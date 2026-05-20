// ============================================
// NYERI LEVEL 4 HOSPITAL
// Complete Healthcare Management System
// Version: 2.0.0
// ============================================

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURATION
    // ============================================
    const cfg = window.PHV_CONFIG || {};
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
            select_channel: "Njia ya Mawasiliano"
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
            this.renderNav();
            this.loadCurrentTab();
        },
        
        renderLoading() {
            return `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>${t('loading')}</p>
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
                        <i class="fas fa-sync-alt"></i> ${t('retry_connection') || 'Retry Connection'}
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
                    <div class="stats-grid">
                        <div class="stat-card" onclick="window.components.switchTab('patients')">
                            <div class="stat-icon">👥</div>
                            <div class="stat-value">${stats.patients?.toLocaleString() || 0}</div>
                            <div class="stat-label">${t('total_patients')}</div>
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
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-calendar-check"></i>
                                <span>${t('upcoming_appts')}</span>
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
                                <div class="appointment-item">
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
                        <div class="patient-card" onclick="window.open('${API_BASE_URL}/patient_view.php?id=${patient.id}', '_blank')">
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
                <div class="card fade-in-up">
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
                <tr>
                    <td><strong>#${patient.id}</strong></td>
                    <td>${escapeHtml(patient.full_name)}</td>
                    <td>${patient.phone || '-'}</td>
                    <td><span class="badge badge-info">${patient.preferred_language === 'sw' ? '🇹🇿 Kiswahili' : '🇬🇧 English'}</span></td>
                    <td><span class="badge badge-secondary">${patient.primary_channel || 'sms'}</span></td>
                    <td><span class="badge ${patient.status === 'active' ? 'badge-success' : 'badge-danger'}">${patient.status || 'active'}</span></td>
                    <td><a href="${API_BASE_URL}/patient_view.php?id=${patient.id}" class="btn-secondary" style="padding: 4px 12px; text-decoration: none; font-size: 0.7rem;" target="_blank">
                        View <i class="fas fa-external-link-alt"></i>
                    </a></td>
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
                            <button type="submit" class="btn-primary">
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
            const escalations = state.messages.escalations || [];
            
            return `
                <div class="fade-in-up">
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
                        <div class="stat-mini-card danger">
                            <div class="stat-mini-icon">⚠️</div>
                            <div class="stat-mini-value">${stats.open_escalations || 0}</div>
                            <div class="stat-mini-label">Open Escalations</div>
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
                                            <td><span class="message-type">${escapeHtml(msg.message_type || 'general')}</span></td>
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
                    
                    ${escalations.length > 0 ? `
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-exclamation-triangle"></i>
                                <span>Active Escalations</span>
                            </div>
                            <span class="badge badge-danger">${escalations.length} open</span>
                        </div>
                        <div class="table-wrapper">
                            <table class="messages-table">
                                <thead>
                                    <tr>
                                        <th style="width: 140px;">Time</th>
                                        <th style="width: 150px;">Patient</th>
                                        <th style="width: 100px;">Status</th>
                                        <th style="width: 100px;">Urgency</th>
                                        <th>Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${escalations.map(esc => `
                                        <tr>
                                            <td><div class="message-time">${formatMessageTime(esc.created_at)}</div></td>
                                            <td>${escapeHtml(esc.full_name)}</td>
                                            <td><span class="status-badge ${esc.status}">${esc.status}</span></td>
                                            <td><span class="urgency-badge ${esc.urgency}">${esc.urgency}</span></td>
                                            <td class="message-content">${escapeHtml(esc.reason)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    ` : ''}
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
                            const formData = new FormData(form);
                            const body = Object.fromEntries(formData.entries());
                            body.opt_in = formData.get('opt_in') ? 1 : 0;
                            
                            try {
                                const result = await api.post('/api/patients.php', body);
                                showNotification(result.message || 'Patient registered successfully!', 'ok');
                                form.reset();
                                setTimeout(() => this.switchTab('patients'), 1500);
                            } catch (err) {
                                showNotification(err.message, 'error');
                            }
                        };
                    }
                } 
                else if (state.currentTab === 'appointments') {
                    app.innerHTML = this.renderAppointments();
                    
                    const appointmentForm = document.getElementById('appointmentForm');
                    if (appointmentForm) {
                        appointmentForm.onsubmit = async (e) => {
                            e.preventDefault();
                            const formData = new FormData(appointmentForm);
                            const body = Object.fromEntries(formData.entries());
                            body.action = 'add';
                            
                            try {
                                const result = await api.post('/api/appointments.php', body);
                                showNotification(result.message || 'Appointment scheduled!', 'ok');
                                appointmentForm.reset();
                            } catch (err) {
                                showNotification(err.message, 'error');
                            }
                        };
                    }
                    
                    const rescheduleForm = document.getElementById('rescheduleForm');
                    if (rescheduleForm) {
                        rescheduleForm.onsubmit = async (e) => {
                            e.preventDefault();
                            const formData = new FormData(rescheduleForm);
                            const body = Object.fromEntries(formData.entries());
                            body.action = 'reschedule';
                            
                            try {
                                const result = await api.post('/api/appointments.php', body);
                                showNotification(result.message || 'Appointment rescheduled!', 'ok');
                                rescheduleForm.reset();
                            } catch (err) {
                                showNotification(err.message, 'error');
                            }
                        };
                    }
                } 
                else if (state.currentTab === 'messages') {
                    const response = await api.get('/api/message_center.php');
                    state.messages = response;
                    app.innerHTML = this.renderMessages();
                }
                
                showNotification(t('ready'), 'ok');
            } catch (error) {
                console.error('Error loading tab:', error);
                app.innerHTML = this.renderConnectionError(error);
                showNotification(`${t('error')}: ${error.message}`, 'error');
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
            <header class="top-nav">
                <div class="nav-container">
                    <div class="nav-content">
                        <div class="logo" onclick="window.components.switchTab('dashboard')">
                            <div class="logo-icon">🏥</div>
                            <div>
                                <div class="logo-text">Nyeri Level 4 Hospital</div>
                                <div class="logo-subtitle">Smart Healthcare System</div>
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
            
            <footer class="footer">
                <p>© 2024 Nyeri Level 4 Hospital | Enterprise Healthcare System v2.0 | Connected to ${API_BASE_URL}</p>
            </footer>
        `;
        
        window.components = components;
        window.components.switchTab = (tab) => {
            state.currentTab = tab;
            components.renderNav();
            components.loadCurrentTab();
        };
        
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
