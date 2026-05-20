const cfg = window.PHV_CONFIG || {};
const API = (cfg.BACKEND_BASE_URL || "").replace(/\/$/, "");
const MOCK_MODE = cfg.MOCK_MODE !== false;

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
    loading: "Loading...",
    savePatient: "Save Patient",
    cancel: "Cancel",
    search: "Search",
    registerNew: "Register New Patient",
    scheduleNew: "Schedule New Appointment",
    rescheduleAppointment: "Reschedule Appointment"
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
    loading: "Inapakia...",
    savePatient: "Hifadhi Mgonjwa",
    cancel: "Ghairi",
    search: "Tafuta",
    registerNew: "Sajili Mgonjwa Mpya",
    scheduleNew: "Panga Miadi Mpya",
    rescheduleAppointment: "Badilisha Miadi"
  }
};

let currentLanguage = localStorage.getItem('language') || 'en';

function t(key) {
  return translations[currentLanguage][key] || key;
}

window.toggleLanguage = function() {
  currentLanguage = currentLanguage === 'en' ? 'sw' : 'en';
  localStorage.setItem('language', currentLanguage);
  render();
  loadCurrentTab();
};

window.switchTab = function(tab) {
  state.tab = tab;
  render();
  loadCurrentTab();
};

const state = {
  tab: "dashboard",
  dashboard: null,
  patients: [],
  messageCenter: null
};

const root = document.getElementById("app");
const statusEl = document.getElementById("status");

function setStatus(msg, cls = "muted") {
  if (statusEl) {
    statusEl.className = cls;
    statusEl.textContent = msg;
  }
}

// Mock data for demonstration
const mockData = {
  getDashboard: () => ({
    ok: true,
    stats: {
      patients: 248,
      appointments_today: 12,
      upcoming: 45
    },
    appointments: [
      {
        id: 1,
        scheduled_start: new Date(Date.now() + 3600000).toISOString(),
        scheduled_end: new Date(Date.now() + 7200000).toISOString(),
        status: "confirmed",
        department: "Cardiology",
        provider_name: "Dr. James Mwangi",
        location: "Room 204",
        reason: "Heart checkup",
        patient_id: 101,
        full_name: "John Kamau",
        phone: "+254712345678",
        preferred_language: "en",
        primary_channel: "sms"
      },
      {
        id: 2,
        scheduled_start: new Date(Date.now() + 86400000).toISOString(),
        scheduled_end: new Date(Date.now() + 90000000).toISOString(),
        status: "proposed",
        department: "Pediatrics",
        provider_name: "Dr. Mary Wanjiku",
        location: "Room 112",
        reason: "Child vaccination",
        patient_id: 102,
        full_name: "Aisha Mohammed",
        phone: "+254723456789",
        preferred_language: "sw",
        primary_channel: "whatsapp"
      },
      {
        id: 3,
        scheduled_start: new Date(Date.now() + 172800000).toISOString(),
        scheduled_end: new Date(Date.now() + 176400000).toISOString(),
        status: "confirmed",
        department: "Maternity",
        provider_name: "Dr. Susan Kimani",
        location: "Ward 3",
        reason: "Prenatal checkup",
        patient_id: 103,
        full_name: "Grace Nduta",
        phone: "+254734567890",
        preferred_language: "en",
        primary_channel: "sms"
      }
    ],
    recent: [
      { id: 104, full_name: "Peter Ochieng", status: "active", registration_at: new Date().toISOString(), preferred_language: "sw" },
      { id: 105, full_name: "Lucy Wambui", status: "active", registration_at: new Date(Date.now() - 86400000).toISOString(), preferred_language: "en" },
      { id: 106, full_name: "Mohamed Ali", status: "active", registration_at: new Date(Date.now() - 172800000).toISOString(), preferred_language: "sw" }
    ]
  }),
  
  getPatients: (query = "") => {
    const allPatients = [
      { id: 101, full_name: "John Kamau", phone: "+254712345678", preferred_language: "en", primary_channel: "sms", status: "active", external_mrn: "MRN001" },
      { id: 102, full_name: "Aisha Mohammed", phone: "+254723456789", preferred_language: "sw", primary_channel: "whatsapp", status: "active", external_mrn: "MRN002" },
      { id: 103, full_name: "Grace Nduta", phone: "+254734567890", preferred_language: "en", primary_channel: "sms", status: "active", external_mrn: "MRN003" },
      { id: 104, full_name: "Peter Ochieng", phone: "+254745678901", preferred_language: "sw", primary_channel: "whatsapp", status: "active", external_mrn: "MRN004" },
      { id: 105, full_name: "Lucy Wambui", phone: "+254756789012", preferred_language: "en", primary_channel: "sms", status: "inactive", external_mrn: "MRN005" }
    ];
    
    if (query) {
      const q = query.toLowerCase();
      return allPatients.filter(p => 
        p.full_name.toLowerCase().includes(q) || 
        p.external_mrn.toLowerCase().includes(q) || 
        p.id.toString().includes(q)
      );
    }
    return allPatients;
  },
  
  savePatient: (data) => {
    console.log("Patient saved:", data);
    const message = data.preferred_language === 'sw' 
      ? "Mgonjwa amesajiliwa kikamilifu! Ujumbe wa karibu utatumwa kwa Kiswahili."
      : "Patient registered successfully! Welcome message will be sent in English.";
    return { ok: true, message: message };
  },
  
  saveAppointment: (data) => {
    console.log("Appointment saved:", data);
    return { ok: true, message: "Appointment scheduled successfully!" };
  },
  
  rescheduleAppointment: (data) => {
    console.log("Appointment rescheduled:", data);
    return { ok: true, message: "Appointment rescheduled successfully!" };
  },
  
  getMessageCenter: () => ({
    ok: true,
    stats: {
      outbound_24h: 156,
      failed_24h: 3,
      inbound_24h: 89,
      open_escalations: 2
    },
    outbound: [
      { created_at: new Date().toISOString(), full_name: "John Kamau", channel: "sms", message_type: "appointment_reminder", status: "sent", body: "Your appointment is tomorrow at 10:00 AM" },
      { created_at: new Date().toISOString(), full_name: "Aisha Mohammed", channel: "whatsapp", message_type: "welcome", status: "sent", body: "Karibu Hospitali ya PHV!" }
    ],
    inbound: [
      { received_at: new Date().toISOString(), full_name: "John Kamau", channel: "sms", from_address: "+254712345678", body: "I confirm my appointment" }
    ],
    escalations: [
      { created_at: new Date().toISOString(), full_name: "Grace Nduta", status: "open", urgency: "high", reason: "Missed critical appointment" }
    ]
  })
};

async function apiGet(path) {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    if (path.includes("/api/dashboard.php")) return mockData.getDashboard();
    if (path.includes("/api/patients.php")) {
      const urlParams = new URLSearchParams(path.split('?')[1]);
      const query = urlParams.get('q') || '';
      const items = mockData.getPatients(query);
      return { ok: true, items };
    }
    if (path.includes("/api/message_center.php")) return mockData.getMessageCenter();
    return { ok: true };
  }
  
  const r = await fetch(`${API}${path}`);
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || "Request failed");
  return j;
}

async function apiPost(path, body) {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (path.includes("/api/patients.php")) return mockData.savePatient(body);
    if (path.includes("/api/appointments.php")) {
      if (body.action === "reschedule") return mockData.rescheduleAppointment(body);
      return mockData.saveAppointment(body);
    }
    return { ok: true };
  }
  
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

function getStatusBadge(status) {
  const statusColors = {
    'confirmed': 'badge-success',
    'proposed': 'badge-warning',
    'cancelled': 'badge-danger',
    'completed': 'badge-info',
    'active': 'badge-success'
  };
  const colorClass = statusColors[status.toLowerCase()] || 'badge-secondary';
  return `<span class="badge ${colorClass}">${status}</span>`;
}

function renderDashboard() {
  const wrap = document.createElement("div");
  if (!state.dashboard) return wrap;

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
  statsDiv.innerHTML = `<h2>📊 ${t('overview')}</h2>${statsHtml}`;
  wrap.appendChild(statsDiv);

  // Appointments Section
  if (state.dashboard.appointments && state.dashboard.appointments.length > 0) {
    const aptCard = document.createElement("div");
    aptCard.className = "card fade-in";
    aptCard.innerHTML = `<h2>📋 ${t('upcomingAppts')}</h2>`;
    
    const grouped = {};
    state.dashboard.appointments.forEach(apt => {
      const date = apt.scheduled_start.split('T')[0];
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
      <button id="searchBtn" class="btn-primary">🔍 ${t('search')}</button>
    </div>
    <button id="registerBtn" class="btn-secondary">+ ${t('registerNew')}</button>
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
        <td>${getLanguageBadge(p.preferred_language || 'en')}</td>
        <td><span class="channel-badge">${p.primary_channel || '-'}</span></td>
        <td>${getStatusBadge(p.status || 'active')}</td>
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
  card.innerHTML = `<h2>📝 ${t('registerNew')}</h2>`;
  
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
        <small class="field-note">⚠️ System will send ALL messages in selected language</small>
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
      <button type="submit" class="btn-primary">💾 ${t('savePatient')}</button>
      <button type="button" class="btn-secondary" onclick="switchTab('patients')">${t('cancel')}</button>
    </div>
  `;
  
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    body.opt_in = fd.get("opt_in") ? 1 : 0;
    try {
      const result = await apiPost("/api/patients.php", body);
      const successMsg = body.preferred_language === 'sw' 
        ? "✅ Mgonjwa amesajiliwa kikamilifu! Ujumbe wa karibu utatumwa kwa Kiswahili."
        : "✅ Patient registered successfully! Welcome message will be sent in English.";
      setStatus(successMsg, "ok");
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
  addCard.innerHTML = `<h2>➕ ${t('scheduleNew')}</h2>`;
  
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
    <button type="submit" class="btn-primary">📅 ${t('scheduleAppointment')}</button>
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
  reCard.innerHTML = `<h2>🔄 ${t('rescheduleAppointment')}</h2>`;
  
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
    <button type="submit" class="btn-primary">🔄 ${t('rescheduleAppointment')}</button>
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
        <div class="stat-mini-label">⚠️ Open Escalations</div>
      </div>
    </div>
  `;
  wrap.appendChild(statsCard);
  
  const outCard = document.createElement("div");
  outCard.className = "card";
  outCard.innerHTML = `<h2>📤 Recent Outbound Messages</h2>`;
  outCard.innerHTML += renderMessageTable(state.messageCenter.outbound, 'outbound');
  wrap.appendChild(outCard);
  
  const inCard = document.createElement("div");
  inCard.className = "card";
  inCard.innerHTML = `<h2>📥 Incoming Messages</h2>`;
  inCard.innerHTML += renderMessageTable(state.messageCenter.inbound || [], 'inbound');
  wrap.appendChild(inCard);
  
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
      tableHtml += `<td>${formatDateTime(item.created_at)}</td><td>${item.full_name || ''}</td><td>${item.channel || ''}</td><td>${item.message_type || ''}</td><td>${getStatusBadge(item.status)}</td><td class="message-cell">${item.body || ''}</td>`;
    } else if (type === 'inbound') {
      tableHtml += `<td>${formatDateTime(item.received_at)}</td><td>${item.full_name || 'Unknown'}</td><td>${item.channel || ''}</td><td>${item.from_address || ''}</td><td class="message-cell">${item.body || ''}</td>`;
    }
    tableHtml += '</tr>';
  });
  
  tableHtml += '</tbody></table>';
  return tableHtml;
}

function formatDateTime(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString(currentLanguage === 'en' ? 'en-US' : 'sw-KE');
}

function render() {
  if (!root) return;
  root.innerHTML = "";
  const nav = document.getElementById("nav");
  if (nav) {
    nav.innerHTML = "";
    nav.append(
      navButton("dashboard", "dashboard"),
      navButton("patients", "patients"),
      navButton("register", "register"),
      navButton("appointments", "appointments"),
      navButton("messages", "messages")
    );
  }

  if (state.tab === "dashboard") root.appendChild(renderDashboard());
  if (state.tab === "patients") root.appendChild(renderPatients());
  if (state.tab === "register") root.appendChild(renderRegister());
  if (state.tab === "appointments") root.appendChild(renderAppointments());
  if (state.tab === "messages") root.appendChild(renderMessageCenter());
}

async function loadDashboard() {
  if (MOCK_MODE) {
    state.dashboard = await apiGet("/api/dashboard.php");
  } else {
    state.dashboard = await apiGet("/api/dashboard.php");
  }
}

async function loadPatients(q = "") {
  if (MOCK_MODE) {
    const result = await apiGet(`/api/patients.php?q=${encodeURIComponent(q)}`);
    state.patients = result.items;
  } else {
    state.patients = (await apiGet(`/api/patients.php?q=${encodeURIComponent(q)}`)).items;
  }
}

async function loadMessageCenter() {
  state.messageCenter = await apiGet("/api/message_center.php");
}

async function loadCurrentTab() {
  try {
    setStatus(t('loading'), "muted");
    if (state.tab === "dashboard") await loadDashboard();
    if (state.tab === "patients") await loadPatients();
    if (state.tab === "messages") await loadMessageCenter();
    setStatus(t('ready'), "ok");
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
