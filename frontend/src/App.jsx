import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { api, clearSession, getSession, saveSession } from "./api";
import { defaultProducts, defaultServices, mergeContent } from "./data";
import { ApplyPage, AuthPage, StaffLoginPage } from "./Auth";
import { CatalogPage, HomePage, PublicLayout } from "./Public";
import { CustomerDashboard, StaffDashboard } from "./Dashboards";

export const AppContext = createContext(null);

const normalizePath = (path) => {
  if (path === "/index.html") return "/";
  if (path === "/services.html") return "/services";
  if (path === "/products.html") return "/products";
  if (path === "/auth.html") return "/auth";
  if (path === "/apply.html") return "/apply";
  if (path === "/dashboard.html") return "/dashboard";
  if (path === "/admin.html") return "/admin";
  if (path === "/employee.html") return "/employee";
  if (path === "/staff-login.html") return "/staff-login";
  return path.replace(/\/+$/, "") || "/";
};

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [session, setSession] = useState(getSession);
  const [bootstrap, setBootstrap] = useState({
    users: [], customers: [], employees: [], applications: [], notifications: [], services: [], products: [], businessSettings: {},
  });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [toast, setToast] = useState("");

  const refresh = useCallback(async () => {
    try {
      const data = await api.get("/api/bootstrap");
      setBootstrap(data);
      setApiError("");
      localStorage.setItem("kssBootstrap", JSON.stringify(data));
      return data;
    } catch (error) {
      const cached = JSON.parse(localStorage.getItem("kssBootstrap") || "null");
      if (cached) setBootstrap(cached);
      setApiError(error.message || "The backend is temporarily unavailable.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh().catch(() => setLoading(false));
  }, [refresh]);

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((next, replace = false) => {
    const url = new URL(next, window.location.origin);
    if (url.origin !== window.location.origin) {
      window.location.href = next;
      return;
    }
    window.history[replace ? "replaceState" : "pushState"]({}, "", `${url.pathname}${url.search}${url.hash}`);
    setPath(normalizePath(url.pathname));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const login = useCallback((user) => {
    saveSession(user);
    setSession(user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    navigate("/");
  }, [navigate]);

  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }, []);

  const value = useMemo(() => ({
    bootstrap,
    loading,
    apiError,
    session,
    services: mergeContent(defaultServices, bootstrap.services).filter((item) => item.active !== false),
    products: mergeContent(defaultProducts, bootstrap.products).filter((item) => item.active !== false),
    refresh,
    navigate,
    login,
    logout,
    notify,
    setBootstrap,
  }), [bootstrap, loading, apiError, session, refresh, navigate, login, logout, notify]);

  let page;
  if (path === "/") page = <PublicLayout><HomePage /></PublicLayout>;
  else if (path === "/services" || path.startsWith("/services/")) page = <PublicLayout><CatalogPage type="services" path={path} /></PublicLayout>;
  else if (path === "/products" || path.startsWith("/products/")) page = <PublicLayout><CatalogPage type="products" path={path} /></PublicLayout>;
  else if (path === "/auth") page = <PublicLayout compact><AuthPage /></PublicLayout>;
  else if (path === "/staff-login") page = <PublicLayout compact><StaffLoginPage /></PublicLayout>;
  else if (path === "/apply") page = <PublicLayout compact><ApplyPage /></PublicLayout>;
  else if (path === "/dashboard") page = <CustomerDashboard />;
  else if (path === "/admin") page = <StaffDashboard role="admin" />;
  else if (path === "/employee") page = <StaffDashboard role="employee" />;
  else page = <PublicLayout><NotFound /></PublicLayout>;

  return (
    <AppContext.Provider value={value}>
      {loading && <PageLoader />}
      {apiError && !loading && <OfflineBanner message={apiError} retry={() => refresh().catch(() => {})} />}
      {page}
      {toast && <div className="toast">{toast}</div>}
    </AppContext.Provider>
  );
}

function PageLoader() {
  return <div className="page-loader" aria-label="Loading"><img src="/assets/kss-logo.jpeg" alt="" /><span /></div>;
}

function OfflineBanner({ message, retry }) {
  return <aside className="offline-banner"><div><strong>Using fallback data</strong><span>{message}</span></div><button onClick={retry}>Retry connection</button></aside>;
}

function NotFound() {
  const { navigate } = React.useContext(AppContext);
  return (
    <main className="center-page">
      <div className="empty-card">
        <span className="eyebrow">404</span>
        <h1>That page is not available.</h1>
        <button className="button primary" onClick={() => navigate("/")}>Back to home</button>
      </div>
    </main>
  );
}
