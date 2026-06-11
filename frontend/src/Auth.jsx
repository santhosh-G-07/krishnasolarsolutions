import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "./App";
import { api, fileToPayload } from "./api";
import { Link } from "./Public";

export function AuthPage() {
  const { login, navigate, notify, setBootstrap } = useContext(AppContext);
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("customer");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      if (mode === "register") {
        await api.post("/api/register", values);
        notify("Registration complete. You can log in now.");
        setMode("login");
        return;
      }
      const result = await api.post("/api/login", { ...values, role });
      login(result.user);
      setBootstrap(result);
      navigate(result.user.role === "admin" ? "/admin" : result.user.role === "employee" ? "/employee" : "/dashboard");
    } catch (caught) {
      setError(caught.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-copy"><span className="eyebrow">Customer access</span><h1>Your solar journey, all in one place.</h1><p>Apply with verified details, upload documents, and track every stage from application to completion.</p><div className="feature-list"><span>✓ Secure customer account</span><span>✓ Verified application details</span><span>✓ Live project status</span></div></section>
      <section className="auth-card">
        <div className="segmented"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button><button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Register</button></div>
        <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <form onSubmit={submit} className="stack-form">
          {mode === "register" && <label>Full name<input name="name" required minLength="2" placeholder="Your full name" /></label>}
          <label>{mode === "login" ? "Mobile or email" : "Mobile number"}<input name={mode === "login" ? "username" : "phone"} required placeholder={mode === "login" ? "Registered mobile or email" : "10 digit mobile number"} /></label>
          {mode === "register" && <label>Email<input name="email" type="email" required placeholder="Active email address" /></label>}
          <label>Password<input name="password" type="password" required minLength="6" placeholder="Minimum 6 characters" /></label>
          {error && <p className="form-error">{error}</p>}
          <button className="button primary" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Login to account" : "Create account"}</button>
        </form>
        <Link href="/staff-login" className="staff-link">Employee or admin? Staff sign-in →</Link>
      </section>
    </main>
  );
}

export function StaffLoginPage() {
  const queryRole = new URLSearchParams(window.location.search).get("role");
  const [role, setRole] = useState(queryRole === "admin" ? "admin" : "employee");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { login, navigate, setBootstrap } = useContext(AppContext);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const result = await api.post("/api/login", { ...values, role });
      login(result.user);
      setBootstrap(result);
      navigate(role === "admin" ? "/admin" : "/employee");
    } catch (caught) {
      setError(caught.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page staff-auth">
      <section className="auth-copy"><span className="eyebrow">KSS workspace</span><h1>Team work, clearly organised.</h1><p>Responsive access to applications, assignments, employees, content, and project updates.</p></section>
      <section className="auth-card">
        <div className="segmented"><button className={role === "employee" ? "active" : ""} onClick={() => setRole("employee")}>Employee</button><button className={role === "admin" ? "active" : ""} onClick={() => setRole("admin")}>Admin</button></div>
        <h2>{role === "admin" ? "Admin login" : "Employee login"}</h2>
        <form onSubmit={submit} className="stack-form" method="post">
          <label>{role === "admin" ? "Admin username or email" : "Phone or email"}<input name="username" required placeholder={role === "admin" ? "admin" : "Registered phone or email"} /></label>
          <label>Password<input name="password" type="password" required placeholder="Your password" /></label>
          {error && <p className="form-error">{error}</p>}
          <button className="button primary" disabled={busy}>{busy ? "Logging in..." : `Login as ${role}`}</button>
        </form>
        <Link href="/auth" className="staff-link">Customer login →</Link>
      </section>
    </main>
  );
}

export function ApplyPage() {
  const { session, services, navigate, notify, setBootstrap } = useContext(AppContext);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const selected = useMemo(() => new URLSearchParams(window.location.search).get("service") || services[0]?.title || "", [services]);
  if (!session || session.role !== "customer") return <main className="center-page"><div className="empty-card"><span className="eyebrow">Login required</span><h1>Register or login before applying.</h1><p>Applications use verified contact details so KSS can reach the correct customer.</p><Link href="/auth" className="button primary">Login / Register</Link></div></main>;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    values.customerId = session.id;
    values.documents = {};
    try {
      for (const input of form.querySelectorAll('input[type="file"]')) {
        if (input.files[0]) values.documents[input.name] = await fileToPayload(input.files[0]);
      }
      const result = await api.post("/api/applications", values);
      setBootstrap(result);
      notify("Application submitted successfully.");
      navigate("/dashboard");
    } catch (caught) {
      setError(caught.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="form-page">
      <div className="form-page-heading"><span className="eyebrow">Apply now</span><h1>Verified solar application</h1><p>Complete the details carefully so KSS can plan your site visit and quotation.</p></div>
      <form className="application-form" onSubmit={submit}>
        <FormSection title="Customer details"><label>Full name<input name="name" required defaultValue={session.name} /></label><label>Mobile number<input name="phone" required pattern="[6-9][0-9]{9}" defaultValue={session.phone} /></label><label>Email<input name="email" type="email" required defaultValue={session.email} /></label></FormSection>
        <FormSection title="Complete address"><label className="wide">House / street / landmark<textarea name="addressLine" required /></label><label>Village / city<input name="villageCity" required /></label><label>District<input name="district" required /></label><label>State<input name="state" required defaultValue="Odisha" /></label><label>Pincode<input name="pincode" required pattern="[0-9]{6}" maxLength="6" /></label></FormSection>
        <FormSection title="Solar requirement"><label>Service<select name="service" defaultValue={selected}>{services.map((service) => <option key={service.id}>{service.title}</option>)}</select></label><label>Rooftop type<select name="roofType" required defaultValue=""><option value="">Choose rooftop type</option><option>RCC / Concrete</option><option>Tin / Sheet</option><option>Tile</option><option>Ground mount</option><option>Other</option></select></label><label>Monthly bill<input name="monthlyBill" type="number" min="0" /></label><label>Required capacity<input name="capacity" placeholder="Example: 3 kW" /></label><label>Preferred date<input name="preferredDate" type="date" /></label><label>Preferred time<select name="preferredTime"><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label><label className="wide">Message<textarea name="message" /></label></FormSection>
        <FormSection title="Documents">{[["aadhar", "Aadhaar"], ["pan", "PAN"], ["bankPassbook", "Bank passbook"], ["electricityBill", "Electricity bill"], ["rooftopGpsPhoto", "Rooftop GPS photo"], ["signaturePhoto", "Signature photo"]].map(([name, label]) => <label key={name}>{label}<input name={name} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" /></label>)}</FormSection>
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions"><Link href="/" className="button secondary">Cancel</Link><button className="button primary" disabled={busy}>{busy ? "Submitting..." : "Submit application"}</button></div>
      </form>
    </main>
  );
}

export function FormSection({ title, children }) {
  return <fieldset><legend>{title}</legend><div className="field-grid">{children}</div></fieldset>;
}
