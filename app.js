// ============================================
// NYERI TOWN HEALTH CENTRE
// Afya Rafiki - Smart Healthcare System
// Version: 2.2.0 - Enhanced UI
// ============================================

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURATION
    // ============================================
    const cfg = window.HPV_CONFIG || window.PHV_CONFIG || {};
    const API_BASE_URL = cfg.BACKEND_BASE_URL || "https://medicback.onrender.com";
    
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
            open_escalations: "Open Escalations",
            hpv_program: "HPV Patient Engagement",
            title_overview: "Healthcare Analytics",
            total_patients: "Total Patients",
            total_registered: "Total Registered",
            today_appointments: "Today's Appointments",
            upcoming_appointments: "Upcoming Appointments",
            upcoming_appts: "Booked Appointments",
            no_appointments: "No appointments scheduled",
            schedule_appointment: "Schedule Appointment",
            recently_registered: "Recently Registered Patients",
            booked_appointments: "Booked Appointments",
            view_all: "View All Patients",
            save: "Save",
            cancel: "Cancel",
            search: "Search",
            register_new: "Register New Patient",
            schedule_new: "Schedule New Appointment",
            reschedule: "Reschedule Appointment",
            ready: "System Ready",
            loading: "Loading data from server...",
            error: "Connection Error",
            success: "Operation completed successfully",
            connection_error: "Cannot connect to server. Please check your connection.",
            server_error: "Server error occurred",
            network_error: "Network error. Please check your connection",
            search_placeholder: "Search by name, MRN, or ID...",
            patient_name: "Patient Name",
            phone_number: "Phone Number",
            select_language: "Preferred Language",
            select_channel: "Contact Channel",
            registering: "Processing registration...",
            processing: "Processing",
            view_record: "View Record",
            appt_with: "Appointment with",
            appt_on: "on"
        },
        sw: {
            nav_dashboard: "Dashibodi",
            nav_patients: "Wagonjwa",
            nav_register: "Sajili",
            nav_appointments: "Miadi",
            nav_messages: "Ujumbe",
            open_escalations: "Escalations Wazi",
            hpv_program: "Ushirikiano wa Wagonjwa wa HPV",
            title_overview: "Takwimu za Afya",
            total_patients: "Jumla ya Wagonjwa",
            total_registered: "Jumla Iliyosajiliwa",
            today_appointments: "Miadi ya Leo",
            upcoming_appointments: "Miadi Ijayo",
            upcoming_appts: "Miadi Iliyopangwa",
            no_appointments: "Hakuna miadi iliyopangwa",
            schedule_appointment: "Panga Miadi",
            recently_registered: "Wagonjwa Wapya",
            booked_appointments: "Miadi Iliyobakwa",
            view_all: "Angalia Wote",
            save: "Hifadhi",
            cancel: "Ghairi",
            search: "Tafuta",
            register_new: "Sajili Mgonjwa Mpya",
            schedule_new: "Panga Miadi Mpya",
            reschedule: "Badilisha Miadi",
            ready: "Mfumo Uko Tayari",
            loading: "Inapakia data kutoka seva...",
            error: "Hitilafu ya Muunganisho",
            success: "Operesheni Imefanikiwa",
            connection_error: "Haikuweza kuunganishwa na seva. Tafadhali angalia muunganisho wako.",
            server_error: "Hitilafu ya seva imetokea",
            network_error: "Hitilafu ya mtandao. Tafadhali angalia muunganisho wako",
            search_placeholder: "Tafuta kwa jina, MRN, au ID...",
            patient_name: "Jina la Mgonjwa",
            phone_number: "Nambari ya Simu",
            select_language: "Lugha Unayopendelea",
            select_channel: "Njia ya Mawasiliano",
            registering: "Inaprosesa usajili...",
            processing: "Inaprosesa",
            view_record: "Angalia Rekodi",
            appt_with: "Miadi na",
            appt_on: "tarehe"
        }
    };
    
    // ============================================
    // APPLICATION STATE
    // ============================================
    let currentLanguage = localStorage.getItem('language') || 'en';
    let retryCount = 0;
    const MAX_RETRIES = 3;
    
    const state = {
        currentTab: "dashboard",
        dashboard: null,
        patients: [],
        appointments: [],
        messages: null,
        patientDetail: null,
        selectedPatientId: null,
        isLoading: false,
        isRegistering: false
    };
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function t(key) {
        return translations[currentLanguage][key] || translations.en[key] || key;
    }
    
    function formatDate(dateString, format = 'full') {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            const options = {
                full: { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' },
                date: { year: 'numeric', month: 'short', day: 'numeric' },
                time: { hour: '2-digit', minute: '2-digit' }
            };
            return date.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'sw-KE', options[format]);
        } catch (e) {
            return dateString;
        }
    }
    
    function formatTime(dateString) {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleTimeString(currentLanguage === 'en' ? 'en-US' : 'sw-KE', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch (e) {
            return dateString;
        }
    }
    
    function formatMessageTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'sw-KE', {
            month: 'short',
            day: 'numeric'
        });
    }
    
    function formatMessageType(type) {
        if (type === 'ai_reply') return 'AI';
        if (type === 'escalation_notice') return 'Escalation';
        if (type === 'appointment_reminder') return 'Appointment';
        if (type === 'education_menu') return 'Menu';
        if (type === 'welcome') return 'Welcome';
        return type || 'Message';
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function showNotification(message, type = 'info') {
        const statusMessage = document.querySelector('.status-message');
        if (statusMessage) {
            statusMessage.className = `status-message ${type}`;
            statusMessage.innerHTML = `<i class="fas ${type === 'ok' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
            
            if (type !== 'info') {
                setTimeout(() => {
                    if (statusMessage.classList.contains(type)) {
                        statusMessage.className = 'status-message muted';
                        statusMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${t('ready')}`;
                    }
                }, 5000);
            }
        }
    }
    
    // ============================================
    // API SERVICE
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
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...options.headers
                    }
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (!data.ok && data.error) {
                    throw new Error(data.error);
                }
                
                return data;
            } catch (error) {
                console.error('API Request failed:', error);
                throw error;
            }
        },
        
        async get(url, retry = true) {
            try {
                const data = await this.request(url);
                retryCount = 0;
                return data;
            } catch (error) {
                if (retry && retryCount < MAX_RETRIES) {
                    retryCount++;
                    const delay = 1000 * Math.pow(2, retryCount);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this.get(url, true);
                }
                retryCount = 0;
                throw error;
            }
        },
        
        async post(url, body, retry = true) {
            try {
                const data = await this.request(url, {
                    method: 'POST',
                    body: JSON.stringify(body)
                });
                retryCount = 0;
                return data;
            } catch (error) {
                if (retry && retryCount < MAX_RETRIES) {
                    retryCount++;
                    const delay = 1000 * Math.pow(2, retryCount);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this.post(url, body, true);
                }
                retryCount = 0;
                throw error;
            }
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
            if (tabId === 'messages' && state._pendingEscalationOpen) {
                state._scrollToEscalations = true;
            }
            this.renderNav();
            this.loadCurrentTab();
        },

        getOpenEscalations() {
            return state.messages?.escalations || [];
        },

        bindEscalationCards(root) {
            const scope = root || document;
            scope.querySelectorAll('.escalation-card').forEach((card) => {
                card.addEventListener('click', (e) => {
                    if (e.target.closest('button')) return;
                    const escId = Number(card.dataset.escId || 0);
                    if (escId) this.toggleEscalationDetails(escId);
                });
            });
        },

        presentEscalations() {
            const openEscalations = this.getOpenEscalations();
            const openCount = state.messages?.stats?.open_escalations ?? openEscalations.length;
            const modal = document.getElementById('escalationDetailsModal');

            this.scrollToEscalations();

            if (!modal) {
                showNotification('Could not open escalations panel', 'error');
                return;
            }

            if (openEscalations.length === 0) {
                if (openCount > 0) {
                    modal.innerHTML = `
                        <div class="modal-content">
                            <div class="modal-header">
                                <h2>${openCount} Open Escalations</h2>
                                <button class="close-btn" onclick="window.components.closeEscalationModal()"><i class="fas fa-times"></i></button>
                            </div>
                            <div class="escalation-details">
                                <p class="muted">The count shows ${openCount} open request(s), but details could not be loaded. Try refreshing the page.</p>
                            </div>
                        </div>`;
                    modal.classList.remove('hidden');
                } else {
                    showNotification('No open escalations', 'ok');
                }
                return;
            }

            modal.innerHTML = `
                <div class="modal-content modal-content-wide">
                    <div class="modal-header">
                        <h2><i class="fas fa-exclamation-triangle"></i> ${openEscalations.length} Open Escalation${openEscalations.length === 1 ? '' : 's'}</h2>
                        <button class="close-btn" onclick="window.components.closeEscalationModal()"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="escalations-panel" style="padding:20px 24px 28px;">
                        ${this.renderEscalationsDetail(openEscalations)}
                    </div>
                </div>`;
            modal.classList.remove('hidden');
            modal.onclick = (e) => {
                if (e.target === modal) this.closeEscalationModal();
            };
            this.bindEscalationCards(modal);
        },

        closeEscalationModal() {
            const modal = document.getElementById('escalationDetailsModal');
            if (modal) modal.classList.add('hidden');
        },
        
        renderLoading() {
            return `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>${t('loading')}</p>
                </div>
            `;
        },
        
        renderLoadingOverlay(stage = 'registering') {
            const stages = {
                'registering': { icon: 'fa-user-check', message: t('registering'), progress: 33 },
                'saving': { icon: 'fa-database', message: 'Saving to database...', progress: 66 },
                'confirming': { icon: 'fa-check-circle', message: 'Confirming registration...', progress: 90 }
            };
            
            const current = stages[stage] || stages['registering'];
            
            return `
                <div class="loading-overlay">
                    <div class="loading-spinner">
                        <i class="fas ${current.icon} fa-pulse"></i>
                        <p>${current.message}</p>
                        <div class="loading-progress">
                            <div class="progress-bar" style="width: ${current.progress}%"></div>
                        </div>
                        <div class="stage-indicator">
                            <span class="stage ${stage === 'registering' ? 'active' : 'complete'}">1. Register</span>
                            <span class="stage-divider">→</span>
                            <span class="stage ${stage === 'saving' ? 'active' : stage === 'registering' ? '' : 'complete'}">2. Save</span>
                            <span class="stage-divider">→</span>
                            <span class="stage ${stage === 'confirming' ? 'active' : ''}">3. Confirm</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        renderConnectionError(error) {
            return `
                <div class="card" style="text-align: center; padding: 60px 40px;">
                    <i class="fas fa-plug" style="font-size: 64px; color: var(--danger); margin-bottom: 20px;"></i>
                    <h2 style="color: var(--gray-800); margin-bottom: 10px;">${t('connection_error')}</h2>
                    <p style="color: var(--gray-600); margin-bottom: 20px;">${error.message}</p>
                    <button onclick="location.reload()" class="btn-primary">
                        <i class="fas fa-sync-alt"></i> Retry Connection
                    </button>
                    <button onclick="window.components.switchTab('dashboard')" class="btn-secondary" style="margin-left: 10px;">
                        <i class="fas fa-home"></i> Go to Dashboard
                    </button>
                </div>
            `;
        },
        
        renderDashboard() {
            if (!state.dashboard) return this.renderLoading();
            
            const stats = state.dashboard.stats || {};
            const appointments = state.dashboard.appointments || [];
            const recent = state.dashboard.recent || [];
            
            return `
                <div class="fade-in-up">
                    <div class="page-hero">
                        <div class="page-hero-content">
                            <span class="page-hero-badge"><i class="fas fa-shield-virus"></i> ${t('hpv_program')}</span>
                            <h1><i class="fas fa-chart-line"></i> Healthcare Analytics Dashboard</h1>
                            <p class="page-hero-sub">Monitor HPV outreach, appointments, and patient engagement in real time.</p>
                        </div>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card" onclick="window.components.switchTab('patients')">
                            <div class="stat-icon">👥</div>
                            <div class="stat-value">${stats.patients?.toLocaleString() || 0}</div>
                            <div class="stat-label">${t('total_patients')}</div>
                        </div>
                        <div class="stat-card" onclick="window.components.switchTab('register')">
                            <div class="stat-icon">📝</div>
                            <div class="stat-value">${stats.registered_today || 0}</div>
                            <div class="stat-label">${t('total_registered')} Today</div>
                        </div>
                        <div class="stat-card" onclick="window.components.switchTab('appointments')">
                            <div class="stat-icon">📅</div>
                            <div class="stat-value">${stats.appointments_today || 0}</div>
                            <div class="stat-label">${t('today_appointments')}</div>
                        </div>
                        <div class="stat-card" onclick="window.components.switchTab('appointments')">
                            <div class="stat-icon">⏰</div>
                            <div class="stat-value">${stats.upcoming || 0}</div>
                            <div class="stat-label">${t('upcoming_appointments')}</div>
                        </div>
                        <div class="stat-card stat-card-alert ${(stats.open_escalations || 0) > 0 ? 'has-alerts' : ''}" onclick="window.components.openEscalations()">
                            <div class="stat-icon">⚠️</div>
                            <div class="stat-value">${stats.open_escalations || 0}</div>
                            <div class="stat-label">${t('open_escalations')}</div>
                            ${(stats.open_escalations || 0) > 0 ? '<div class="stat-card-hint">Tap to review</div>' : ''}
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-calendar-check"></i>
                                <span>${t('booked_appointments')}</span>
                            </div>
                            <button class="btn-primary" onclick="window.components.switchTab('appointments')">
                                <i class="fas fa-plus"></i> ${t('schedule_appointment')}
                            </button>
                        </div>
                        ${this.renderAppointmentsList()}
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-user-clock"></i>
                                <span>${t('recently_registered')}</span>
                            </div>
                            <button class="btn-secondary" onclick="window.components.switchTab('patients')">
                                ${t('view_all')} <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                        ${this.renderRecentPatients()}
                    </div>
                </div>
            `;
        },
        
        renderAppointmentsList() {
            const appointments = state.dashboard?.appointments || [];
            
            if (appointments.length === 0) {
                return `
                    <div class="empty-state">
                        <div class="empty-icon">📅</div>
                        <div class="empty-title">${t('no_appointments')}</div>
                        <button class="btn-primary" onclick="window.components.switchTab('appointments')">
                            + ${t('schedule_appointment')}
                        </button>
                    </div>
                `;
            }
            
            const grouped = {};
            appointments.forEach(apt => {
                const date = apt.scheduled_start?.split('T')[0] || apt.scheduled_start?.split(' ')[0];
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push(apt);
            });
            
            return `
                <div class="appointments-timeline">
                    ${Object.entries(grouped).map(([date, appointments]) => `
                        <div class="date-group">
                            <div class="date-header">
                                <i class="fas fa-calendar-day"></i>
                                <span class="date-text">${formatDate(date, 'full')}</span>
                                <span class="appointment-badge">${appointments.length} appointment${appointments.length > 1 ? 's' : ''}</span>
                            </div>
                            ${appointments.map(apt => `
                                <div class="appointment-item clickable" onclick="window.components.viewPatient(${apt.patient_id})" style="cursor:pointer;">
                                    <div class="appointment-time">
                                        <i class="far fa-clock"></i>
                                        <span>${formatTime(apt.scheduled_start)}</span>
                                    </div>
                                    <div class="appointment-details">
                                        <div class="patient-name">
                                            ${escapeHtml(apt.full_name || `Patient #${apt.patient_id}`)}
                                            <span class="badge ${apt.status === 'confirmed' ? 'badge-success' : 'badge-warning'}">
                                                ${apt.status || 'pending'}
                                            </span>
                                        </div>
                                        <div class="appointment-meta">
                                            ${apt.department ? `<span class="meta-tag"><i class="fas fa-hospital"></i> ${escapeHtml(apt.department)}</span>` : ''}
                                            ${apt.provider_name ? `<span class="meta-tag"><i class="fas fa-user-md"></i> ${escapeHtml(apt.provider_name)}</span>` : ''}
                                            ${apt.location ? `<span class="meta-tag"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(apt.location)}</span>` : ''}
                                        </div>
                                        ${apt.reason ? `<div class="appointment-reason"><i class="fas fa-notes-medical"></i> ${escapeHtml(apt.reason)}</div>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            `;
        },
        
        renderRecentPatients() {
            const recent = state.dashboard?.recent || [];
            
            if (recent.length === 0) {
                return `
                    <div class="empty-state">
                        <div class="empty-icon">👤</div>
                        <div class="empty-title">No patients registered yet</div>
                        <button class="btn-primary" onclick="window.components.switchTab('register')">
                            <i class="fas fa-user-plus"></i> Register First Patient
                        </button>
                    </div>
                `;
            }
            
            return `
                <div class="patients-grid">
                    ${recent.slice(0, 6).map(patient => `
                        <div class="patient-card clickable" onclick="window.components.viewPatient(${patient.id})">
                            <div class="patient-avatar">👤</div>
                            <div class="patient-info">
                                <div class="patient-name">${escapeHtml(patient.full_name)}</div>
                                <div class="patient-meta">
                                    <span class="badge badge-success">
                                        <i class="fas fa-check-circle"></i> ${patient.status || 'Active'}
                                    </span>
                                    <span class="date-badge">
                                        <i class="far fa-calendar-alt"></i> ${formatDate(patient.registration_at, 'date')}
                                    </span>
                                    ${patient.preferred_language === 'sw' ? 
                                        '<span class="badge badge-info"><i class="fas fa-language"></i> Kiswahili</span>' : 
                                        '<span class="badge badge-info"><i class="fas fa-language"></i> English</span>'}
                                </div>
                            </div>
                            <i class="fas fa-chevron-right" style="color: var(--gray-400);"></i>
                        </div>
                    `).join('')}
                </div>
                ${recent.length > 6 ? `
                    <div class="view-all-link">
                        <a href="#" onclick="window.components.switchTab('patients'); return false;">
                            View all ${recent.length} patients <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                ` : ''}
            `;
        },
        
        renderPatients() {
            return `
                <div class="fade-in-up">
                    <div class="page-hero page-hero-compact">
                        <div class="page-hero-content">
                            <span class="page-hero-badge"><i class="fas fa-users"></i> Patient Registry</span>
                            <h1><i class="fas fa-id-card"></i> ${t('nav_patients')}</h1>
                            <p class="page-hero-sub">Search, view, and manage HPV program participants.</p>
                        </div>
                    </div>
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fas fa-users"></i>
                            <span>${t('nav_patients')}</span>
                        </div>
                        <button class="btn-primary" onclick="window.components.switchTab('register')">
                            <i class="fas fa-user-plus"></i> ${t('register_new')}
                        </button>
                    </div>
                    
                    <div class="search-section">
                        <div class="search-input-wrapper">
                            <i class="fas fa-search"></i>
                            <input type="text" id="patientSearch" class="search-input" placeholder="${t('search_placeholder')}">
                        </div>
                        <button id="searchBtn" class="btn-primary">${t('search')}</button>
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
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="patientsTableBody">
                                ${this.renderPatientsTable()}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
            `;
        },
        
        renderPatientsTable() {
            const patients = state.patients || [];
            
            if (patients.length === 0) {
                return '<tr><td colspan="7" class="empty-state">No patients found</td>' +
                '<td style="display:none;"></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;"></td><td style="display:none;"></td>' +
                '</tr>';
            }
            
            return patients.map(patient => `
                <tr class="patient-row clickable" onclick="window.components.viewPatient(${patient.id})">
                    <td><strong>#${patient.id}</strong></td>
                    <td>${escapeHtml(patient.full_name)}</td>
                    <td>${patient.phone || '-'}</td>
                    <td><span class="badge badge-info">${patient.preferred_language === 'sw' ? '🇹🇿 Kiswahili' : '🇬🇧 English'}</span></td>
                    <td><span class="badge badge-secondary">${patient.primary_channel || 'sms'}</span></td>
                    <td><span class="badge ${patient.status === 'active' ? 'badge-success' : 'badge-danger'}">${patient.status || 'active'}</span></td>
                    <td onclick="event.stopPropagation();">
                        <button type="button" class="btn-secondary" style="padding: 4px 12px; font-size: 0.7rem;" onclick="window.components.viewPatient(${patient.id})">
                            ${t('view_record')} <i class="fas fa-chevron-right"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        },

        renderPatientDetail() {
            const p = state.patientDetail;
            if (!p) return this.renderLoading();

            const contacts = p.contacts || [];
            const appointments = p.appointments || [];
            const escalations = p.escalations || [];
            const dcr = p.doctor_call_request;

            return `
                <div class="fade-in-up">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <button type="button" class="btn-secondary" style="margin-right:12px;padding:6px 12px;" onclick="window.components.switchTab('patients')">
                                    <i class="fas fa-arrow-left"></i> Back
                                </button>
                                <i class="fas fa-user"></i>
                                <span>${escapeHtml(p.full_name)}</span>
                            </div>
                            <span class="badge ${p.status === 'active' ? 'badge-success' : 'badge-danger'}">${p.status || 'active'}</span>
                        </div>
                        <div class="detail-grid" style="padding:16px;">
                            <div class="detail-item"><span class="label">Patient ID</span><span class="value">#${p.id}</span></div>
                            <div class="detail-item"><span class="label">Language</span><span class="value">${p.preferred_language === 'sw' ? 'Kiswahili' : 'English'}</span></div>
                            <div class="detail-item"><span class="label">Date of Birth</span><span class="value">${p.date_of_birth || 'N/A'}</span></div>
                            <div class="detail-item"><span class="label">MRN</span><span class="value">${escapeHtml(p.external_mrn || 'N/A')}</span></div>
                            <div class="detail-item"><span class="label">Registered</span><span class="value">${formatDate(p.registration_at, 'full')}</span></div>
                            <div class="detail-item full-width"><span class="label">Notes</span><span class="value">${escapeHtml(p.notes || 'None')}</span></div>
                        </div>
                    </div>

                    <div class="card" style="margin-top:1rem;">
                        <div class="card-header"><div class="card-title"><i class="fas fa-phone"></i> Contact</div></div>
                        <div style="padding:16px;">
                            ${contacts.length === 0 ? '<p class="muted">No contact on file.</p>' : contacts.map(c => `
                                <div class="meta-tag" style="margin-bottom:8px;">
                                    <i class="fas fa-${c.channel === 'whatsapp' ? 'comment' : 'sms'}"></i>
                                    ${c.channel.toUpperCase()}: ${escapeHtml(c.address)}
                                    ${c.opted_in ? '<span class="badge badge-success">Opted in</span>' : '<span class="badge badge-danger">Opted out</span>'}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    ${dcr ? `
                    <div class="card" style="margin-top:1rem;border-left:4px solid var(--warning);">
                        <div class="card-header"><div class="card-title"><i class="fas fa-user-md"></i> Health Specialist Request</div></div>
                        <div style="padding:16px;">
                            <p><strong>Status:</strong> ${(dcr.status || 'pending').toUpperCase()}</p>
                            <p><strong>Requested:</strong> ${formatDate(dcr.requested_at, 'full')} ${formatTime(dcr.requested_at)}</p>
                            <p>${escapeHtml(dcr.reason || '')}</p>
                        </div>
                    </div>` : ''}

                    <div class="card" style="margin-top:1rem;">
                        <div class="card-header">
                            <div class="card-title"><i class="fas fa-calendar"></i> Appointments</div>
                            <button class="btn-primary" onclick="window.components.scheduleForPatient(${p.id})">
                                <i class="fas fa-plus"></i> Schedule
                            </button>
                        </div>
                        <div style="padding:16px;">
                            ${appointments.length === 0 ? '<p class="muted">No appointments yet.</p>' : appointments.map(a => `
                                <div class="appointment-item" style="margin-bottom:12px;">
                                    <strong>${formatDate(a.scheduled_start, 'full')} ${formatTime(a.scheduled_start)}</strong>
                                    <span class="badge ${a.status === 'confirmed' ? 'badge-success' : 'badge-warning'}">${a.status}</span>
                                    ${a.department ? `<div>${escapeHtml(a.department)}</div>` : ''}
                                    ${a.reason ? `<div class="muted">${escapeHtml(a.reason)}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    ${escalations.length > 0 ? `
                    <div class="card" style="margin-top:1rem;">
                        <div class="card-header"><div class="card-title"><i class="fas fa-exclamation-triangle"></i> Escalations</div></div>
                        <div style="padding:16px;">
                            ${escalations.map(e => `
                                <div style="margin-bottom:10px;padding:10px;background:var(--gray-50);border-radius:8px;">
                                    <strong>${(e.urgency || 'routine').toUpperCase()}</strong> — ${(e.status || 'open').toUpperCase()}
                                    <div>${escapeHtml(e.reason || '')}</div>
                                    <div class="muted">${formatDate(e.created_at, 'full')}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>` : ''}
                </div>
            `;
        },

        async viewPatient(id) {
            state.selectedPatientId = id;
            state.currentTab = 'patient';
            this.renderNav();
            await this.loadCurrentTab();
        },

        scheduleForPatient(patientId) {
            state.selectedPatientId = patientId;
            state.currentTab = 'appointments';
            this.renderNav();
            this.loadCurrentTab().then(() => {
                const sel = document.getElementById('apptPatientSelect');
                if (sel) sel.value = String(patientId);
            });
        },
        
        renderRegister() {
            return `
                <div class="fade-in-up">
                    <div class="page-hero page-hero-compact">
                        <div class="page-hero-content">
                            <span class="page-hero-badge"><i class="fas fa-user-plus"></i> Enrollment</span>
                            <h1><i class="fas fa-clipboard-list"></i> ${t('register_new')}</h1>
                            <p class="page-hero-sub">Register patients for HPV screening, vaccination, and follow-up care.</p>
                        </div>
                    </div>
                <div class="card">
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
                                <input type="text" name="full_name" class="form-input" required>
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
                                <small style="color: var(--danger); font-size: 0.7rem; margin-top: 4px; display: block;">
                                    ⚠️ System sends messages in selected language
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
                                <textarea name="notes" class="form-textarea" rows="3"></textarea>
                            </div>
                            
                            <div class="form-group full-width">
                                <label class="checkbox-label">
                                    <input type="checkbox" name="opt_in" checked>
                                    <span>✅ Receive appointment reminders and health tips</span>
                                </label>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button type="button" class="btn-secondary" onclick="window.components.switchTab('patients')">
                                ${t('cancel')}
                            </button>
                            <button type="submit" class="btn-primary" id="submitBtn">
                                <i class="fas fa-save"></i> ${t('save')}
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            `;
        },
        
        renderAppointmentsPage() {
            return `
                <div class="fade-in-up appointments-page">
                    <div class="page-hero page-hero-compact">
                        <div class="page-hero-content">
                            <span class="page-hero-badge"><i class="fas fa-calendar-alt"></i> Scheduling</span>
                            <h1><i class="fas fa-calendar-check"></i> ${t('nav_appointments')}</h1>
                            <p class="page-hero-sub">Book HPV clinic visits, screening appointments, and follow-ups.</p>
                        </div>
                    </div>
                    <div class="card appointments-section">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-calendar-check"></i>
                                <span>${t('booked_appointments')}</span>
                            </div>
                            <div class="appointment-filters">
                                <select id="appointmentFilter" class="form-select" style="width: auto; padding: 8px 12px;">
                                    <option value="all">All Appointments</option>
                                    <option value="today">Today</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="past">Past</option>
                                </select>
                            </div>
                        </div>
                        <div id="appointmentsContent">
                            ${this.renderLoadingAppointments()}
                        </div>
                    </div>

                    <div class="card appointments-section" style="margin-top: 1.5rem;">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-plus-circle"></i>
                                <span>${t('schedule_new')}</span>
                            </div>
                        </div>
                        <form id="appointmentForm" class="form-container">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Patient *</label>
                                    <select name="patient_id" id="apptPatientSelect" class="form-select" required>
                                        <option value="">Select patient...</option>
                                        ${(state.patients || []).map(p => `<option value="${p.id}">${escapeHtml(p.full_name)} (#${p.id})</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Date & Time *</label>
                                    <input type="datetime-local" name="scheduled_start" class="form-input" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">End Time</label>
                                    <input type="datetime-local" name="scheduled_end" class="form-input">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Department</label>
                                    <input type="text" name="department" class="form-input" placeholder="e.g., HPV Clinic">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Provider Name</label>
                                    <input type="text" name="provider_name" class="form-input" placeholder="Doctor's name">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Location</label>
                                    <input type="text" name="location" class="form-input" placeholder="Room / ward">
                                </div>
                            </div>
                            <div class="form-group full-width">
                                <label class="form-label">Reason for Visit *</label>
                                <textarea name="reason" class="form-textarea" required rows="3"></textarea>
                            </div>
                            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                                <button type="submit" class="btn-primary">
                                    <i class="fas fa-calendar-check"></i> ${t('schedule_appointment')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        },

        renderBookedAppointments() {
            return this.renderAppointmentsPage();
        },

        renderLoadingAppointments() {
            return `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading appointments...</p>
                </div>
            `;
        },

        renderAppointmentsDetailList(appointments) {
            if (!appointments || appointments.length === 0) {
                return `
                    <div class="empty-state">
                        <div class="empty-icon">📅</div>
                        <div class="empty-title">No appointments scheduled</div>
                        <button class="btn-primary" onclick="window.components.switchTab('appointments')">
                            + Schedule First Appointment
                        </button>
                    </div>
                `;
            }
            
            const grouped = {};
            appointments.forEach(apt => {
                const date = apt.scheduled_start?.split('T')[0] || apt.scheduled_start?.split(' ')[0];
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push(apt);
            });
            
            const sortedDates = Object.keys(grouped).sort();
            
            return `
                <div class="appointments-detail-list">
                    ${sortedDates.map(date => `
                        <div class="appointment-date-section">
                            <div class="appointment-date-header">
                                <h3>${formatDate(date, 'full')}</h3>
                                <span class="count-badge">${grouped[date].length} appointment${grouped[date].length !== 1 ? 's' : ''}</span>
                            </div>
                            
                            <div class="appointment-cards">
                                ${grouped[date].map((apt, idx) => `
                                    <div class="appointment-card" data-id="${apt.id || idx}">
                                        <div class="appointment-card-left">
                                            <div class="appointment-patient-avatar">
                                                ${(apt.full_name || 'Patient').charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        
                                        <div class="appointment-card-middle">
                                            <div class="appointment-patient-name">${escapeHtml(apt.full_name || 'Unknown Patient')}</div>
                                            <div class="appointment-time-display">
                                                <i class="fas fa-clock"></i>
                                                <span>${formatTime(apt.scheduled_start)} - ${apt.scheduled_end ? formatTime(apt.scheduled_end) : 'TBA'}</span>
                                            </div>
                                            <div class="appointment-provider">
                                                ${apt.provider_name ? `<span><i class="fas fa-user-md"></i> Dr. ${escapeHtml(apt.provider_name)}</span>` : ''}
                                                ${apt.department ? `<span><i class="fas fa-hospital"></i> ${escapeHtml(apt.department)}</span>` : ''}
                                            </div>
                                            ${apt.reason ? `<div class="appointment-reason-text"><i class="fas fa-notes-medical"></i> <strong>Reason:</strong> ${escapeHtml(apt.reason)}</div>` : ''}
                                            ${apt.location ? `<div class="appointment-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(apt.location)}</div>` : ''}
                                        </div>
                                        
                                        <div class="appointment-card-right">
                                            <span class="status-badge ${apt.status || 'pending'}">
                                                ${apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1) : 'Pending'}
                                            </span>
                                            <button class="btn-action-small" onclick="event.stopPropagation(); window.components.viewPatient(${apt.patient_id})" title="View patient">
                                                <i class="fas fa-user"></i>
                                            </button>
                                            <button class="btn-action-small" onclick="event.stopPropagation(); window.components.viewAppointmentDetails(${apt.id || idx})" title="Appointment details">
                                                <i class="fas fa-chevron-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
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
                        
                        <form id="appointmentForm" class="form-container">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Patient ID *</label>
                                    <input type="number" name="patient_id" class="form-input" required>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Date & Time *</label>
                                    <input type="datetime-local" name="scheduled_start" class="form-input" required>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">End Time</label>
                                    <input type="datetime-local" name="scheduled_end" class="form-input">
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
                                <textarea name="reason" class="form-textarea" required rows="3"></textarea>
                            </div>
                            
                            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                                <button type="submit" class="btn-primary">
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
                        
                        <form id="rescheduleForm" class="form-container">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Appointment ID *</label>
                                    <input type="number" name="appointment_id" class="form-input" required>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">New Date & Time *</label>
                                    <input type="datetime-local" name="new_scheduled_start" class="form-input" required>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">New End Time</label>
                                    <input type="datetime-local" name="new_scheduled_end" class="form-input">
                                </div>
                            </div>
                            
                            <div class="form-group full-width">
                                <label class="form-label">Reason for Rescheduling *</label>
                                <textarea name="reason" class="form-textarea" required rows="3"></textarea>
                            </div>
                            
                            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                                <button type="submit" class="btn-primary">
                                    <i class="fas fa-calendar-alt"></i> ${t('reschedule')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        },
        
        renderMessages() {
            if (!state.messages) return this.renderLoading();
            
            const stats = state.messages.stats || {};
            const outbound = state.messages.outbound || [];
            const inbound = state.messages.inbound || [];
            const allEscalations = state.messages.escalations || [];
            const openEscalations = allEscalations.filter(e => e.status === 'open' || e.status === 'triaged');
            const openCount = stats.open_escalations ?? openEscalations.length;
            
            return `
                <div class="fade-in-up">
                    <div class="page-hero page-hero-compact">
                        <div class="page-hero-content">
                            <span class="page-hero-badge"><i class="fas fa-envelope-open-text"></i> Message Center</span>
                            <h1><i class="fas fa-comments"></i> Patient Communications</h1>
                            <p class="page-hero-sub">SMS, WhatsApp, AI replies, and escalation requests for the HPV program.</p>
                        </div>
                    </div>

                    <div class="stats-grid-mini">
                        <div class="stat-mini-card">
                            <div class="stat-mini-icon">📤</div>
                            <div class="stat-mini-value">${stats.outbound_24h || 0}</div>
                            <div class="stat-mini-label">Outbound (24h)</div>
                        </div>
                        <div class="stat-mini-card warning">
                            <div class="stat-mini-icon">❌</div>
                            <div class="stat-mini-value">${stats.failed_24h || 0}</div>
                            <div class="stat-mini-label">Failed (24h)</div>
                        </div>
                        <div class="stat-mini-card">
                            <div class="stat-mini-icon">📥</div>
                            <div class="stat-mini-value">${stats.inbound_24h || 0}</div>
                            <div class="stat-mini-label">Inbound (24h)</div>
                        </div>
                        <div class="stat-mini-card danger clickable-stat" onclick="window.components.openEscalations()" title="View open escalation details">
                            <div class="stat-mini-icon">⚠️</div>
                            <div class="stat-mini-value">${openCount}</div>
                            <div class="stat-mini-label">${t('open_escalations')}</div>
                            ${openCount > 0 ? '<div class="stat-mini-hint">Click to view</div>' : ''}
                        </div>
                    </div>

                    ${openCount > 0 ? `
                    <div class="alert-banner danger">
                        <i class="fas fa-bell"></i>
                        <div>
                            <strong>${openCount} patient request${openCount === 1 ? '' : 's'} need attention</strong>
                            <p>Review open escalations below — patients may have asked to speak with a health specialist.</p>
                        </div>
                        <button class="btn-secondary btn-sm" onclick="window.components.openEscalations()">View now</button>
                    </div>` : ''}

                    <div class="card escalations-section" id="escalationsSection">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-exclamation-triangle"></i>
                                <span>${t('open_escalations')}</span>
                            </div>
                            <span class="badge ${openCount > 0 ? 'badge-danger' : 'badge-success'}">${openCount} open</span>
                        </div>
                        <div id="escalationsContainer" class="escalations-panel">
                            ${this.renderEscalationsDetail(openEscalations)}
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-paper-plane"></i>
                                <span>Send Custom Message</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <p class="muted">Send a specific message to one patient or broadcast to all active, opted-in patients.</p>
                            <div id="customMsgNote"></div>
                            <div class="form-group">
                                <label class="form-label">Recipients</label>
                                <select id="cmTarget" class="form-select">
                                    <option value="one">A specific patient</option>
                                    <option value="broadcast">All active, opted-in patients</option>
                                </select>
                            </div>
                            <div class="form-group" id="cmPatientGroup">
                                <label class="form-label">Patient</label>
                                <select id="cmPatient" class="form-select">
                                    <option value="">Select patient...</option>
                                    ${(state.patients || []).map(p => `<option value="${p.id}">${escapeHtml(p.full_name || '')} (#${p.id})</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Message</label>
                                <textarea id="cmText" class="form-textarea" rows="3" placeholder="Type the message to send..."></textarea>
                            </div>
                            <button class="btn-primary" id="cmSendBtn"><i class="fas fa-paper-plane"></i> Send Message</button>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-paper-plane"></i>
                                <span>Recent Outbound Messages</span>
                            </div>
                            <span class="badge badge-info">${outbound.length} total</span>
                        </div>
                        <div class="table-wrapper">
                            <table class="messages-table">
                                <thead>
                                    <tr>
                                        <th style="width: 140px;">Time</th>
                                        <th style="width: 150px;">Patient</th>
                                        <th style="width: 80px;">Channel</th>
                                        <th style="width: 100px;">Type</th>
                                        <th style="width: 80px;">Status</th>
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${outbound.length === 0 ? `
                                        <tr><td colspan="6" class="empty-state">No outbound messages</td></tr>
                                    ` : outbound.map(msg => `
                                        <tr>
                                            <td><div class="message-time">${formatMessageTime(msg.created_at)}</div></td>
                                            <td><div class="patient-cell">${escapeHtml(msg.full_name || 'Unknown')}</div></td>
                                            <td><span class="channel-badge ${msg.channel === 'whatsapp' ? 'whatsapp' : 'sms'}">
                                                <i class="fab ${msg.channel === 'whatsapp' ? 'fa-whatsapp' : 'fa-sms'}"></i> ${msg.channel}
                                            </span></td>
                                            <td><span class="message-type">${escapeHtml(formatMessageType(msg.message_type))}</span></td>
                                            <td><span class="status-badge ${msg.status}">
                                                <i class="fas ${msg.status === 'sent' ? 'fa-check-circle' : msg.status === 'failed' ? 'fa-exclamation-circle' : 'fa-clock'}"></i>
                                                ${msg.status}
                                            </span></td>
                                            <td class="message-content">
                                                <div class="message-preview">${escapeHtml(msg.body || '-')}</div>
                                                ${msg.error_detail ? `<div class="message-error"><i class="fas fa-exclamation-triangle"></i> ${escapeHtml(msg.error_detail)}</div>` : ''}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-inbox"></i>
                                <span>Recent Inbound Messages</span>
                            </div>
                            <span class="badge badge-info">${inbound.length} total</span>
                        </div>
                        <div class="table-wrapper">
                            <table class="messages-table">
                                <thead>
                                    <tr>
                                        <th style="width: 140px;">Time</th>
                                        <th style="width: 150px;">Patient</th>
                                        <th style="width: 80px;">Channel</th>
                                        <th style="width: 130px;">From</th>
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${inbound.length === 0 ? `
                                        <tr><td colspan="5" class="empty-state">No inbound messages</td></tr>
                                    ` : inbound.map(msg => `
                                        <tr>
                                            <td><div class="message-time">${formatMessageTime(msg.received_at)}</div></td>
                                            <td><div class="patient-cell">${escapeHtml(msg.full_name || 'Unknown')}</div></td>
                                            <td><span class="channel-badge ${msg.channel === 'whatsapp' ? 'whatsapp' : 'sms'}">
                                                <i class="fab ${msg.channel === 'whatsapp' ? 'fa-whatsapp' : 'fa-sms'}"></i> ${msg.channel}
                                            </span></td>
                                            <td><div class="from-number">${escapeHtml(msg.from_address || '-')}</div></td>
                                            <td class="message-content inbound-message">
                                                <div class="message-bubble">
                                                    <i class="fas fa-quote-left"></i>
                                                    ${escapeHtml(msg.body || '-')}
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        },

        renderEscalationsDetail(escalations) {
            if (!escalations || escalations.length === 0) {
                return `
                    <div class="empty-state">
                        <div class="empty-icon">✅</div>
                        <div class="empty-title">No open escalations</div>
                        <p style="color: var(--gray-500); margin-bottom: 16px;">All patient requests are being handled</p>
                    </div>
                `;
            }
            
            return `<div class="escalations-grid">
                ${escalations.map((esc) => `
                    <div class="escalation-card" data-esc-id="${esc.id}">
                        <div class="escalation-header">
                            <div class="escalation-patient-info">
                                <div class="escalation-avatar">
                                    ${(esc.full_name || 'Patient').charAt(0).toUpperCase()}
                                </div>
                                <div class="escalation-title-section">
                                    <h4>${escapeHtml(esc.full_name || 'Unknown')}</h4>
                                    <p class="escalation-id">Patient #${esc.patient_id || 'N/A'} · ${esc.phone ? escapeHtml(esc.phone) : 'No phone'}</p>
                                </div>
                            </div>
                            <div class="escalation-urgency ${esc.urgency || 'medium'}">
                                ${esc.urgency ? esc.urgency.toUpperCase() : 'MEDIUM'}
                            </div>
                        </div>
                        
                        <div class="escalation-body">
                            <div class="escalation-reason">
                                <strong>Reason</strong>
                                <p>${escapeHtml(esc.reason || 'General escalation')}</p>
                            </div>
                            ${esc.doctor_call_requested_at ? `
                            <div class="escalation-doctor-call">
                                <span class="badge badge-warning"><i class="fas fa-user-md"></i> Health specialist requested</span>
                                <p class="muted">Requested: ${formatDate(esc.doctor_call_requested_at, 'full')} ${formatTime(esc.doctor_call_requested_at)}</p>
                            </div>` : ''}
                            
                            <div class="escalation-meta">
                                <div class="meta-item">
                                    <i class="fas fa-clock"></i>
                                    <div>
                                        <span>Escalated</span>
                                        <p>${formatMessageTime(esc.created_at)}</p>
                                    </div>
                                </div>
                                <div class="meta-item">
                                    <i class="fas fa-${esc.channel === 'whatsapp' ? 'comment' : 'sms'}"></i>
                                    <div>
                                        <span>Channel</span>
                                        <p>${esc.channel ? esc.channel.toUpperCase() : 'SMS'}</p>
                                    </div>
                                </div>
                                <div class="meta-item">
                                    <i class="fas ${esc.status === 'open' ? 'fa-exclamation-circle' : 'fa-hourglass-half'}"></i>
                                    <div>
                                        <span>Status</span>
                                        <p class="status-${esc.status}">${esc.status ? esc.status.toUpperCase() : 'OPEN'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="escalation-footer">
                            <button class="btn-secondary btn-sm" onclick="event.stopPropagation(); window.components.viewPatient(${esc.patient_id || 0})">
                                <i class="fas fa-user"></i> Patient
                            </button>
                            <button class="btn-primary btn-sm" onclick="event.stopPropagation(); window.components.toggleEscalationDetails(${esc.id})">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>`;
        },

        renderEscalationDetailsModal(escalation) {
            return `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Escalation Details</h2>
                        <button class="close-btn" onclick="window.components.closeEscalationModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="escalation-details">
                        <div class="detail-section">
                            <h3>Patient Information</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span class="label">Full Name</span>
                                    <span class="value">${escapeHtml(escalation.full_name || 'N/A')}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Patient ID</span>
                                    <span class="value">${escalation.patient_id || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Phone</span>
                                    <span class="value">${escalation.phone || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Contact Channel</span>
                                    <span class="value">${escalation.channel ? escalation.channel.toUpperCase() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Escalation Details</h3>
                            <div class="detail-grid">
                                <div class="detail-item full-width">
                                    <span class="label">Reason for Escalation</span>
                                    <p class="value full-text">${escapeHtml(escalation.reason || 'Not specified')}</p>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Urgency Level</span>
                                    <span class="value urgency-${escalation.urgency}">${escalation.urgency ? escalation.urgency.toUpperCase() : 'MEDIUM'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Current Status</span>
                                    <span class="value status-${escalation.status}">${escalation.status ? escalation.status.toUpperCase() : 'OPEN'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Created At</span>
                                    <span class="value">${formatDate(escalation.created_at, 'full')} ${formatTime(escalation.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        ${escalation.doctor_call_requested_at ? `
                        <div class="detail-section">
                            <h3><i class="fas fa-user-md"></i> Health Specialist Request</h3>
                            <div class="detail-grid">
                                <div class="detail-item full-width">
                                    <span class="label">Patient asked to speak with a health specialist</span>
                                    <p class="value full-text">${escapeHtml(escalation.doctor_call_reason || escalation.reason || 'Direct doctor contact requested')}</p>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Request Status</span>
                                    <span class="value status-${escalation.doctor_call_status || 'pending'}">${(escalation.doctor_call_status || 'pending').toUpperCase()}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Requested At</span>
                                    <span class="value">${formatDate(escalation.doctor_call_requested_at, 'full')} ${formatTime(escalation.doctor_call_requested_at)}</span>
                                </div>
                            </div>
                        </div>` : ''}
                        
                        <div class="detail-actions">
                            <button class="btn-primary" onclick="window.components.viewPatient(${escalation.patient_id || 0})">
                                <i class="fas fa-user"></i> View Patient Record
                            </button>
                            <button class="btn-secondary" onclick="window.components.closeEscalationModal()">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },
        
        async loadCurrentTab() {
            const app = document.getElementById('app');
            if (!app) return;
            
            state.isLoading = true;
            app.innerHTML = this.renderLoading();
            
            try {
                if (state.currentTab === 'dashboard') {
                    const response = await api.get('/api/dashboard.php');
                    state.dashboard = response;
                    app.innerHTML = this.renderDashboard();
                    showNotification(t('ready'), 'ok');
                } 
                else if (state.currentTab === 'patients') {
                    const response = await api.get('/api/patients.php');
                    state.patients = response.items || [];
                    app.innerHTML = this.renderPatients();
                    
                    const searchBtn = document.getElementById('searchBtn');
                    const searchInput = document.getElementById('patientSearch');
                    
                    if (searchBtn && searchInput) {
                        const performSearch = async () => {
                            const query = searchInput.value.trim();
                            const response = await api.get(`/api/patients.php?q=${encodeURIComponent(query)}`);
                            state.patients = response.items || [];
                            const tbody = document.getElementById('patientsTableBody');
                            if (tbody) tbody.innerHTML = this.renderPatientsTable();
                        };
                        
                        searchBtn.onclick = performSearch;
                        searchInput.onkeypress = (e) => {
                            if (e.key === 'Enter') performSearch();
                        };
                    }
                } 
                else if (state.currentTab === 'register') {
                    app.innerHTML = this.renderRegister();
                    const form = document.getElementById('registerForm');
                    if (form) {
                        form.onsubmit = async (e) => {
                            e.preventDefault();
                            state.isRegistering = true;
                            const submitBtn = document.getElementById('submitBtn');
                            
                            const formContainer = form.parentElement;
                            formContainer.insertAdjacentHTML('beforeend', this.renderLoadingOverlay());
                            submitBtn.disabled = true;
                            
                            try {
                                const formData = new FormData(form);
                                const body = Object.fromEntries(formData.entries());
                                body.opt_in = formData.get('opt_in') ? 1 : 0;
                                
                                await new Promise(resolve => setTimeout(resolve, 1500));
                                
                                const result = await api.post('/api/patients.php', body);
                                showNotification(result.message || t('success'), 'ok');
                                form.reset();
                                
                                const overlay = document.querySelector('.loading-overlay');
                                if (overlay) overlay.remove();
                                submitBtn.disabled = false;
                                
                                setTimeout(() => this.switchTab('patients'), 1500);
                            } catch (err) {
                                const overlay = document.querySelector('.loading-overlay');
                                if (overlay) overlay.remove();
                                submitBtn.disabled = false;
                                showNotification(err.message, 'error');
                            } finally {
                                state.isRegistering = false;
                            }
                        };
                    }
                } 
                else if (state.currentTab === 'patient') {
                    if (!state.selectedPatientId) {
                        this.switchTab('patients');
                        return;
                    }
                    const response = await api.get(`/api/patients.php?id=${state.selectedPatientId}`);
                    state.patientDetail = response.patient;
                    app.innerHTML = this.renderPatientDetail();
                }
                else if (state.currentTab === 'appointments') {
                    try {
                        const pr = await api.get('/api/patients.php');
                        state.patients = pr.items || [];
                    } catch (e) { /* optional */ }
                    app.innerHTML = this.renderAppointmentsPage();
                    
                    (async () => {
                        try {
                            const response = await api.get('/api/appointments.php');
                            state.appointments = response.items || [];
                            const content = document.getElementById('appointmentsContent');
                            if (content) content.innerHTML = this.renderAppointmentsDetailList(state.appointments);
                            
                            const filter = document.getElementById('appointmentFilter');
                            if (filter) {
                                filter.onchange = () => {
                                    let filtered = state.appointments;
                                    const today = new Date().toISOString().split('T')[0];
                                    
                                    if (filter.value === 'today') {
                                        filtered = state.appointments.filter(apt => 
                                            (apt.scheduled_start?.split('T')[0] || apt.scheduled_start?.split(' ')[0]) === today
                                        );
                                    } else if (filter.value === 'upcoming') {
                                        filtered = state.appointments.filter(apt => 
                                            (apt.scheduled_start?.split('T')[0] || apt.scheduled_start?.split(' ')[0]) >= today
                                        );
                                    } else if (filter.value === 'past') {
                                        filtered = state.appointments.filter(apt => 
                                            (apt.scheduled_start?.split('T')[0] || apt.scheduled_start?.split(' ')[0]) < today
                                        );
                                    }
                                    
                                    content.innerHTML = this.renderAppointmentsDetailList(filtered);
                                };
                            }
                        } catch (err) {
                            const content = document.getElementById('appointmentsContent');
                            if (content) content.innerHTML = this.renderConnectionError(err);
                        }
                    })();

                    const apptForm = document.getElementById('appointmentForm');
                    if (apptForm) {
                        if (state.selectedPatientId) {
                            const sel = document.getElementById('apptPatientSelect');
                            if (sel) sel.value = String(state.selectedPatientId);
                        }
                        apptForm.onsubmit = async (e) => {
                            e.preventDefault();
                            const fd = new FormData(apptForm);
                            const body = Object.fromEntries(fd.entries());
                            body.action = 'add';
                            try {
                                await api.post('/api/appointments.php', body);
                                showNotification(t('success'), 'ok');
                                apptForm.reset();
                                const response = await api.get('/api/appointments.php');
                                state.appointments = response.items || [];
                                const content = document.getElementById('appointmentsContent');
                                if (content) content.innerHTML = this.renderAppointmentsDetailList(state.appointments);
                            } catch (err) {
                                showNotification(err.message, 'error');
                            }
                        };
                    }
                } 
                else if (state.currentTab === 'messages') {
                    const response = await api.get('/api/message_center.php');
                    state.messages = response;
                    try {
                        const pr = await api.get('/api/patients.php');
                        state.patients = pr.items || [];
                    } catch (e) { /* patient picker is optional */ }
                    app.innerHTML = this.renderMessages();
                    this.setupCustomMessageForm();
                    
                    setTimeout(() => {
                        this.bindEscalationCards();
                        if (state._scrollToEscalations || state._pendingEscalationOpen) {
                            state._scrollToEscalations = false;
                            state._pendingEscalationOpen = false;
                            this.presentEscalations();
                        }
                    }, 150);
                }
                
                showNotification(t('ready'), 'ok');
            } catch (error) {
                console.error('Error loading tab:', error);
                app.innerHTML = this.renderConnectionError(error);
                showNotification(`${t('error')}: ${error.message}`, 'error');
            } finally {
                state.isLoading = false;
            }
        },

        setupCustomMessageForm() {
            const target = document.getElementById('cmTarget');
            const patientGroup = document.getElementById('cmPatientGroup');
            const sendBtn = document.getElementById('cmSendBtn');
            const note = document.getElementById('customMsgNote');
            if (!target || !sendBtn) return;

            const syncPicker = () => {
                patientGroup.style.display = target.value === 'broadcast' ? 'none' : '';
            };
            target.onchange = syncPicker;
            syncPicker();

            sendBtn.onclick = async () => {
                const text = (document.getElementById('cmText').value || '').trim();
                const targetVal = target.value;
                const patientId = Number(document.getElementById('cmPatient').value || 0);
                if (!text) {
                    note.innerHTML = `<div class="message-error">Message text is required.</div>`;
                    return;
                }
                if (targetVal !== 'broadcast' && !patientId) {
                    note.innerHTML = `<div class="message-error">Select a patient to message.</div>`;
                    return;
                }
                sendBtn.disabled = true;
                note.innerHTML = `<div class="muted">Sending...</div>`;
                try {
                    const res = await api.post('/api/message_center.php', {
                        action: 'send_custom',
                        target: targetVal,
                        patient_id: patientId,
                        message_text: text
                    });
                    showNotification(`Message sent to ${res.sent} patient(s)`, 'ok');
                    this.loadCurrentTab();
                } catch (err) {
                    sendBtn.disabled = false;
                    note.innerHTML = `<div class="message-error">${escapeHtml(err.message)}</div>`;
                    showNotification(err.message, 'error');
                }
            };
        },

        openEscalations() {
            if (state.currentTab === 'messages' && state.messages && !state.isLoading) {
                this.presentEscalations();
                return;
            }
            state._pendingEscalationOpen = true;
            state._scrollToEscalations = true;
            if (state.currentTab !== 'messages') {
                this.switchTab('messages');
            } else {
                this.loadCurrentTab();
            }
        },

        scrollToEscalations() {
            const tryScroll = (attempts) => {
                const section = document.getElementById('escalationsSection');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    section.classList.add('highlight-pulse');
                    setTimeout(() => section.classList.remove('highlight-pulse'), 1200);
                    return;
                }
                if (attempts > 0) setTimeout(() => tryScroll(attempts - 1), 200);
            };
            tryScroll(15);
        },

        toggleEscalationDetails(escId) {
            const modal = document.getElementById('escalationDetailsModal');
            const escalations = state.messages?.escalations || [];
            const escalation = escalations.find(e => Number(e.id) === Number(escId));
            if (!modal) return;
            if (!escalation) {
                showNotification('Escalation not found — try refreshing', 'error');
                return;
            }
            modal.innerHTML = this.renderEscalationDetailsModal(escalation);
            modal.classList.remove('hidden');
            modal.onclick = (e) => {
                if (e.target === modal) this.closeEscalationModal();
            };
        },

        viewAppointmentDetails(id) {
            const apt = (state.appointments || []).find(a => Number(a.id) === Number(id));
            if (!apt) {
                showNotification('Appointment not found', 'error');
                return;
            }
            const lines = [
                `Patient: ${apt.full_name || apt.patient_id}`,
                `Date: ${formatDate(apt.scheduled_start, 'full')} ${formatTime(apt.scheduled_start)}`,
                apt.department ? `Department: ${apt.department}` : '',
                apt.provider_name ? `Provider: ${apt.provider_name}` : '',
                apt.location ? `Location: ${apt.location}` : '',
                apt.reason ? `Reason: ${apt.reason}` : '',
                `Status: ${apt.status || 'pending'}`
            ].filter(Boolean).join('\n');
            alert(lines);
        }
    };
    
    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        const root = document.getElementById('app-root');
        if (!root) return;
        
        root.innerHTML = `
            <header class="top-nav">
                <div class="nav-container">
                    <div class="nav-content">
                        <div class="logo" onclick="window.components.switchTab('dashboard')">
                            <div class="logo-icon">🏥</div>
                            <div>
                                <div class="logo-text">${cfg.APP_NAME || 'Nyeri Level 4 Hospital'}</div>
                                <div class="logo-subtitle">HPV Patient Engagement Console</div>
                            </div>
                        </div>
                        <div class="nav-menu"></div>
                        <div class="header-actions">
                            <button class="lang-toggle" id="langToggle">
                                <i class="fas fa-globe"></i>
                                <span>${currentLanguage === 'en' ? 'EN' : 'SW'}</span>
                            </button>
                            <div class="user-avatar" title="System Administrator">👨‍⚕️</div>
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
            
            <div id="escalationDetailsModal" class="modal hidden"></div>
            
            <footer class="footer">
                <p>© 2026 ${cfg.APP_NAME || 'Nyeri Level 4 Hospital'} | HPV Patient Engagement v2.3 | Connected to ${API_BASE_URL}</p>
            </footer>
        `;
        
        window.components = components;
        window.components.switchTab = (tab) => {
            state.currentTab = tab;
            if (tab === 'messages' && state._pendingEscalationOpen) {
                state._scrollToEscalations = true;
            }
            components.renderNav();
            components.loadCurrentTab();
        };
        window.components.openEscalations = () => components.openEscalations();
        window.components.scrollToEscalations = () => components.scrollToEscalations();
        window.components.toggleEscalationDetails = (id) => components.toggleEscalationDetails(id);
        window.components.closeEscalationModal = () => components.closeEscalationModal();
        window.components.presentEscalations = () => components.presentEscalations();
        
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.onclick = () => {
                currentLanguage = currentLanguage === 'en' ? 'sw' : 'en';
                localStorage.setItem('language', currentLanguage);
                langToggle.querySelector('span').textContent = currentLanguage.toUpperCase();
                components.renderNav();
                components.loadCurrentTab();
                showNotification(`Language changed to ${currentLanguage === 'en' ? 'English' : 'Kiswahili'}`, 'ok');
            };
        }
        
        components.renderNav();
        components.loadCurrentTab();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
