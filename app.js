const cfg = window.PHV_CONFIG || {};
const API = (cfg.BACKEND_BASE_URL || "").replace(/\/$/, "");

const state = {
  tab: "dashboard",
  dashboard: null,
  patients: [],
  messageCenter: null
};

const root = document.getElementById("app");
const statusEl = document.getElementById("status");

function setStatus(msg, cls = "muted") {
  statusEl.className = cls;
  statusEl.textContent = msg;
}

async function apiGet(path) {
  const r = await fetch(`${API}${path}`);
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || "Request failed");
  return j;
}

async function apiPost(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || "Request failed");
  return j;
}

function navButton(id, label) {
  const b = document.createElement("button");
  b.textContent = label;
  b.className = state.tab === id ? "active" : "";
  b.onclick = async () => {
    state.tab = id;
    render();
    await loadCurrentTab();
  };
  return b;
}

function createCard(title) {
  const c = document.createElement("section");
  c.className = "card";
  const h = document.createElement("h2");
  h.textContent = title;
  c.appendChild(h);
  return c;
}

function renderDashboard() {
  const wrap = document.createElement("div");
  if (!state.dashboard) return wrap;

  const stats = createCard("Dashboard");
  const grid = document.createElement("div");
  grid.className = "grid";
  grid.innerHTML = `
    <div class="card stat"><strong>${state.dashboard.stats.patients}</strong><span class="muted">Patients registered</span></div>
    <div class="card stat"><strong>${state.dashboard.stats.appointments_today}</strong><span class="muted">Appointments today</span></div>
    <div class="card stat"><strong>${state.dashboard.stats.upcoming}</strong><span class="muted">Upcoming appointments</span></div>
  `;
  stats.appendChild(grid);
  wrap.appendChild(stats);

  const recent = createCard("Recently registered");
  if (!state.dashboard.recent.length) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "No patients yet.";
    recent.appendChild(p);
  } else {
    const t = document.createElement("table");
    t.innerHTML = `<thead><tr><th>Name</th><th>Status</th><th>Registered</th></tr></thead>`;
    const tb = document.createElement("tbody");
    state.dashboard.recent.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${r.full_name}</td><td>${r.status}</td><td>${r.registration_at}</td>`;
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    recent.appendChild(t);
  }
  wrap.appendChild(recent);
  return wrap;
}

function renderPatients() {
  const wrap = document.createElement("div");
  const card = createCard("Patients");
  const removedMsg = new URLSearchParams(window.location.search).get("removed");
  if (removedMsg) {
    const alert = document.createElement("div");
    alert.className = "alert alert-success";
    alert.textContent = removedMsg;
    card.appendChild(alert);
  }

  const input = document.createElement("input");
  input.placeholder = "Search by name/MRN/ID";
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.textContent = "Search";
  btn.onclick = async () => {
    await loadPatients(input.value.trim());
  };
  const row = document.createElement("div");
  row.className = "row";
  row.append(input, btn);
  card.appendChild(row);

  const actions = document.createElement("div");
  actions.style.margin = "10px 0 12px";
  const reg = document.createElement("button");
  reg.className = "btn";
  reg.textContent = "+ Register patient";
  reg.onclick = async () => {
    state.tab = "register";
    render();
    await loadCurrentTab();
  };
  actions.appendChild(reg);
  card.appendChild(actions);

  const t = document.createElement("table");
  t.innerHTML = `<thead><tr><th>ID</th><th>Name</th><th>Channel</th><th>Status</th><th></th></tr></thead>`;
  const tb = document.createElement("tbody");
  state.patients.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${p.id}</td><td>${p.full_name}</td><td>${p.primary_channel || "-"}</td><td>${p.status}</td><td><a href="${API}/patient_view.php?id=${p.id}" target="_blank" rel="noopener noreferrer">Open</a></td>`;
    tb.appendChild(tr);
  });
  t.appendChild(tb);
  card.appendChild(t);
  wrap.appendChild(card);
  return wrap;
}

function renderRegister() {
  const wrap = document.createElement("div");
  const card = createCard("Register patient");
  const form = document.createElement("form");
  form.innerHTML = `
    <div class="row">
      <div><label>Full name</label><input name="full_name" required /></div>
      <div><label>Date of birth</label><input type="date" name="date_of_birth" /></div>
      <div><label>Language</label><select name="preferred_language"><option value="en">English</option><option value="sw">Kiswahili</option></select></div>
    </div>
    <div class="row">
      <div><label>MRN</label><input name="external_mrn" /></div>
      <div><label>Phone</label><input name="phone" placeholder="+2547..." required /></div>
      <div><label>Channel</label><select name="contact_channel"><option value="sms">SMS</option><option value="whatsapp">WhatsApp</option></select></div>
    </div>
    <div><label>Notes</label><textarea name="notes"></textarea></div>
    <div><label><input type="checkbox" name="opt_in" checked /> Opt-in patient messaging</label></div>
    <button class="btn" type="submit">Save patient</button>
  `;
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    body.opt_in = fd.get("opt_in") ? 1 : 0;
    try {
      await apiPost("/api/patients.php", body);
      setStatus("Patient registered successfully", "ok");
      form.reset();
      await loadDashboard();
    } catch (err) {
      setStatus(err.message, "error");
    }
  };
  card.appendChild(form);
  wrap.appendChild(card);
  return wrap;
}

function renderAppointments() {
  const wrap = document.createElement("div");

  const addCard = createCard("Add appointment");
  const addForm = document.createElement("form");
  addForm.innerHTML = `
    <div class="row">
      <div><label>Patient ID</label><input name="patient_id" type="number" required /></div>
      <div><label>Date/time</label><input name="scheduled_start" type="datetime-local" required /></div>
      <div><label>End</label><input name="scheduled_end" type="datetime-local" /></div>
    </div>
    <div class="row">
      <div><label>Department</label><input name="department" /></div>
      <div><label>Provider</label><input name="provider_name" /></div>
      <div><label>Location</label><input name="location" /></div>
    </div>
    <div><label>Reason (required)</label><textarea name="reason" required></textarea></div>
    <button class="btn" type="submit">Save appointment</button>
  `;
  addForm.onsubmit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(addForm).entries());
    body.action = "add";
    try {
      await apiPost("/api/appointments.php", body);
      setStatus("Appointment saved and patient notified", "ok");
      addForm.reset();
    } catch (err) {
      setStatus(err.message, "error");
    }
  };
  addCard.appendChild(addForm);
  wrap.appendChild(addCard);

  const reCard = createCard("Reschedule appointment");
  const reForm = document.createElement("form");
  reForm.innerHTML = `
    <div class="row">
      <div><label>Appointment ID</label><input name="appointment_id" type="number" required /></div>
      <div><label>New date/time</label><input name="new_scheduled_start" type="datetime-local" required /></div>
      <div><label>New end</label><input name="new_scheduled_end" type="datetime-local" /></div>
    </div>
    <div><label>Reason (required)</label><textarea name="reason" required></textarea></div>
    <button class="btn" type="submit">Reschedule</button>
  `;
  reForm.onsubmit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(reForm).entries());
    body.action = "reschedule";
    try {
      await apiPost("/api/appointments.php", body);
      setStatus("Appointment rescheduled and patient notified", "ok");
      reForm.reset();
    } catch (err) {
      setStatus(err.message, "error");
    }
  };
  reCard.appendChild(reForm);
  wrap.appendChild(reCard);

  return wrap;
}

function renderMessageCenter() {
  const wrap = document.createElement("div");
  if (!state.messageCenter) return wrap;
  const stats = createCard("Message Center");
  const grid = document.createElement("div");
  grid.className = "grid";
  grid.innerHTML = `
    <div class="card stat"><strong>${state.messageCenter.stats.outbound_24h}</strong><span class="muted">Outbound 24h</span></div>
    <div class="card stat"><strong>${state.messageCenter.stats.failed_24h}</strong><span class="muted">Failed 24h</span></div>
    <div class="card stat"><strong>${state.messageCenter.stats.inbound_24h}</strong><span class="muted">Inbound 24h</span></div>
    <div class="card stat"><strong>${state.messageCenter.stats.open_escalations}</strong><span class="muted">Open escalations</span></div>
  `;
  stats.appendChild(grid);
  wrap.appendChild(stats);

  const out = createCard("Recent outbound");
  const t = document.createElement("table");
  t.innerHTML = `<thead><tr><th>Time</th><th>Patient</th><th>Channel</th><th>Type</th><th>Status</th><th>Message Sent</th><th>Error</th></tr></thead>`;
  const tb = document.createElement("tbody");
  state.messageCenter.outbound.forEach((m) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${m.created_at}</td><td>${m.full_name}</td><td>${m.channel}</td><td>${m.message_type}</td><td>${m.status}</td><td class="message-cell">${m.body || ""}</td><td>${m.error_detail || ""}</td>`;
    tb.appendChild(tr);
  });
  t.appendChild(tb);
  out.appendChild(t);
  wrap.appendChild(out);

  const inbound = createCard("Incoming user messages");
  const tin = document.createElement("table");
  tin.innerHTML = `<thead><tr><th>Time</th><th>Patient</th><th>Channel</th><th>From</th><th>User Message</th></tr></thead>`;
  const tbin = document.createElement("tbody");
  (state.messageCenter.inbound || []).forEach((m) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${m.received_at}</td><td>${m.full_name || "Unknown"}</td><td>${m.channel}</td><td>${m.from_address}</td><td class="message-cell">${m.body || ""}</td>`;
    tbin.appendChild(tr);
  });
  tin.appendChild(tbin);
  inbound.appendChild(tin);
  wrap.appendChild(inbound);

  const esc = createCard("Escalations");
  const te = document.createElement("table");
  te.innerHTML = `<thead><tr><th>Time</th><th>Patient</th><th>Status</th><th>Urgency</th><th>Reason</th></tr></thead>`;
  const tbe = document.createElement("tbody");
  (state.messageCenter.escalations || []).forEach((e) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${e.created_at}</td><td>${e.full_name}</td><td>${e.status}</td><td>${e.urgency}</td><td class="message-cell">${e.reason}</td>`;
    tbe.appendChild(tr);
  });
  te.appendChild(tbe);
  esc.appendChild(te);
  wrap.appendChild(esc);
  return wrap;
}

function render() {
  root.innerHTML = "";
  const nav = document.getElementById("nav");
  nav.innerHTML = "";
  nav.append(
    navButton("dashboard", "Dashboard"),
    navButton("patients", "Patients"),
    navButton("register", "Register patient"),
    navButton("appointments", "Appointments"),
    navButton("messages", "Message center")
  );

  if (state.tab === "dashboard") root.appendChild(renderDashboard());
  if (state.tab === "patients") root.appendChild(renderPatients());
  if (state.tab === "register") root.appendChild(renderRegister());
  if (state.tab === "appointments") root.appendChild(renderAppointments());
  if (state.tab === "messages") root.appendChild(renderMessageCenter());
}

async function loadDashboard() {
  state.dashboard = await apiGet("/api/dashboard.php");
}
async function loadPatients(q = "") {
  state.patients = (await apiGet(`/api/patients.php?q=${encodeURIComponent(q)}`)).items;
}
async function loadMessageCenter() {
  state.messageCenter = await apiGet("/api/message_center.php");
}

async function loadCurrentTab() {
  try {
    setStatus("Loading...", "muted");
    if (state.tab === "dashboard") await loadDashboard();
    if (state.tab === "patients") await loadPatients();
    if (state.tab === "messages") await loadMessageCenter();
    setStatus("Ready", "ok");
    render();
  } catch (err) {
    setStatus(err.message, "error");
  }
}

async function start() {
  render();
  await loadCurrentTab();
}

start();
