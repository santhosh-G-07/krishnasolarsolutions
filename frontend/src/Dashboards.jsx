import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "./App";
import { api, backendUrl, fileToPayload, saveSession } from "./api";
import { statusFlow } from "./data";
import { FormSection, StaffLoginPage } from "./Auth";
import { Link } from "./Public";

const adminTabs = [["overview", "Overview", "▦"], ["applications", "Applications", "◎"], ["employees", "Employees", "♙"], ["content", "Content", "◇"], ["settings", "Settings", "⚙"]];
const employeeTabs = [["applications", "All work", "◎"], ["mine", "My work", "●"], ["add", "Add customer", "+"]];

export function CustomerDashboard() {
  const { session, bootstrap, logout, navigate } = useContext(AppContext);
  useEffect(() => {
    if (!session) navigate("/auth", true);
  }, [session, navigate]);
  if (!session) return null;
  const applications = bootstrap.applications.filter((item) => item.phone === session.phone);
  return (
    <div className="customer-dashboard">
      <header className="customer-header"><Link href="/" className="brand"><img src="/assets/kss-logo.jpeg" alt="KSS" /><span><strong>KSS</strong><small>Customer dashboard</small></span></Link><div><Link href="/apply" className="button primary">New application</Link><button className="button secondary" onClick={logout}>Logout</button></div></header>
      <main className="dashboard-content">
        <div className="page-heading"><div><span className="eyebrow">Welcome back</span><h1>{session.name}</h1><p>Track every solar application and work update.</p></div></div>
        <Stats items={[["Applications", applications.length], ["Active", applications.filter((item) => !["Completed", "Cancelled"].includes(item.status)).length], ["Completed", applications.filter((item) => item.status === "Completed").length]]} />
        <div className="customer-app-grid">
          {applications.map((item) => <article className="customer-app" key={item.id}><div><span className={`status ${statusClass(item.status)}`}>{item.status}</span><small>{item.id}</small></div><h2>{item.service}</h2><p>{item.address}</p><div className="progress-track"><span style={{ width: `${Math.max(8, ((statusFlow.indexOf(item.status) + 1) / statusFlow.length) * 100)}%` }} /></div><div className="app-meta"><span>Applied {item.createdAt}</span><strong>{item.notes || "KSS will update you soon."}</strong></div></article>)}
          {!applications.length && <Empty title="No applications yet" text="Start your solar journey with a verified application." action={<Link href="/apply" className="button primary">Apply now</Link>} />}
        </div>
      </main>
    </div>
  );
}

export function StaffDashboard({ role }) {
  const { session, logout, bootstrap, refresh, notify, services, products, setBootstrap, navigate } = useContext(AppContext);
  const [tab, setTab] = useState(role === "admin" ? "overview" : "applications");
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [busy, setBusy] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (!session || session.role !== role) navigate(`/staff-login?role=${role}`, true);
  }, [session, role, navigate]);

  if (!session || session.role !== role) return null;
  const employees = bootstrap.users.filter((user) => user.role === "employee");
  const mine = bootstrap.applications.filter((item) => item.assignedTo === session.phone);
  const visibleApps = role === "employee" && tab === "mine" ? mine : bootstrap.applications;
  const filteredApps = visibleApps.filter((item) => {
    const query = search.toLowerCase();
    return (status === "all" || item.status === status) && (!query || [item.name, item.phone, item.district, item.service].some((value) => String(value || "").toLowerCase().includes(query)));
  });
  const tabs = role === "admin" ? adminTabs : employeeTabs;

  async function post(path, body) {
    setBusy(true);
    try {
      const result = await api.post(path, body);
      setBootstrap((current) => ({ ...current, ...result }));
      notify(result.message || "Saved successfully.");
      setModal(null);
      return result;
    } catch (error) {
      notify(error.message);
      throw error;
    } finally {
      setBusy(false);
    }
  }

  function chooseTab(next) {
    if (next === "add") setModal({ type: "application" });
    else setTab(next);
    setMobileMenu(false);
  }

  return (
    <div className="staff-shell">
      <aside className={mobileMenu ? "staff-sidebar open" : "staff-sidebar"}>
        <div className="staff-brand"><img src="/assets/kss-logo.jpeg" alt="KSS" /><div><strong>Krishna Solar</strong><span>{role === "admin" ? "Admin Panel" : "Employee Panel"}</span></div><button onClick={() => setMobileMenu(false)}>×</button></div>
        <div className="staff-user"><Avatar user={session} /><div><strong>{session.displayName || session.name}</strong><span>{session.jobTitle || (role === "admin" ? "Main Admin" : "Employee")}</span></div></div>
        <nav>{tabs.map(([key, label, icon]) => <button key={key} className={tab === key ? "active" : ""} onClick={() => chooseTab(key)}><span>{icon}</span>{label}</button>)}</nav>
        <div className="sidebar-foot"><Link href="/">View website</Link><button onClick={logout}>Logout</button></div>
      </aside>

      <div className="staff-main">
        <header className="staff-topbar"><button className="mobile-menu-button" onClick={() => setMobileMenu(true)}>☰</button><div><strong>{tabs.find(([key]) => key === tab)?.[1]}</strong><span>{role === "admin" ? "Manage your complete solar operation" : "Stay on top of assigned customer work"}</span></div><div><button className="button secondary refresh-button" onClick={() => refresh().catch((error) => notify(error.message))}>Refresh</button><button className="button primary" onClick={() => setModal({ type: "application" })}>+ Add application</button></div></header>
        <main className="dashboard-content">
          {role === "admin" && tab === "overview" && <Overview apps={bootstrap.applications} employees={employees} notifications={bootstrap.notifications} onApplications={() => setTab("applications")} />}
          {(tab === "applications" || tab === "mine") && <Applications apps={filteredApps} allApps={visibleApps} employees={employees} session={session} role={role} search={search} setSearch={setSearch} status={status} setStatus={setStatus} onView={(item) => setModal({ type: "view", item })} onEdit={(item) => setModal({ type: "update", item })} onDelete={(item) => window.confirm(`Delete customer application for ${item.name}? This cannot be undone.`) && post("/api/applications/delete", { id: item.id, admin_phone: session.phone })} />}
          {role === "admin" && tab === "employees" && <Employees employees={employees} apps={bootstrap.applications} onAdd={() => setModal({ type: "employee" })} onEdit={(item) => setModal({ type: "employee", item })} onDelete={(item) => window.confirm(`Deactivate ${item.name}?`) && post("/api/employees/delete", { id: item.id })} />}
          {role === "admin" && tab === "content" && <ContentManager services={services} products={products} onEdit={(kind, item) => setModal({ type: "content", kind, item })} />}
          {role === "admin" && tab === "settings" && <Settings user={session} business={bootstrap.businessSettings} busy={busy} post={post} onSession={(user) => { saveSession(user); window.location.reload(); }} />}
        </main>
      </div>

      <nav className="mobile-bottom-nav">{tabs.slice(0, 5).map(([key, label, icon]) => <button key={key} className={tab === key ? "active" : ""} onClick={() => chooseTab(key)}><span>{icon}</span><small>{label}</small></button>)}</nav>
      {modal && <Modal title={modalTitle(modal)} onClose={() => setModal(null)}>{modal.type === "view" ? <ApplicationDetail item={modal.item} employees={employees} /> : modal.type === "update" ? <UpdateApplication item={modal.item} employees={employees} role={role} session={session} busy={busy} submit={(body) => post("/api/applications/update", body)} /> : modal.type === "employee" ? <EmployeeForm item={modal.item} busy={busy} submit={(body) => post(modal.item ? "/api/employees/update" : "/api/employees", body)} /> : modal.type === "content" ? <ContentForm kind={modal.kind} item={modal.item} busy={busy} submit={(body) => post(`/api/${modal.kind}`, body)} /> : <StaffApplicationForm services={services} employees={employees} session={session} role={role} busy={busy} submit={(body) => post("/api/applications", body)} />}</Modal>}
    </div>
  );
}

function Overview({ apps, employees, notifications, onApplications }) {
  const active = apps.filter((item) => !["Completed", "Cancelled"].includes(item.status));
  return <>
    <div className="page-heading"><div><span className="eyebrow">Live overview</span><h1>Everything that needs attention.</h1><p>Applications, team workload, and customer progress at a glance.</p></div><button className="button secondary" onClick={onApplications}>View all applications</button></div>
    <Stats items={[["Total applications", apps.length], ["Active work", active.length], ["Completed", apps.filter((item) => item.status === "Completed").length], ["Active employees", employees.filter((item) => item.active).length]]} />
    <div className="dashboard-two-col"><section className="panel"><PanelTitle title="Recent applications" text="Latest customer enquiries and status" />{apps.slice(0, 6).map((item) => <div className="mini-row" key={item.id}><Avatar user={item} /><div><strong>{item.name}</strong><span>{item.service}</span></div><span className={`status ${statusClass(item.status)}`}>{item.status}</span></div>)}</section><section className="panel"><PanelTitle title="Team workload" text="Current assigned applications" />{employees.filter((item) => item.active).map((employee) => <div className="mini-row" key={employee.id}><Avatar user={employee} /><div><strong>{employee.name}</strong><span>{employee.jobTitle}</span></div><b>{apps.filter((item) => item.assignedTo === employee.phone).length}</b></div>)}{!employees.length && <Empty title="No employees" />}</section></div>
    <section className="panel notifications-panel"><PanelTitle title="Latest notifications" text={`${notifications.length} notification records`} />{notifications.slice(0, 5).map((item) => <div className="notification-row" key={item.id}><span>●</span><div><strong>{item.subject}</strong><p>{item.message}</p></div><small>{item.created_at}</small></div>)}</section>
  </>;
}

function Applications({ apps, allApps, employees, session, role, search, setSearch, status, setStatus, onView, onEdit, onDelete }) {
  const mine = allApps.filter((item) => item.assignedTo === session.phone);
  return <>
    <div className="page-heading"><div><span className="eyebrow">Applications</span><h1>Customer work, clearly organised.</h1><p>Search, review, assign, and update every solar project.</p></div></div>
    <Stats items={[["Visible applications", allApps.length], ["Assigned to you", mine.length], ["In progress", allApps.filter((item) => item.status === "In Progress").length], ["Completed", allApps.filter((item) => item.status === "Completed").length]]} />
    <section className="panel data-panel">
      <div className="table-tools"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone, district, service..." /><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{statusFlow.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="responsive-table"><table><thead><tr><th>Customer</th><th>Service</th><th>Status</th><th>Assigned to</th><th>Updated</th><th /></tr></thead><tbody>{apps.map((item) => { const canEdit = role === "admin" || item.assignedTo === session.phone; return <tr key={item.id}><td data-label="Customer"><strong>{item.name}</strong><small>{item.phone} · {item.district}</small></td><td data-label="Service">{item.service}</td><td data-label="Status"><span className={`status ${statusClass(item.status)}`}>{item.status}</span></td><td data-label="Assigned">{employeeName(item.assignedTo, employees)}</td><td data-label="Updated">{item.updatedAt || item.createdAt}</td><td><div className="row-actions"><button onClick={() => onView(item)}>View</button>{canEdit && <button onClick={() => onEdit(item)}>Update</button>}{role === "admin" && <button className="danger" onClick={() => onDelete(item)}>Delete</button>}</div></td></tr>; })}</tbody></table></div>
      {!apps.length && <Empty title="No applications found" text="Try changing the search or status filter." />}
    </section>
  </>;
}

function Employees({ employees, apps, onAdd, onEdit, onDelete }) {
  return <>
    <div className="page-heading"><div><span className="eyebrow">Team</span><h1>Employees and workload.</h1><p>Create team access, update details, and review assigned work.</p></div><button className="button primary" onClick={onAdd}>+ Add employee</button></div>
    <div className="employee-grid">{employees.map((item) => <article className="employee-card" key={item.id}><div><Avatar user={item} /><span className={item.active ? "online-dot" : "offline-dot"} /></div><h2>{item.name}</h2><p>{item.jobTitle || "Installation Staff"}</p>{!item.email && <span className="email-warning">Add email to enable assignment alerts</span>}<dl><div><dt>Phone</dt><dd>{item.phone}</dd></div><div><dt>Email</dt><dd>{item.email || "Missing"}</dd></div><div><dt>Assigned</dt><dd>{apps.filter((app) => app.assignedTo === item.phone).length}</dd></div><div><dt>Last login</dt><dd>{item.lastLogin || "Not yet"}</dd></div></dl><div className="row-actions"><button onClick={() => onEdit(item)}>Edit</button><button className="danger" onClick={() => onDelete(item)}>Deactivate</button></div></article>)}</div>
    {!employees.length && <Empty title="No employees yet" action={<button className="button primary" onClick={onAdd}>Add first employee</button>} />}
  </>;
}

function ContentManager({ services, products, onEdit }) {
  return <>
    <div className="page-heading"><div><span className="eyebrow">Website content</span><h1>Services and products.</h1><p>Edit the content shown on the Vercel frontend without changing code.</p></div></div>
    <section className="panel"><div className="panel-action-title"><PanelTitle title="Services" text={`${services.length} active services`} /><button className="button primary" onClick={() => onEdit("services", null)}>+ Add service</button></div><div className="manage-grid">{services.map((item) => <article key={item.id}><span className="tag">{item.badge}</span><h3>{item.title}</h3><p>{item.description}</p><button onClick={() => onEdit("services", item)}>Edit service</button></article>)}</div></section>
    <section className="panel"><div className="panel-action-title"><PanelTitle title="Products" text={`${products.length} active products`} /><button className="button primary" onClick={() => onEdit("products", null)}>+ Add product</button></div><div className="manage-grid">{products.map((item) => <article key={item.id}><span className="tag">{item.badge}</span><h3>{item.title}</h3><p>{item.description}</p><button onClick={() => onEdit("products", item)}>Edit product</button></article>)}</div></section>
  </>;
}

function Settings({ user, business, busy, post, onSession }) {
  const [passwordStep, setPasswordStep] = useState(false);
  return <>
    <div className="page-heading"><div><span className="eyebrow">Settings</span><h1>Profile and business details.</h1><p>Manage the details used by your admin account and public website.</p></div></div>
    <div className="settings-grid">
      <form className="panel stack-form" onSubmit={async (event) => { event.preventDefault(); const result = await post("/api/admin/profile", { admin_phone: user.phone, ...Object.fromEntries(new FormData(event.currentTarget)) }); onSession(result.user); }}><PanelTitle title="Admin profile" text="Display name and account identity" /><label>Name<input name="name" defaultValue={user.name} /></label><label>Display name<input name="displayName" defaultValue={user.displayName} /></label><label>Login email<input value={user.email || ""} disabled /></label><button className="button primary" disabled={busy}>Save profile</button></form>
      <form className="panel stack-form" onSubmit={(event) => { event.preventDefault(); post("/api/business-settings", { admin_phone: user.phone, ...Object.fromEntries(new FormData(event.currentTarget)) }); }}><PanelTitle title="Business settings" text="Public contact and company details" /><label>Business name<input name="businessName" defaultValue={business.businessName} /></label><label>Tagline<input name="tagline" defaultValue={business.tagline} /></label><label>Public phone<input name="businessMobile" defaultValue={business.businessMobile} /></label><label>Public email<input name="businessEmail" defaultValue={business.businessEmail} /></label><label>WhatsApp number<input name="whatsappNumber" defaultValue={business.whatsappNumber} /></label><label>Office address<textarea name="officeAddress" defaultValue={business.officeAddress} /></label><button className="button primary" disabled={busy}>Save business settings</button></form>
      <form className="panel stack-form" onSubmit={async (event) => { event.preventDefault(); const body = { admin_phone: user.phone, ...Object.fromEntries(new FormData(event.currentTarget)) }; if (!passwordStep) { await post("/api/admin/password/request-otp", body); setPasswordStep(true); } else { await post("/api/admin/password/confirm", body); } }}><PanelTitle title="Change password" text="Confirmed with a code sent to your login email" />{!passwordStep ? <><label>Current password<input name="oldPassword" type="password" /></label><label>New password<input name="newPassword" type="password" minLength="8" /></label><label>Confirm password<input name="confirmPassword" type="password" minLength="8" /></label></> : <label>6 digit verification code<input name="code" inputMode="numeric" maxLength="6" /></label>}<button className="button primary" disabled={busy}>{passwordStep ? "Confirm password change" : "Send verification code"}</button></form>
    </div>
  </>;
}

function UpdateApplication({ item, employees, role, session, busy, submit }) {
  return <form className="application-form modal-form" onSubmit={(event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); submit({ id: item.id, ...values, assignedTo: role === "employee" ? session.phone : values.assignedTo, updatedByRole: role, updatedByPhone: session.phone }); }}><FormSection title="Customer details"><label>Full name<input name="name" defaultValue={item.name} required /></label><label>Phone<input name="phone" defaultValue={item.phone} required /></label><label>Email<input name="email" type="email" defaultValue={item.email} required /></label><label className="wide">Address line<textarea name="addressLine" defaultValue={item.address_line} required /></label><label>Village / city<input name="villageCity" defaultValue={item.village_city} required /></label><label>District<input name="district" defaultValue={item.district} required /></label><label>State<input name="state" defaultValue={item.state} required /></label><label>Pincode<input name="pincode" defaultValue={item.pincode} required /></label></FormSection><FormSection title="Requirement and work"><label>Service<input name="service" defaultValue={item.service} required /></label><label>Roof type<input name="roofType" defaultValue={item.roofType} required /></label><label>Monthly bill<input name="monthlyBill" defaultValue={item.monthlyBill} /></label><label>Capacity<input name="capacity" defaultValue={item.capacity} /></label><label>Preferred date<input name="preferredDate" type="date" defaultValue={item.preferredDate} /></label><label>Preferred time<input name="preferredTime" defaultValue={item.preferredTime} /></label><label>Status<select name="status" defaultValue={item.status}>{statusFlow.map((entry) => <option key={entry}>{entry}</option>)}</select></label>{role === "admin" && <label>Assigned employee<select name="assignedTo" defaultValue={item.assignedTo || ""}><option value="">Unassigned</option>{employees.filter((employee) => employee.active && employee.email).map((employee) => <option value={employee.phone} key={employee.id}>{employee.name}</option>)}</select></label>}<label className="wide">Customer message<textarea name="message" defaultValue={item.message} /></label><label className="wide">Work notes<textarea name="notes" defaultValue={item.notes} rows="5" /></label></FormSection>{role === "employee" && <p className="audit-note">Admin will be notified with a summary of every field you change.</p>}<button className="button primary" disabled={busy}>Save customer and work update</button></form>;
}

function EmployeeForm({ item, busy, submit }) {
  return <form className="stack-form" onSubmit={(event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); submit(item ? { id: item.id, ...values, active: values.active === "true" } : values); }}><label>Full name<input name="name" defaultValue={item?.name} required /></label><label>Phone<input name="phone" defaultValue={item?.phone} required /></label><label>Email for login and assignment alerts<input name="email" type="email" defaultValue={item?.email} required /></label><label>Job title<input name="jobTitle" defaultValue={item?.jobTitle || "Installation Staff"} /></label>{!item && <label>Login password<input name="password" type="password" minLength="6" required /></label>}{item && <label>Account status<select name="active" defaultValue={String(item.active)}><option value="true">Active</option><option value="false">Inactive</option></select></label>}<button className="button primary" disabled={busy}>{item ? "Save employee" : "Create employee"}</button></form>;
}

function ContentForm({ kind, item, busy, submit }) {
  const content = item || {};
  return <form className="stack-form" onSubmit={(event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); submit({ [kind === "services" ? "service" : "product"]: { ...content, ...values, active: values.active === "true", details: splitLines(values.details), benefits: splitLines(values.benefits), process: splitLines(values.process) } }); }}><label>Title<input name="title" defaultValue={content.title || ""} required /></label><label>Badge<input name="badge" defaultValue={content.badge || ""} /></label><label>Short description<textarea name="description" defaultValue={content.description || ""} rows="4" required /></label><label>Full description<textarea name="fullDescription" defaultValue={content.fullDescription || ""} rows="5" /></label><label>{kind === "services" ? "Pricing" : "Warranty"}<input name={kind === "services" ? "pricing" : "warranty"} defaultValue={kind === "services" ? (content.pricing || "") : (content.warranty || "")} /></label><label>Included details, one per line<textarea name="details" defaultValue={joinLines(content.details || content.install)} rows="5" /></label><label>Benefits, one per line<textarea name="benefits" defaultValue={joinLines(content.benefits)} rows="5" /></label><label>Process, one per line<textarea name="process" defaultValue={joinLines(content.process)} rows="5" /></label><label>Status<select name="active" defaultValue={String(content.active !== false)}><option value="true">Active</option><option value="false">Hidden</option></select></label><button className="button primary" disabled={busy}>{content.id ? "Save content" : `Add ${kind === "services" ? "service" : "product"}`}</button></form>;
}

function StaffApplicationForm({ services, employees, session, role, busy, submit }) {
  const [files, setFiles] = useState([]);
  async function onSubmit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    values.assignedTo = role === "employee" ? session.phone : values.assignedTo;
    values.documents = {};
    for (const [index, file] of files.entries()) values.documents[`doc_${index}`] = await fileToPayload(file);
    submit(values);
  }
  return <form className="application-form modal-form" onSubmit={onSubmit}><FormSection title="Customer details"><label>Full name<input name="name" required /></label><label>Phone<input name="phone" required /></label><label>Email<input name="email" type="email" required /></label></FormSection><FormSection title="Address"><label className="wide">Address line<textarea name="addressLine" required /></label><label>Village / city<input name="villageCity" required /></label><label>District<input name="district" required /></label><label>State<input name="state" defaultValue="Odisha" required /></label><label>Pincode<input name="pincode" required maxLength="6" /></label></FormSection><FormSection title="Solar requirement"><label>Service<select name="service" required><option value="">Select service</option>{services.map((item) => <option key={item.id}>{item.title}</option>)}</select></label><label>Roof type<select name="roofType" required><option value="">Select roof type</option><option>RCC / Concrete</option><option>Tin / Sheet</option><option>Tile</option><option>Ground mount</option><option>Other</option></select></label><label>Monthly bill<input name="monthlyBill" /></label><label>Capacity<input name="capacity" /></label>{role === "admin" && <label>Assign employee<select name="assignedTo"><option value="">Unassigned</option>{employees.filter((employee) => employee.active && employee.email).map((employee) => <option key={employee.id} value={employee.phone}>{employee.name}</option>)}</select></label>}<label className="wide">Notes<textarea name="message" /></label></FormSection><FormSection title="Documents"><label className="wide">Upload files<input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(event) => setFiles([...event.target.files])} /></label></FormSection><button className="button primary" disabled={busy}>{busy ? "Saving..." : "Save application"}</button></form>;
}

function ApplicationDetail({ item, employees }) {
  return <div className="detail-modal-grid"><DetailGroup title="Customer" rows={[["Name", item.name], ["Phone", item.phone], ["Email", item.email], ["Address", item.address]]} /><DetailGroup title="Requirement" rows={[["Service", item.service], ["Roof type", item.roofType], ["Monthly bill", item.monthlyBill], ["Capacity", item.capacity]]} /><DetailGroup title="Work status" rows={[["Status", item.status], ["Assigned to", employeeName(item.assignedTo, employees)], ["Notes", item.notes], ["Updated", item.updatedAt]]} /><article><h3>Documents</h3><div className="document-list">{Object.values(item.documents || {}).map((document) => <a key={document.url} href={backendUrl(document.url)} target="_blank" rel="noreferrer">{document.name || "Document"} <span>Open ↗</span></a>)}{!Object.keys(item.documents || {}).length && <p>No documents uploaded.</p>}</div></article></div>;
}

function DetailGroup({ title, rows }) { return <article><h3>{title}</h3><dl>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Not added"}</dd></div>)}</dl></article>; }
function Stats({ items }) { return <div className="stats-grid">{items.map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div>; }
function PanelTitle({ title, text }) { return <div className="panel-title"><div><h2>{title}</h2><p>{text}</p></div></div>; }
function Empty({ title, text, action }) { return <div className="empty"><strong>{title}</strong>{text && <p>{text}</p>}{action}</div>; }
function Avatar({ user }) { const initials = String(user.displayName || user.name || "?").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); return user.profilePhoto ? <img className="avatar" src={user.profilePhoto} alt="" /> : <span className="avatar">{initials}</span>; }
function statusClass(status) { return String(status || "").toLowerCase().replace(/\s+/g, "-"); }
function employeeName(phone, employees) { return employees.find((item) => item.phone === phone)?.name || phone || "Unassigned"; }
function joinLines(items) { return Array.isArray(items) ? items.map((item) => typeof item === "string" ? item : item.name || item.detail || "").filter(Boolean).join("\n") : ""; }
function splitLines(value) { return String(value || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean); }
function modalTitle(modal) { return modal.type === "application" ? "New customer application" : modal.type === "update" ? `Update ${modal.item.name}` : modal.type === "view" ? modal.item.name : modal.type === "employee" ? (modal.item ? `Edit ${modal.item.name}` : "Add employee") : modal.item ? `Edit ${modal.item.title}` : `Add ${modal.kind === "services" ? "service" : "product"}`; }
function Modal({ title, children, onClose }) { return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal"><header><h2>{title}</h2><button onClick={onClose}>×</button></header><div className="modal-body">{children}</div></section></div>; }
