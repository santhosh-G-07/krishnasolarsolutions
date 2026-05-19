/*
 * KSS Solar Assistant — vanilla JS chatbot widget
 * Load with: <script src="chatbot.js" defer></script>
 * Renders floating button + chat window. Talks to /api/chatbot.
 * History persists in localStorage. Mobile-responsive.
 */
(function () {
  const STATE = {
    KEY: "kss_chat_history_v1",
    SESSION: "kss_chat_session_v1",
    OPEN: "kss_chat_open_v1",
    messages: [],
    open: false,
    busy: false,
    lead: { mode: false, submitted: false },
    sessionId: null,
  };
  const CHIPS = [
    "What is on-grid solar?",
    "Calculate my savings",
    "Book a site visit",
    "Solar subsidy info",
    "Hybrid vs off-grid",
    "Contact support",
  ];

  function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
  function nowTime() {
    const d = new Date();
    let h = d.getHours(), m = d.getMinutes(), ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12; m = m < 10 ? "0" + m : m;
    return h + ":" + m + " " + ap;
  }
  function escHtml(s) { return String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function mdLite(s) {
    let h = escHtml(s);
    h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/^\s*[\-•]\s+(.+)$/gm, "<li>$1</li>");
    h = h.replace(/(<li>[\s\S]+?<\/li>)/g, m => "<ul>" + m + "</ul>");
    h = h.replace(/<\/ul>\s*<ul>/g, "");
    h = h.replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>");
    h = h.replace(/<br>\s*<ul>/g, "<ul>").replace(/<\/ul>\s*<br>/g, "</ul>");
    h = h.replace(/<\/li>\s*<br>\s*<li>/g, "</li><li>");
    return h;
  }

  /* ---------- CSS injection ---------- */
  const css = `
  .kss-bot-fab{position:fixed;bottom:22px;right:22px;z-index:9998;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#0d4a2a,#1a7a45);color:#fff;border:none;cursor:pointer;box-shadow:0 8px 24px rgba(13,74,42,.35);display:flex;align-items:center;justify-content:center;font-family:'DM Sans',system-ui,sans-serif;transition:transform .2s,box-shadow .2s;animation:kssPulse 2.6s ease-in-out infinite}
  .kss-bot-fab:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(13,74,42,.45)}
  .kss-bot-fab svg{width:26px;height:26px}
  .kss-bot-fab .kss-fab-dot{position:absolute;top:8px;right:8px;width:10px;height:10px;border-radius:50%;background:#22a85a;border:2px solid #fff;animation:kssBlink 1.4s ease-in-out infinite}
  @keyframes kssPulse{0%,100%{box-shadow:0 8px 24px rgba(13,74,42,.35)}50%{box-shadow:0 8px 24px rgba(34,168,90,.55)}}
  @keyframes kssBlink{0%,100%{opacity:1}50%{opacity:.35}}
  .kss-bot-win{position:fixed;bottom:96px;right:22px;z-index:9999;width:380px;max-width:calc(100vw - 28px);height:min(620px,calc(100vh - 130px));background:#faf8f3;border:1px solid #c8dfd1;border-radius:18px;box-shadow:0 24px 60px rgba(13,74,42,.22);display:none;flex-direction:column;overflow:hidden;font-family:'DM Sans',system-ui,sans-serif;color:#0f1f14;animation:kssWinIn .22s ease-out}
  .kss-bot-win.open{display:flex}
  @keyframes kssWinIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  .kss-bot-head{background:linear-gradient(135deg,#0d4a2a,#1a7a45);color:#fff;padding:14px 18px;display:flex;align-items:center;gap:10px}
  .kss-bot-head .ic{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;font-family:'Fraunces',Georgia,serif}
  .kss-bot-head .ic img{width:100%;height:100%;object-fit:cover;border-radius:50%}
  .kss-bot-head .ti{flex:1;min-width:0}
  .kss-bot-head .ti .t{font-size:14px;font-weight:600;line-height:1.1}
  .kss-bot-head .ti .s{font-size:11px;opacity:.85;margin-top:2px;display:flex;align-items:center;gap:6px}
  .kss-bot-head .ti .s::before{content:"";width:7px;height:7px;border-radius:50%;background:#a7f3d0;box-shadow:0 0 0 0 rgba(167,243,208,.7);animation:kssDot 1.6s ease-in-out infinite}
  @keyframes kssDot{0%,100%{box-shadow:0 0 0 0 rgba(167,243,208,.7)}50%{box-shadow:0 0 0 4px rgba(167,243,208,0)}}
  .kss-bot-head .x{background:none;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1;padding:0 4px;opacity:.85}
  .kss-bot-head .x:hover{opacity:1}
  .kss-bot-msgs{flex:1;overflow-y:auto;padding:14px 14px 8px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
  .kss-bot-msg{max-width:84%;font-size:13.5px;line-height:1.5;padding:10px 13px;border-radius:14px;word-wrap:break-word}
  .kss-bot-msg.bot{align-self:flex-start;background:#fff;border:1px solid #d4f0df;border-bottom-left-radius:4px;color:#0f1f14}
  .kss-bot-msg.user{align-self:flex-end;background:linear-gradient(135deg,#0d4a2a,#1a7a45);color:#fff;border-bottom-right-radius:4px}
  .kss-bot-msg ul{margin:4px 0 4px 18px;padding:0}
  .kss-bot-msg li{margin:2px 0}
  .kss-bot-msg strong{font-weight:600}
  .kss-bot-time{font-size:10px;color:#7a9b85;margin:-4px 4px 0;align-self:flex-start}
  .kss-bot-msg.user + .kss-bot-time{align-self:flex-end;color:#a7c4b0}
  .kss-bot-typing{align-self:flex-start;background:#fff;border:1px solid #d4f0df;border-bottom-left-radius:4px;border-radius:14px;padding:12px 14px;display:none;align-items:center;gap:5px}
  .kss-bot-typing.show{display:inline-flex}
  .kss-bot-typing span{width:7px;height:7px;border-radius:50%;background:#1a7a45;animation:kssBounce 1s infinite}
  .kss-bot-typing span:nth-child(2){animation-delay:.15s}
  .kss-bot-typing span:nth-child(3){animation-delay:.3s}
  @keyframes kssBounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}
  .kss-bot-chips{padding:6px 12px 8px;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid #e8efe9}
  .kss-bot-chips.hidden{display:none}
  .kss-bot-chip{font-size:11.5px;background:#fff;border:1px solid #c8dfd1;color:#0d4a2a;padding:6px 11px;border-radius:18px;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}
  .kss-bot-chip:hover{background:#d4f0df;border-color:#1a7a45}
  .kss-bot-input{display:flex;gap:8px;padding:10px 12px 12px;border-top:1px solid #e8efe9;background:#fff}
  .kss-bot-input input{flex:1;border:1px solid #c8dfd1;border-radius:22px;padding:10px 16px;font-size:13px;background:#f0faf4;outline:none;font-family:inherit;color:#0f1f14}
  .kss-bot-input input:focus{border-color:#1a7a45;background:#fff;box-shadow:0 0 0 3px rgba(26,122,69,.1)}
  .kss-bot-input input::placeholder{color:#7a9b85}
  .kss-bot-send{background:linear-gradient(135deg,#0d4a2a,#1a7a45);border:none;color:#fff;width:40px;height:40px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .12s}
  .kss-bot-send:hover{transform:scale(1.06)}
  .kss-bot-send:disabled{opacity:.55;cursor:not-allowed;transform:none}
  .kss-bot-send svg{width:18px;height:18px}
  .kss-bot-lead{margin-top:6px;background:#fff;border:1px solid #d4f0df;border-radius:14px;padding:12px}
  .kss-bot-lead .lt{font-size:13px;font-weight:600;color:#0d4a2a;margin-bottom:8px}
  .kss-bot-lead .ls{font-size:11.5px;color:#3d5c48;margin-bottom:10px;line-height:1.4}
  .kss-bot-lead input{width:100%;padding:9px 12px;border:1px solid #c8dfd1;border-radius:9px;font-size:13px;background:#f0faf4;outline:none;margin-bottom:8px;font-family:inherit;color:#0f1f14}
  .kss-bot-lead input:focus{border-color:#1a7a45;background:#fff}
  .kss-bot-lead .lr{display:flex;gap:6px}
  .kss-bot-lead button{flex:1;padding:9px;border:none;border-radius:9px;font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .15s}
  .kss-bot-lead button.p{background:linear-gradient(135deg,#0d4a2a,#1a7a45);color:#fff}
  .kss-bot-lead button.p:hover{filter:brightness(1.08)}
  .kss-bot-lead button.s{background:transparent;color:#7a9b85;border:1px solid #c8dfd1}
  .kss-bot-lead.done{background:#d4f0df;border-color:#1a7a45;text-align:center;padding:14px}
  .kss-bot-lead.done .lt{margin:0}
  .kss-bot-foot{font-size:10px;color:#7a9b85;text-align:center;padding:6px 12px 10px;background:#fff;border-top:1px solid #f0f5f0}
  @media (max-width:480px){
    .kss-bot-win{right:8px;left:8px;width:auto;bottom:84px;height:calc(100vh - 100px);border-radius:18px 18px 14px 14px}
    .kss-bot-fab{right:14px;bottom:14px;width:54px;height:54px}
  }
  `;
  const style = document.createElement("style");
  style.id = "kss-bot-styles"; style.textContent = css;
  document.head.appendChild(style);

  /* ---------- DOM ---------- */
  const fab = document.createElement("button");
  fab.className = "kss-bot-fab";
  fab.setAttribute("aria-label", "Open KSS Solar Assistant");
  fab.innerHTML = `
    <span class="kss-fab-dot"></span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>`;
  document.body.appendChild(fab);

  const win = document.createElement("div");
  win.className = "kss-bot-win";
  win.innerHTML = `
    <div class="kss-bot-head">
      <div class="ic" id="kss-bot-ic">KSS</div>
      <div class="ti">
        <div class="t">KSS Solar Assistant</div>
        <div class="s">Online · usually replies instantly</div>
      </div>
      <button class="x" aria-label="Close chat">&times;</button>
    </div>
    <div class="kss-bot-msgs" id="kss-bot-msgs"></div>
    <div class="kss-bot-chips" id="kss-bot-chips"></div>
    <div class="kss-bot-input">
      <input id="kss-bot-input" type="text" placeholder="Ask about solar, savings, site visits…" maxlength="500" autocomplete="off"/>
      <button class="kss-bot-send" id="kss-bot-send" aria-label="Send">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
    <div class="kss-bot-foot">KSS Solar Solutions · Powering India's homes</div>
  `;
  document.body.appendChild(win);

  // Use kss-logo if present
  const ic = win.querySelector("#kss-bot-ic");
  const logoUrl = "assets/kss-logo.jpeg";
  const probe = new Image();
  probe.onload = () => { ic.innerHTML = `<img src="${logoUrl}" alt=""/>`; };
  probe.src = logoUrl;

  const msgsEl = win.querySelector("#kss-bot-msgs");
  const chipsEl = win.querySelector("#kss-bot-chips");
  const inputEl = win.querySelector("#kss-bot-input");
  const sendEl = win.querySelector("#kss-bot-send");
  const closeEl = win.querySelector(".x");

  /* ---------- state load/save ---------- */
  function loadHistory() {
    try { STATE.messages = JSON.parse(localStorage.getItem(STATE.KEY) || "[]") || []; } catch (e) { STATE.messages = []; }
    try { STATE.sessionId = localStorage.getItem(STATE.SESSION) || uid(); localStorage.setItem(STATE.SESSION, STATE.sessionId); } catch (e) { STATE.sessionId = uid(); }
  }
  function saveHistory() {
    try { localStorage.setItem(STATE.KEY, JSON.stringify(STATE.messages.slice(-40))); } catch (e) {}
  }

  /* ---------- render ---------- */
  function renderChips() {
    chipsEl.innerHTML = "";
    if (STATE.messages.length > 2 || STATE.busy) { chipsEl.classList.add("hidden"); return; }
    chipsEl.classList.remove("hidden");
    CHIPS.forEach(text => {
      const b = document.createElement("button");
      b.className = "kss-bot-chip"; b.textContent = text;
      b.onclick = () => { inputEl.value = text; sendMessage(); };
      chipsEl.appendChild(b);
    });
  }
  function appendMsg(role, content, time) {
    time = time || nowTime();
    const m = document.createElement("div");
    m.className = "kss-bot-msg " + (role === "user" ? "user" : "bot");
    m.innerHTML = role === "user" ? escHtml(content) : mdLite(content);
    msgsEl.appendChild(m);
    const t = document.createElement("div");
    t.className = "kss-bot-time"; t.textContent = time;
    msgsEl.appendChild(t);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
  function appendTyping() {
    const t = document.createElement("div");
    t.className = "kss-bot-typing show"; t.id = "kss-bot-typing-active";
    t.innerHTML = "<span></span><span></span><span></span>";
    msgsEl.appendChild(t); msgsEl.scrollTop = msgsEl.scrollHeight;
  }
  function clearTyping() {
    const t = document.getElementById("kss-bot-typing-active");
    if (t) t.remove();
  }
  function appendLeadForm() {
    if (STATE.lead.submitted) return;
    const f = document.createElement("div");
    f.className = "kss-bot-lead"; f.id = "kss-bot-lead-form";
    f.innerHTML = `
      <div class="lt">Get a free callback</div>
      <div class="ls">Share your details and KSS will reach out within a working day.</div>
      <input id="kss-lead-name" type="text" placeholder="Your full name" maxlength="60"/>
      <input id="kss-lead-phone" type="tel" placeholder="10-digit mobile" maxlength="10" inputmode="numeric"/>
      <input id="kss-lead-loc" type="text" placeholder="Location (district / city)" maxlength="60"/>
      <div class="lr">
        <button class="s" id="kss-lead-cancel">Not now</button>
        <button class="p" id="kss-lead-submit">Send to KSS</button>
      </div>`;
    msgsEl.appendChild(f); msgsEl.scrollTop = msgsEl.scrollHeight;
    f.querySelector("#kss-lead-cancel").onclick = () => { f.remove(); };
    f.querySelector("#kss-lead-submit").onclick = submitLead;
  }
  async function submitLead() {
    const f = document.getElementById("kss-bot-lead-form");
    if (!f) return;
    const name = f.querySelector("#kss-lead-name").value.trim();
    const phone = f.querySelector("#kss-lead-phone").value.trim();
    const loc = f.querySelector("#kss-lead-loc").value.trim();
    if (name.length < 2) { alert("Please enter your name."); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { alert("Please enter a valid 10-digit mobile number."); return; }
    const btn = f.querySelector("#kss-lead-submit");
    btn.disabled = true; btn.textContent = "Sending…";
    const lastUser = [...STATE.messages].reverse().find(m => m.role === "user");
    try {
      const r = await fetch("/api/chatbot/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, location: loc, interest: lastUser ? lastUser.content : "", sessionId: STATE.sessionId })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Could not save.");
      STATE.lead.submitted = true;
      f.classList.add("done");
      f.innerHTML = `<div class="lt">✓ Thanks, ${escHtml(name.split(" ")[0])}!</div><div class="ls" style="margin-bottom:0;margin-top:4px">Our team will call you shortly on +91-${escHtml(phone)}.</div>`;
      msgsEl.scrollTop = msgsEl.scrollHeight;
    } catch (e) {
      btn.disabled = false; btn.textContent = "Send to KSS";
      alert(e.message || "Could not send. Please try again.");
    }
  }
  function renderAll() {
    msgsEl.innerHTML = "";
    if (STATE.messages.length === 0) {
      appendMsg("assistant",
        "Hi! I'm the **KSS Solar Assistant**. I can help you understand solar systems, estimate savings, and book a free site visit.\n\nWhat would you like to know?");
    } else {
      STATE.messages.forEach(m => appendMsg(m.role, m.content, m.time));
    }
    renderChips();
  }

  /* ---------- send ---------- */
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || STATE.busy) return;
    STATE.busy = true;
    sendEl.disabled = true;
    inputEl.value = "";
    const userMsg = { role: "user", content: text, time: nowTime() };
    STATE.messages.push(userMsg);
    appendMsg("user", text, userMsg.time);
    renderChips();
    appendTyping();
    saveHistory();
    try {
      const r = await fetch("/api/chatbot", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: STATE.messages.slice(0, -1), sessionId: STATE.sessionId })
      });
      const j = await r.json();
      clearTyping();
      const reply = j.reply || "Sorry, assistant is temporarily unavailable.";
      const botMsg = { role: "assistant", content: reply, time: nowTime() };
      STATE.messages.push(botMsg);
      appendMsg("assistant", reply, botMsg.time);
      saveHistory();
      if (j.leadCapture && !STATE.lead.submitted) {
        setTimeout(appendLeadForm, 350);
      }
    } catch (e) {
      clearTyping();
      const fallback = "Sorry, assistant is temporarily unavailable. Please try again or contact KSS directly.";
      STATE.messages.push({ role: "assistant", content: fallback, time: nowTime() });
      appendMsg("assistant", fallback);
      saveHistory();
    }
    STATE.busy = false;
    sendEl.disabled = false;
    inputEl.focus();
  }

  /* ---------- open/close ---------- */
  function openChat() {
    STATE.open = true; win.classList.add("open");
    try { localStorage.setItem(STATE.OPEN, "1"); } catch (e) {}
    setTimeout(() => inputEl.focus(), 200);
  }
  function closeChat() {
    STATE.open = false; win.classList.remove("open");
    try { localStorage.setItem(STATE.OPEN, "0"); } catch (e) {}
  }
  fab.onclick = () => STATE.open ? closeChat() : openChat();
  closeEl.onclick = closeChat;
  sendEl.onclick = sendMessage;
  inputEl.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } });

  /* ---------- init ---------- */
  loadHistory();
  renderAll();
  try { if (localStorage.getItem(STATE.OPEN) === "1") openChat(); } catch (e) {}

  // expose for debugging / clearing
  window.kssChat = {
    reset() { STATE.messages = []; STATE.lead.submitted = false; try { localStorage.removeItem(STATE.KEY); } catch (e) {} renderAll(); },
    open: openChat, close: closeChat,
  };
})();
