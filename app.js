const cfg = window.PHV_CONFIG || {};
const API = (cfg.BACKEND_BASE_URL || "").replace(/\/$/, "");

// Language translations
const translations = {
  en: {
    dashboard: "Dashboard",
    patients: "Patients",
    register: "Register",
    appointments: "Appointments",
    messages: "Messages",
    overview: "Overview",
    totalPatients: "Total Patients",
    todayAppointments: "Today's Appointments",
    upcomingAppointments: "Upcoming Appointments",
    upcomingAppts: "Upcoming Appointments",
    noAppointments: "No upcoming appointments scheduled",
    scheduleAppointment: "Schedule Appointment",
    recentlyRegistered: "Recently Registered Patients",
    viewAll: "View all patients",
    ready: "Ready",
    loading: "Loading..."
  },
  sw: {
    dashboard: "Dashibodi",
    patients: "Wagonjwa",
    register: "Sajili",
    appointments: "Miadi",
    messages: "Ujumbe",
    overview: "Muhtasari",
    totalPatients: "Jumla ya Wagonjwa",
    todayAppointments: "Miadi ya Leo",
    upcomingAppointments: "Miadi Ijayo",
    upcomingAppts: "Miadi Ijayo",
    noAppointments: "Hakuna miadi iliyopangwa",
    scheduleAppointment: "Panga Miadi",
    recentlyRegistered: "Wagonjwa Waliosajiliwa Hivi Karibuni",
    viewAll: "Angalia wagonjwa wote",
    ready: "Tayari",
    loading: "Inapakia..."
  }
};

let currentLanguage = localStorage.getItem('language') || 'en';

function t(key) {
  return translations[currentLanguage][key] || key;
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'sw' : 'en';
  localStorage.setItem('language', currentLanguage);
  render();
  loadCurrentTab();
}

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

function navButton(id, labelKey) {
  const b = document.createElement("button");
  b.textContent = t(labelKey);
  b.className = state.tab === id ? "active" : "";
  b.onclick = async () => {
    state.tab = id;
    render();
    await loadCurrentTab();
  };
  return b;
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'sw-KE', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

function formatTime(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString(currentLanguage === 'en' ? 'en-US' : 'sw-KE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function getLanguageBadge(lang) {
  const langNames = { en: '🇬🇧 English', sw: '🇹🇿 Kiswahili' };
  return `<span class="lang-badge">${langNames[lang] || '🏳️ Unknown'}</span>`;
}

function renderDashboard() {
  const wrap = document.createElement("div");
  if (!state.dashboard) return wrap;

  // Stats Grid
  const statsHtml = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-value">${state.dashboard.stats.patients}</div>
          <div class="stat-label">${t('totalPatients')}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-value">${state.dashboard.stats.appointments_today}</div>
          <div class="stat-label">${t('todayAppointments')}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏰</div>
        <div class="stat-content">
          <div class="stat-value">${state.dashboard.stats.upcoming}</div>
          <div class="stat-label">${t('upcomingAppointments')}</div>
        </div>
      </div>
    </div>
  `;
  
  const statsDiv = document.createElement("div");
  statsDiv.className = "card fade-in";
  statsDiv.innerHTML = `<h2>${t('overview')}</h2>${statsHtml}`;
  wrap.appendChild(statsDiv);

  // Appointments Section
  if (state.dashboard.appointments && state.dashboard.appointments.length > 0) {
    const aptCard = document.createElement("div");
    aptCard.className = "card fade-in";
    aptCard.innerHTML = `<h2>📋 ${t('upcomingAppts')}</h2>`;
    
    const grouped = {};
    state.dashboard.appointments.forEach(apt => {
      const date = apt.scheduled_start.split(' ')[0];
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
        const languageIcon = apt.preferred_language === 'sw' ? '🇹🇿' : '🇬🇧';
        appointmentsHtml += `
          <div class="appointment-item">
            <div class="appointment-time">
              <span class="time-icon">🕐</span>
              <span class="time-text">${formatTime(apt.scheduled_start)}</span>
            </div>
            <div class="appointment-details">
              <div class="patient-name">${apt.full_name} ${languageIcon}</div>
              <div class="appointment-meta">
                ${apt.department ? `<span class="meta-tag">🏥 ${apt.department}</span>` : ''}
                ${apt.provider_name ? `<span class="meta-tag">👨‍⚕️ ${apt.provider_name}</span>` : ''}
                ${apt.location ? `<span class="meta-tag">📍 ${apt.location}</span>` : ''}
                <span class="meta-tag">📞 ${apt.primary_channel || 'sms'}</span>
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
    const noAptCard = document.createElement("div");
    noAptCard.className = "card fade-in";
    noAptCard.innerHTML = `
      <h2>📋 ${t('upcomingAppts')}</h2>
      <div class="empty-state">
        <div class="empty-icon">📅</div>
        <p>${t('noAppointments')}</p>
        <button class="btn-primary" onclick="switchTab('appointments')">+ ${t('scheduleAppointment')}</button>
      </div>
    `;
    wrap.appendChild(noAptCard);
  }

  // Recent Patients
  if (state.dashboard.recent && state.dashboard.recent.length > 0) {
    const recentCard = document.createElement("div");
    recentCard.className = "card fade-in";
    recentCard.innerHTML = `<h2>👤 ${t('recentlyRegistered')}</h2>`;
    
    let recentHtml = '<div class="patients-grid">';
    state.dashboard.recent.slice(0, 6).forEach(patient => {
      recentHtml += `
        <div class="patient-card-small">
          <div class="patient-avatar">👤</div>
          <div class="patient-info">
            <div class="patient-name">${patient.full_name}</div>
            <div class="patient-meta">
              <span class="meta-badge">${patient.status || 'Active'}</span>
              ${getLanguageBadge(patient.preferred_language || 'en')}
              <span class="meta-date">${formatDate(patient.registration_at)}</span>
            </div>
          </div>
        </div>
      `;
    });
    recentHtml += '</div>';
    if (state.dashboard.recent.length > 6) {
      recentHtml += `<div class="view-all"><a href="#" onclick="switchTab('patients'); return false;">${t('viewAll')} →</a></div>`;
    }
    recentCard.innerHTML += recentHtml;
    wrap.appendChild(recentCard);
  }

  return wrap;
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

function renderPatients() {
  const wrap = document.createElement("div");
  wrap.className = "fade-in";
  
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<h2>👥 ${t('patients')}</h2>`;
  
  const searchSection = document.createElement("div");
  searchSection.className = "search-section";
  searchSection.innerHTML = `
    <div class="search-bar">
      <input type="text" id="patientSearch" placeholder="🔍 Search by name, MRN, or ID..." class="search-input">
      <button id="searchBtn" class="btn-primary">🔍 Search</button>
    </div>
    <button id="registerBtn" class="btn-secondary">+ ${t('register')}</button>
  `;
  card.appendChild(searchSection);

  const table = document.createElement("table");
  table.className = "patients-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Patient Name</th>
        <th>Phone</th>
        <th>Language</th>
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
      tbody.innerHTML = '<tr><td colspan="7" class="empty-table">No patients found</td></tr>';
      return;
    }
    
    patients.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="patient-id">#${p.id}</td>
        <td class="patient-name-cell">${p.full_name}</td>
        <td>${p.phone || '-'}</td>
        <td>${getLanguageBadge(p.preferred_language || 'en')}</td>
        <td><span class="channel-badge">${p.primary_channel || '-'}</span></td>
        <td>${getStatusBadge(p.status || 'active')}</td>
        <td><a href="${API}/patient_view.php?id=${p.id}" class="view-link" target="_blank">View →</a></td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  renderPatientsList(state.patients);
  card.appendChild(table);
  
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
  wrap.className = "fade-in";
  
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<h2>📝 ${t('register')}</h2>`;
  
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
        <label>Preferred Language *</label>
        <select name="preferred_language" required>
          <option value="en">🇬🇧 English</option>
          <option value="sw">🇹🇿 Kiswahili</option>
        </select>
        <small class="field-note">System will send messages in selected language</small>
      </div>
      <div class="form-field">
        <label>MRN (Optional)</label>
        <input name="external_mrn" placeholder="Medical Record Number" />
      </div>
      <div class="form-field">
        <label>Contact Channel *</label>
        <select name="contact_channel" required>
          <option value="sms">📱 SMS</option>
          <option value="whatsapp">💬 WhatsApp</option>
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
        ✅ Opt-in to receive appointment reminders and health tips
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
      setStatus(currentLanguage === 'en' ? "✅ Patient registered successfully!" : "✅ Mgonjwa amesajiliwa kikamilifu!", "ok");
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
  wrap.className = "fade-in appointments-page";

  const addCard = document.createElement("div");
  addCard.className = "card";
  addCard.innerHTML = `<h2>➕ Schedule New Appointment</h2>`;
  
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

  const reCard = document.createElement("div");
  reCard.className = "card";
  reCard.innerHTML = `<h2>🔄 Reschedule Existing Appointment</h2>`;
  
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
  wrap.className = "fade-in";
  if (!state.messageCenter) return wrap;
  
  const statsCard = document.createElement("div");
  statsCard.className = "card";
  statsCard.innerHTML = `<h2>💬 Message Center Analytics</h2>`;
  statsCard.innerHTML += `
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
        <div class
