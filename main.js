/* ===== CINEMATIC MAIN JS — UPGRADED ===== */
const App = {
  currentUser: null,
  _refreshTimer: null,
  _sessionTimer: null,
  _sessionWarned: false,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 min idle timeout
  SESSION_WARN: 60,                // warn at 60 seconds remaining

  init() {
    this.loadUser();
    this.initTheme();
    this.initNotifications();
    this.updateAvatar();
    this.updateClock();
    this.initMenuToggle();
    this.initCommandPalette();
    this.initKeyboardShortcuts();
    this.startSessionMonitor();
    this.startAutoRefresh();
    this.hideLoading();
  },

  /* ----- LOADING ----- */
  hideLoading() {
    const ls = document.getElementById("loadingScreen");
    if (ls) setTimeout(() => ls.classList.add("hidden"), 80);
  },

  /* ----- USER SESSION ----- */
  loadUser() {
    const data = localStorage.getItem("institrack_user");
    if (data) {
      this.currentUser = JSON.parse(data);
      this.updateBadge();
      this.touchSession();
    }
    this.updateAvatar();
  },

  updateBadge() {
    const badge = document.getElementById("roleBadge");
    if (badge && this.currentUser) {
      badge.textContent = this.currentUser.role;
      badge.className = "badge " + (this.currentUser.role === "admin" ? "badge-danger" : this.currentUser.role === "teacher" ? "badge-info" : "badge-success");
    }
  },

  updateAvatar() {
    const el = document.getElementById("avatarEl");
    if (el && this.currentUser) {
      const initials = this.currentUser.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
      el.textContent = initials;
      el.title = this.currentUser.name;
    }
  },

  touchSession() {
    localStorage.setItem("institrack_session", Date.now().toString());
    this._sessionWarned = false;
  },

  startSessionMonitor() {
    if (!this.currentUser) return;
    const check = () => {
      const last = parseInt(localStorage.getItem("institrack_session") || "0");
      const elapsed = Date.now() - last;
      const remaining = Math.max(0, Math.round((this.SESSION_TIMEOUT - elapsed) / 1000));
      const timerEl = document.getElementById("sessionTimer");
      if (timerEl) {
        if (remaining > 300) { timerEl.style.display = "none"; }
        else {
          timerEl.style.display = "inline-flex";
          const mins = Math.floor(remaining / 60);
          const secs = remaining % 60;
          timerEl.innerHTML = `<i class="fas fa-clock"></i> ${mins}:${String(secs).padStart(2, "0")}`;
          timerEl.className = "session-timer" + (remaining < 60 ? " danger" : remaining < 180 ? " warning" : "");
        }
      }
      if (remaining <= this.SESSION_WARN && !this._sessionWarned) {
        this._sessionWarned = true;
        this.showToast("Session expiring soon due to inactivity", "warning");
      }
      if (remaining <= 0) {
        this.showToast("Session expired — please log in again", "info");
        this.logout();
        return;
      }
    };
    check();
    this._sessionTimer = setInterval(check, 5000);
    document.addEventListener("click", () => this.touchSession());
    document.addEventListener("keydown", () => this.touchSession());
    document.addEventListener("mousemove", () => this.touchSession());
  },

  /* ----- THEME ----- */
  initTheme() {
    const btn = document.querySelector(".theme-toggle");

    const stored = localStorage.getItem("institrack_theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)");
    const theme = stored || (prefersLight.matches ? "light" : "dark");

    this._applyTheme(theme, btn);

    if (!stored) {
      prefersLight.addEventListener("change", (e) => {
        this._applyTheme(e.matches ? "light" : "dark", document.querySelector(".theme-toggle"));
      });
    }

    if (!btn) return;
    btn.addEventListener("click", () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const next = isLight ? "dark" : "light";
      this._applyTheme(next, btn);
      localStorage.setItem("institrack_theme", next);
    });
  },

  _applyTheme(theme, btn) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      if (btn) btn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.documentElement.removeAttribute("data-theme");
      if (btn) btn.innerHTML = '<i class="fas fa-moon"></i>';
    }
  },

  toggleTheme() {
    document.querySelector(".theme-toggle")?.click();
  },

  /* ----- NOTIFICATIONS ----- */
  initNotifications() {
    this.refreshNotifBadge();
    this.buildNotifDropdown();
  },

  refreshNotifBadge() {
    const notifs = Store.getNotifications();
    const unread = notifs.filter(n => !n.read).length;
    const badge = document.getElementById("notifCount");
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? "flex" : "none";
    }
  },

  buildNotifDropdown() {
    const old = document.querySelector(".notif-dropdown");
    if (old) old.remove();
    const btn = document.querySelector(".notif-btn-wrap") || document.querySelector(".notif-btn");
    if (!btn) return;

    const wrap = document.querySelector(".notif-btn-wrap");
    if (!wrap) {
      const parent = btn.parentElement;
      if (!parent) return;
      const wrapper = document.createElement("div");
      wrapper.className = "notif-btn-wrap";
      parent.insertBefore(wrapper, btn);
      wrapper.appendChild(btn);
    }

    const existing = document.querySelector(".notif-dropdown");
    if (existing) existing.remove();

    const dd = document.createElement("div");
    dd.className = "notif-dropdown";
    dd.innerHTML = `<div class="notif-dropdown-header"><h4>Notifications</h4><button onclick="App.markAllRead()">Mark all read</button></div><div class="notif-list"></div>`;
    document.querySelector(".notif-btn-wrap").appendChild(dd);

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      dd.classList.toggle("active");
      this.renderNotifList();
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".notif-btn-wrap")) dd.classList.remove("active");
    });
  },

  renderNotifList() {
    const list = document.querySelector(".notif-list");
    if (!list) return;
    const notifs = Store.getNotifications().sort((a, b) => new Date(b.time || b.date) - new Date(a.time || a.date)).slice(0, 20);
    if (!notifs.length) {
      list.innerHTML = '<div class="notif-empty"><i class="fas fa-bell-slash"></i><p>No notifications</p></div>';
      return;
    }
    list.innerHTML = notifs.map(n => {
      const time = n.time || n.date || new Date().toISOString();
      const ago = this.timeAgo(time);
      const icons = { warning: "fa-exclamation-triangle", success: "fa-check-circle", info: "fa-info-circle", danger: "fa-times-circle" };
      const icon = icons[n.type] || "fa-bell";
      const colors = { warning: "var(--warning)", success: "var(--success)", info: "var(--primary)", danger: "var(--danger)" };
      const color = colors[n.type] || "var(--text-light)";
      return `<div class="notif-item ${n.read ? 'read' : 'unread'}" onclick="App.markRead(${n.id})">
        <div class="notif-dot"></div>
        <div class="notif-body">
          <div class="notif-text"><i class="fas ${icon}" style="color:${color};margin-right:4px"></i> ${n.message}</div>
          <div class="notif-time">${ago}</div>
        </div>
      </div>`;
    }).join("");
  },

  markRead(id) {
    const notifs = Store.getNotifications();
    const n = notifs.find(x => x.id === id);
    if (n) { n.read = true; Store.saveNotifications(notifs); this.renderNotifList(); this.refreshNotifBadge(); }
  },

  markAllRead() {
    const notifs = Store.getNotifications();
    notifs.forEach(n => n.read = true);
    Store.saveNotifications(notifs);
    this.renderNotifList();
    this.refreshNotifBadge();
    this.showToast("All notifications marked read", "success");
  },

  pushNotif(message, type = "info") {
    const notifs = Store.getNotifications();
    const maxId = notifs.length ? Math.max(...notifs.map(n => n.id)) : 0;
    notifs.push({ id: maxId + 1, message, type, read: false, time: new Date().toISOString() });
    Store.saveNotifications(notifs);
    this.refreshNotifBadge();
    if (document.querySelector(".notif-dropdown.active")) this.renderNotifList();
  },

  /* ----- COMMAND PALETTE ----- */
  initCommandPalette() {
    if (document.getElementById("cmdPalette")) return;
    const overlay = document.createElement("div");
    overlay.className = "cmd-overlay";
    overlay.id = "cmdPalette";
    overlay.innerHTML = `
      <div class="cmd-modal">
        <div class="cmd-input-wrap">
          <i class="fas fa-search"></i>
          <input type="text" id="cmdInput" placeholder="Search pages, students, actions..." autofocus>
          <span class="cmd-shortcut-hint">ESC</span>
        </div>
        <div class="cmd-results" id="cmdResults"></div>
      </div>`;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => { if (e.target === overlay) this.closePalette(); });

    const input = document.getElementById("cmdInput");
    input.addEventListener("input", () => this.filterPalette());
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closePalette();
      if (e.key === "ArrowDown") { e.preventDefault(); this.navigateCmd(1); }
      if (e.key === "ArrowUp") { e.preventDefault(); this.navigateCmd(-1); }
      if (e.key === "Enter") { e.preventDefault(); this.activateCmd(); }
    });
  },

  openPalette() {
    const overlay = document.getElementById("cmdPalette");
    if (!overlay) this.initCommandPalette();
    document.getElementById("cmdPalette").classList.add("active");
    document.getElementById("cmdInput").value = "";
    this._cmdItems = [];
    this._cmdIndex = -1;
    this.filterPalette();
    setTimeout(() => document.getElementById("cmdInput").focus(), 100);
  },

  closePalette() {
    document.getElementById("cmdPalette").classList.remove("active");
  },

  filterPalette() {
    const q = document.getElementById("cmdInput").value.toLowerCase().trim();
    const results = document.getElementById("cmdResults");
    const groups = [];

    // Pages
    const pages = [
      { label: "Dashboard", icon: "fa-th-large", href: "dashboard.html" },
      { label: "Attendance", icon: "fa-clipboard-check", href: "attendance.html" },
      { label: "Reports & Analytics", icon: "fa-chart-bar", href: "reports.html" },
      { label: "Student Directory", icon: "fa-users", href: "students.html" },
      { label: "Absenteeism", icon: "fa-user-graduate", href: "absenteeism.html" },
      { label: "Timetable", icon: "fa-calendar-alt", href: "timetable.html" },
      { label: "Leave Management", icon: "fa-door-open", href: "leaves.html" },
      { label: "Fee Management", icon: "fa-wallet", href: "fees.html" },
      { label: "Settings", icon: "fa-cog", href: "settings.html" },
    ];
    if (this.currentUser?.role === "admin") {
      pages.unshift({ label: "Admin Dashboard", icon: "fa-th-large", href: "admin-dashboard.html" });
    }
    const matchedPages = pages.filter(p => !q || p.label.toLowerCase().includes(q));
    if (matchedPages.length) groups.push({ title: "Pages", items: matchedPages.map(p => ({ ...p, action: () => { window.location.href = p.href; } })) });

    // Students
    if (!q || q.length >= 1) {
      const students = Store.getStudents().filter(s => !q || s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q) || s.class.toLowerCase().includes(q)).slice(0, 5);
      if (students.length) groups.push({ title: "Students", items: students.map(s => ({ label: s.name, icon: "fa-user-graduate", meta: s.roll + " · " + s.class, action: () => { this.closePalette(); this.showToast(s.name + " — " + s.roll, "info"); } })) });
    }

    // Actions
    const actions = [
      { label: "Mark Attendance", icon: "fa-check", action: () => { window.location.href = "attendance.html"; } },
      { label: "Apply for Leave", icon: "fa-door-open", action: () => { window.location.href = "leaves.html"; } },
      { label: "Export Report", icon: "fa-file-csv", action: () => { window.location.href = "reports.html"; } },
      { label: "Toggle Theme", icon: "fa-moon", action: () => { this.toggleTheme(); this.closePalette(); } },
      { label: "Logout", icon: "fa-sign-out-alt", action: () => { this.closePalette(); this.logout(); } },
    ];
    const matchedActions = actions.filter(a => !q || a.label.toLowerCase().includes(q));
    if (matchedActions.length) groups.push({ title: "Actions", items: matchedActions });

    this._cmdItems = [];
    let html = "";
    groups.forEach(g => {
      html += `<div class="cmd-group-title">${g.title}</div>`;
      g.items.forEach(item => {
        const idx = this._cmdItems.length;
        this._cmdItems.push(item);
        html += `<div class="cmd-item" data-idx="${idx}">
          <i class="fas ${item.icon || 'fa-circle'}"></i>
          <span class="cmd-label">${item.label}</span>
          ${item.meta ? `<span class="cmd-meta">${item.meta}</span>` : ""}
        </div>`;
      });
    });
    if (!this._cmdItems.length) html = '<div style="padding:32px;text-align:center;color:var(--text-muted)"><i class="fas fa-search" style="font-size:24px;margin-bottom:8px;display:block"></i>No results found</div>';
    results.innerHTML = html;

    results.querySelectorAll(".cmd-item").forEach(el => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.dataset.idx);
        const item = this._cmdItems[idx];
        if (item) { this.closePalette(); item.action(); }
      });
      el.addEventListener("mouseenter", () => {
        document.querySelectorAll(".cmd-item").forEach(e => e.classList.remove("active"));
        el.classList.add("active");
        this._cmdIndex = parseInt(el.dataset.idx);
      });
    });
    this._cmdIndex = this._cmdItems.length ? 0 : -1;
    if (this._cmdIndex >= 0) results.querySelector(".cmd-item")?.classList.add("active");
  },

  navigateCmd(dir) {
    const items = document.querySelectorAll(".cmd-item");
    if (!items.length) return;
    items.forEach(e => e.classList.remove("active"));
    this._cmdIndex = Math.max(0, Math.min(this._cmdItems.length - 1, this._cmdIndex + dir));
    items[this._cmdIndex]?.classList.add("active");
    items[this._cmdIndex]?.scrollIntoView({ block: "nearest" });
  },

  activateCmd() {
    if (this._cmdIndex >= 0 && this._cmdItems[this._cmdIndex]) {
      this.closePalette();
      this._cmdItems[this._cmdIndex].action();
    }
  },

  /* ----- KEYBOARD SHORTCUTS ----- */
  initKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Ctrl+K / Cmd+K — command palette
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (document.getElementById("cmdPalette")?.classList.contains("active")) this.closePalette();
        else this.openPalette();
      }
      // ? — show shortcuts help
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.target.closest("input,textarea,select")) {
        e.preventDefault();
        this.showShortcutsHelp();
      }
      // M — toggle theme
      if (e.key === "m" && !e.ctrlKey && !e.metaKey && !e.target.closest("input,textarea,select")) {
        e.preventDefault();
        this.toggleTheme();
        this.showToast("Theme toggled", "info");
      }
      // Ctrl+Shift+A — Principal Dashboard
      if (e.ctrlKey && e.shiftKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        window.location.href = "principal-dashboard.html";
      }
    });
  },

  showShortcutsHelp() {
    const html = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div><kbd>Ctrl+K</kbd> <span style="font-size:12px;color:var(--text-light)">Command palette</span></div>
        <div><kbd>M</kbd> <span style="font-size:12px;color:var(--text-light)">Toggle theme</span></div>
        <div><kbd>Ctrl+Shift+A</kbd> <span style="font-size:12px;color:var(--text-light)">Principal Panel</span></div>
        <div><kbd>?</kbd> <span style="font-size:12px;color:var(--text-light)">Show shortcuts</span></div>
      </div>`;
    const modal = this.openModal(`
      <h3>⌨ Keyboard Shortcuts</h3>
      ${html}
      <div style="margin-top:16px;text-align:right"><button class="btn btn-sm btn-primary" onclick="App.closeModal()">Got it</button></div>
    `);
  },

  /* ----- AUTO REFRESH ----- */
  startAutoRefresh() {
    const indicator = document.getElementById("refreshIndicator");
    if (indicator) {
      let count = 30;
      const tick = () => {
        count--;
        if (count <= 0) { count = 30; this.refreshData(); }
        indicator.innerHTML = `<span class="refresh-dot"></span> ${count}s`;
      };
      tick();
      setInterval(tick, 1000);
    }
  },

  refreshData() {
    // Override per page
    if (typeof renderDashboard === "function") renderDashboard();
    if (typeof renderAdminDashboard === "function") renderAdminDashboard();
  },

  /* ----- CLOCK ----- */
  updateClock() {
    const el = document.querySelector(".live-clock");
    if (!el) return;
    function tick() {
      const now = new Date();
      el.textContent = now.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
    tick();
    setInterval(tick, 1000);
  },

  /* ----- MENU TOGGLE ----- */
  initMenuToggle() {
    document.querySelectorAll(".menu-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelector(".sidebar")?.classList.toggle("open");
      });
    });
    document.addEventListener("click", (e) => {
      const sidebar = document.querySelector(".sidebar");
      if (window.innerWidth <= 768 && sidebar?.classList.contains("open")) {
        if (!sidebar.contains(e.target) && !e.target.closest(".menu-toggle")) {
          sidebar.classList.remove("open");
        }
      }
    });
  },

  /* ----- TOAST ----- */
  showToast(message, type = "info") {
    const container = document.querySelector(".toast-container");
    if (!container) return;
    const icons = { success: "fa-check-circle", error: "fa-times-circle", info: "fa-info-circle", warning: "fa-exclamation-triangle" };
    const toast = document.createElement("div");
    toast.className = "toast toast-" + type;
    toast.innerHTML = '<span class="toast-icon"><i class="fas ' + (icons[type] || icons.info) + '"></i></span> ' + message;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "0"; toast.style.transform = "translateX(40px)"; toast.style.transition = "all 0.4s ease"; }, 3000);
    setTimeout(() => toast.remove(), 3500);
  },

  /* ----- LOGOUT ----- */
  logout() {
    localStorage.removeItem("institrack_user");
    localStorage.removeItem("institrack_session");
    if (this._sessionTimer) clearInterval(this._sessionTimer);
    this.showToast("Logged out", "info");
    setTimeout(() => { window.location.href = "index.html"; }, 500);
  },

  /* ----- MODAL ----- */
  openModal(content) {
    const existing = document.querySelector(".modal-overlay.app-modal");
    if (existing) existing.remove();
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay app-modal";
    overlay.innerHTML = '<div class="modal">' + content + '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
    return overlay.querySelector(".modal");
  },

  closeModal() {
    document.querySelectorAll(".modal-overlay.app-modal").forEach(m => m.remove());
  },

  /* ----- TIME AGO HELPER ----- */
  timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
    if (diff < 604800) return Math.floor(diff / 86400) + "d ago";
    return date.toLocaleDateString("en", { month: "short", day: "numeric" });
  }
};

/* ===== GLOBAL INIT ===== */
document.addEventListener("DOMContentLoaded", () => {
  // Skip global init on login page
  const isLoginPage = window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/");
  if (!isLoginPage) App.init();
  const path = window.location.pathname.split("/").pop() || "dashboard.html";
  document.querySelectorAll(".nav-link").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
  if (isLoginPage) App.hideLoading();
});
