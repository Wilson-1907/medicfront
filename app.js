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

function createCard(title, icon = "") {
  const c = document.createElement("section");
  c.className = "card";
  const h = document.createElement("h2");
  h.innerHTML = icon ? `${icon} ${title}` : title;
  c.appendChild(h);
  return c;
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

function formatTime(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function getStatusBadge(status) {
  const statusColors = {
    'confirmed': 'badge-success',
    'proposed': 'badge-warning',
    'cancelled': 'badge-danger',
    'completed': 'badge-info'
  };
  const colorClass = statusColors[status.toLowerCase()] || 'badge-secondary';
  return `<span class="badge ${colorClass}">${status}</span>`;
}

function renderDashboard() {
  const wrap = document.createElement("div");
  if (!state.dashboard) return wrap;

  // Stats Grid
  const statsGrid = createCard("Overview", "📊");
  const statsHtml = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-value">${state.dashboard.stats.patients}</div>
          <div class="stat-label">Total Patients</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-value">${state.dashboard.stats.appointments_today}</div>
          <div class="stat-label">Today's Appointments</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏰</div>
        <div class="stat-content">
          <div class="stat-value">${state.dashboard.stats.upcoming}</div>
          <div class="stat-label">Upcoming Appointments</div>
        </div>
      </div>
    </div>
  `;
  statsGrid.innerHTML = statsHtml;
  wrap.appendChild(statsGrid);

  // Appointments Section - MAIN FEATURE
  if (state.dashboard.appointments && state.dashboard.appointments.length > 0) {
    const aptCard = createCard("📋 Upcoming Appointments", "📅");
    
    // Group appointments by date
    const grouped = {};
    state.dashboard.appointments.forEach(apt => {
      const date = apt.appointment_date || apt.scheduled_start.split(' ')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(apt);
    });

    let appointmentsHtml = '<div class="appointments-container">';
    for (const [date, appointments] of Object.entries(grouped)) {
      appointmentsHtml += `
        <div class="date-group">
          <div class="date-header">
            <span class="date-icon">📅</span>
            <span class="date-text">${formatDate(date)}</span>
            <span class="appointment-count">${appointments.length} appointment${appointments.length > 1 ? 's' : ''}</span>
          </div>
          <div class="appointments-list">
      `;
      
      appointments.forEach(apt => {
        appointmentsHtml += `
          <div class="appointment-item">
            <div class="appointment-time">
              <span class="time-icon">🕐</span>
              <span class="time-text">${formatTime(apt.scheduled_start)}</span>
            </div>
            <div class="appointment-details">
              <div class="patient-name">${apt.full_name}</div>
              <div class="appointment-meta">
                ${apt.department ? `<span class="meta-tag">🏥 ${apt.department}</span>` : ''}
                ${apt.provider_name ? `<span class="meta-tag">👨‍⚕️ ${apt.provider_name}</span>` : ''}
                ${apt.location ? `<span class="meta-tag">📍 ${apt.location}</span>` : ''}
              </div>
              ${apt.reason ? `<div class="appointment-reason">📝 ${apt.reason}</div>` : ''}
            </div>
            <div class="appointment-status">
              ${getStatusBadge(apt.status)}
            </div>
          </div>
        `;
      });
      
      appointmentsHtml += `
          </div>
        </div>
      `;
    }
    appointmentsHtml += '</div>';
    aptCard.innerHTML += appointmentsHtml;
    wrap.appendChild(aptCard);
  } else {
    const noAptCard = createCard("📋 Upcoming Appointments", "📅");
    noAptCard.innerHTML += `
      <div class="empty-state">
        <div class="empty-icon">📅</div>
        <p>No upcoming appointments scheduled</p>
        <button class="btn-primary" onclick="document.querySelector('[data-tab=\'appointments\']')?.click()">Schedule Appointment</button>
      </div>
    `;
    wrap.appendChild(noAptCard);
  }

  // Recent Patients Section
  if (state.dashboard.recent && state.dashboard.recent.length > 0) {
    const recentCard = createCard("👤 Recently Registered Patients", "👥");
    let recentHtml = `
      <div class="patients-grid">
    `;
    
    state.dashboard.recent.slice(0, 6).forEach(patient => {
      recentHtml += `
        <div class="patient-card-small">
          <div class="patient-avatar">👤</div>
          <div class="patient-info">
            <div class="patient-name">${patient.full_name}</div>
            <div class="patient-meta">
              <span class="meta-badge">${patient.status || 'Active'}</span>
              <span class="meta-date">${formatDate(patient.registration_at)}</span>
            </div>
          </div>
        </div>
      `;
    });
    
    recentHtml += '</div>';
    if (state.dashboard.recent.length > 6) {
      recentHtml += `<div class="view-all"><a href="#" onclick="switchTab('patients'); return false;">View all patients →</a></div>`;
    }
    recentCard.innerHTML += recentHtml;
    wrap.appendChild(recentCard);
  }

  return wrap;
}

function renderPatients() {
  const wrap = document.createElement("div");
  const card = createCard("👥 Patient Management", "👥");
  
  const searchSection = document.createElement("div");
  searchSection.className = "search-section";
  searchSection.innerHTML = `
    <div class="search-bar">
      <input type="text" id="patientSearch" placeholder="Search by name, MRN, or ID..." class="search-input">
      <button id="searchBtn" class="btn-primary">🔍 Search</button>
    </div>
    <button id="registerBtn" class="btn-secondary">+ Register New Patient</button>
  `;
  card.appendChild(searchSection);

  const table = document.createElement("table");
  table.className = "patients-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Patient Name</th>
        <th>Contact</th>
        <th>Channel</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="patientsTableBody"></tbody>
  `;
  
  const tbody = table.querySelector("#patientsTableBody");
  
  function renderPatientsList(patients) {
    tbody.innerHTML = "";
    if (patients.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-table">No patients found</td></tr>';
      return;
    }
    
    patients.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="patient-id">#${p.id}</td>
        <td class="patient-name-cell">${p.full_name}</td>
        <td>${p.phone || '-'}</td>
        <td><span class="channel-badge">${p.primary_channel || '-'}</span></td>
        <td>${getStatusBadge(p.status || 'active')}</td>
        <td><a href="${API}/patient_view.php?id=${p.id}" class="view-link" target="_blank">View Profile →</a></td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  renderPatientsList(state.patients);
  card.appendChild(table);
  
  // Search functionality
  const searchInput = searchSection.querySelector("#patientSearch");
  const searchBtn = searchSection.querySelector("#searchBtn");
  const registerBtn = searchSection.querySelector("#registerBtn");
  
  searchBtn.onclick = async () => {
    await loadPatients(searchInput.value.trim());
    renderPatientsList(state.patients);
  };
  
  searchInput.onkeypress = (e) => {
    if (e.key === "Enter") searchBtn.click();
  };
  
  registerBtn.onclick = () => {
    state.tab = "register";
    render();
    loadCurrentTab();
  };
  
  wrap.appendChild(card);
  return wrap;
}

function renderRegister() {
  const wrap = document.createElement("div");
  const card = createCard("📝 Register New Patient", "✏️");
  const form = document.createElement("form");
  form.className = "register-form";
  form.innerHTML = `
    <div class="form-grid">
      <div class="form-field">
        <label>Full Name *</label>
        <input name="full_name" required placeholder="Enter patient's full name" />
      </div>
      <div class="form-field">
        <label>Date of Birth</label>
        <input type="date" name="date_of_birth" />
      </div>
      <div class="form-field">
        <label>Phone Number *</label>
        <input name="phone" placeholder="+254..." required />
      </div>
      <div class="form-field">
        <label>Language</label>
        <select name="preferred_language">
          <option value="en">English</option>
          <option value="sw">Kiswahili</option>
        </select>
      </div>
      <div class="form-field">
        <label>MRN (Optional)</label>
        <input name="external_mrn" placeholder="Medical Record Number" />
      </div>
      <div class="form-field">
        <label>Contact Channel</label>
        <select name="contact_channel">
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>
    </div>
    <div class="form-field">
      <label>Notes</label>
      <textarea name="notes" rows="3" placeholder="Any additional information..."></textarea>
    </div>
    <div class="form-field checkbox">
      <label>
        <input type="checkbox" name="opt_in" checked /> 
        Opt-in to patient messaging
      </label>
    </div>
    <div class="form-actions">
      <button type="submit" class="btn-primary">💾 Save Patient</button>
      <button type="button" class="btn-secondary" onclick="switchTab('patients')">Cancel</button>
    </div>
  `;
  
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    body.opt_in = fd.get("opt_in") ? 1 : 0;
    try {
      await apiPost("/api/patients.php", body);
      setStatus("✅ Patient registered successfully!", "ok");
      form.reset();
      setTimeout(() => switchTab('patients'), 1500);
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
  wrap.className = "appointments-page";

  const addCard = createCard("➕ Schedule New Appointment", "📅");
  const addForm = document.createElement("form");
  addForm.className = "appointment-form";
  addForm.innerHTML = `
    <div class="form-grid">
      <div class="form-field">
        <label>Patient ID *</label>
        <input name="patient_id" type="number" required placeholder="Enter patient ID" />
      </div>
      <div class="form-field">
        <label>Date & Time *</label>
        <input name="scheduled_start" type="datetime-local" required />
      </div>
      <div class="form-field">
        <label>End Time</label>
        <input name="scheduled_end" type="datetime-local" />
      </div>
      <div class="form-field">
        <label>Department</label>
        <input name="department" placeholder="e.g., Cardiology, Pediatrics" />
      </div>
      <div class="form-field">
        <label>Provider Name</label>
        <input name="provider_name" placeholder="Doctor's name" />
      </div>
      <div class="form-field">
        <label>Location</label>
        <input name="location" placeholder="Room number or clinic name" />
      </div>
    </div>
    <div class="form-field">
      <label>Reason for Visit *</label>
      <textarea name="reason" required rows="3" placeholder="Brief description of the appointment reason..."></textarea>
    </div>
    <button type="submit" class="btn-primary">📅 Schedule Appointment</button>
  `;
  
  addForm.onsubmit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(addForm).entries());
    body.action = "add";
    try {
      await apiPost("/api/appointments.php", body);
      setStatus("✅ Appointment scheduled successfully!", "ok");
      addForm.reset();
      await loadDashboard();
    } catch (err) {
      setStatus(err.message, "error");
    }
  };
  addCard.appendChild(addForm);
  wrap.appendChild(addCard);

  const reCard = createCard("🔄 Reschedule Existing Appointment", "⏰");
  const reForm = document.createElement("form");
  reForm.className = "appointment-form";
  reForm.innerHTML = `
    <div class="form-grid">
      <div class="form-field">
        <label>Appointment ID *</label>
        <input name="appointment_id" type="number" required placeholder="Enter appointment ID" />
      </div>
      <div class="form-field">
        <label>New Date & Time *</label>
        <input name="new_scheduled_start" type="datetime-local" required />
      </div>
      <div class="form-field">
        <label>New End Time</label>
        <input name="new_scheduled_end" type="datetime-local" />
      </div>
    </div>
    <div class="form-field">
      <label>Reason for Rescheduling *</label>
      <textarea name="reason" required rows="3" placeholder="Why is this appointment being rescheduled?"></textarea>
    </div>
    <button type="submit" class="btn-primary">🔄 Reschedule Appointment</button>
  `;
  
  reForm.onsubmit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(reForm).entries());
    body.action = "reschedule";
    try {
      await apiPost("/api/appointments.php", body);
      setStatus("✅ Appointment rescheduled successfully!", "ok");
      reForm.reset();
      await loadDashboard();
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
  
  const stats = createCard("💬 Message Center Analytics", "📊");
  const statsHtml = `
    <div class="stats-grid-small">
      <div class="stat-mini">
        <div class="stat-mini-value">${state.messageCenter.stats.outbound_24h}</div>
        <div class="stat-mini-label">📤 Outbound (24h)</div>
      </div>
      <div class="stat-mini">
        <div class="stat-mini-value">${state.messageCenter.stats.failed_24h}</div>
        <div class="stat-mini-label">❌ Failed (24h)</div>
      </div>
      <div class="stat-mini">
        <div class="stat-mini-value">${state.messageCenter.stats.inbound_24h}</div>
        <div class="stat-mini-label">📥 Inbound (24h)</div>
      </div>
      <div class="stat-mini">
        <div class="stat-mini-value">${state.messageCenter.stats.open_escalations}</div>
        <div class="stat-mini-label">⚠️ Open Escalations</div>
      </div>
    </div>
  `;
  stats.innerHTML += statsHtml;
  wrap.appendChild(stats);

  const out = createCard("📤 Recent Outbound Messages", "💬");
  out.innerHTML += renderMessageTable(state.messageCenter.outbound, 'outbound');
  wrap.appendChild(out);

  const inbound = createCard("📥 Incoming Messages", "✉️");
  inbound.innerHTML += renderMessageTable(state.messageCenter.inbound || [], 'inbound');
  wrap.appendChild(inbound);

  const esc = createCard("⚠️ Active Escalations", "🚨");
  esc.innerHTML += renderMessageTable(state.messageCenter.escalations || [], 'escalation');
  wrap.appendChild(esc);
  
  return wrap;
}

function renderMessageTable(data, type) {
  if (!data.length) {
    return '<div class="empty-state"><p>No data available</p></div>';
  }
  
  let headers = '';
  if (type === 'outbound') {
    headers = '<th>Time</th><th>Patient</th><th>Channel</th><th>Type</th><th>Status</th><th>Message</th>';
  } else if (type === 'inbound') {
    headers = '<th>Time</th><th>Patient</th><th>Channel</th><th>From</th><th>Message</th>';
  } else {
    headers = '<th>Time</th><th>Patient</th><th>Status</th><th>Urgency</th><th>Reason</th>';
  }
  
  let tableHtml = `<table class="data-table"><thead><tr>${headers}</tr></thead><tbody>`;
  
  data.slice(0, 10).forEach(item => {
    tableHtml += '<tr>';
    if (type === 'outbound') {
      tableHtml += `<td>${item.created_at || ''}</td><td>${item.full_name || ''}</td><td>${item.channel || ''}</td><td>${item.message_type || ''}</td><td>${getStatusBadge(item.status)}</td><td class="message-cell">${item.body || ''}</td>`;
    } else if (type === 'inbound') {
      tableHtml += `<td>${item.received_at || ''}</td><td>${item.full_name || 'Unknown'}</td><td>${item.channel || ''}</td><td>${item.from_address || ''}</td><td class="message-cell">${item.body || ''}</td>`;
    } else {
      tableHtml += `<td>${item.created_at || ''}</td><td>${item.full_name || ''}</td><td>${item.status || ''}</td><td>${item.urgency || ''}</td><td class="message-cell">${item.reason || ''}</td>`;
    }
    tableHtml += '</tr>';
  });
  
  tableHtml += '</tbody></table>';
  return tableHtml;
}

function render() {
  root.innerHTML = "";
  const nav = document.getElementById("nav");
  nav.innerHTML = "";
  nav.append(
    navButton("dashboard", "📊 Dashboard"),
    navButton("patients", "👥 Patients"),
    navButton("register", "✏️ Register"),
    navButton("appointments", "📅 Appointments"),
    navButton("messages", "💬 Messages")
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

window.switchTab = (tab) => {
  state.tab = tab;
  render();
  loadCurrentTab();
};

async function start() {
  render();
  await loadCurrentTab();
}

start();
