// ============================================
// NYERI LEVEL 4 HOSPITAL
// Enterprise Healthcare Management System
// Version: 2.0.0
// ============================================

( function() {
    'use strict';
    
    // ============================================
    // CONFIGURATION
    // ============================================
    const cfg = window.PHV_CONFIG || {};
    const API = (cfg.BACKEND_BASE_URL || "").replace(/\/$/, "");
    const MOCK_MODE = cfg.MOCK_MODE !== false;
    
    // ============================================
    // INTERNATIONALIZATION
    // ============================================
    const translations = {
        en: {
            // Navigation
            nav_dashboard: "Dashboard",
            nav_patients: "Patients",
            nav_register: "Register",
            nav_appointments: "Appointments",
            nav_messages: "Messages",
            
            // Dashboard
            title_overview: "Healthcare Analytics",
            total_patients: "Total Patients",
            today_appointments: "Today's Appointments",
            upcoming_appointments: "Upcoming Appointments",
            upcoming_appts: "Scheduled Appointments",
            no_appointments: "No appointments scheduled",
            schedule_appointment: "Schedule Appointment",
            recently_registered: "Recently Registered Patients",
            view_all: "View All Patients",
            
            // Actions
            save: "Save",
            cancel: "Cancel",
            search: "Search",
            register_new: "Register New Patient",
            schedule_new: "Schedule New Appointment",
            reschedule: "Reschedule Appointment",
            
            // Status
            ready: "System Ready",
            loading: "Loading...",
            error: "An error occurred",
            success: "Operation completed successfully",
            
            // Messages
            welcome_en: "Welcome to Nyeri Level 4 Hospital",
            welcome_sw: "Karibu Hospitali ya Nyeri Level 4",
            
            // Placeholders
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
            error: "Hitilafu Imetokea",
            success: "Operesheni Imefanikiwa",
            
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
    let currentUser = {
        name: "Dr. Admin",
        role: "Administrator",
        avatar: "👨‍⚕️"
    };
    
    const state = {
        currentTab: "dashboard",
        dashboard: null,
        patients: [],
        appointments: [],
        messages: null,
        isLoading: false
    };
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function t(key) {
        return translations[currentLanguage][key] || translations.en[key] || key;
    }
    
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
        const date = new Date(dateString);
        return date.toLocaleTimeString(currentLanguage === 'en' ? 'en-US' : 'sw-KE', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    function showNotification(message, type = 'info') {
        const statusBar = document.querySelector('.status-message');
        if (statusBar) {
            statusBar.className = `status-message ${type}`;
            statusBar.innerHTML = `<i class="fas ${type === 'ok' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
            setTimeout(() => {
                if (statusBar.classList.contains(type)) {
                    statusBar.className = 'status-message muted';
                    statusBar.innerHTML = `<i class="fas fa-check-circle"></i> ${t('ready')}`;
                }
            }, 3000);
        }
    }
    
    // ============================================
    // API SERVICES
    // ============================================
    const api = {
        async get(path) {
            if (MOCK_MODE) {
                await this.simulateDelay();
                return this.getMockData(path);
            }
            const response = await fetch(`${API}${path}`);
            const data = await response.json();
            if (!data.ok) throw new Error(data.error || 'Request failed');
            return data;
        },
        
        async post(path, body) {
            if (MOCK_MODE) {
                await this.simulateDelay();
                return this.postMockData(path, body);
            }
            const response = await fetch(`${API}${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (!data.ok) throw new Error(data.error || 'Request failed');
            return data;
        },
        
        simulateDelay() {
            return new Promise(resolve => setTimeout(resolve, 500));
        },
        
        getMockData(path) {
            if (path.includes('/dashboard')) return this.mockDashboard();
            if (path.includes('/patients')) return this.mockPatients(path);
            if (path.includes('/messages')) return this.mockMessages();
            return { ok: true };
        },
        
        postMockData(path, body) {
            console.log('API Post:', path, body);
            const message = body.preferred_language === 'sw' 
                ? "Mgonjwa amesajiliwa kikamilifu!"
                : "Patient registered successfully!";
            return { ok: true, message };
        },
        
        mockDashboard() {
            return {
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
                        reason: 'Routine cardiac checkup and ECG',
                        patient_id: 101,
                        full_name: 'John Kamau',
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
                        location: 'Child Health Wing, Room 112',
                        reason: 'Child vaccination - booster dose',
                        patient_id: 102,
                        full_name: 'Aisha Mohammed',
                        preferred_language: 'sw',
                        primary_channel: 'whatsapp'
                    }
                ],
                recent: [
                    { id: 103, full_name: 'Peter Ochieng', status: 'active', registration_at: new Date().toISOString(), preferred_language: 'sw' },
                    { id: 104, full_name: 'Lucy Wambui', status: 'active', registration_at: new Date(Date.now() - 86400000).toISOString(), preferred_language: 'en' }
                ]
            };
        },
        
        mockPatients(path) {
            const patients = [
                { id: 101, full_name: 'John Kamau', phone: '+254712345678', preferred_language: 'en', primary_channel: 'sms', status: 'active', external_mrn: 'MRN001', email: 'john@example.com' },
                { id: 102, full_name: 'Aisha Mohammed', phone: '+254723456789', preferred_language: 'sw', primary_channel: 'whatsapp', status: 'active', external_mrn: 'MRN002', email: 'aisha@example.com' },
                { id: 103, full_name: 'Peter Ochieng', phone: '+254734567890', preferred_language: 'sw', primary_channel: 'sms', status: 'active', external_mrn: 'MRN003', email: 'peter@example.com' },
                { id: 104, full_name: 'Lucy Wambui', phone: '+254745678901', preferred_language: 'en', primary_channel: 'whatsapp', status: 'inactive', external_mrn: 'MRN004', email: 'lucy@example.com' }
            ];
            
            const urlParams = new URLSearchParams(path.split('?')[1]);
            const query = urlParams.get('q') || '';
            if (query) {
                const filtered = patients.filter(p => 
                    p.full_name.toLowerCase().includes(query.toLowerCase()) ||
                    p.external_mrn.toLowerCase().includes(query.toLowerCase()) ||
                    p.id.toString().includes(query)
                );
                return { ok: true, items: filtered };
            }
            return { ok: true, items: patients };
        },
        
        mockMessages() {
            return {
                ok: true,
                stats: {
                    outbound_24h: 342,
                    failed_24h: 5,
                    inbound_24h: 187,
                    open_escalations: 3
                },
                outbound: [
                    { created_at: new Date().toISOString(), full_name: 'John Kamau', channel: 'sms', message_type: 'appointment_reminder', status: 'sent', body: 'Your appointment is tomorrow at 10:00 AM' }
                ],
                inbound: [
                    { received_at: new Date().toISOString(), full_name: 'Aisha Mohammed', channel: 'whatsapp', from_address: '+254723456789', body: 'Nathibitisha miadi yangu' }
                ]
            };
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
            if (!state.dashboard) return '<div class="loading">Loading...</div>';
            
            return `
                <div class="fade-in-up">
                    <!-- Stats Grid -->
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">👥</div>
                            <div class="stat-value">${state.dashboard.stats.patients.toLocaleString()}</div>
                            <div class="stat-label">${t('total_patients')}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">📅</div>
                            <div class="stat-value">${state.dashboard.stats.appointments_today}</div>
                            <div class="stat-label">${t('today_appointments')}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">⏰</div>
                            <div class="stat-value">${state.dashboard.stats.upcoming}</div>
                            <div class="stat-label">${t('upcoming_appointments')}</div>
                        </div>
                    </div>
                    
                    <!-- Appointments Section -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-calendar-check"></i>
                                <span>${t('upcoming_appts')}</span>
                            </div>
                        </div>
                        ${this.renderAppointmentsList()}
                    </div>
                    
                    <!-- Recent Patients -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-user-clock"></i>
                                <span>${t('recently_registered')}</span>
                            </div>
                            <button class="btn btn-secondary" onclick="window.components.switchTab('patients')">
                                ${t('view_all')} <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                        ${this.renderRecentPatients()}
                    </div>
                </div>
            `;
        },
        
        renderAppointmentsList() {
            if (!state.dashboard.appointments || state.dashboard.appointments.length === 0) {
                return `
                    <div class="empty-state">
                        <div class="empty-icon">📅</div>
                        <div class="empty-title">${t('no_appointments')}</div>
                        <button class="btn btn-primary" onclick="window.components.switchTab('appointments')">
                            + ${t('schedule_appointment')}
                        </button>
                    </div>
                `;
            }
            
            const grouped = {};
            state.dashboard.appointments.forEach(apt => {
                const date = apt.scheduled_start.split('T')[0];
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push(apt);
            });
            
            return `
                <div class="appointments-timeline">
                    ${Object.entries(grouped).map(([date, appointments]) => `
                        <div class="date-group">
                            <div class="date-header">
                                <i class="fas fa-calendar-day date-icon"></i>
                                <span class="date-text">${formatDate(date, 'full')}</span>
                                <span class="appointment-badge">${appointments.length} appointment${appointments.length > 1 ? 's' : ''}</span>
                            </div>
                            ${appointments.map(apt => `
                                <div class="appointment-item">
                                    <div class="appointment-time">
                                        <i class="far fa-clock"></i>
                                        <span>${formatTime(apt.scheduled_start)}</span>
                                    </div>
                                    <div class="appointment-details">
                                        <div class="patient-name">
                                            ${apt.full_name}
                                            <span class="badge ${apt.status === 'confirmed' ? 'badge-success' : 'badge-warning'}">
                                                ${apt.status}
                                            </span>
                                        </div>
                                        <div class="appointment-meta">
                                            ${apt.department ? `<span class="meta-tag"><i class="fas fa-hospital"></i> ${apt.department}</span>` : ''}
                                            ${apt.provider_name ? `<span class="meta-tag"><i class="fas fa-user-md"></i> ${apt.provider_name}</span>` : ''}
                                            ${apt.location ? `<span class="meta-tag"><i class="fas fa-map-marker-alt"></i> ${apt.location}</span>` : ''}
                                            <span class="meta-tag"><i class="fas ${apt.primary_channel === 'whatsapp' ? 'fa-whatsapp' : 'fa-sms'}"></i> ${apt.primary_channel}</span>
                                        </div>
                                        ${apt.reason ? `<div class="appointment-reason"><i class="fas fa-notes-medical"></i> ${apt.reason}</div>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            `;
        },
        
        renderRecentPatients() {
            if (!state.dashboard.recent || state.dashboard.recent.length === 0) {
                return '<div class="empty-state">No recent patients</div>';
            }
            
            return `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
                    ${state.dashboard.recent.slice(0, 6).map(patient => `
                        <div class="patient-card-small" style="display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--gray-50); border-radius: 16px;">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, var(--primary-500), var(--primary-700)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">
                                👤
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 700; margin-bottom: 4px;">${patient.full_name}</div>
                                <div style="display: flex; gap: 8px; font-size: 12px;">
                                    <span class="badge badge-success">${patient.status}</span>
                                    <span>${formatDate(patient.registration_at, 'date')}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        },
        
        renderPatients() {
            return `
                <div class="card fade-in-up">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fas fa-users"></i>
                            <span>${t('nav_patients')}</span>
                        </div>
                        <button class="btn btn-primary" onclick="window.components.switchTab('register')">
                            <i class="fas fa-user-plus"></i> ${t('register_new')}
                        </button>
                    </div>
                    
                    <div class="search-section">
                        <div class="search-input-wrapper">
                            <i class="fas fa-search"></i>
                            <input type="text" id="patientSearch" class="search-input" placeholder="${t('search_placeholder')}">
                        </div>
                        <button id="searchBtn" class="btn btn-primary">${t('search')}</button>
                    </div>
                    
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>${t('patient_name')}</th>
                                    <th>${t('phone_number')}</th>
                                    <th>Language</th>
                                    <th>Channel</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="patientsTableBody">
                                ${this.renderPatientsTable()}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        },
        
        renderPatientsTable() {
            if (!state.patients || state.patients.length === 0) {
                return '<tr><td colspan="6" class="empty-state">No patients found</td></tr>';
            }
            
            return state.patients.map(patient => `
                <tr>
                    <td><strong>#${patient.id}</strong></td>
                    <td>${patient.full_name}</td>
                    <td>${patient.phone || '-'}</td>
                    <td><span class="badge badge-info">${patient.preferred_language === 'sw' ? '🇹🇿 Kiswahili' : '🇬🇧 English'}</span></td>
                    <td><span class="badge badge-secondary">${patient.primary_channel}</span></td>
                    <td><span class="badge ${patient.status === 'active' ? 'badge-success' : 'badge-danger'}">${patient.status}</span></td>
                </tr>
            `).join('');
        },
        
        renderRegister() {
            return `
                <div class="card fade-in-up">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fas fa-user-plus"></i>
                            <span>${t('register_new')}</span>
                        </div>
                    </div>
                    
                    <form id="registerForm" class="form-container">
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">${t('patient_name')} *</label>
                                <input type="text" name="full_name" class="form-input" required placeholder="Enter full name">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Date of Birth</label>
                                <input type="date" name="date_of_birth" class="form-input">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">${t('phone_number')} *</label>
                                <input type="tel" name="phone" class="form-input" required placeholder="+254...">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">${t('select_language')} *</label>
                                <select name="preferred_language" class="form-select" required>
                                    <option value="en">🇬🇧 English</option>
                                    <option value="sw">🇹🇿 Kiswahili</option>
                                </select>
                                <small style="color: var(--danger); font-size: 11px; margin-top: 4px; display: block;">
                                    ⚠️ System will send ALL messages in selected language
                                </small>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">MRN (Optional)</label>
                                <input type="text" name="external_mrn" class="form-input" placeholder="Medical Record Number">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">${t('select_channel')} *</label>
                                <select name="contact_channel" class="form-select" required>
                                    <option value="sms">📱 SMS</option>
                                    <option value="whatsapp">💬 WhatsApp</option>
                                </select>
                            </div>
                            
                            <div class="form-group full-width">
                                <label class="form-label">Notes</label>
                                <textarea name="notes" class="form-textarea" rows="3" placeholder="Any additional information..."></textarea>
                            </div>
                            
                            <div class="form-group full-width">
                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="checkbox" name="opt_in" checked>
                                    <span>✅ Receive appointment reminders and health tips</span>
                                </label>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button type="button" class="btn btn-secondary" onclick="window.components.switchTab('patients')">
                                ${t('cancel')}
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> ${t('save')}
                            </button>
                        </div>
                    </form>
                </div>
            `;
        },
        
        renderAppointments() {
            return `
                <div class="fade-in-up">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-plus-circle"></i>
                                <span>${t('schedule_new')}</span>
                            </div>
                        </div>
                        
                        <form id="appointmentForm">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Patient ID *</label>
                                    <input type="number" name="patient_id" class="form-input" required placeholder="Enter patient ID">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Date & Time *</label>
                                    <input type="datetime-local" name="scheduled_start" class="form-input" required>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Department</label>
                                    <input type="text" name="department" class="form-input" placeholder="e.g., Cardiology">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Provider Name</label>
                                    <input type="text" name="provider_name" class="form-input" placeholder="Doctor's name">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Location</label>
                                    <input type="text" name="location" class="form-input" placeholder="Room number">
                                </div>
                            </div>
                            
                            <div class="form-group full-width">
                                <label class="form-label">Reason for Visit *</label>
                                <textarea name="reason" class="form-textarea" required rows="3" placeholder="Describe the reason for appointment..."></textarea>
                            </div>
                            
                            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-calendar-check"></i> ${t('schedule_appointment')}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-exchange-alt"></i>
                                <span>${t('reschedule')}</span>
                            </div>
                        </div>
                        
                        <form id="rescheduleForm">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Appointment ID *</label>
                                    <input type="number" name="appointment_id" class="form-input" required placeholder="Enter appointment ID">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">New Date & Time *</label>
                                    <input type="datetime-local" name="new_scheduled_start" class="form-input" required>
                                </div>
                            </div>
                            
                            <div class="form-group full-width">
                                <label class="form-label">Reason for Rescheduling *</label>
                                <textarea name="reason" class="form-textarea" required rows="3" placeholder="Why is this appointment being rescheduled?"></textarea>
                            </div>
                            
                            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-calendar-alt"></i> ${t('reschedule')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        },
        
        renderMessages() {
            if (!state.messages) return '<div class="loading">Loading...</div>';
            
            return `
                <div class="fade-in-up">
                    <div class="stats-grid-small" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                        <div class="stat-mini" style="background: linear-gradient(135deg, var(--primary-50), var(--primary-100)); padding: 20px; border-radius: 16px; text-align: center;">
                            <div style="font-size: 32px; font-weight: 800; color: var(--primary-600);">${state.messages.stats.outbound_24h}</div>
                            <div style="font-size: 12px; color: var(--gray-600);">📤 Outbound (24h)</div>
                        </div>
                        <div class="stat-mini" style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 20px; border-radius: 16px; text-align: center;">
                            <div style="font-size: 32px; font-weight: 800; color: #d97706;">${state.messages.stats.failed_24h}</div>
                            <div style="font-size: 12px; color: var(--gray-600);">❌ Failed (24h)</div>
                        </div>
                        <div class="stat-mini" style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); padding: 20px; border-radius: 16px; text-align: center;">
                            <div style="font-size: 32px; font-weight: 800; color: var(--primary-600);">${state.messages.stats.inbound_24h}</div>
                            <div style="font-size: 12px; color: var(--gray-600);">📥 Inbound (24h)</div>
                        </div>
                        <div class="stat-mini" style="background: linear-gradient(135deg, #fee2e2, #fecaca); padding: 20px; border-radius: 16px; text-align: center;">
                            <div style="font-size: 32px; font-weight: 800; color: #dc2626;">${state.messages.stats.open_escalations}</div>
                            <div style="font-size: 12px; color: var(--gray-600);">⚠️ Escalations</div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-paper-plane"></i>
                                <span>Recent Outbound Messages</span>
                            </div>
                        </div>
                        <div class="table-wrapper">
                            <table class="data-table">
                                <thead>
                                    <tr><th>Time</th><th>Patient</th><th>Channel</th><th>Status</th><th>Message</th></tr>
                                </thead>
                                <tbody>
                                    ${state.messages.outbound.map(msg => `
                                        <tr>
                                            <td>${formatDate(msg.created_at)}</td>
                                            <td>${msg.full_name}</td>
                                            <td>${msg.channel}</td>
                                            <td><span class="badge badge-success">${msg.status}</span></td>
                                            <td>${msg.body}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        },
        
        async loadCurrentTab() {
            const app = document.getElementById('app');
            if (!app) return;
            
            state.isLoading = true;
            app.innerHTML = '<div class="loading" style="text-align: center; padding: 60px;"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
            
            try {
                if (state.currentTab === 'dashboard') {
                    state.dashboard = await api.get('/api/dashboard.php');
                    app.innerHTML = this.renderDashboard();
                } else if (state.currentTab === 'patients') {
                    const data = await api.get('/api/patients.php');
                    state.patients = data.items;
                    app.innerHTML = this.renderPatients();
                    
                    document.getElementById('searchBtn')?.addEventListener('click', async () => {
                        const searchInput = document.getElementById('patientSearch');
                        const query = searchInput?.value || '';
                        const data = await api.get(`/api/patients.php?q=${encodeURIComponent(query)}`);
                        state.patients = data.items;
                        const tbody = document.getElementById('patientsTableBody');
                        if (tbody) tbody.innerHTML = this.renderPatientsTable();
                    });
                } else if (state.currentTab === 'register') {
                    app.innerHTML = this.renderRegister();
                    const form = document.getElementById('registerForm');
                    form?.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const formData = new FormData(form);
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
                        showNotification('Appointment scheduled successfully!', 'ok');
                        e.target.reset();
                    });
                    
                    document.getElementById('rescheduleForm')?.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const body = Object.fromEntries(formData.entries());
                        body.action = 'reschedule';
                        const result = await api.post('/api/appointments.php', body);
                        showNotification('Appointment rescheduled successfully!', 'ok');
                        e.target.reset();
                    });
                } else if (state.currentTab === 'messages') {
                    state.messages = await api.get('/api/message_center.php');
                    app.innerHTML = this.renderMessages();
                }
                
                showNotification(t('ready'), 'ok');
            } catch (error) {
                console.error('Error loading tab:', error);
                app.innerHTML = `<div class="error-state" style="text-align: center; padding: 60px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: var(--danger);"></i>
                    <p>${t('error')}: ${error.message}</p>
                </div>`;
                showNotification(error.message, 'error');
            } finally {
                state.isLoading = false;
            }
        }
    };
    
    // ============================================
    // APPLICATION INITIALIZATION
    // ============================================
    function init() {
        // Create app structure
        const root = document.getElementById('app-root');
        if (!root) return;
        
        root.innerHTML = `
            <header class="top-nav">
                <div class="nav-container">
                    <div class="nav-content">
                        <div class="logo" onclick="window.components.switchTab('dashboard')">
                            <div class="logo-icon">🏥</div>
                            <div>
                                <div class="logo-text">Nyeri Level 4 Hospital</div>
                                <div class="logo-subtitle">Enterprise Healthcare System</div>
                            </div>
                        </div>
                        <div class="nav-menu"></div>
                        <div class="header-actions">
                            <button class="lang-toggle" id="langToggle">
                                <i class="fas fa-globe"></i>
                                <span>${currentLanguage === 'en' ? 'EN' : 'SW'}</span>
                            </button>
                            <div class="user-avatar" title="${currentUser.name}">
                                ${currentUser.avatar}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            <main class="main-container">
                <div class="status-bar">
                    <div class="status-message muted">
                        <i class="fas fa-check-circle"></i>
                        <span>${t('ready')}</span>
                    </div>
                </div>
                <div id="app"></div>
            </main>
            
            <footer class="footer">
                <p>© 2024 Nyeri Level 4 Hospital. All rights reserved. | Enterprise Healthcare Management System v2.0</p>
            </footer>
        `;
        
        // Expose components globally
        window.components = components;
        window.components.switchTab = (tab) => {
            state.currentTab = tab;
            components.renderNav();
            components.loadCurrentTab();
        };
        
        // Language toggle
        document.getElementById('langToggle')?.addEventListener('click', () => {
            currentLanguage = currentLanguage === 'en' ? 'sw' : 'en';
            localStorage.setItem('language', currentLanguage);
            document.getElementById('langToggle').querySelector('span').textContent = currentLanguage.toUpperCase();
            components.renderNav();
            components.loadCurrentTab();
            showNotification(`Language changed to ${currentLanguage === 'en' ? 'English' : 'Kiswahili'}`, 'ok');
        });
        
        // Initialize
        components.renderNav();
        components.loadCurrentTab();
    }
    
    // Start the application
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
