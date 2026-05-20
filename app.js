// ============================================
// NYERI LEVEL 4 HOSPITAL
// Production Frontend - Connected to medicback API
// Version: 2.0.0
// ============================================

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURATION
    // ============================================
    const cfg = window.PHV_CONFIG || {};
    const API_BASE_URL = cfg.BACKEND_BASE_URL || "https://medicback.onrender.com";
    const USE_MOCK_FALLBACK = cfg.MOCK_FALLBACK !== false;
    
    // ============================================
    // INTERNATIONALIZATION
    // ============================================
    const translations = {
        en: {
            nav_dashboard: "Dashboard",
            nav_patients: "Patients",
            nav_register: "Register",
            nav_appointments: "Appointments",
            nav_messages: "Messages",
            title_overview: "Healthcare Analytics",
            total_patients: "Total Patients",
            today_appointments: "Today's Appointments",
            upcoming_appointments: "Upcoming Appointments",
            upcoming_appts: "Scheduled Appointments",
            no_appointments: "No appointments scheduled",
            schedule_appointment: "Schedule Appointment",
            recently_registered: "Recently Registered Patients",
            view_all: "View All Patients",
            save: "Save",
            cancel: "Cancel",
            search: "Search",
            register_new: "Register New Patient",
            schedule_new: "Schedule New Appointment",
            reschedule: "Reschedule Appointment",
            ready: "System Ready",
            loading: "Loading...",
            error: "Connection Error",
            offline_mode: "Offline Mode (Using Demo Data)",
            back_online: "Backend Connected",
            success: "Operation completed successfully",
            connection_error: "Cannot connect to server. Using offline mode.",
            server_error: "Server error occurred",
            network_error: "Network error. Please check your connection",
            welcome_en: "Welcome to Nyeri Level 4 Hospital",
            welcome_sw: "Karibu Hospitali ya Nyeri Level 4",
            search_placeholder: "Search by name, MRN, or ID...",
            patient_name: "Patient Name",
            phone_number: "Phone Number",
            select_language: "Preferred Language",
            select_channel: "Contact Channel"
        },
        sw: {
            nav_dashboard: "Dashibodi",
            nav_patients: "Wagonjwa",
            nav_register: "Sajili",
            nav_appointments: "Miadi",
            nav_messages: "Ujumbe",
            title_overview: "Takwimu za Afya",
            total_patients: "Jumla ya Wagonjwa",
            today_appointments: "Miadi ya Leo",
            upcoming_appointments: "Miadi Ijayo",
            upcoming_appts: "Miadi Iliyopangwa",
            no_appointments: "Hakuna miadi iliyopangwa",
            schedule_appointment: "Panga Miadi",
            recently_registered: "Wagonjwa Wapya",
            view_all: "Angalia Wote",
            save: "Hifadhi",
            cancel: "Ghairi",
            search: "Tafuta",
            register_new: "Sajili Mgonjwa Mpya",
            schedule_new: "Panga Miadi Mpya",
            reschedule: "Badilisha Miadi",
            ready: "Mfumo Uko Tayari",
            loading: "Inapakia...",
            error: "Hitilafu ya Muunganisho",
            offline_mode: "Hali ya Nje ya Mtandao (Kutumia Data ya Majaribio)",
            back_online: "Muunganisho Umerejeshwa",
            success: "Operesheni Imefanikiwa",
            connection_error: "Haikuweza kuunganishwa na seva. Inatumia hali ya nje ya mtandao.",
            server_error: "Hitilafu ya seva imetokea",
            network_error: "Hitilafu ya mtandao. Tafadhali angalia muunganisho wako",
            welcome_sw: "Karibu Hospitali ya Nyeri Level 4",
            welcome_en: "Welcome to Nyeri Level 4 Hospital",
            search_placeholder: "Tafuta kwa jina, MRN, au ID...",
            patient_name: "Jina la Mgonjwa",
            phone_number: "Nambari ya Simu",
            select_language: "Lugha Unayopendelea",
            select_channel: "Njia ya Mawasiliano"
        }
    };
    
    // ============================================
    // APPLICATION STATE
    // ============================================
    let currentLanguage = localStorage.getItem('language') || 'en';
    let usingMockData = false;
    let retryCount = 0;
    const MAX_RETRIES = 2;
    
    const state = {
        currentTab: "dashboard",
        dashboard: null,
        patients: [],
        appointments: [],
        messages: null,
        isLoading: false
    };
    
    // ============================================
    // MOCK DATA (Fallback when backend is unavailable)
    // ============================================
    const mockData = {
        getDashboard: () => ({
            ok: true,
            stats: {
                patients: 2847,
                appointments_today: 23,
                upcoming: 156
            },
            appointments: [
                {
                    id: 1,
                    scheduled_start: new Date(Date.now() + 3600000).toISOString(),
                    scheduled_end: new Date(Date.now() + 7200000).toISOString(),
                    status: 'confirmed',
                    department: 'Cardiology',
                    provider_name: 'Dr. James Mwangi',
                    location: 'Wing A, Room 204',
                    reason: 'Routine cardiac checkup',
                    patient_id: 101,
                    full_name: 'John Kamau',
                    phone: '+254712345678',
                    preferred_language: 'en',
                    primary_channel: 'sms'
                },
                {
                    id: 2,
                    scheduled_start: new Date(Date.now() + 86400000).toISOString(),
                    scheduled_end: new Date(Date.now() + 90000000).toISOString(),
                    status: 'proposed',
                    department: 'Pediatrics',
                    provider_name: 'Dr. Mary Wanjiku',
                    location: 'Child Health Wing',
                    reason: 'Child vaccination',
                    patient_id: 102,
                    full_name: 'Aisha Mohammed',
                    phone: '+254723456789',
                    preferred_language: 'sw',
                    primary_channel: 'whatsapp'
                }
            ],
            recent: [
                { id: 103, full_name: 'Peter Ochieng', status: 'active', registration_at: new Date().toISOString(), preferred_language: 'sw' },
                { id: 104, full_name: 'Lucy Wambui', status: 'active', registration_at: new Date(Date.now() - 86400000).toISOString(), preferred_language: 'en' }
            ]
        }),
        
        getPatients: (query = "") => {
            const patients = [
                { id: 101, full_name: 'John Kamau', phone: '+254712345678', preferred_language: 'en', primary_channel: 'sms', status: 'active', external_mrn: 'MRN001' },
                { id: 102, full_name: 'Aisha Mohammed', phone: '+254723456789', preferred_language: 'sw', primary_channel: 'whatsapp', status: 'active', external_mrn: 'MRN002' },
                { id: 103, full_name: 'Peter Ochieng', phone: '+254734567890', preferred_language: 'sw', primary_channel: 'sms', status: 'active', external_mrn: 'MRN003' },
                { id: 104, full_name: 'Lucy Wambui', phone: '+254745678901', preferred_language: 'en', primary_channel: 'whatsapp', status: 'inactive', external_mrn: 'MRN004' }
            ];
            if (query) {
                const q = query.toLowerCase();
                return patients.filter(p => p.full_name.toLowerCase().includes(q) || p.external_mrn.toLowerCase().includes(q) || p.id.toString().includes(q));
            }
            return patients;
        },
        
        savePatient: (data) => ({ ok: true, message: data.preferred_language === 'sw' ? "Mgonjwa amesajiliwa!" : "Patient registered!", id: Math.floor(Math.random() * 1000) }),
        saveAppointment: (data) => ({ ok: true, message: "Appointment scheduled!" }),
        rescheduleAppointment: (data) => ({ ok: true, message: "Appointment rescheduled!" }),
        
        getMessages: () => ({
            ok: true,
            stats: { outbound_24h: 342, failed_24h: 5, inbound_24h: 187, open_escalations: 3 },
            outbound: [{ created_at: new Date().toISOString(), full_name: 'John Kamau', channel: 'sms', message_type: 'reminder', status: 'sent', body: 'Your appointment tomorrow' }],
            inbound: [{ received_at: new Date().toISOString(), full_name: 'Aisha Mohammed', channel: 'whatsapp', from_address: '+254723456789', body: 'Nathibitisha' }]
        })
    };
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function t(key) { return translations[currentLanguage][key] || translations.en[key] || key; }
    
    function formatDate(dateString, format = 'full') {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const options = {
            full: { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' },
            date: { year: 'numeric', month: 'short', day: 'numeric' },
            time: { hour: '2-digit', minute: '2-digit' }
        };
        return date.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'sw-KE', options[format]);
    }
    
    function formatTime(dateString) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleTimeString(currentLanguage === 'en' ? 'en-US' : 'sw-KE', { hour: '2-digit', minute: '2-digit' });
    }
    
    function showNotification(message, type = 'info') {
        const statusMessage = document.querySelector('.status-message');
        if (statusMessage) {
            statusMessage.className = `status-message ${type}`;
            statusMessage.innerHTML = `<i class="fas ${type === 'ok' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
            if (type !== 'info') {
                setTimeout(() => {
                    if (statusMessage.classList.contains(type)) {
                        const modeText = usingMockData ? ` (${t('offline_mode')})` : '';
                        statusMessage.className = 'status-message muted';
                        statusMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${t('ready')}${modeText}`;
                    }
                }, 5000);
            }
        }
    }
    
    // ============================================
    // API SERVICE - Connected to medicback
    // ============================================
    const api = {
        async request(url, options = {}) {
            const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
            
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000);
                
                const response = await fetch(fullUrl, {
                    ...options,
                    signal: controller.signal,
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...options.headers }
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                if (!data.ok && data.error) throw new Error(data.error);
                
                return data;
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        },
        
        async get(url, retry = true) {
            try {
                const data = await this.request(url);
                usingMockData = false;
                return data;
            } catch (error) {
                if (retry && retryCount < MAX_RETRIES) {
                    retryCount++;
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                    return this.get(url, true);
                }
                retryCount = 0;
                if (USE_MOCK_FALLBACK && !usingMockData) {
                    usingMockData = true;
                    showNotification(t('connection_error'), 'error');
                    return this.getMockData(url);
                }
                throw error;
            }
        },
        
        async post(url, body, retry = true) {
            try {
                const data = await this.request(url, { method: 'POST', body: JSON.stringify(body) });
                usingMockData = false;
                return data;
            } catch (error) {
                if (retry && retryCount < MAX_RETRIES) {
                    retryCount++;
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                    return this.post(url, body, true);
                }
                retryCount = 0;
                if (USE_MOCK_FALLBACK) {
                    usingMockData = true;
                    showNotification(t('connection_error'), 'error');
                    return this.postMockData(url, body);
                }
                throw error;
            }
        },
        
        getMockData(url) {
            if (url.includes('/dashboard')) return mockData.getDashboard();
            if (url.includes('/patients')) {
                const urlParams = new URLSearchParams(url.split('?')[1]);
                const items = mockData.getPatients(urlParams.get('q') || '');
                return { ok: true, items };
            }
            if (url.includes('/messages')) return mockData.getMessages();
            return { ok: true };
        },
        
        postMockData(url, body) {
            if (url.includes('/patients')) return mockData.savePatient(body);
            if (url.includes('/appointments')) {
                if (body.action === 'reschedule') return mockData.rescheduleAppointment(body);
                return mockData.saveAppointment(body);
            }
            return { ok: true, message: 'Operation successful' };
        }
    };
    
    // ============================================
    // UI COMPONENTS
    // ============================================
    const components = {
        renderNav() {
            const nav = document.querySelector('.nav-menu');
            if (!nav) return;
            
            const tabs = [
                { id: 'dashboard', icon: 'fa-chart-line', label: 'nav_dashboard' },
                { id: 'patients', icon: 'fa-users', label: 'nav_patients' },
                { id: 'register', icon: 'fa-user-plus', label: 'nav_register' },
                { id: 'appointments', icon: 'fa-calendar-alt', label: 'nav_appointments' },
                { id: 'messages', icon: 'fa-envelope', label: 'nav_messages' }
            ];
            
            nav.innerHTML = tabs.map(tab => `
                <button class="nav-item ${state.currentTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
                    <i class="fas ${tab.icon}"></i>
                    <span>${t(tab.label)}</span>
                </button>
            `).join('');
            
            nav.querySelectorAll('.nav-item').forEach(btn => {
                btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
            });
        },
        
        switchTab(tabId) {
            state.currentTab = tabId;
            this.renderNav();
            this.loadCurrentTab();
        },
        
        renderDashboard() {
            if (!state.dashboard) return '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
            
            return `
                <div class="fade-in-up">
                    ${usingMockData ? `
                        <div class="offline-banner" style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 12px 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
                            <i class="fas fa-cloud-upload-alt" style="color: #f59e0b;"></i>
                            <span style="color: #92400e;">⚠️ ${t('offline_mode')}</span>
                            <button onclick="location.reload()" style="margin-left: auto; background: none; border: none; color: #f59e0b; cursor: pointer;">
                                <i class="fas fa-sync-alt"></i> Retry
                            </button>
                        </div>
                    ` : ''}
                    
                    <div class="stats-grid">
                        <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-value">${state.dashboard.stats.patients.toLocaleString()}</div><div class="stat-label">${t('total_patients')}</div></div>
                        <div class="stat-card"><div class="stat-icon">📅</div><div class="stat-value">${state.dashboard.stats.appointments_today}</div><div class="stat-label">${t('today_appointments')}</div></div>
                        <div class="stat-card"><div class="stat-icon">⏰</div><div class="stat-value">${state.dashboard.stats.upcoming}</div><div class="stat-label">${t('upcoming_appointments')}</div></div>
                    </div>
                    
                    <div class="card"><div class="card-header"><div class="card-title"><i class="fas fa-calendar-check"></i><span>${t('upcoming_appts')}</span></div></div>${this.renderAppointmentsList()}</div>
                    <div class="card"><div class="card-header"><div class="card-title"><i class="fas fa-user-clock"></i><span>${t('recently_registered')}</span></div><button class="btn btn-secondary" onclick="window.components.switchTab('patients')">${t('view_all')} <i class="fas fa-arrow-right"></i></button></div>${this.renderRecentPatients()}</div>
                </div>
            `;
        },
        
        renderAppointmentsList() {
            if (!state.dashboard.appointments?.length) {
                return `<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-title">${t('no_appointments')}</div><button class="btn btn-primary" onclick="window.components.switchTab('appointments')">+ ${t('schedule_appointment')}</button></div>`;
            }
            
            const grouped = {};
            state.dashboard.appointments.forEach(apt => {
                const date = apt.scheduled_start.split('T')[0];
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push(apt);
            });
            
            return `<div class="appointments-timeline">${Object.entries(grouped).map(([date, appointments]) => `
                <div class="date-group">
                    <div class="date-header"><i class="fas fa-calendar-day"></i><span class="date-text">${formatDate(date, 'full')}</span><span class="appointment-badge">${appointments.length}</span></div>
                    ${appointments.map(apt => `
                        <div class="appointment-item">
                            <div class="appointment-time"><i class="far fa-clock"></i><span>${formatTime(apt.scheduled_start)}</span></div>
                            <div class="appointment-details">
                                <div class="patient-name">${apt.full_name} <span class="badge ${apt.status === 'confirmed' ? 'badge-success' : 'badge-warning'}">${apt.status}</span></div>
                                <div class="appointment-meta">${apt.department ? `<span class="meta-tag"><i class="fas fa-hospital"></i> ${apt.department}</span>` : ''}${apt.provider_name ? `<span class="meta-tag"><i class="fas fa-user-md"></i> ${apt.provider_name}</span>` : ''}</div>
                                ${apt.reason ? `<div class="appointment-reason"><i class="fas fa-notes-medical"></i> ${apt.reason}</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('')}</div>`;
        },
        
        renderRecentPatients() {
            if (!state.dashboard.recent?.length) return '<div class="empty-state">No recent patients</div>';
            
            return `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">${state.dashboard.recent.slice(0, 6).map(patient => `
                <div class="patient-card-small" style="display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--gray-50); border-radius: 16px;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--primary-500), var(--primary-700)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">👤</div>
                    <div style="flex: 1;"><div style="font-weight: 700;">${patient.full_name}</div><div style="display: flex; gap: 8px; font-size: 12px;"><span class="badge badge-success">${patient.status}</span><span>${formatDate(patient.registration_at, 'date')}</span></div></div>
                </div>
            `).join('')}</div>`;
        },
        
        renderPatients() {
            return `<div class="card fade-in-up"><div class="card-header"><div class="card-title"><i class="fas fa-users"></i><span>${t('nav_patients')}</span>${usingMockData ? '<span class="badge badge-warning" style="margin-left:10px;">Demo</span>' : ''}</div><button class="btn btn-primary" onclick="window.components.switchTab(\'register\')"><i class="fas fa-user-plus"></i> ${t('register_new')}</button></div>
                <div class="search-section"><div class="search-input-wrapper"><i class="fas fa-search"></i><input type="text" id="patientSearch" class="search-input" placeholder="${t('search_placeholder')}"></div><button id="searchBtn" class="btn btn-primary">${t('search')}</button></div>
                <div class="table-wrapper"><table class="data-table"><thead><tr><th>ID</th><th>${t('patient_name')}</th><th>${t('phone_number')}</th><th>Language</th><th>Channel</th><th>Status</th></tr></thead><tbody id="patientsTableBody">${this.renderPatientsTable()}</tbody></table></div></div>`;
        },
        
        renderPatientsTable() {
            if (!state.patients?.length) return '<tr><td colspan="6" class="empty-state">No patients found</td></tr>';
            return state.patients.map(p => `<tr><td><strong>#${p.id}</strong></td><td>${p.full_name}</td><td>${p.phone || '-'}</td><td><span class="badge badge-info">${p.preferred_language === 'sw' ? '🇹🇿 Kiswahili' : '🇬🇧 English'}</span></td><td><span class="badge badge-secondary">${p.primary_channel || 'sms'}</span></td><td><span class="badge ${p.status === 'active' ? 'badge-success' : 'badge-danger'}">${p.status || 'active'}</span></td></tr>`).join('');
        },
        
        renderRegister() {
            return `<div class="card fade-in-up"><div class="card-header"><div class="card-title"><i class="fas fa-user-plus"></i><span>${t('register_new')}</span></div></div>
                <form id="registerForm" class="form-container"><div class="form-grid">
                    <div class="form-group"><label class="form-label">${t('patient_name')} *</label><input type="text" name="full_name" class="form-input" required></div>
                    <div class="form-group"><label class="form-label">Date of Birth</label><input type="date" name="date_of_birth" class="form-input"></div>
                    <div class="form-group"><label class="form-label">${t('phone_number')} *</label><input type="tel" name="phone" class="form-input" required placeholder="+254..."></div>
                    <div class="form-group"><label class="form-label">${t('select_language')} *</label><select name="preferred_language" class="form-select" required><option value="en">🇬🇧 English</option><option value="sw">🇹🇿 Kiswahili</option></select><small style="color: var(--danger); font-size: 11px;">⚠️ System sends messages in selected language</small></div>
                    <div class="form-group"><label class="form-label">MRN (Optional)</label><input type="text" name="external_mrn" class="form-input" placeholder="Medical Record Number"></div>
                    <div class="form-group"><label class="form-label">${t('select_channel')} *</label><select name="contact_channel" class="form-select" required><option value="sms">📱 SMS</option><option value="whatsapp">💬 WhatsApp</option></select></div>
                    <div class="form-group full-width"><label class="form-label">Notes</label><textarea name="notes" class="form-textarea" rows="3"></textarea></div>
                    <div class="form-group full-width"><label><input type="checkbox" name="opt_in" checked> ✅ Receive reminders and health tips</label></div>
                </div><div style="display: flex; gap: 12px; justify-content: flex-end;"><button type="button" class="btn btn-secondary" onclick="window.components.switchTab('patients')">${t('cancel')}</button><button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${t('save')}</button></div></form></div>`;
        },
        
        renderAppointments() {
            return `<div class="fade-in-up"><div class="card"><div class="card-header"><div class="card-title"><i class="fas fa-plus-circle"></i><span>${t('schedule_new')}</span></div></div>
                <form id="appointmentForm"><div class="form-grid"><div class="form-group"><label class="form-label">Patient ID *</label><input type="number" name="patient_id" class="form-input" required></div>
                <div class="form-group"><label class="form-label">Date & Time *</label><input type="datetime-local" name="scheduled_start" class="form-input" required></div>
                <div class="form-group"><label class="form-label">Department</label><input type="text" name="department" class="form-input" placeholder="Cardiology"></div>
                <div class="form-group"><label class="form-label">Provider Name</label><input type="text" name="provider_name" class="form-input" placeholder="Doctor's name"></div>
                <div class="form-group"><label class="form-label">Location</label><input type="text" name="location" class="form-input" placeholder="Room number"></div></div>
                <div class="form-group"><label class="form-label">Reason *</label><textarea name="reason" class="form-textarea" required rows="3"></textarea></div>
                <button type="submit" class="btn btn-primary"><i class="fas fa-calendar-check"></i> ${t('schedule_appointment')}</button></form></div>
                <div class="card"><div class="card-header"><div class="card-title"><i class="fas fa-exchange-alt"></i><span>${t('reschedule')}</span></div></div>
                <form id="rescheduleForm"><div class="form-grid"><div class="form-group"><label class="form-label">Appointment ID *</label><input type="number" name="appointment_id" class="form-input" required></div>
                <div class="form-group"><label class="form-label">New Date & Time *</label><input type="datetime-local" name="new_scheduled_start" class="form-input" required></div></div>
                <div class="form-group"><label class="form-label">Reason *</label><textarea name="reason" class="form-textarea" required rows="3"></textarea></div>
                <button type="submit" class="btn btn-primary"><i class="fas fa-calendar-alt"></i> ${t('reschedule')}</button></form></div></div>`;
        },
        
        renderMessages() {
            if (!state.messages) return '<div class="loading">Loading...</div>';
            return `<div class="fade-in-up"><div class="card"><div class="card-header"><div class="card-title"><i class="fas fa-envelope"></i><span>Message Analytics</span></div></div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">${['outbound_24h', 'failed_24h', 'inbound_24h', 'open_escalations'].map(key => `<div style="text-align:center;padding:20px;background:var(--gray-50);border-radius:16px;"><div style="font-size:28px;font-weight:800;color:var(--primary-600);">${state.messages.stats[key]}</div><div style="font-size:12px;">${key.replace(/_/g,' ')}</div></div>`).join('')}</div>
                <div class="table-wrapper"><table class="data-table"><thead><tr><th>Time</th><th>Patient</th><th>Channel</th><th>Message</th></tr></thead><tbody>${state.messages.outbound?.slice(0,5).map(m => `<tr><td>${formatDate(m.created_at)}</td><td>${m.full_name}</td><td>${m.channel}</td><td>${m.body}</td></tr>`).join('') || '<tr><td colspan="4">No messages</td></tr>'}</tbody></table></div></div></div>`;
        },
        
        async loadCurrentTab() {
            const app = document.getElementById('app');
            if (!app) return;
            
            state.isLoading = true;
            app.innerHTML = '<div style="text-align:center;padding:60px;"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
            
            try {
                if (state.currentTab === 'dashboard') {
                    state.dashboard = await api.get('/api/dashboard.php');
                    app.innerHTML = this.renderDashboard();
                } else if (state.currentTab === 'patients') {
                    const data = await api.get('/api/patients.php');
                    state.patients = data.items || [];
                    app.innerHTML = this.renderPatients();
                    document.getElementById('searchBtn')?.addEventListener('click', async () => {
                        const query = document.getElementById('patientSearch')?.value || '';
                        const data = await api.get(`/api/patients.php?q=${encodeURIComponent(query)}`);
                        state.patients = data.items || [];
                        const tbody = document.getElementById('patientsTableBody');
                        if (tbody) tbody.innerHTML = this.renderPatientsTable();
                    });
                } else if (state.currentTab === 'register') {
                    app.innerHTML = this.renderRegister();
                    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const body = Object.fromEntries(formData.entries());
                        body.opt_in = formData.get('opt_in') ? 1 : 0;
                        const result = await api.post('/api/patients.php', body);
                        showNotification(result.message, 'ok');
                        setTimeout(() => this.switchTab('patients'), 1500);
                    });
                } else if (state.currentTab === 'appointments') {
                    app.innerHTML = this.renderAppointments();
                    document.getElementById('appointmentForm')?.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const body = Object.fromEntries(formData.entries());
                        body.action = 'add';
                        const result = await api.post('/api/appointments.php', body);
                        showNotification(result.message || 'Appointment scheduled!', 'ok');
                        e.target.reset();
                    });
                    document.getElementById('rescheduleForm')?.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const body = Object.fromEntries(formData.entries());
                        body.action = 'reschedule';
                        const result = await api.post('/api/appointments.php', body);
                        showNotification(result.message || 'Appointment rescheduled!', 'ok');
                        e.target.reset();
                    });
                } else if (state.currentTab === 'messages') {
                    state.messages = await api.get('/api/message_center.php');
                    app.innerHTML = this.renderMessages();
                }
                
                const modeText = usingMockData ? ` (${t('offline_mode')})` : '';
                showNotification(`${t('ready')}${modeText}`, 'ok');
            } catch (error) {
                console.error('Error:', error);
                app.innerHTML = `<div style="text-align:center;padding:60px;"><i class="fas fa-exclamation-triangle" style="font-size:48px;color:var(--danger);"></i><p>${t('error')}: ${error.message}</p><button onclick="location.reload()" class="btn btn-primary">Retry</button></div>`;
                showNotification(error.message, 'error');
            } finally {
                state.isLoading = false;
            }
        }
    };
    
    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        const root = document.getElementById('app-root');
        if (!root) return;
        
        root.innerHTML = `
            <header class="top-nav"><div class="nav-container"><div class="nav-content">
                <div class="logo" onclick="window.components.switchTab('dashboard')"><div class="logo-icon">🏥</div><div><div class="logo-text">Nyeri Level 4 Hospital</div><div class="logo-subtitle">Smart Healthcare System</div></div></div>
                <div class="nav-menu"></div>
                <div class="header-actions"><button class="lang-toggle" id="langToggle"><i class="fas fa-globe"></i><span>${currentLanguage === 'en' ? 'EN' : 'SW'}</span></button><div class="user-avatar">👨‍⚕️</div></div>
            </div></div></header>
            <main class="main-container"><div class="status-bar"><div class="status-message muted"><i class="fas fa-check-circle"></i><span>${t('ready')}</span></div></div><div id="app"></div></main>
            <footer class="footer"><p>© 2024 Nyeri Level 4 Hospital | Enterprise Healthcare System v2.0 | <a href="#" onclick="location.reload()">Check Connection</a></p></footer>
        `;
        
        window.components = components;
        window.components.switchTab = (tab) => {
            state.currentTab = tab;
            components.renderNav();
            components.loadCurrentTab();
        };
        
        document.getElementById('langToggle')?.addEventListener('click', () => {
            currentLanguage = currentLanguage === 'en' ? 'sw' : 'en';
            localStorage.setItem('language', currentLanguage);
            document.getElementById('langToggle').querySelector('span').textContent = currentLanguage.toUpperCase();
            components.renderNav();
            components.loadCurrentTab();
            showNotification(`Language: ${currentLanguage === 'en' ? 'English' : 'Kiswahili'}`, 'ok');
        });
        
        components.renderNav();
        components.loadCurrentTab();
    }
    
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
