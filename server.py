from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from email.message import EmailMessage
from pathlib import Path
import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import smtplib
import time
import urllib.parse

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv()

ROOT = Path(__file__).resolve().parent
UPLOAD_DIR = ROOT / "uploads"
PORT = int(os.environ.get("PORT", "3000"))
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "satabdeepersonal@gmail.com")
NOTIFICATION_EMAIL = os.environ.get("NOTIFICATION_EMAIL", ADMIN_EMAIL)
DB_READY = True
DB_ERROR = ""
PHONE_RE = re.compile(r"^[6-9]\d{9}$")
PIN_RE = re.compile(r"^\d{6}$")
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

STATUS_FLOW = [
    "Applied",
    "Contacted",
    "Site Visit Scheduled",
    "Site Visit Completed",
    "Quotation Sent",
    "Installation Started",
    "In Progress",
    "Completed",
]


def env_first(*keys, default=""):
    for key in keys:
        value = os.environ.get(key)
        if value is not None and str(value).strip() != "":
            return str(value).strip()
    return default


def env_bool(key, default=False):
    value = os.environ.get(key)
    if value is None:
        return default
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


UPLOAD_DIR = Path(env_first("UPLOAD_DIR", default=str(UPLOAD_DIR))).resolve()


def smtp_settings():
    smtp_user = env_first("MAIL_USERNAME", "SMTP_USER")
    smtp_pass = env_first("MAIL_PASSWORD", "SMTP_PASS")
    smtp_host = env_first("MAIL_SERVER", "SMTP_HOST", default="smtp.gmail.com")
    smtp_port = int(env_first("MAIL_PORT", "SMTP_PORT", default="587"))
    mail_from = env_first("MAIL_FROM", "SMTP_USER", "MAIL_USERNAME", default=smtp_user)
    starttls = env_bool("MAIL_STARTTLS", default=True)
    ssl_tls = env_bool("MAIL_SSL_TLS", default=False)
    return {
        "user": smtp_user,
        "pass": smtp_pass,
        "host": smtp_host,
        "port": smtp_port,
        "from": mail_from,
        "starttls": starttls,
        "ssl_tls": ssl_tls,
    }


def send_smtp_message(message):
    config = smtp_settings()
    if not config["user"] or not config["pass"]:
        return False, "Mail credentials are missing. Configure MAIL_USERNAME and MAIL_PASSWORD (or SMTP_USER/SMTP_PASS)."
    try:
        if config["ssl_tls"]:
            with smtplib.SMTP_SSL(config["host"], config["port"], timeout=15) as smtp:
                smtp.login(config["user"], config["pass"])
                smtp.send_message(message)
        else:
            with smtplib.SMTP(config["host"], config["port"], timeout=15) as smtp:
                if config["starttls"]:
                    smtp.starttls()
                smtp.login(config["user"], config["pass"])
                smtp.send_message(message)
        return True, "Email sent."
    except Exception as error:
        return False, str(error)


def now():
    return time.strftime("%d/%m/%Y, %I:%M:%S %p")


def make_id(prefix):
    return f"{prefix}-{int(time.time() * 1000)}-{secrets.token_hex(3)}"


def make_slug(value):
    slug = re.sub(r"[^a-z0-9]+", "-", str(value or "").lower()).strip("-")
    return slug or "service"


def normalize_price(value):
    digits = re.sub(r"[^0-9]", "", str(value or ""))
    return int(digits) if digits else 0


def hash_password(password, salt=None):
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", str(password).encode("utf-8"), salt.encode("utf-8"), 120_000)
    return f"pbkdf2_sha256${salt}${digest.hex()}"


def verify_password(password, stored):
    if not stored:
        return False
    if not str(stored).startswith("pbkdf2_sha256$"):
        return hmac.compare_digest(str(stored), str(password))
    _, salt, digest = stored.split("$", 2)
    return hmac.compare_digest(hash_password(password, salt), stored)


def connect():
    database_url = env_first("DATABASE_URL", "PG_DATABASE_URL")
    connect_kwargs = {
        "cursor_factory": psycopg2.extras.RealDictCursor,
    }
    sslmode = env_first("PG_SSLMODE")
    sslrootcert = env_first("PG_SSLROOTCERT")

    if database_url:
        connect_kwargs["dsn"] = database_url
    else:
        connect_kwargs.update(
            {
                "host": os.environ.get("PG_HOST", "localhost"),
                "port": int(os.environ.get("PG_PORT", "5432")),
                "dbname": os.environ.get("PG_DB", "kss_db"),
                "user": os.environ.get("PG_USER", "kss_user"),
                "password": os.environ.get("PG_PASSWORD", ""),
            }
        )

    if sslmode:
        connect_kwargs["sslmode"] = sslmode
    if sslrootcert:
        connect_kwargs["sslrootcert"] = sslrootcert

    conn = psycopg2.connect(**connect_kwargs)
    conn.autocommit = False
    return conn


def row_dict(cursor):
    row = cursor.fetchone()
    return dict(row) if row else None


def fetch_rows(cursor):
    return [dict(row) for row in cursor.fetchall()]


def init_db():
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    conn = connect()
    try:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL,
                job_title TEXT,
                active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                last_login TEXT
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS applications (
                id TEXT PRIMARY KEY,
                customer_id TEXT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT NOT NULL,
                address_line TEXT NOT NULL,
                village_city TEXT NOT NULL,
                district TEXT NOT NULL,
                state TEXT NOT NULL,
                pincode TEXT NOT NULL,
                roof_type TEXT NOT NULL,
                service TEXT NOT NULL,
                monthly_bill TEXT,
                capacity TEXT,
                preferred_date TEXT,
                preferred_time TEXT,
                message TEXT,
                status TEXT NOT NULL,
                assigned_to TEXT,
                notes TEXT,
                documents TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY,
                application_id TEXT,
                recipient TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                sent_online INTEGER NOT NULL DEFAULT 0,
                email_status TEXT,
                created_at TEXT NOT NULL
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS employee_activity (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                role TEXT NOT NULL,
                active INTEGER NOT NULL DEFAULT 1,
                last_login TEXT NOT NULL
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS services (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                badge TEXT,
                description TEXT,
                payload TEXT NOT NULL,
                sort_order INTEGER NOT NULL DEFAULT 0,
                active INTEGER NOT NULL DEFAULT 1,
                updated_at TEXT NOT NULL
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                badge TEXT,
                description TEXT,
                payload TEXT NOT NULL,
                sort_order INTEGER NOT NULL DEFAULT 0,
                active INTEGER NOT NULL DEFAULT 1,
                updated_at TEXT NOT NULL
            )
        """)
        # --- v2 migrations: profile + business settings + OTP ---
        cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT")
        cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo TEXT")
        cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile TEXT")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS business_settings (
                id INTEGER PRIMARY KEY,
                business_name TEXT,
                tagline TEXT,
                business_email TEXT,
                business_mobile TEXT,
                whatsapp_number TEXT,
                office_address TEXT,
                logo TEXT,
                gstin TEXT,
                pan TEXT,
                bank_details TEXT,
                updated_at TEXT
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS otp_codes (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                purpose TEXT NOT NULL,
                channel TEXT NOT NULL,
                code TEXT NOT NULL,
                target TEXT,
                expires_at DOUBLE PRECISION NOT NULL,
                used INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL
            )
        """)
        cur.execute("ALTER TABLE otp_codes ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0")
        cur.execute("ALTER TABLE otp_codes ADD COLUMN IF NOT EXISTS created_ts DOUBLE PRECISION NOT NULL DEFAULT 0")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS chat_leads (
                id TEXT PRIMARY KEY,
                session_id TEXT,
                name TEXT,
                phone TEXT,
                location TEXT,
                interest TEXT,
                source TEXT,
                created_at TEXT NOT NULL
            )
        """)
        cur.execute("SELECT id FROM business_settings WHERE id = 1")
        if not cur.fetchone():
            cur.execute(
                """
                INSERT INTO business_settings (id, business_name, tagline, business_email, business_mobile, whatsapp_number, office_address, updated_at)
                VALUES (1, %s, %s, %s, %s, %s, %s, %s)
                """,
                ("Krishna Solar Solutions", "Powering India's homes", ADMIN_EMAIL, "", "", "", now()),
            )
        cur.execute("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
        admin = cur.fetchone()
        if not admin:
            password = os.environ.get("ADMIN_PASSWORD", "kssadmin123")
            cur.execute(
                """
                INSERT INTO users (id, name, phone, email, password_hash, role, job_title, active, created_at, last_login)
                VALUES (%s, %s, %s, %s, %s, 'admin', 'Main Admin', 1, %s, %s)
                ON CONFLICT (id) DO NOTHING
                """,
                ("admin-owner", "KSS Owner", "admin", ADMIN_EMAIL, hash_password(password), now(), "Not logged in yet"),
            )
        else:
            # one-time migration: keep the seeded admin's email aligned with ADMIN_EMAIL env value
            cur.execute(
                "UPDATE users SET email = %s WHERE id = %s AND (email IS NULL OR email = '' OR LOWER(email) IN (%s, %s))",
                (ADMIN_EMAIL, "admin-owner", "krishnamoharana011@gmail.com", "satabdeepersonal@gmail.com"),
            )
        conn.commit()
        cur.close()
        print("Database tables ready.")
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def public_service(service):
    data = json.loads(service["payload"] or "{}")
    data["id"] = service["id"]
    data["slug"] = make_slug(data.get("slug") or service["id"] or service["title"])
    data["title"] = service["title"]
    data["badge"] = service["badge"] or data.get("badge", "")
    data["description"] = service["description"] or data.get("description", "")
    data["fullDescription"] = data.get("fullDescription") or data.get("tagline") or data["description"]
    data["whoFor"] = data.get("whoFor") or data.get("audience") or ""
    data["startingPrice"] = normalize_price(data.get("startingPrice") or data.get("starting_price") or data.get("pricing"))
    data["sortOrder"] = service["sort_order"]
    data["active"] = bool(service["active"])
    data["type"] = "service"
    return data


def public_product(product):
    data = json.loads(product["payload"] or "{}")
    data["id"] = product["id"]
    data["slug"] = make_slug(data.get("slug") or product["id"] or product["title"])
    data["title"] = product["title"]
    data["badge"] = product["badge"] or data.get("badge", "")
    data["description"] = product["description"] or data.get("description", "")
    data["fullDescription"] = data.get("fullDescription") or data["description"]
    data["categoryIcon"] = data.get("categoryIcon") or data.get("iconName") or data.get("icon") or "panel"
    data["startingPrice"] = normalize_price(data.get("startingPrice") or data.get("starting_price") or data.get("pricing"))
    data["priceNote"] = data.get("priceNote") or "Price varies by capacity, brand, and project requirement."
    data["sortOrder"] = product["sort_order"]
    data["active"] = bool(product["active"])
    data["type"] = "product"
    return data


def public_user(user):
    if not user:
        return None
    data = dict(user)
    data.pop("password_hash", None)
    data["jobTitle"] = data.pop("job_title", "")
    data["createdAt"] = data.pop("created_at", "")
    data["lastLogin"] = data.pop("last_login", "")
    data["displayName"] = data.pop("display_name", "") or data.get("name", "")
    data["profilePhoto"] = data.pop("profile_photo", "") or ""
    data["mobile"] = data.pop("mobile", "") or ""
    data["active"] = bool(data.get("active", 1))
    return data


def public_business_settings(row):
    if not row:
        return {}
    data = dict(row)
    return {
        "businessName": data.get("business_name") or "",
        "tagline": data.get("tagline") or "",
        "businessEmail": data.get("business_email") or "",
        "businessMobile": data.get("business_mobile") or "",
        "whatsappNumber": data.get("whatsapp_number") or "",
        "officeAddress": data.get("office_address") or "",
        "logo": data.get("logo") or "",
        "gstin": data.get("gstin") or "",
        "pan": data.get("pan") or "",
        "bankDetails": data.get("bank_details") or "",
        "updatedAt": data.get("updated_at") or "",
    }


def public_application(app):
    data = dict(app)
    data["address"] = ", ".join(filter(None, [data.get("address_line"), data.get("village_city"), data.get("district"), data.get("state"), data.get("pincode")]))
    data["roofType"] = data.pop("roof_type", "")
    data["monthlyBill"] = data.pop("monthly_bill", "")
    data["preferredDate"] = data.pop("preferred_date", "")
    data["preferredTime"] = data.pop("preferred_time", "")
    data["assignedTo"] = data.pop("assigned_to", "")
    data["createdAt"] = data.pop("created_at", "")
    data["updatedAt"] = data.pop("updated_at", "")
    data["documents"] = json.loads(data.get("documents") or "{}")
    return data


def bootstrap():
    conn = connect()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM users ORDER BY created_at DESC")
        users = fetch_rows(cur)
        cur.execute("SELECT * FROM applications ORDER BY created_at DESC")
        applications = fetch_rows(cur)
        cur.execute("SELECT * FROM notifications ORDER BY created_at DESC")
        notifications = fetch_rows(cur)
        cur.execute("SELECT * FROM employee_activity ORDER BY last_login DESC LIMIT 80")
        activity = fetch_rows(cur)
        cur.execute("SELECT * FROM services ORDER BY sort_order ASC, title ASC")
        services = fetch_rows(cur)
        cur.execute("SELECT * FROM products ORDER BY sort_order ASC, title ASC")
        products = fetch_rows(cur)
        cur.execute("SELECT * FROM business_settings WHERE id = 1")
        bs_row = row_dict(cur)
        cur.close()
    finally:
        conn.close()
    customers = [public_user(u) for u in users if u["role"] == "customer"]
    return {
        "users": [public_user(u) for u in users if u["role"] != "customer"],
        "customers": customers,
        "employees": activity,
        "applications": [public_application(a) for a in applications],
        "notifications": [dict(n) for n in notifications],
        "services": [public_service(s) for s in services],
        "products": [public_product(p) for p in products],
        "businessSettings": public_business_settings(bs_row),
    }


def offline_bootstrap():
    return {
        "users": [],
        "customers": [],
        "employees": [],
        "applications": [],
        "notifications": [],
        "services": [],
        "products": [],
        "businessSettings": {
            "businessName": "Krishna Solar Solutions",
            "tagline": "Powering India's homes",
            "businessEmail": ADMIN_EMAIL,
            "businessMobile": "",
            "whatsappNumber": "",
            "officeAddress": "",
            "logo": "",
            "gstin": "",
            "pan": "",
            "bankDetails": "",
            "updatedAt": "",
        },
        "databaseOffline": True,
        "message": DB_ERROR or "Database is not configured.",
    }


def validate_customer_payload(data, require_password=True):
    name = str(data.get("name", "")).strip()
    phone = str(data.get("phone", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    if len(name) < 2:
        return "Enter a valid customer name."
    if not PHONE_RE.match(phone):
        return "Mobile number must be a valid 10 digit Indian number."
    if not EMAIL_RE.match(email):
        return "Enter a valid email address."
    if require_password and len(password) < 6:
        return "Password must be at least 6 characters."
    return ""


def save_documents(application_id, documents):
    saved = {}
    allowed = {"pdf", "png", "jpg", "jpeg", "webp"}
    for key, file_info in (documents or {}).items():
        if not file_info or not file_info.get("data"):
            continue
        original = Path(str(file_info.get("name", key))).name
        ext = original.rsplit(".", 1)[-1].lower() if "." in original else "bin"
        if ext not in allowed:
            raise ValueError(f"{original} is not an allowed document type.")
        raw_data = file_info["data"].split(",", 1)[-1]
        content = base64.b64decode(raw_data)
        if len(content) > 5 * 1024 * 1024:
            raise ValueError(f"{original} is larger than 5MB.")
        filename = f"{application_id}-{key}.{ext}"
        target = UPLOAD_DIR / filename
        target.write_bytes(content)
        saved[key] = {"name": original, "url": f"/uploads/{filename}", "size": len(content)}
    return saved


def send_application_email(application):
    mail_config = smtp_settings()
    if not mail_config["user"] or not mail_config["pass"]:
        return False, "Mail is not configured."
    message = EmailMessage()
    message["From"] = mail_config["from"] or mail_config["user"]
    message["To"] = NOTIFICATION_EMAIL
    message["Subject"] = f"New KSS solar application - {application['name']}"
    message.set_content(
        "\n".join([
            "New solar application received.",
            "",
            f"Application ID: {application['id']}",
            f"Name: {application['name']}",
            f"Phone: {application['phone']}",
            f"Email: {application['email']}",
            f"Service: {application['service']}",
            f"Address: {application['address_line']}, {application['village_city']}, {application['district']}, {application['state']} - {application['pincode']}",
            f"Monthly bill: {application.get('monthly_bill') or 'Not added'}",
            f"Capacity: {application.get('capacity') or 'Not added'}",
            f"Preferred visit: {application.get('preferred_date') or 'Not added'} {application.get('preferred_time') or ''}".strip(),
            f"Message: {application.get('message') or 'Not added'}",
        ])
    )
    return send_smtp_message(message)


# ===================== ADMIN PROFILE / OTP HELPERS =====================

OTP_TTL_SECONDS = 300      # 5 minutes
OTP_RESEND_COOLDOWN = 60   # 60 seconds before requesting again
OTP_MAX_ATTEMPTS = 5       # max verify tries per code


def get_admin_by_phone(cur, phone):
    """Look up an active admin by their login phone/username."""
    cur.execute("SELECT * FROM users WHERE role = 'admin' AND active = 1 AND phone = %s", (str(phone).strip(),))
    return row_dict(cur)


def require_admin(cur, payload):
    """Pull admin from payload (admin_phone) and ensure they're active. Returns user dict or None."""
    phone = str((payload or {}).get("admin_phone", "")).strip()
    if not phone:
        return None
    return get_admin_by_phone(cur, phone)


def gen_otp_code():
    return f"{secrets.randbelow(900000) + 100000}"  # 6-digit


def latest_otp(cur, user_id, purpose, channel):
    cur.execute(
        """
        SELECT * FROM otp_codes
        WHERE user_id = %s AND purpose = %s AND channel = %s AND used = 0
        ORDER BY created_ts DESC LIMIT 1
        """,
        (user_id, purpose, channel),
    )
    return row_dict(cur)


def create_otp(cur, user_id, purpose, channel, target):
    """Create and store an OTP. Enforces 60-second cooldown.
    Returns (code, error_message). If cooldown active, returns (None, "Wait Xs before requesting again.")."""
    # cooldown check
    last = latest_otp(cur, user_id, purpose, channel)
    if last and (time.time() - (last.get("created_ts") or 0)) < OTP_RESEND_COOLDOWN:
        wait = int(OTP_RESEND_COOLDOWN - (time.time() - last["created_ts"]))
        return None, f"Please wait {wait}s before requesting a new code."
    code = gen_otp_code()
    expires = time.time() + OTP_TTL_SECONDS
    # Invalidate older codes for same purpose+channel
    cur.execute(
        "UPDATE otp_codes SET used = 1 WHERE user_id = %s AND purpose = %s AND channel = %s AND used = 0",
        (user_id, purpose, channel),
    )
    cur.execute(
        """
        INSERT INTO otp_codes (id, user_id, purpose, channel, code, target, expires_at, created_ts, used, attempts, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 0, 0, %s)
        """,
        (make_id("otp"), user_id, purpose, channel, code, target or "", expires, time.time(), now()),
    )
    return code, None


def verify_otp(cur, user_id, purpose, channel, code):
    row = latest_otp(cur, user_id, purpose, channel)
    if not row:
        return False, "No code to verify. Request one first."
    if row["expires_at"] < time.time():
        cur.execute("UPDATE otp_codes SET used = 1 WHERE id = %s", (row["id"],))
        return False, "Code has expired. Request a new one."
    if row.get("attempts", 0) >= OTP_MAX_ATTEMPTS:
        cur.execute("UPDATE otp_codes SET used = 1 WHERE id = %s", (row["id"],))
        return False, "Too many wrong attempts. Request a new code."
    if str(row["code"]) != str(code).strip():
        cur.execute("UPDATE otp_codes SET attempts = attempts + 1 WHERE id = %s", (row["id"],))
        remaining = OTP_MAX_ATTEMPTS - (row.get("attempts", 0) + 1)
        if remaining <= 0:
            cur.execute("UPDATE otp_codes SET used = 1 WHERE id = %s", (row["id"],))
            return False, "Too many wrong attempts. Request a new code."
        return False, f"Incorrect code. {remaining} attempt(s) remaining."
    cur.execute("UPDATE otp_codes SET used = 1 WHERE id = %s", (row["id"],))
    return True, "OK"


def otp_email_html(code, purpose_label, expires_min):
    """KSS-branded HTML email template."""
    return f"""<!doctype html>
<html><body style="margin:0;padding:0;background:#faf8f3;font-family:Arial,Helvetica,sans-serif;color:#0f1f14">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="540" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border:1px solid #c8dfd1;border-radius:16px;overflow:hidden">
        <tr>
          <td style="background:linear-gradient(135deg,#0d4a2a,#1a7a45);padding:28px 32px;color:#fff">
            <div style="font-size:11px;letter-spacing:.16em;opacity:.75;font-weight:500">KRISHNA SOLAR SOLUTIONS</div>
            <div style="font-size:22px;font-weight:700;margin-top:4px">Admin verification code</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px">
            <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#3d5c48">
              You requested to <strong style="color:#0d4a2a">{purpose_label}</strong>. Enter this code in the admin dashboard to confirm.
            </p>
            <div style="background:#f0faf4;border:1px solid #d4f0df;border-radius:12px;padding:24px;text-align:center;margin:18px 0">
              <div style="font-size:11px;letter-spacing:.18em;color:#7a9b85;font-weight:600">YOUR CODE</div>
              <div style="font-size:36px;font-weight:700;color:#0d4a2a;letter-spacing:.4em;margin-top:8px;font-family:'Courier New',monospace">{code}</div>
              <div style="font-size:12px;color:#7a9b85;margin-top:10px">Expires in {expires_min} minutes</div>
            </div>
            <p style="margin:0;font-size:13px;line-height:1.55;color:#7a9b85">
              <strong style="color:#92400e">Security warning:</strong> KSS will never ask for this code over phone or chat.
              If you didn't request it, change your admin password immediately — someone may have your login email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 32px;background:#faf8f3;border-top:1px solid #c8dfd1;font-size:11px;color:#7a9b85;text-align:center">
            Sent automatically by KSS Admin · Krishna Solar Solutions · This is an automated message
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>"""


def send_otp_email(to_email, code, purpose_label):
    """Send OTP via SMTP (Gmail App Password). Returns (ok, message)."""
    mail_config = smtp_settings()
    if not mail_config["user"] or not mail_config["pass"]:
        print(f"[OTP EMAIL -> {to_email}] code={code} purpose={purpose_label} (SMTP not configured - code printed to console only)")
        return False, "SMTP not configured. Code printed to server console - copy from there."
    if not to_email:
        return False, "No email on file to send the code to."
    expires_min = OTP_TTL_SECONDS // 60
    message = EmailMessage()
    message["From"] = f"KSS Admin <{mail_config['from'] or mail_config['user']}>"
    message["To"] = to_email
    message["Subject"] = f"KSS verification code: {code} ({purpose_label})"
    message.set_content(
        f"Your KSS Admin verification code is: {code}\n\n"
        f"This code is for: {purpose_label}.\n"
        f"It expires in {expires_min} minutes.\n\n"
        "If you did not request this, you can safely ignore this email."
    )
    message.add_alternative(otp_email_html(code, purpose_label, expires_min), subtype="html")
    sent, info = send_smtp_message(message)
    if sent:
        return True, f"Code sent to {to_email}."
    print(f"[OTP EMAIL -> {to_email}] code={code} purpose={purpose_label} (SMTP error: {info})")
    return False, f"Could not send email ({info}). Check the server console for the code."


def send_otp_sms(to_mobile, code, purpose_label):
    """Stub SMS sender. Hook for Twilio / MSG91 / Fast2SMS integration."""
    provider = os.environ.get("SMS_PROVIDER", "").strip().lower()
    if not provider or not to_mobile:
        print(f"[OTP·SMS→{to_mobile}] code={code} purpose={purpose_label} (SMS_PROVIDER not configured — code printed to console only)")
        return False, "SMS provider not configured. Code is printed in the server console — use it from there for now."
    print(f"[OTP·SMS→{to_mobile}] code={code} purpose={purpose_label} (provider={provider} — wire integration here)")
    return False, f"SMS provider '{provider}' not wired up yet. Code is in server console."


# ===================== KSS SOLAR ASSISTANT (Gemini) =====================

KSS_SYSTEM_PROMPT = """You are the "KSS Solar Assistant" — the official chatbot for Krishna Solar Solutions (KSS), a solar installation business in Odisha, India.

## Your role
- Help website visitors understand solar power and KSS's services.
- Answer questions about solar systems clearly, in simple language, for people who may not be technical.
- Encourage qualified visitors to book a site visit or request a quotation.
- Stay professional, warm, concise. Use bullet points for lists. Keep replies under ~120 words unless the user asks for detail.

## What KSS offers (talk about these confidently)
- **On-grid solar** — connected to the electricity grid. Cheapest. Net-metering exports surplus power and reduces your monthly bill. Best for homes/businesses with reliable grid supply.
- **Off-grid solar** — battery-backed, no grid connection needed. For remote farms, villages, or backup-critical sites. Higher upfront cost because of batteries.
- **Hybrid solar** — both grid AND battery. Runs through power cuts, exports surplus when grid is available. Best of both worlds. Common for premium homes / businesses that can't afford downtime.
- **Solar water pumps (agriculture)** — for farms; replaces diesel pumps. PM-KUSUM subsidy eligible.
- **Commercial solar setups** — for offices, factories, schools.
- **Rooftop solar — residential** — typical 2-10 kW systems for homes.
- **AMC & maintenance** — annual contracts for cleaning panels, inverter checks, monitoring.

## Installation process (5 simple steps)
1. Free site visit by KSS engineer (book through this chat or +91 number)
2. Design + quotation (within 2-3 days)
3. Subsidy paperwork (we handle MNRE / state subsidy applications)
4. Installation (1-5 days depending on system size)
5. Grid synchronization & handover

## Savings (rough ballpark — always say "actual depends on site visit")
- A 3 kW rooftop in Odisha generates ~12-14 units/day on average
- Average monthly bill ~₹3000 → after 3 kW solar, ~₹300-500
- Payback period 4-6 years; panels last 25 years (with 25-year manufacturer warranty)

## Subsidy info (be careful — give general info, not exact promises)
- Central government MNRE rooftop subsidy: up to ₹78,000 for 3 kW residential
- State Odisha schemes exist for agricultural pumps (PM-KUSUM)
- Always say "exact subsidy depends on your category and current scheme — KSS will confirm during site visit"

## Warranty
- Panels: 25 years performance warranty (manufacturer)
- Inverter: 5-10 years (depending on brand)
- Installation workmanship: 2 years (KSS)

## Lead capture
If the user shows clear buying interest (asks about price, wants installation, asks to book a visit, says "I want solar", asks for site visit, etc.), at the END of your normal response add ONE LINE EXACTLY:

[LEAD_CAPTURE]

The website UI will detect this token and show a small form. Do NOT explain the token to the user — just include it on its own line at the very end. Use it sparingly — only when they're clearly interested.

## Off-topic handling
If the user asks about anything unrelated to solar, energy, KSS, or related services (e.g., recipes, sports, jokes, unrelated tech), politely redirect them in one short sentence and steer back to solar. Example: "I'm here for solar questions — I can help you with rooftop systems, savings or booking a site visit. What would you like to know?"

## Style rules
- Never mention you are powered by Gemini or any AI provider — you are "KSS Solar Assistant"
- Use ₹ for prices, kW for capacity, units for kWh
- Don't invent specific phone numbers, addresses, or exact subsidy amounts you aren't told here
- For "book a site visit" requests, encourage them to share name/phone/location through the form that pops up
- Keep replies focused; one topic at a time
"""


def gemini_chat(messages, system_prompt=KSS_SYSTEM_PROMPT):
    """Call Gemini API with conversation history. Returns (text, error).
    messages: list of {role: 'user'|'assistant', content: '...'}
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    model = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash").strip()
    if not api_key:
        return None, "AI service is not configured. Please contact KSS at +91-XXXXXXXXXX for now."
    # Build Gemini content array (alternating user/model)
    contents = []
    for m in messages:
        role = "user" if m.get("role") == "user" else "model"
        text = str(m.get("content", "")).strip()
        if not text:
            continue
        contents.append({"role": role, "parts": [{"text": text}]})
    if not contents:
        return None, "Empty message."
    payload = {
        "contents": contents,
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "generationConfig": {"temperature": 0.5, "maxOutputTokens": 400, "topP": 0.9},
        "safetySettings": [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_ONLY_HIGH"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_ONLY_HIGH"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_ONLY_HIGH"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH"},
        ],
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    try:
        import urllib.request, urllib.error
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        candidates = data.get("candidates") or []
        if not candidates:
            return None, "No response from AI. Try again."
        parts = (candidates[0].get("content") or {}).get("parts") or []
        text = "".join(p.get("text", "") for p in parts).strip()
        if not text:
            return None, "Empty response from AI."
        return text, None
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "ignore")
        print(f"[CHATBOT] Gemini HTTPError {e.code}: {body}")
        return None, f"AI service error ({e.code}). Please try again in a moment."
    except Exception as e:
        print(f"[CHATBOT] Gemini error: {e}")
        return None, "Sorry, assistant is temporarily unavailable."


# Simple per-IP rate limiter for chatbot (in-memory)
_chat_rate = {}
def chat_rate_allow(ip, limit_per_min=30):
    now_t = time.time()
    bucket = _chat_rate.get(ip, [])
    bucket = [t for t in bucket if now_t - t < 60]
    if len(bucket) >= limit_per_min:
        return False
    bucket.append(now_t)
    _chat_rate[ip] = bucket
    return True


def update_business_settings(payload):
    """Upsert the business_settings single row (id=1)."""
    conn = connect()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            UPDATE business_settings SET
                business_name = %s,
                tagline = %s,
                business_email = %s,
                business_mobile = %s,
                whatsapp_number = %s,
                office_address = %s,
                logo = %s,
                gstin = %s,
                pan = %s,
                bank_details = %s,
                updated_at = %s
            WHERE id = 1
            """,
            (
                str(payload.get("businessName", "")).strip(),
                str(payload.get("tagline", "")).strip(),
                str(payload.get("businessEmail", "")).strip(),
                str(payload.get("businessMobile", "")).strip(),
                str(payload.get("whatsappNumber", "")).strip(),
                str(payload.get("officeAddress", "")).strip(),
                str(payload.get("logo", "")),
                str(payload.get("gstin", "")).strip(),
                str(payload.get("pan", "")).strip(),
                str(payload.get("bankDetails", "")).strip(),
                now(),
            ),
        )
        conn.commit()
        cur.close()
    finally:
        conn.close()



class KssHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def route_shell_page(self):
        parsed_path = urllib.parse.urlparse(self.path).path.rstrip("/")
        if parsed_path == "/services" or parsed_path.startswith("/services/"):
            return "services.html"
        if parsed_path == "/products" or parsed_path.startswith("/products/"):
            return "products.html"
        return ""

    def translate_path(self, path):
        shell_page = self.route_shell_page()
        if shell_page:
            return str(ROOT / shell_page)
        return super().translate_path(path)

    def json_response(self, status, data):
        payload = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        if not length:
            return {}
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path).path
        if parsed_path == "/api/bootstrap":
            self.json_response(200, bootstrap() if DB_READY else offline_bootstrap())
            return
        shell_page = self.route_shell_page()
        if shell_page:
            self.path = f"/{shell_page}"
            super().do_GET()
            return
        super().do_GET()

    def do_POST(self):
        try:
            self.handle_api_post()
        except ValueError as error:
            self.json_response(400, {"message": str(error)})
        except Exception as error:
            self.json_response(500, {"message": str(error)})

    def handle_api_post(self):
        body = self.read_json()
        if not DB_READY:
            self.json_response(503, {
                "message": "Database is not configured. Add DATABASE_URL or PG_* values in .env before using login, apply, or dashboard features.",
                "detail": DB_ERROR,
            })
            return

        if self.path == "/api/register":
            error = validate_customer_payload(body)
            if error:
                self.json_response(400, {"message": error})
                return
            conn = connect()
            try:
                cur = conn.cursor()
                cur.execute("SELECT id FROM users WHERE phone = %s OR email = %s", (body["phone"], body["email"].lower()))
                if cur.fetchone():
                    self.json_response(409, {"message": "This phone or email is already registered."})
                    return
                user_id = make_id("cust")
                cur.execute(
                    """
                    INSERT INTO users (id, name, phone, email, password_hash, role, active, created_at, last_login)
                    VALUES (%s, %s, %s, %s, %s, 'customer', 1, %s, %s)
                    """,
                    (user_id, body["name"].strip(), body["phone"].strip(), body["email"].strip().lower(), hash_password(body["password"]), now(), "Not logged in yet"),
                )
                cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
                customer = row_dict(cur)
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(201, {"customer": public_user(customer), **bootstrap()})
            return

        if self.path == "/api/login":
            role = body.get("role") or "customer"
            username = str(body.get("username", "")).strip().lower()
            password = str(body.get("password", ""))
            conn = connect()
            try:
                cur = conn.cursor()
                cur.execute(
                    "SELECT * FROM users WHERE role = %s AND active = 1 AND (LOWER(phone) = %s OR LOWER(email) = %s)",
                    (role, username, username),
                )
                user = row_dict(cur)
                if not user or not verify_password(password, user["password_hash"]):
                    self.json_response(401, {"message": "Login details not matched. Please register first if you are a new customer."})
                    return
                stamp = now()
                cur.execute("UPDATE users SET last_login = %s WHERE id = %s", (stamp, user["id"]))
                if role in {"admin", "employee"}:
                    cur.execute(
                        "INSERT INTO employee_activity (id, user_id, name, phone, role, active, last_login) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                        (make_id("act"), user["id"], user["name"], user["phone"], "Main Admin" if role == "admin" else (user["job_title"] or "Installation Staff"), 1, stamp),
                    )
                cur.execute("SELECT * FROM users WHERE id = %s", (user["id"],))
                user = row_dict(cur)
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, {"user": public_user(user), **bootstrap()})
            return

        # ===================== ADMIN PROFILE =====================
        if self.path == "/api/admin/profile":
            conn = connect()
            try:
                cur = conn.cursor()
                admin = require_admin(cur, body)
                if not admin:
                    self.json_response(401, {"message": "Admin not authorised."})
                    return
                name = str(body.get("name", admin["name"])).strip()
                display_name = str(body.get("displayName", admin.get("display_name") or "")).strip()
                profile_photo = body.get("profilePhoto", admin.get("profile_photo") or "")
                if name and len(name) < 2:
                    self.json_response(400, {"message": "Name is too short."})
                    return
                cur.execute(
                    "UPDATE users SET name = %s, display_name = %s, profile_photo = %s WHERE id = %s",
                    (name or admin["name"], display_name or None, profile_photo or None, admin["id"]),
                )
                cur.execute("SELECT * FROM users WHERE id = %s", (admin["id"],))
                updated = row_dict(cur)
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, {"user": public_user(updated), **bootstrap()})
            return

        if self.path == "/api/admin/password/request-otp":
            conn = connect()
            try:
                cur = conn.cursor()
                admin = require_admin(cur, body)
                if not admin:
                    self.json_response(401, {"message": "Admin not authorised."})
                    return
                old_password = str(body.get("oldPassword", ""))
                new_password = str(body.get("newPassword", ""))
                confirm_password = str(body.get("confirmPassword", ""))
                if not verify_password(old_password, admin["password_hash"]):
                    self.json_response(400, {"message": "Current password is incorrect."})
                    return
                if len(new_password) < 8:
                    self.json_response(400, {"message": "New password must be at least 8 characters."})
                    return
                if new_password != confirm_password:
                    self.json_response(400, {"message": "New password and confirm password don't match."})
                    return
                if new_password == old_password:
                    self.json_response(400, {"message": "New password must be different from the current one."})
                    return
                # stash the *hash* of the new password in OTP target so plaintext is never persisted
                new_hash = hash_password(new_password)
                code, err = create_otp(cur, admin["id"], "password_change", "email", new_hash)
                if err:
                    self.json_response(429, {"message": err})
                    return
                current_email = admin.get("email") or ""
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            sent, msg = send_otp_email(current_email, code, "verify password change")
            self.json_response(200, {"message": msg, "sent": sent, "to": current_email})
            return

        if self.path == "/api/admin/password/confirm":
            conn = connect()
            try:
                cur = conn.cursor()
                admin = require_admin(cur, body)
                if not admin:
                    self.json_response(401, {"message": "Admin not authorised."})
                    return
                code = str(body.get("code", "")).strip()
                row = latest_otp(cur, admin["id"], "password_change", "email")
                if not row:
                    self.json_response(400, {"message": "No password change in progress."})
                    return
                ok_otp, msg = verify_otp(cur, admin["id"], "password_change", "email", code)
                if not ok_otp:
                    self.json_response(400, {"message": msg})
                    return
                new_hash = row["target"]
                if not new_hash:
                    self.json_response(500, {"message": "Could not retrieve pending password change."})
                    return
                cur.execute("UPDATE users SET password_hash = %s WHERE id = %s", (new_hash, admin["id"]))
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, {"message": "Password updated. Please log in again with the new password."})
            return

        if self.path == "/api/admin/password":
            conn = connect()
            try:
                cur = conn.cursor()
                admin = require_admin(cur, body)
                if not admin:
                    self.json_response(401, {"message": "Admin not authorised."})
                    return
                old_password = str(body.get("oldPassword", ""))
                new_password = str(body.get("newPassword", ""))
                confirm_password = str(body.get("confirmPassword", ""))
                if not verify_password(old_password, admin["password_hash"]):
                    self.json_response(400, {"message": "Current password is incorrect."})
                    return
                if len(new_password) < 8:
                    self.json_response(400, {"message": "New password must be at least 8 characters."})
                    return
                if new_password != confirm_password:
                    self.json_response(400, {"message": "New password and confirm password don't match."})
                    return
                if new_password == old_password:
                    self.json_response(400, {"message": "New password must be different from the current one."})
                    return
                cur.execute("UPDATE users SET password_hash = %s WHERE id = %s", (hash_password(new_password), admin["id"]))
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, {"message": "Password updated. Please log in again with the new password."})
            return

        if self.path == "/api/admin/email/request-otp":
            conn = connect()
            try:
                cur = conn.cursor()
                admin = require_admin(cur, body)
                if not admin:
                    self.json_response(401, {"message": "Admin not authorised."})
                    return
                new_email = str(body.get("newEmail", "")).strip().lower()
                if not EMAIL_RE.match(new_email):
                    self.json_response(400, {"message": "Enter a valid new email."})
                    return
                if new_email == (admin.get("email") or "").lower():
                    self.json_response(400, {"message": "This is already your current email."})
                    return
                cur.execute("SELECT id FROM users WHERE email = %s AND id != %s", (new_email, admin["id"]))
                if cur.fetchone():
                    self.json_response(409, {"message": "Another account already uses this email."})
                    return
                current_email = admin.get("email") or ""
                code, err = create_otp(cur, admin["id"], "email_change", "email", new_email)
                if err:
                    self.json_response(429, {"message": err})
                    return
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            sent, msg = send_otp_email(current_email, code, "verify email change")
            self.json_response(200, {"message": msg, "sent": sent, "channel": "email", "to": current_email})
            return

        if self.path == "/api/admin/email/verify":
            conn = connect()
            try:
                cur = conn.cursor()
                admin = require_admin(cur, body)
                if not admin:
                    self.json_response(401, {"message": "Admin not authorised."})
                    return
                new_email = str(body.get("newEmail", "")).strip().lower()
                code = str(body.get("code", "")).strip()
                ok_otp, msg = verify_otp(cur, admin["id"], "email_change", "email", code)
                if not ok_otp:
                    self.json_response(400, {"message": msg})
                    return
                cur.execute("UPDATE users SET email = %s WHERE id = %s", (new_email, admin["id"]))
                cur.execute("SELECT * FROM users WHERE id = %s", (admin["id"],))
                updated = row_dict(cur)
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, {"user": public_user(updated), "message": "Login email updated.", **bootstrap()})
            return

        if self.path == "/api/admin/mobile/request-otp":
            conn = connect()
            try:
                cur = conn.cursor()
                admin = require_admin(cur, body)
                if not admin:
                    self.json_response(401, {"message": "Admin not authorised."})
                    return
                new_mobile = str(body.get("newMobile", "")).strip()
                if not PHONE_RE.match(new_mobile):
                    self.json_response(400, {"message": "Enter a valid 10 digit mobile number."})
                    return
                if new_mobile == (admin.get("mobile") or ""):
                    self.json_response(400, {"message": "This is already your current mobile number."})
                    return
                current_email = admin.get("email") or ""
                current_mobile = admin.get("mobile") or ""
                email_code, err1 = create_otp(cur, admin["id"], "mobile_change", "email", current_email)
                if err1:
                    self.json_response(429, {"message": err1})
                    return
                sms_code = None
                if current_mobile:
                    sms_code, err2 = create_otp(cur, admin["id"], "mobile_change", "sms", current_mobile)
                    if err2:
                        self.json_response(429, {"message": err2})
                        return
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            email_ok, email_msg = send_otp_email(current_email, email_code, "verify mobile number change")
            if sms_code:
                sms_ok, sms_msg = send_otp_sms(current_mobile, sms_code, "verify mobile number change")
            else:
                sms_ok, sms_msg = False, "No mobile on file yet — only email OTP required."
            self.json_response(200, {
                "email": {"sent": email_ok, "message": email_msg, "to": current_email},
                "sms": {"sent": sms_ok, "message": sms_msg, "to": current_mobile},
                "needsCurrentMobile": not current_mobile,
            })
            return

        if self.path == "/api/admin/mobile/verify":
            conn = connect()
            try:
                cur = conn.cursor()
                admin = require_admin(cur, body)
                if not admin:
                    self.json_response(401, {"message": "Admin not authorised."})
                    return
                new_mobile = str(body.get("newMobile", "")).strip()
                email_code = str(body.get("emailCode", "")).strip()
                sms_code = str(body.get("smsCode", "")).strip()
                if not PHONE_RE.match(new_mobile):
                    self.json_response(400, {"message": "Enter a valid 10 digit mobile number."})
                    return
                ok_email, msg_email = verify_otp(cur, admin["id"], "mobile_change", "email", email_code)
                if not ok_email:
                    self.json_response(400, {"message": f"Email code: {msg_email}"})
                    return
                # SMS code: only required if admin has a mobile on file
                if admin.get("mobile"):
                    ok_sms, msg_sms = verify_otp(cur, admin["id"], "mobile_change", "sms", sms_code)
                    if not ok_sms:
                        self.json_response(400, {"message": f"SMS code: {msg_sms}"})
                        return
                cur.execute("UPDATE users SET mobile = %s WHERE id = %s", (new_mobile, admin["id"]))
                cur.execute("SELECT * FROM users WHERE id = %s", (admin["id"],))
                updated = row_dict(cur)
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, {"user": public_user(updated), "message": "Mobile number updated.", **bootstrap()})
            return

        if self.path == "/api/business-settings":
            conn = connect()
            try:
                cur = conn.cursor()
                admin = require_admin(cur, body)
                if not admin:
                    self.json_response(401, {"message": "Admin not authorised."})
                    return
                cur.close()
            finally:
                conn.close()
            try:
                update_business_settings(body)
            except Exception as e:
                self.json_response(500, {"message": f"Could not save settings: {e}"})
                return
            self.json_response(200, {"message": "Business settings saved.", **bootstrap()})
            return

        # ===================== CHATBOT =====================
        if self.path == "/api/chatbot":
            ip = self.client_address[0] if self.client_address else "unknown"
            if not chat_rate_allow(ip):
                self.json_response(429, {"message": "Too many messages. Please wait a moment."})
                return
            history = body.get("history") or []
            message = str(body.get("message", "")).strip()
            if not message:
                self.json_response(400, {"message": "Empty message."})
                return
            if len(message) > 800:
                self.json_response(400, {"message": "Message too long. Please keep it under 800 characters."})
                return
            # Trim history to last 8 exchanges to keep context tight
            trimmed = []
            for h in history[-16:]:
                role = "user" if h.get("role") == "user" else "assistant"
                trimmed.append({"role": role, "content": str(h.get("content", ""))[:600]})
            trimmed.append({"role": "user", "content": message})
            text, error = gemini_chat(trimmed)
            if error:
                self.json_response(200, {"reply": "Sorry, assistant is temporarily unavailable. Please call KSS or use the Contact form to reach us.", "fallback": True, "error": error})
                return
            # Detect lead-capture token
            lead_capture = False
            if "[LEAD_CAPTURE]" in text:
                lead_capture = True
                text = text.replace("[LEAD_CAPTURE]", "").strip()
            self.json_response(200, {"reply": text, "leadCapture": lead_capture})
            return

        if self.path == "/api/chatbot/lead":
            name = str(body.get("name", "")).strip()
            phone = str(body.get("phone", "")).strip()
            location = str(body.get("location", "")).strip()
            interest = str(body.get("interest", "")).strip()[:500]
            session_id = str(body.get("sessionId", "")).strip()[:64]
            if len(name) < 2:
                self.json_response(400, {"message": "Please enter your name."})
                return
            if not PHONE_RE.match(phone):
                self.json_response(400, {"message": "Please enter a valid 10-digit mobile number."})
                return
            conn = connect()
            try:
                cur = conn.cursor()
                cur.execute(
                    """
                    INSERT INTO chat_leads (id, session_id, name, phone, location, interest, source, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (make_id("clead"), session_id, name, phone, location, interest, "chatbot", now()),
                )
                # also create a notification so admin sees it in their dashboard
                cur.execute(
                    """
                    INSERT INTO notifications (id, application_id, recipient, subject, message, sent_online, email_status, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (make_id("notif"), "", ADMIN_EMAIL, "New chatbot lead",
                     f"{name} ({phone}) from {location or 'unknown'}. Interest: {interest or '—'}",
                     1, "captured", now()),
                )
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, {"message": "Thanks! Our team will reach out soon."})
            return

        if self.path == "/api/employees":
            name = str(body.get("name", "")).strip()
            phone = str(body.get("phone", "")).strip()
            email = str(body.get("email", "")).strip().lower()
            password = str(body.get("password", ""))
            if len(name) < 2 or not PHONE_RE.match(phone) or len(password) < 6:
                self.json_response(400, {"message": "Employee needs a name, valid 10 digit phone, and 6 character password."})
                return
            if email and not EMAIL_RE.match(email):
                self.json_response(400, {"message": "Enter a valid employee email."})
                return
            conn = connect()
            try:
                cur = conn.cursor()
                cur.execute("SELECT id FROM users WHERE phone = %s OR (email != '' AND email = %s)", (phone, email))
                if cur.fetchone():
                    self.json_response(409, {"message": "Employee phone or email already exists."})
                    return
                emp_id = make_id("emp")
                cur.execute(
                    """
                    INSERT INTO users (id, name, phone, email, password_hash, role, job_title, active, created_at, last_login)
                    VALUES (%s, %s, %s, %s, %s, 'employee', %s, 1, %s, %s)
                    """,
                    (emp_id, name, phone, email, hash_password(password), str(body.get("jobTitle", "Installation Staff")).strip(), now(), "Not logged in yet"),
                )
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(201, bootstrap())
            return

        if self.path == "/api/employees/update":
            emp_id = str(body.get("id", "")).strip()
            name = str(body.get("name", "")).strip()
            phone = str(body.get("phone", "")).strip()
            email = str(body.get("email", "")).strip().lower()
            job_title = str(body.get("jobTitle", "Installation Staff")).strip()
            active = 1 if body.get("active", True) else 0
            if len(name) < 2 or not PHONE_RE.match(phone):
                self.json_response(400, {"message": "Employee needs a name and valid 10 digit phone."})
                return
            if email and not EMAIL_RE.match(email):
                self.json_response(400, {"message": "Enter a valid employee email."})
                return
            conn = connect()
            try:
                cur = conn.cursor()
                cur.execute("SELECT * FROM users WHERE id = %s AND role = 'employee'", (emp_id,))
                if not cur.fetchone():
                    self.json_response(404, {"message": "Employee not found."})
                    return
                cur.execute(
                    "SELECT id FROM users WHERE id != %s AND (phone = %s OR (email != '' AND email = %s))",
                    (emp_id, phone, email),
                )
                if cur.fetchone():
                    self.json_response(409, {"message": "Employee phone or email already exists."})
                    return
                cur.execute(
                    "UPDATE users SET name = %s, phone = %s, email = %s, job_title = %s, active = %s WHERE id = %s",
                    (name, phone, email, job_title, active, emp_id),
                )
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, bootstrap())
            return

        if self.path == "/api/employees/delete":
            emp_id = str(body.get("id", "")).strip()
            conn = connect()
            try:
                cur = conn.cursor()
                cur.execute("UPDATE users SET active = 0 WHERE id = %s AND role = 'employee'", (emp_id,))
                cur.execute("UPDATE applications SET assigned_to = '' WHERE assigned_to = (SELECT phone FROM users WHERE id = %s)", (emp_id,))
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, bootstrap())
            return

        if self.path == "/api/services":
            service = body.get("service") or body
            title = str(service.get("title", "")).strip()
            if len(title) < 2:
                self.json_response(400, {"message": "Service title is required."})
                return
            service_id = str(service.get("id") or make_id("svc")).strip()
            service["id"] = service_id
            service["slug"] = make_slug(service.get("slug") or title)
            service["fullDescription"] = str(service.get("fullDescription") or service.get("tagline") or service.get("description") or "").strip()
            service["whoFor"] = str(service.get("whoFor") or service.get("audience") or "").strip()
            service["startingPrice"] = normalize_price(service.get("startingPrice") or service.get("pricing"))
            service["type"] = "service"
            badge = str(service.get("badge", "")).strip()
            description = str(service.get("description", "")).strip()
            sort_order = int(service.get("sortOrder") or 0)
            active = 1 if service.get("active", True) else 0
            conn = connect()
            try:
                cur = conn.cursor()
                cur.execute(
                    """
                    INSERT INTO services (id, title, badge, description, payload, sort_order, active, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        title = EXCLUDED.title,
                        badge = EXCLUDED.badge,
                        description = EXCLUDED.description,
                        payload = EXCLUDED.payload,
                        sort_order = EXCLUDED.sort_order,
                        active = EXCLUDED.active,
                        updated_at = EXCLUDED.updated_at
                    """,
                    (service_id, title, badge, description, json.dumps(service), sort_order, active, now()),
                )
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, bootstrap())
            return

        if self.path == "/api/services/delete":
            service_id = str(body.get("id", "")).strip()
            title = str(body.get("title") or service_id or "Deleted service").strip()
            conn = connect()
            try:
                cur = conn.cursor()
                cur.execute("UPDATE services SET active = 0, updated_at = %s WHERE id = %s", (now(), service_id))
                if cur.rowcount == 0:
                    payload = {"id": service_id, "title": title, "type": "service", "active": False}
                    cur.execute(
                        "INSERT INTO services (id, title, badge, description, payload, sort_order, active, updated_at) VALUES (%s, %s, '', '', %s, 999, 0, %s)",
                        (service_id, title, json.dumps(payload), now()),
                    )
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, bootstrap())
            return

        if self.path == "/api/products":
            product = body.get("product") or body
            title = str(product.get("title", "")).strip()
            if len(title) < 2:
                self.json_response(400, {"message": "Product title is required."})
                return
            product_id = str(product.get("id") or make_id("prd")).strip()
            product["id"] = product_id
            product["slug"] = make_slug(product.get("slug") or title)
            product["fullDescription"] = str(product.get("fullDescription") or product.get("description") or "").strip()
            product["categoryIcon"] = str(product.get("categoryIcon") or product.get("iconName") or product.get("icon") or "panel").strip()
            product["startingPrice"] = normalize_price(product.get("startingPrice") or product.get("pricing"))
            product["priceNote"] = str(product.get("priceNote") or "Price varies by capacity, brand, and project requirement.").strip()
            product["type"] = "product"
            badge = str(product.get("badge", "")).strip()
            description = str(product.get("description", "")).strip()
            sort_order = int(product.get("sortOrder") or 0)
            active = 1 if product.get("active", True) else 0
            conn = connect()
            try:
                cur = conn.cursor()
                cur.execute(
                    """
                    INSERT INTO products (id, title, badge, description, payload, sort_order, active, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        title = EXCLUDED.title,
                        badge = EXCLUDED.badge,
                        description = EXCLUDED.description,
                        payload = EXCLUDED.payload,
                        sort_order = EXCLUDED.sort_order,
                        active = EXCLUDED.active,
                        updated_at = EXCLUDED.updated_at
                    """,
                    (product_id, title, badge, description, json.dumps(product), sort_order, active, now()),
                )
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, bootstrap())
            return

        if self.path == "/api/products/delete":
            product_id = str(body.get("id", "")).strip()
            title = str(body.get("title") or product_id or "Deleted product").strip()
            conn = connect()
            try:
                cur = conn.cursor()
                cur.execute("UPDATE products SET active = 0, updated_at = %s WHERE id = %s", (now(), product_id))
                if cur.rowcount == 0:
                    payload = {"id": product_id, "title": title, "type": "product", "active": False}
                    cur.execute(
                        "INSERT INTO products (id, title, badge, description, payload, sort_order, active, updated_at) VALUES (%s, %s, '', '', %s, 999, 0, %s)",
                        (product_id, title, json.dumps(payload), now()),
                    )
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, bootstrap())
            return

        if self.path == "/api/applications":
            error = validate_customer_payload(body, require_password=False)
            if error:
                self.json_response(400, {"message": error})
                return
            required = ["addressLine", "villageCity", "district", "state", "pincode", "roofType", "service"]
            if any(not str(body.get(field, "")).strip() for field in required):
                self.json_response(400, {"message": "Complete address, pincode, rooftop type, and service are required."})
                return
            if not PIN_RE.match(str(body.get("pincode", "")).strip()):
                self.json_response(400, {"message": "Pincode must be exactly 6 digits."})
                return
            app_id = make_id("KSS")
            documents = save_documents(app_id, body.get("documents", {}))
            application = {
                "id": app_id,
                "customer_id": body.get("customerId", ""),
                "name": body["name"].strip(),
                "phone": body["phone"].strip(),
                "email": body["email"].strip().lower(),
                "address_line": body["addressLine"].strip(),
                "village_city": body["villageCity"].strip(),
                "district": body["district"].strip(),
                "state": body["state"].strip(),
                "pincode": body["pincode"].strip(),
                "roof_type": body["roofType"].strip(),
                "service": body["service"].strip(),
                "monthly_bill": str(body.get("monthlyBill", "")).strip(),
                "capacity": str(body.get("capacity", "")).strip(),
                "preferred_date": str(body.get("preferredDate", "")).strip(),
                "preferred_time": str(body.get("preferredTime", "")).strip(),
                "message": str(body.get("message", "")).strip(),
                "status": "Applied",
                "assigned_to": str(body.get("assignedTo", "")).strip(),
                "notes": "New verified application received.",
                "documents": json.dumps(documents),
                "created_at": now(),
                "updated_at": now(),
            }
            sent_online, email_status = send_application_email(application)
            conn = connect()
            try:
                cur = conn.cursor()
                cur.execute(
                    """
                    INSERT INTO applications (
                        id, customer_id, name, phone, email, address_line, village_city, district, state, pincode,
                        roof_type, service, monthly_bill, capacity, preferred_date, preferred_time, message,
                        status, assigned_to, notes, documents, created_at, updated_at
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        application["id"], application["customer_id"], application["name"],
                        application["phone"], application["email"], application["address_line"],
                        application["village_city"], application["district"], application["state"],
                        application["pincode"], application["roof_type"], application["service"],
                        application["monthly_bill"], application["capacity"], application["preferred_date"],
                        application["preferred_time"], application["message"], application["status"],
                        application["assigned_to"], application["notes"], application["documents"],
                        application["created_at"], application["updated_at"],
                    ),
                )
                cur.execute(
                    "INSERT INTO notifications VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                    (
                        make_id("MAIL"), app_id, NOTIFICATION_EMAIL,
                        f"New KSS solar application - {application['name']}",
                        f"{application['name']} applied for {application['service']}. Phone: {application['phone']}.",
                        1 if sent_online else 0, email_status, now(),
                    ),
                )
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(201, {"application": public_application(application), **bootstrap()})
            return

        if self.path == "/api/applications/update":
            app_id = body.get("id")
            conn = connect()
            try:
                cur = conn.cursor()
                cur.execute("SELECT * FROM applications WHERE id = %s", (app_id,))
                current = row_dict(cur)
                if not current:
                    self.json_response(404, {"message": "Application not found."})
                    return
                status = body.get("status") or current["status"]
                if status == "next":
                    current_index = STATUS_FLOW.index(current["status"]) if current["status"] in STATUS_FLOW else 0
                    status = STATUS_FLOW[min(len(STATUS_FLOW) - 1, current_index + 1)]
                if status not in STATUS_FLOW and status != "Cancelled":
                    self.json_response(400, {"message": "Invalid status."})
                    return
                cur.execute(
                    "UPDATE applications SET status = %s, assigned_to = %s, notes = %s, updated_at = %s WHERE id = %s",
                    (
                        status,
                        str(body.get("assignedTo", current["assigned_to"] or "")).strip(),
                        str(body.get("notes", current["notes"] or "")).strip(),
                        now(),
                        app_id,
                    ),
                )
                conn.commit()
                cur.close()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
            self.json_response(200, bootstrap())
            return

        self.json_response(404, {"message": "API route not found."})


if __name__ == "__main__":
    try:
        init_db()
    except psycopg2.OperationalError as error:
        DB_READY = False
        DB_ERROR = str(error).strip()
        print("Database is not configured, so KSS is starting in frontend-only mode.")
        print("Login, apply, admin, employee, uploads, and dashboard APIs need PostgreSQL.")
        print("Fix: create a .env file with DATABASE_URL, or PG_HOST/PG_DB/PG_USER/PG_PASSWORD.")
        print(f"Database error: {DB_ERROR}")
    HOST = os.environ.get("HOST", "0.0.0.0")
    print(f"KSS server listening on http://{HOST}:{PORT}")
    if DB_READY:
        print("Admin login is phone/user 'admin'. Set ADMIN_PASSWORD before launch.")
    ThreadingHTTPServer((HOST, PORT), KssHandler).serve_forever()
