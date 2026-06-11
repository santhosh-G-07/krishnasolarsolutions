import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "./App";
import { EMAIL, heroSlides, PHONE } from "./data";

export function Link({ href, children, className = "", onClick, ...props }) {
  const { navigate } = useContext(AppContext);
  const external = /^(https?:|mailto:|tel:)/.test(href) || href.endsWith(".pdf");
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !external) {
          event.preventDefault();
          navigate(href);
        }
      }}
      {...props}
    >
      {children}
    </a>
  );
}

export function PublicLayout({ children, compact = false }) {
  const { session, logout } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const dashboard = session?.role === "admin" ? "/admin" : session?.role === "employee" ? "/employee" : "/dashboard";
  return (
    <div className={compact ? "public-shell compact" : "public-shell"}>
      <header className="site-header">
        <Link href="/" className="brand">
          <img src="/assets/kss-logo.jpeg" alt="KSS logo" />
          <span><strong>KSS</strong><small>Krishna Solar Solutions</small></span>
        </Link>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          <span /><span /><span />
        </button>
        <nav className={open ? "site-nav open" : "site-nav"} onClick={() => setOpen(false)}>
          <Link href="/services">Services</Link>
          <Link href="/products">Products</Link>
          <Link href="/apply">Apply</Link>
          <a href="/#calculator">Calculator</a>
          <a href="/#contact">Contact</a>
          {session ? <Link href={dashboard} className="nav-account">Dashboard</Link> : <Link href="/auth" className="nav-account">Login / Register</Link>}
          {session && <button className="nav-logout" onClick={logout}>Logout</button>}
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <div><strong>Krishna Solar Solutions</strong><span>Powering India's homes, farms, and businesses.</span></div>
        <div><a href={`tel:+91${PHONE}`}>+91 {PHONE}</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
      </footer>
    </div>
  );
}

export function HomePage() {
  const { services, products, bootstrap } = useContext(AppContext);
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % heroSlides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);
  const completed = bootstrap.applications.filter((item) => item.status === "Completed").length;
  return (
    <main>
      <section className="hero">
        {heroSlides.map(([src, alt], index) => <img key={src} className={slide === index ? "hero-image active" : "hero-image"} src={src} alt={alt} />)}
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-pill">Solar experts in Odisha</span>
          <h1>Clean energy.<br /><em>Clear savings.</em></h1>
          <p>Rooftop solar installation, solar pumps, commercial systems, and complete service support from one trusted team.</p>
          <div className="action-row">
            <Link href="/apply" className="button primary">Apply for Solar</Link>
            <Link href="/services" className="button glass">Explore Services</Link>
            <a className="button glass" href="/assets/Krishna Solar Solutions Template.pdf" target="_blank" rel="noreferrer">Open Brochure</a>
          </div>
          <div className="hero-stats">
            <div><strong>{Math.max(100, completed)}+</strong><span>Projects supported</span></div>
            <div><strong>{services.length}</strong><span>Solar services</span></div>
            <div><strong>{products.length}+</strong><span>Product types</span></div>
          </div>
        </div>
        <div className="slide-dots">{heroSlides.map((_, index) => <button key={index} className={slide === index ? "active" : ""} onClick={() => setSlide(index)} aria-label={`Slide ${index + 1}`} />)}</div>
      </section>

      <section className="section split-intro">
        <div>
          <span className="eyebrow">Solar made simple</span>
          <h2>Stop renting electricity.<br />Start owning your power.</h2>
          <p>We plan the right system, handle documents, install safely, and keep every project stage visible.</p>
          <Link href="/apply" className="text-link">Get a free solar assessment</Link>
        </div>
        <div className="step-grid">
          {[["01", "We visit your site", "Free assessment of your roof and usage."], ["02", "We design your system", "A custom plan for your budget and needs."], ["03", "You start saving", "Clean power and clear project tracking."]].map(([number, title, text]) => (
            <article className="step-card" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>
          ))}
        </div>
      </section>

      <ContentPreview title="Solar services for every requirement." eyebrow="Our services" items={services.slice(0, 6)} type="services" />
      <ContentPreview title="Certified products. Expert installation." eyebrow="Our products" items={products.slice(0, 8)} type="products" />

      <section className="section visual-section">
        <div>
          <span className="eyebrow">Why KSS</span>
          <h2>Reliable solar support from enquiry to completion.</h2>
          <p>KSS guides you through product selection, installation planning, document collection, work tracking, and service updates with a clear process.</p>
          <div className="feature-list">
            {["Clear project status", "Secure document records", "Warranty guidance", "After-sales support"].map((item) => <span key={item}>✓ {item}</span>)}
          </div>
        </div>
        <img src="/assets/renewable-energy.png" alt="Renewable energy" />
      </section>

      <Reviews />
      <Calculator />
      <Contact />
    </main>
  );
}

function ContentPreview({ title, eyebrow, items, type }) {
  return (
    <section className="section band">
      <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
      <div className="content-grid">
        {items.map((item) => (
          <Link className="content-card" href={`/${type}/${item.slug || item.id}`} key={item.id}>
            <span className="tag">{item.badge}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <strong>{item.pricing || item.warranty || "View details"} →</strong>
          </Link>
        ))}
      </div>
      <Link href={`/${type}`} className="button secondary">View all {type}</Link>
    </section>
  );
}

function Reviews() {
  const reviews = [
    ["★★★★★", "Good installation support", "Team explained the solar process clearly and updated every stage on time.", "Home customer"],
    ["★★★★★", "Helpful for documents", "KSS helped with electricity bill, roof photo, and other required documents smoothly.", "Residential client"],
    ["★★★★★", "Quick response", "Calls and WhatsApp updates were fast, and the team handled the site visit professionally.", "Solar applicant"],
    ["★★★★☆", "Clean work progress", "The work status tracking made it easy to know what was pending and what was completed.", "KSS customer"],
  ];
  const featureReviews = [
    ["HC", "Good installation support", "Home installation", "Team explained the solar process clearly and updated every stage on time."],
    ["RC", "Helpful for documents", "Residential client", "KSS helped with electricity bill, roof photo, and other required documents smoothly."],
    ["SA", "Quick response", "Solar applicant", "Calls and WhatsApp updates were fast, and the site visit was handled professionally."],
    ["KC", "Clean work progress", "Commercial project", "The work status tracking made it easy to know what was pending and completed."],
  ];
  return (
    <section className="section band reviews-section" id="reviews">
      <div className="reviews-heading">
        <div>
          <p className="eyebrow">Customer Reviews</p>
          <h2>What customers say about KSS</h2>
          <p>Real feedback from homeowners, businesses, and solar applicants.</p>
        </div>
        <a className="button secondary" href="https://share.google/neok5yBa11cMHkvuz" target="_blank" rel="noreferrer">View on Google Maps</a>
      </div>

      <div className="rating-summary">
        <div className="rating-score">
          <strong>4.8</strong>
          <span>★★★★★</span>
          <small>Overall rating</small>
        </div>
        <div className="rating-bars">
          {[["5★", 42], ["4★", 18], ["3★", 5], ["2★", 2], ["1★", 1]].map(([label, value]) => (
            <div key={label}><span>{label}</span><meter min="0" max="68" value={value} /><small>{value}</small></div>
          ))}
        </div>
        <div className="rating-badges">
          <span>68 verified reviews</span>
          <span>Google verified</span>
          <span>Top-rated installer</span>
        </div>
      </div>

      <div className="review-feature-grid">
        {featureReviews.map(([initials, title, subtitle, text]) => (
          <article key={title}>
            <span>{initials}</span>
            <div><strong>{title}</strong><small>{subtitle}</small></div>
            <p>{text}</p>
          </article>
        ))}
      </div>

      <div className="reviews-marquee" aria-label="Sliding customer reviews">
        <div className="reviews-track">
          {[...reviews, ...reviews].map(([stars, title, text, name], index) => (
            <article className="review-card" key={`${title}-${index}`}>
              <strong>{stars}</strong>
              <h3>{title}</h3>
              <p>{text}</p>
              <span>- {name}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Calculator() {
  const [bill, setBill] = useState(2500);
  const [rate, setRate] = useState(8);
  const result = useMemo(() => {
    const units = Math.round(bill / rate);
    const kw = Math.max(1, Math.ceil(units / 120));
    const monthly = Math.round(Math.min(bill * 0.82, kw * 1100));
    return { units, kw, monthly, yearly: monthly * 12, cost: kw * 60000 };
  }, [bill, rate]);
  return (
    <section className="section calculator" id="calculator">
      <div className="section-heading"><span className="eyebrow">Savings calculator</span><h2>See what solar could save you.</h2></div>
      <div className="calculator-grid">
        <div className="form-card">
          <label>Average monthly electricity bill <strong>Rs {bill.toLocaleString("en-IN")}</strong><input type="range" min="500" max="30000" step="100" value={bill} onChange={(event) => setBill(Number(event.target.value))} /></label>
          <label>Average electricity unit rate <strong>Rs {rate} / kWh</strong><input type="range" min="3" max="20" step=".5" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></label>
          <Link href="/apply" className="button primary">Apply with these details</Link>
        </div>
        <div className="result-grid">
          <article className="result-main"><span>Recommended system</span><strong>{result.kw}<small> kW</small></strong><p>Final capacity is confirmed after a site visit.</p></article>
          <article><span>Monthly savings</span><strong>Rs {result.monthly.toLocaleString("en-IN")}</strong></article>
          <article><span>Yearly savings</span><strong>Rs {result.yearly.toLocaleString("en-IN")}</strong></article>
          <article><span>Units consumed</span><strong>{result.units} / month</strong></article>
          <article><span>Estimated system cost</span><strong>Rs {result.cost.toLocaleString("en-IN")}</strong></article>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section band" id="contact">
      <div className="section-heading"><span className="eyebrow">Contact us</span><h2>Let's power your future together.</h2></div>
      <div className="contact-grid">
        <a href={`tel:+91${PHONE}`}><span>Call us</span><strong>+91 {PHONE}</strong><small>Mon-Sat, 9am to 7pm</small></a>
        <a href={`https://wa.me/91${PHONE}`} target="_blank" rel="noreferrer"><span>WhatsApp</span><strong>Chat with KSS</strong><small>Fast support for your solar enquiry</small></a>
        <a href={`mailto:${EMAIL}`}><span>Email support</span><strong>{EMAIL}</strong><small>Replies within one working day</small></a>
      </div>
    </section>
  );
}

export function CatalogPage({ type, path }) {
  const context = useContext(AppContext);
  const items = type === "services" ? context.services : context.products;
  const slug = path.split("/")[2];
  const item = slug ? items.find((entry) => (entry.slug || entry.id) === slug) : null;
  if (slug && !item) return <main className="center-page"><div className="empty-card"><h1>Item not found.</h1><Link href={`/${type}`} className="button primary">View all {type}</Link></div></main>;
  if (item) return <DetailPage item={item} type={type} />;
  return (
    <main>
      <section className="catalog-hero"><span className="eyebrow">KSS {type}</span><h1>{type === "services" ? "Solar support for every energy need." : "Reliable solar products for every system."}</h1><p>Explore complete details, benefits, process, and service support.</p></section>
      <section className="section"><div className="content-grid catalog-grid">{items.map((entry) => <Link className="content-card" href={`/${type}/${entry.slug || entry.id}`} key={entry.id}><span className="tag">{entry.badge}</span><h3>{entry.title}</h3><p>{entry.description}</p><strong>{entry.pricing || entry.warranty || "View details"} →</strong></Link>)}</div></section>
    </main>
  );
}

function DetailPage({ item, type }) {
  const details = item.details || item.install || [];
  return (
    <main>
      <section className="detail-hero">
        <div><Link href={`/${type}`} className="back-link">← All {type}</Link><span className="tag">{item.badge}</span><h1>{item.title}</h1><p>{item.fullDescription || item.description}</p><div className="action-row"><Link href={`/apply?service=${encodeURIComponent(item.title)}`} className="button primary">Apply now</Link><a href={`https://wa.me/91${PHONE}`} className="button secondary">WhatsApp us</a></div></div>
        <aside><span>Starting from</span><strong>{item.pricing || item.warranty || "Custom quote"}</strong><small>Final quote after requirement check.</small></aside>
      </section>
      <section className="section detail-grid">
        <InfoBlock title="What's included" items={details} />
        <InfoBlock title="Key benefits" items={item.benefits || []} />
        <InfoBlock title="How it works" items={item.process || []} />
        <InfoBlock title="Support" items={["Requirement guidance", "Professional installation", "Testing and handover", "After-sales assistance"]} />
      </section>
    </main>
  );
}

function InfoBlock({ title, items }) {
  return <article className="info-block"><h2>{title}</h2>{items.length ? items.map((item, index) => <p key={index}><span>✓</span>{typeof item === "string" ? item : `${item.name || ""} ${item.detail || ""}`}</p>) : <p><span>✓</span>Details shared after assessment.</p>}</article>;
}
