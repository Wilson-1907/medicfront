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
            phone_local_hint: "Enter 9 digits (e.g. 712345678)",
            select_language: "Preferred Language",
            select_channel: "Contact Channel",
            registering: "Processing registration...",
            processing: "Processing",
            view_record: "View Record",
            appt_with: "Appointment with",
            appt_on: "on",
            admin_danger_zone: "Administrator",
            wipe_all_data: "Erase all database data",
            wipe_all_hint: "Deletes every row in all tables. Schema stays. Cannot be undone.",
            wipe_password_prompt: "Enter administrator password:",
            wipe_password_confirm_label: "Re-enter administrator password to confirm:",
            wipe_modal_title: "Erase all database data",
            wipe_modal_step1: "Enter the admin password to continue.",
            wipe_modal_step2: "Enter the same password again to confirm permanent deletion.",
            wipe_password_mismatch: "Passwords do not match.",
            wipe_confirm_btn: "Confirm erase",
            wipe_continue: "Continue",
            wipe_back: "Back",
            wipe_confirm: "This will permanently delete ALL patients, appointments, messages, and escalations. Continue?",
            wipe_success: "Database cleared successfully.",
            wipe_wrong_password: "Wrong administrator password.",
        wipe_not_configured: "Server wipe password is not set. Ask your admin to set WIPE_DATA_PASSWORD on Render (default: Adminpass).",
        wipe_failed: "Erase failed on the server. Try again or check Render logs.",
            wiping: "Erasing all data...",
            hpv_result_title: "HPV screening result",
            hpv_result_hint: "Record the lab result, then confirm to notify the patient and start guidance.",
            hpv_status: "Status",
            hpv_record_positive: "Record POSITIVE",
            hpv_record_negative: "Record NEGATIVE",
            hpv_confirm_notify: "Confirm & notify patient",
            hpv_confirmed: "Sent to patient",
            hpv_awaiting: "Awaiting confirm",
            hpv_pending: "PENDING",
            hpv_positive: "HPV positive",
            hpv_negative: "HPV negative",
            hpv_confirmed_on_positive: "This patient was confirmed on {date} as HPV positive. Result and guidance were sent by SMS.",
            hpv_confirmed_on_negative: "This patient was confirmed on {date} as HPV negative. Result and guidance were sent by SMS.",
            hpv_recorded_on: "Lab result recorded on {date} as {result}. Confirm below to notify the patient.",
            hpv_step_record: "Step 1 — Record lab result",
            hpv_step_confirm: "Step 2 — Confirm & notify patient",
            hpv_confirm_hint: "Confirmation sends the result to the patient and starts gentle follow-up messages over time.",
            hpv_confirm_need_result: "Record positive or negative above before you can confirm.",
            hpv_confirm_dialog: "Confirm this patient as HPV {result} and send the result plus follow-up guidance by SMS?",
            hpv_unavailable: "HPV result recording could not be enabled on the server. Please try again later or contact support.",
            mark_patient_called: "Mark as called",
            mark_patient_called_confirm: "Confirm you have spoken with this patient on the phone? This removes the request from open escalations.",
            patient_called_success: "Marked as called. Open escalation cleared.",
            status_called: "Called",
            specialist_called_on: "Hospital confirmed they called this patient on {date}.",
            specialist_request_open: "Patient requested a call from a health specialist."
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
            phone_local_hint: "Weka tarakimu 9 (mf. 712345678)",
            select_language: "Lugha Unayopendelea",
            select_channel: "Njia ya Mawasiliano",
            registering: "Inaprosesa usajili...",
            processing: "Inaprosesa",
            view_record: "Angalia Rekodi",
            appt_with: "Miadi na",
            appt_on: "tarehe",
            admin_danger_zone: "Msimamizi",
            wipe_all_data: "Futa data yote kwenye hifadhidata",
            wipe_all_hint: "Hufuta kila rekodi kwenye jedwali zote. Muundo wa jedwali hubaki. Haiwezi kutenduliwa.",
            wipe_password_prompt: "Weka nenosiri la msimamizi:",
            wipe_password_confirm_label: "Weka tena nenosiri la msimamizi kuthibitisha:",
            wipe_modal_title: "Futa data yote kwenye hifadhidata",
            wipe_modal_step1: "Weka nenosiri la msimamizi ili kuendelea.",
            wipe_modal_step2: "Weka tena nenosiri lile lile kuthibitisha kufuta kabisa.",
            wipe_password_mismatch: "Nenosiri halilingani.",
            wipe_confirm_btn: "Thibitisha kufuta",
            wipe_continue: "Endelea",
            wipe_back: "Rudi",
            wipe_confirm: "Hii itafuta kabisa wagonjwa, miadi, ujumbe, na escalations zote. Endelea?",
            wipe_success: "Hifadhidata imefutwa kikamilifu.",
            wipe_wrong_password: "Nenosiri la msimamizi si sahihi.",
            wipe_not_configured: "Nenosiri la kufuta halijawekwa kwenye seva. Weka WIPE_DATA_PASSWORD kwenye Render (chaguo-msingi: Adminpass).",
            wipe_failed: "Kufuta kumeshindwa kwenye seva. Jaribu tena au angalia logi za Render.",
            wiping: "Inafuta data yote...",
            hpv_result_title: "Matokeo ya uchunguzi wa HPV",
            hpv_result_hint: "Weka matokeo ya maabara, kisha thibitisha kumjulisha mgonjwa na kuanza mwongozo.",
            hpv_status: "Hali",
            hpv_record_positive: "Weka CHANYA",
            hpv_record_negative: "Weka HASI",
            hpv_confirm_notify: "Thibitisha & mjulishe mgonjwa",
            hpv_confirmed: "Imetumwa kwa mgonjwa",
            hpv_awaiting: "Inasubiri uthibitisho",
            hpv_pending: "INASUBIRI",
            hpv_positive: "HPV chanya",
            hpv_negative: "HPV hasi",
            hpv_confirmed_on_positive: "Mgonjwa alithibitishwa {date} kuwa na HPV chanya. Matokeo na mwongozo yametumwa kwa SMS.",
            hpv_confirmed_on_negative: "Mgonjwa alithibitishwa {date} kuwa na HPV hasi. Matokeo na mwongozo yametumwa kwa SMS.",
            hpv_recorded_on: "Matokeo ya maabara yamewekwa {date} kama {result}. Thibitisha hapa chini kumjulisha mgonjwa.",
            hpv_step_record: "Hatua 1 — Weka matokeo ya maabara",
            hpv_step_confirm: "Hatua 2 — Thibitisha & mjulishe mgonjwa",
            hpv_confirm_hint: "Uthibitisho hutuma matokeo kwa mgonjwa na kuanza ujumbe wa mwongozo polepole.",
            hpv_confirm_need_result: "Weka chanya au hasi hapo juu kabla ya kuthibitisha.",
            hpv_confirm_dialog: "Thibitisha mgonjwa huyu kama HPV {result} na kutuma matokeo pamoja na mwongozo kwa SMS?",
            hpv_unavailable: "Kuweka matokeo ya HPV hakupatikani kwenye seva. Jaribu tena baadaye au wasiliana na msaada.",
            mark_patient_called: "Weka alipigiwa simu",
            mark_patient_called_confirm: "Thibitisha umemzungumzia mgonjwa huyu kwa simu? Ombi litaondolewa kwenye escalations wazi.",
            patient_called_success: "Imewekwa alipigiwa simu. Escalation imefungwa.",
            status_called: "Amepigiwa simu",
            specialist_called_on: "Hospitali imethibitisha kumpigia mgonjwa simu {date}.",
            specialist_request_open: "Mgonjwa ameomba kuzungumza na mhudumu wa afya."
        }
    };

    function isOpenEscalationStatus(status) {
        const s = (status || '').toLowerCase();
        return s === 'open' || s === 'triaged';
    }

    function isSpecialistCallPending(dcr) {
        if (!dcr) return false;
        const s = (dcr.status || '').toLowerCase();
        return s === 'pending' || s === 'awaiting_reason';
    }

    function doctorCallReasonFromRecord(dcr) {
        if (!dcr) return '';
        const raw = String(dcr.reason || '').trim();
        if (!raw || isGenericDoctorReason(raw)) return '';
        return raw.replace(/^Patient wants to speak with a health specialist:\s*/i, '').trim();
    }

    function hpvResultLabel(result) {
        const r = (result || '').toLowerCase();
        if (r === 'positive') return t('hpv_positive');
        if (r === 'negative') return t('hpv_negative');
        return t('hpv_pending');
    }

    function hpvFormatConfirmedDate(iso) {
        if (!iso) return '';
        return `${formatDate(iso, 'full')} ${formatTime(iso)}`.trim();
    }
    
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
        if (type === 'engagement_boost') return 'Health Tip';
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

    function isGenericDoctorReason(text) {
        if (!text) return true;
        const s = String(text).trim();
        return /^Patient requested direct provider contact via /i.test(s)
            || s === '__AWAITING_PATIENT_REASON__'
            || /^Health specialist requested — waiting/i.test(s);
    }

    function getPatientCallReason(esc) {
        if (esc.patient_stated_reason) {
            return String(esc.patient_stated_reason).trim();
        }
        const dcr = String(esc.doctor_call_reason || '').trim();
        const main = String(esc.reason || '').trim();
        const fromDcr = dcr.replace(/^Patient wants to speak with a health specialist:\s*/i, '').trim();
        if (fromDcr && !isGenericDoctorReason(fromDcr)) return fromDcr;
        const fromMain = main.replace(/^Patient wants to speak with a health specialist:\s*/i, '').trim();
        if (fromMain && !isGenericDoctorReason(fromMain)) return fromMain;
        const inbound = String(esc.last_inbound_body || '').trim();
        if (inbound && !/^(DOCTOR|DAKTARI|5)$/i.test(inbound)) return inbound;
        return null;
    }

    function getCallReasonDisplay(esc) {
        if (esc.awaiting_doctor_reason) {
            return {
                text: 'We asked the patient by SMS to reply with why they want to speak with a health specialist. Waiting for their message.',
                waiting: true
            };
        }
        const reason = getPatientCallReason(esc);
        if (reason) {
            return { text: reason, waiting: false };
        }
        if (esc.doctor_call_requested_at || /health specialist/i.test(esc.reason || '')) {
            return {
                text: 'Patient asked to speak with a health specialist. They were sent a message asking why — no detailed reply yet.',
                waiting: true
            };
        }
        return { text: esc.reason || 'Not specified', waiting: false };
    }

    function formatPhoneLink(phone) {
        if (!phone) return '<span class="muted">No phone on file</span>';
        const safe = escapeHtml(phone);
        const tel = String(phone).replace(/[^\d+]/g, '');
        return `<a href="tel:${tel}" class="phone-link">${safe}</a>`;
    }
    
    function normalizeKenyaPhone(local) {
        let d = String(local || '').replace(/\D/g, '');
        if (d.startsWith('254')) {
            d = d.slice(3);
        }
        if (d.startsWith('0')) {
            d = d.slice(1);
        }
        if (d.length !== 9) {
            return '';
        }
        return '+254' + d;
    }

    function setupPhoneLocalInput(input) {
        if (!input) {
            return;
        }
        input.addEventListener('input', () => {
            let d = input.value.replace(/\D/g, '');
            if (d.startsWith('254')) {
                d = d.slice(3);
            }
            if (d.startsWith('0')) {
                d = d.slice(1);
            }
            input.value = d.slice(0, 9);
        });
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
            const list = state.messages?.escalations || [];
            return list.filter(e => e.status === 'open' || e.status === 'triaged');
        },

        findEscalationById(escId) {
            const id = Number(escId);
            const fromMessages = (state.messages?.escalations || []).find(e => Number(e.id) === id);
            if (fromMessages) return fromMessages;
            return (state._escalationCache || []).find(e => Number(e.id) === id) || null;
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
            if (modal) {
                modal.classList.add('hidden');
                modal.setAttribute('aria-hidden', 'true');
            }
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
                    
                    ${this.renderAdminDangerZone()}
                </div>
            `;
        },
        
        renderAdminDangerZone() {
            return `
                <div class="card admin-danger-zone">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fas fa-user-shield"></i>
                            <span>${t('admin_danger_zone')}</span>
                        </div>
                    </div>
                    <p class="muted admin-danger-hint">${t('wipe_all_hint')}</p>
                    <button type="button" class="btn-danger" onclick="window.components.openWipeDataModal()">
                        <i class="fas fa-trash-alt"></i> ${t('wipe_all_data')}
                    </button>
                </div>
            `;
        },

        openWipeDataModal() {
            state._wipeStep = 1;
            state._wipePassword = '';
            const modal = document.getElementById('wipeDataModal');
            if (!modal) {
                showNotification('Could not open erase dialog — refresh the page', 'error');
                return;
            }
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            modal.innerHTML = this.renderWipeDataModalContent();
            const first = modal.querySelector('#wipePasswordInput');
            if (first) first.focus();
        },

        closeWipeDataModal() {
            state._wipeStep = 1;
            state._wipePassword = '';
            const modal = document.getElementById('wipeDataModal');
            if (modal) {
                modal.classList.add('hidden');
                modal.style.display = '';
                modal.setAttribute('aria-hidden', 'true');
                modal.innerHTML = '';
            }
        },

        renderWipeDataModalContent() {
            const step = state._wipeStep || 1;
            if (step === 1) {
                return `
                    <div class="modal-content wipe-modal-content">
                        <div class="modal-header">
                            <h2><i class="fas fa-exclamation-triangle" style="color:#b91c1c"></i> ${t('wipe_modal_title')}</h2>
                            <button type="button" class="btn-secondary" onclick="window.components.closeWipeDataModal()" aria-label="Close">&times;</button>
                        </div>
                        <div class="wipe-modal-body">
                            <p class="muted">${t('wipe_all_hint')}</p>
                            <p>${t('wipe_modal_step1')}</p>
                            <label class="form-label" for="wipePasswordInput">${t('wipe_password_prompt')}</label>
                            <input type="password" id="wipePasswordInput" class="form-input" autocomplete="off"
                                   placeholder="Administrator password" onkeydown="if(event.key==='Enter')window.components.wipeDataStepContinue()">
                        </div>
                        <div class="wipe-modal-actions">
                            <button type="button" class="btn-secondary" onclick="window.components.closeWipeDataModal()">${t('cancel')}</button>
                            <button type="button" class="btn-primary" onclick="window.components.wipeDataStepContinue()">${t('wipe_continue')}</button>
                        </div>
                    </div>`;
            }
            return `
                <div class="modal-content wipe-modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-trash-alt" style="color:#b91c1c"></i> ${t('wipe_confirm_btn')}</h2>
                        <button type="button" class="btn-secondary" onclick="window.components.closeWipeDataModal()" aria-label="Close">&times;</button>
                    </div>
                    <div class="wipe-modal-body">
                        <p>${t('wipe_modal_step2')}</p>
                        <label class="form-label" for="wipePasswordConfirmInput">${t('wipe_password_confirm_label')}</label>
                        <input type="password" id="wipePasswordConfirmInput" class="form-input" autocomplete="off"
                               placeholder="Administrator password" onkeydown="if(event.key==='Enter')window.components.submitWipeDataErase()">
                        <p id="wipeModalError" class="wipe-modal-error hidden"></p>
                    </div>
                    <div class="wipe-modal-actions">
                        <button type="button" class="btn-secondary" onclick="window.components.wipeDataGoBack()">${t('wipe_back')}</button>
                        <button type="button" class="btn-secondary" onclick="window.components.closeWipeDataModal()">${t('cancel')}</button>
                        <button type="button" class="btn-danger" id="wipeConfirmEraseBtn" onclick="window.components.submitWipeDataErase()">
                            <i class="fas fa-trash-alt"></i> ${t('wipe_confirm_btn')}
                        </button>
                    </div>
                </div>`;
        },

        wipeDataStepContinue() {
            const input = document.getElementById('wipePasswordInput');
            const password = input ? input.value.trim() : '';
            if (!password) {
                showNotification(t('wipe_password_prompt'), 'error');
                return;
            }
            state._wipePassword = password;
            state._wipeStep = 2;
            const modal = document.getElementById('wipeDataModal');
            if (!modal) return;
            modal.innerHTML = this.renderWipeDataModalContent();
            const confirmInput = document.getElementById('wipePasswordConfirmInput');
            if (confirmInput) confirmInput.focus();
        },

        wipeDataGoBack() {
            state._wipeStep = 1;
            const modal = document.getElementById('wipeDataModal');
            if (!modal) return;
            modal.innerHTML = this.renderWipeDataModalContent();
            const first = document.getElementById('wipePasswordInput');
            if (first) {
                first.value = state._wipePassword || '';
                first.focus();
            }
        },

        showWipeModalError(message) {
            const el = document.getElementById('wipeModalError');
            if (!el) return;
            el.textContent = message;
            el.classList.remove('hidden');
        },

        async submitWipeDataErase() {
            const confirmInput = document.getElementById('wipePasswordConfirmInput');
            const confirmPassword = confirmInput ? confirmInput.value.trim() : '';
            const errEl = document.getElementById('wipeModalError');
            if (errEl) errEl.classList.add('hidden');

            if (confirmPassword !== state._wipePassword) {
                this.showWipeModalError(t('wipe_password_mismatch'));
                return;
            }

            const btn = document.getElementById('wipeConfirmEraseBtn');
            if (btn) btn.disabled = true;
            showNotification(t('wiping'), 'info');

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 180000);
                const response = await fetch(`${API_BASE_URL}/api/clear_data.php`, {
                    method: 'POST',
                    signal: controller.signal,
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify({ password: confirmPassword, confirm: true }),
                });
                clearTimeout(timeoutId);
                const data = await response.json().catch(() => ({}));

                if (data.code === 'wipe_not_configured' || response.status === 503) {
                    this.showWipeModalError(data.error || t('wipe_not_configured'));
                    if (btn) btn.disabled = false;
                    return;
                }
                if (response.status === 401 || data.code === 'invalid_password' || data.error === 'Invalid password') {
                    this.showWipeModalError(t('wipe_wrong_password') + ' (default is Adminpass unless changed on Render.)');
                    if (btn) btn.disabled = false;
                    return;
                }
                if (!response.ok || !data.ok) {
                    throw new Error(data.error || `HTTP ${response.status}`);
                }
                this.closeWipeDataModal();
                state.dashboard = null;
                state.patients = null;
                state.appointments = null;
                state.messages = null;
                state.patientDetail = null;
                showNotification(t('wipe_success') + ` (${data.tables_cleared || 0} tables)`, 'ok');
                await this.loadCurrentTab();
            } catch (err) {
                console.error(err);
                const msg = err.name === 'AbortError'
                    ? 'Request timed out — the database may still be clearing. Refresh in a minute.'
                    : (err.message || t('wipe_failed'));
                this.showWipeModalError(msg);
                if (btn) btn.disabled = false;
            }
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

                    ${this.renderHpvResultCard(p)}

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

                    ${this.renderHealthSpecialistCard(p, dcr)}

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

                    ${(() => {
                        const openEsc = escalations.filter(e => isOpenEscalationStatus(e.status));
                        if (openEsc.length === 0) return '';
                        return `
                    <div class="card" style="margin-top:1rem;">
                        <div class="card-header"><div class="card-title"><i class="fas fa-exclamation-triangle"></i> Open escalations</div></div>
                        <div style="padding:16px;">
                            ${openEsc.map(e => `
                                <div style="margin-bottom:12px;padding:12px;background:var(--gray-50);border-radius:8px;">
                                    <strong>${(e.urgency || 'routine').toUpperCase()}</strong>
                                    <div>${escapeHtml(e.reason || '')}</div>
                                    <div class="muted">${formatDate(e.created_at, 'full')}</div>
                                    <button type="button" class="btn-primary btn-sm" style="margin-top:10px"
                                        onclick="window.components.markSpecialistCalled(${p.id}, ${e.id})">
                                        <i class="fas fa-phone"></i> ${t('mark_patient_called')}
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>`;
                    })()}
                </div>
            `;
        },

        renderHealthSpecialistCard(p, dcr) {
            if (!dcr && !(p.escalations || []).some(e => isOpenEscalationStatus(e.status))) {
                return '';
            }
            if (!dcr) {
                return `
                <div class="card specialist-request-card open" style="margin-top:1rem;">
                    <div class="card-header"><div class="card-title"><i class="fas fa-user-md"></i> Health Specialist Request</div></div>
                    <div style="padding:16px;">
                        <p>${t('specialist_request_open')}</p>
                        <button type="button" class="btn-primary" style="margin-top:12px"
                            onclick="window.components.markSpecialistCalled(${p.id}, 0)">
                            <i class="fas fa-phone"></i> ${t('mark_patient_called')}
                        </button>
                    </div>
                </div>`;
            }

            const status = (dcr.status || 'pending').toLowerCase();
            const called = status === 'contacted' || status === 'closed';
            const reason = doctorCallReasonFromRecord(dcr);
            const calledAt = dcr.updated_at || dcr.requested_at;

            if (called) {
                const when = hpvFormatConfirmedDate(calledAt);
                return `
                <div class="card specialist-request-card called" style="margin-top:1rem;">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-user-md"></i> Health Specialist Request</div>
                        <span class="badge badge-success">${t('status_called')}</span>
                    </div>
                    <div style="padding:16px;">
                        <p class="specialist-called-msg">${escapeHtml(t('specialist_called_on').replace('{date}', when))}</p>
                        ${reason ? `<p><strong>They said:</strong> ${escapeHtml(reason)}</p>` : ''}
                    </div>
                </div>`;
            }

            return `
                <div class="card specialist-request-card open" style="margin-top:1rem;">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-user-md"></i> Health Specialist Request</div>
                        <span class="badge badge-warning">${(status || 'pending').toUpperCase()}</span>
                    </div>
                    <div style="padding:16px;">
                        <p class="muted">${t('specialist_request_open')}</p>
                        <p><strong>Requested:</strong> ${formatDate(dcr.requested_at, 'full')} ${formatTime(dcr.requested_at)}</p>
                        <p><strong>Why they want to talk:</strong></p>
                        <p class="call-reason-text">${escapeHtml(
                            reason || 'Waiting for patient to reply by SMS with their reason.'
                        )}</p>
                        <button type="button" class="btn-primary hpv-confirm-btn" style="margin-top:14px"
                            onclick="window.components.markSpecialistCalled(${p.id}, 0)">
                            <i class="fas fa-phone"></i> ${t('mark_patient_called')}
                        </button>
                    </div>
                </div>`;
        },

        renderHpvResultCard(p) {
            if (p.hpv_workflow_enabled === false) {
                return `
                <div class="card hpv-result-card hpv-card-pending" style="margin-top:1rem;">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-vial"></i> ${t('hpv_result_title')}</div>
                    </div>
                    <div class="hpv-result-body">
                        <p class="muted">${t('hpv_unavailable')}</p>
                    </div>
                </div>`;
            }

            const result = (p.hpv_screening_result || 'pending').toLowerCase();
            const recorded = p.hpv_result_recorded_at;
            const confirmed = p.hpv_result_confirmed_at;
            const hasResult = result === 'positive' || result === 'negative';
            const isConfirmed = Boolean(confirmed && hasResult);
            const borderClass = isConfirmed
                ? (result === 'positive' ? 'hpv-card-positive' : 'hpv-card-negative')
                : 'hpv-card-pending';

            if (isConfirmed) {
                const dateStr = hpvFormatConfirmedDate(confirmed);
                const summaryKey = result === 'positive' ? 'hpv_confirmed_on_positive' : 'hpv_confirmed_on_negative';
                const summary = t(summaryKey).replace('{date}', dateStr);
                return `
                <div class="card hpv-result-card ${borderClass}" style="margin-top:1rem;">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-vial"></i> ${t('hpv_result_title')}</div>
                        <span class="badge badge-success"><i class="fas fa-check-circle"></i> ${t('hpv_confirmed')}</span>
                    </div>
                    <div class="hpv-result-body">
                        <div class="hpv-confirmed-banner">
                            <i class="fas fa-check-circle"></i>
                            <p>${escapeHtml(summary)}</p>
                        </div>
                        <p class="hpv-result-badge-line">
                            <span class="badge ${result === 'positive' ? 'badge-warning' : 'badge-success'} hpv-result-badge-lg">
                                ${escapeHtml(hpvResultLabel(result))}
                            </span>
                        </p>
                    </div>
                </div>`;
            }

            const canConfirm = hasResult && !confirmed;
            const recordedLine = hasResult && recorded
                ? t('hpv_recorded_on')
                    .replace('{date}', hpvFormatConfirmedDate(recorded))
                    .replace('{result}', hpvResultLabel(result))
                : '';

            return `
                <div class="card hpv-result-card ${borderClass}" style="margin-top:1rem;">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-vial"></i> ${t('hpv_result_title')}</div>
                        ${hasResult ? `<span class="badge badge-warning">${t('hpv_awaiting')}</span>` : ''}
                    </div>
                    <div class="hpv-result-body">
                        <p class="muted hpv-result-intro">${t('hpv_result_hint')}</p>

                        <div class="hpv-step-block">
                            <h4 class="hpv-step-title">${t('hpv_step_record')}</h4>
                            ${recordedLine ? `<p class="hpv-recorded-note">${escapeHtml(recordedLine)}</p>` : ''}
                            <div class="hpv-record-actions">
                                <button type="button" class="btn-primary ${result === 'positive' ? 'hpv-selected' : ''}"
                                    onclick="window.components.setHpvResult(${p.id}, 'positive')">
                                    <i class="fas fa-plus-circle"></i> ${t('hpv_record_positive')}
                                </button>
                                <button type="button" class="btn-secondary ${result === 'negative' ? 'hpv-selected' : ''}"
                                    onclick="window.components.setHpvResult(${p.id}, 'negative')">
                                    <i class="fas fa-minus-circle"></i> ${t('hpv_record_negative')}
                                </button>
                            </div>
                        </div>

                        <div class="hpv-step-block hpv-step-confirm ${canConfirm ? 'hpv-step-active' : ''}">
                            <h4 class="hpv-step-title">${t('hpv_step_confirm')}</h4>
                            <p class="muted">${t('hpv_confirm_hint')}</p>
                            ${canConfirm ? `
                            <button type="button" class="btn-danger hpv-confirm-btn"
                                onclick="window.components.confirmHpvResult(${p.id}, '${result}')">
                                <i class="fas fa-paper-plane"></i> ${t('hpv_confirm_notify')}
                            </button>` : `
                            <p class="hpv-confirm-disabled muted"><i class="fas fa-info-circle"></i> ${t('hpv_confirm_need_result')}</p>`}
                        </div>
                    </div>
                </div>`;
        },

        async setHpvResult(patientId, result) {
            try {
                const data = await api.post('/api/hpv_result.php', {
                    action: 'set_result',
                    patient_id: patientId,
                    result,
                });
                showNotification(data.message || `Recorded HPV ${result.toUpperCase()}`, 'ok');
                await this.viewPatient(patientId);
            } catch (err) {
                showNotification(err.message, 'error');
            }
        },

        async markSpecialistCalled(patientId, escalationId) {
            if (!window.confirm(t('mark_patient_called_confirm'))) {
                return;
            }
            try {
                const data = await api.post('/api/escalation.php', {
                    action: 'mark_called',
                    patient_id: patientId || 0,
                    escalation_id: escalationId || 0,
                });
                showNotification(data.message || t('patient_called_success'), 'ok');
                this.closeEscalationModal();
                state.messages = null;
                state.dashboard = null;
                if (state.currentTab === 'messages') {
                    await this.loadCurrentTab();
                } else if (state.currentTab === 'patient' && state.selectedPatientId) {
                    await this.viewPatient(state.selectedPatientId);
                } else {
                    await this.loadCurrentTab();
                }
            } catch (err) {
                showNotification(err.message || t('server_error'), 'error');
            }
        },

        async confirmHpvResult(patientId, resultHint) {
            const label = hpvResultLabel(resultHint || '');
            if (!window.confirm(t('hpv_confirm_dialog').replace('{result}', label))) {
                return;
            }
            try {
                const data = await api.post('/api/hpv_result.php', {
                    action: 'confirm_result',
                    patient_id: patientId,
                });
                showNotification(
                    data.counseling_started
                        ? 'Result sent. Follow-up messages will go out gently over the next hours and days (not all at once).'
                        : 'Result sent to patient.',
                    'ok'
                );
                await this.viewPatient(patientId);
            } catch (err) {
                showNotification(err.message, 'error');
            }
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
                                <div class="phone-input-group">
                                    <span class="phone-prefix" aria-hidden="true">+254</span>
                                    <input type="tel" name="phone_local" id="phoneLocal" class="form-input phone-local-input"
                                           required maxlength="9" inputmode="numeric" pattern="[0-9]{9}"
                                           placeholder="712345678" autocomplete="tel-national">
                                </div>
                                <small class="form-hint-muted">${t('phone_local_hint')}</small>
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
                    <div class="card appointments-section appointments-booked-card">
                        <div class="card-header appointments-booked-header">
                            <div class="card-title">
                                <i class="fas fa-calendar-check"></i>
                                <span>${t('booked_appointments')}</span>
                            </div>
                            <div class="appointment-toolbar">
                                <div class="appointment-search-wrap">
                                    <i class="fas fa-search"></i>
                                    <input type="text" id="appointmentSearch" class="appointment-search" placeholder="Search patient, department...">
                                </div>
                                <select id="appointmentFilter" class="form-select appointment-filter-select">
                                    <option value="all">All</option>
                                    <option value="today">Today</option>
                                    <option value="upcoming" selected>Upcoming</option>
                                    <option value="past">Past</option>
                                </select>
                            </div>
                        </div>
                        <div id="appointmentsStats" class="appointments-stats-bar"></div>
                        <div id="appointmentsContent">
                            ${this.renderLoadingAppointments()}
                        </div>
                    </div>

                    <div class="card appointments-section appointments-form-card">
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

        renderAppointmentsStats(appointments) {
            const today = new Date().toISOString().split('T')[0];
            const todayCount = appointments.filter(a => (a.scheduled_start?.split('T')[0] || a.scheduled_start?.split(' ')[0]) === today).length;
            const upcomingCount = appointments.filter(a => (a.scheduled_start?.split('T')[0] || a.scheduled_start?.split(' ')[0]) >= today).length;
            const confirmed = appointments.filter(a => a.status === 'confirmed').length;
            return `
                <div class="appt-stat-pill"><i class="fas fa-list"></i><strong>${appointments.length}</strong> shown</div>
                <div class="appt-stat-pill highlight"><i class="fas fa-sun"></i><strong>${todayCount}</strong> today</div>
                <div class="appt-stat-pill"><i class="fas fa-forward"></i><strong>${upcomingCount}</strong> upcoming</div>
                <div class="appt-stat-pill success"><i class="fas fa-check-circle"></i><strong>${confirmed}</strong> confirmed</div>
            `;
        },

        renderReminderBadges(apt) {
            if (apt.status === 'completed' || apt.status === 'cancelled') return '';
            const badges = [];
            if (apt.reminder_7d_sent_at) badges.push('<span class="reminder-chip sent" title="7-day reminder sent"><i class="fas fa-bell"></i> 7d</span>');
            else badges.push('<span class="reminder-chip pending" title="7-day reminder pending"><i class="far fa-bell"></i> 7d</span>');
            if (apt.reminder_3d_sent_at) badges.push('<span class="reminder-chip sent" title="3-day reminder sent"><i class="fas fa-bell"></i> 3d</span>');
            else badges.push('<span class="reminder-chip pending" title="3-day reminder pending"><i class="far fa-bell"></i> 3d</span>');
            if (apt.reminder_night_sent_at) badges.push('<span class="reminder-chip sent" title="1-day / night-before reminder sent"><i class="fas fa-moon"></i> 1d</span>');
            else badges.push('<span class="reminder-chip pending" title="1-day / night-before reminder pending"><i class="far fa-moon"></i> 1d</span>');
            return `<div class="reminder-chips">${badges.join('')}</div>`;
        },

        renderAppointmentsDetailList(appointments) {
            if (!appointments || appointments.length === 0) {
                return `
                    <div class="empty-state appointments-empty">
                        <div class="empty-icon">📅</div>
                        <div class="empty-title">No appointments in this view</div>
                        <p class="muted">Try another filter or schedule a new visit below.</p>
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
            const today = new Date().toISOString().split('T')[0];

            return `
                <div class="appointments-timeline-view">
                    ${sortedDates.map(date => {
                        const isToday = date === today;
                        const isPast = date < today;
                        return `
                        <section class="appt-day-block ${isToday ? 'is-today' : ''} ${isPast ? 'is-past' : ''}">
                            <div class="appt-day-marker">
                                <div class="appt-day-dot"></div>
                                <div class="appt-day-line"></div>
                            </div>
                            <div class="appt-day-content">
                                <header class="appt-day-header">
                                    <div>
                                        <h3>${formatDate(date, 'full')}</h3>
                                        ${isToday ? '<span class="today-tag">Today</span>' : ''}
                                    </div>
                                    <span class="count-badge">${grouped[date].length} visit${grouped[date].length !== 1 ? 's' : ''}</span>
                                </header>
                                <div class="appointment-cards-grid">
                                    ${grouped[date].map(apt => `
                                        <article class="appointment-card-v2 status-${apt.status || 'proposed'}" onclick="window.components.viewPatient(${apt.patient_id})">
                                            <div class="appt-card-top">
                                                <div class="appointment-patient-avatar">${(apt.full_name || 'P').charAt(0).toUpperCase()}</div>
                                                <div class="appt-card-headline">
                                                    <h4>${escapeHtml(apt.full_name || 'Unknown Patient')}</h4>
                                                    <span class="appt-id">#${apt.patient_id}</span>
                                                </div>
                                                <span class="status-badge ${apt.status || 'proposed'}">${(apt.status || 'proposed').replace('_', ' ')}</span>
                                            </div>
                                            <div class="appt-time-row">
                                                <i class="fas fa-clock"></i>
                                                <strong>${formatTime(apt.scheduled_start)}</strong>
                                                ${apt.scheduled_end ? `<span class="appt-end">→ ${formatTime(apt.scheduled_end)}</span>` : ''}
                                            </div>
                                            <div class="appt-meta-tags">
                                                ${apt.department ? `<span><i class="fas fa-hospital"></i> ${escapeHtml(apt.department)}</span>` : ''}
                                                ${apt.provider_name ? `<span><i class="fas fa-user-md"></i> ${escapeHtml(apt.provider_name)}</span>` : ''}
                                                ${apt.location ? `<span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(apt.location)}</span>` : ''}
                                                ${apt.contact_channel ? `<span class="channel-tag ${apt.contact_channel}"><i class="fab fa-${apt.contact_channel === 'whatsapp' ? 'whatsapp' : 'sms'}"></i> ${apt.contact_channel}</span>` : ''}
                                            </div>
                                            ${apt.reason ? `<p class="appt-reason"><i class="fas fa-notes-medical"></i> ${escapeHtml(apt.reason)}</p>` : ''}
                                            ${this.renderReminderBadges(apt)}
                                            <div class="appt-card-actions" onclick="event.stopPropagation()">
                                                <button class="btn-secondary btn-sm" onclick="window.components.viewPatient(${apt.patient_id})"><i class="fas fa-user"></i> Patient</button>
                                                <button class="btn-primary btn-sm" onclick="window.components.viewAppointmentDetails(${apt.id})"><i class="fas fa-info-circle"></i> Details</button>
                                            </div>
                                        </article>
                                    `).join('')}
                                </div>
                            </div>
                        </section>`;
                    }).join('')}
                </div>
            `;
        },
        
        filterAppointmentsList() {
            const filter = document.getElementById('appointmentFilter');
            const search = document.getElementById('appointmentSearch');
            const content = document.getElementById('appointmentsContent');
            const statsBar = document.getElementById('appointmentsStats');
            if (!content) return;

            let filtered = state.appointments || [];
            const today = new Date().toISOString().split('T')[0];
            const q = (search?.value || '').trim().toLowerCase();

            if (filter?.value === 'today') {
                filtered = filtered.filter(apt =>
                    (apt.scheduled_start?.split('T')[0] || apt.scheduled_start?.split(' ')[0]) === today
                );
            } else if (filter?.value === 'upcoming') {
                filtered = filtered.filter(apt =>
                    (apt.scheduled_start?.split('T')[0] || apt.scheduled_start?.split(' ')[0]) >= today
                );
            } else if (filter?.value === 'past') {
                filtered = filtered.filter(apt =>
                    (apt.scheduled_start?.split('T')[0] || apt.scheduled_start?.split(' ')[0]) < today
                );
            }

            if (q) {
                filtered = filtered.filter(apt =>
                    (apt.full_name || '').toLowerCase().includes(q) ||
                    (apt.department || '').toLowerCase().includes(q) ||
                    (apt.provider_name || '').toLowerCase().includes(q) ||
                    String(apt.patient_id || '').includes(q)
                );
            }

            if (statsBar) statsBar.innerHTML = this.renderAppointmentsStats(filtered);
            content.innerHTML = this.renderAppointmentsDetailList(filtered);
        },

        setupAppointmentsFilters() {
            const filter = document.getElementById('appointmentFilter');
            const search = document.getElementById('appointmentSearch');
            if (filter) filter.onchange = () => this.filterAppointmentsList();
            if (search) search.oninput = () => this.filterAppointmentsList();
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
                            ${(() => {
                                const call = getCallReasonDisplay(esc);
                                return `
                            <div class="escalation-call-reason ${call.waiting ? 'is-waiting' : ''}">
                                <strong><i class="fas fa-comment-medical"></i> Why they want to talk</strong>
                                <p>${escapeHtml(call.text)}</p>
                            </div>
                            <div class="escalation-phone-row">
                                <strong><i class="fas fa-phone"></i> Phone</strong>
                                ${formatPhoneLink(esc.phone)}
                            </div>`;
                            })()}
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
                            ${isOpenEscalationStatus(esc.status) ? `
                            <button class="btn-primary btn-sm" onclick="event.stopPropagation(); window.components.markSpecialistCalled(${esc.patient_id || 0}, ${esc.id})">
                                <i class="fas fa-phone"></i> ${t('mark_patient_called')}
                            </button>` : ''}
                            <button class="btn-secondary btn-sm" onclick="event.stopPropagation(); window.components.toggleEscalationDetails(${esc.id})">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>`;
        },

        renderEscalationDetailsModal(escalation) {
            const call = getCallReasonDisplay(escalation);
            const lastInbound = escalation.last_inbound_body
                && !/^(DOCTOR|DAKTARI|5)$/i.test(String(escalation.last_inbound_body).trim());
            return `
                <div class="modal-content escalation-detail-modal">
                    <div class="modal-header">
                        <h2><i class="fas fa-user-md"></i> ${escapeHtml(escalation.full_name || 'Patient request')}</h2>
                        <button type="button" class="close-btn" onclick="window.components.closeEscalationModal()" aria-label="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="escalation-details">
                        <div class="call-reason-hero ${call.waiting ? 'is-waiting' : ''}">
                            <span class="label">Why they want to speak with a health specialist</span>
                            <p class="call-reason-text">${escapeHtml(call.text)}</p>
                            ${call.waiting ? '<p class="muted" style="margin:8px 0 0">Tip: the patient should receive an SMS asking them to reply with their reason in their own words.</p>' : ''}
                        </div>

                        <div class="detail-section">
                            <h3>Contact</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span class="label">Phone (tap to call)</span>
                                    <span class="value phone-value">${formatPhoneLink(escalation.phone)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Channel</span>
                                    <span class="value">${escalation.channel ? escalation.channel.toUpperCase() : 'SMS'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Patient ID</span>
                                    <span class="value">#${escalation.patient_id || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        ${lastInbound ? `
                        <div class="detail-section">
                            <h3>Latest message from patient</h3>
                            <p class="value full-text inbound-snippet">${escapeHtml(escalation.last_inbound_body)}</p>
                            ${escalation.last_inbound_at ? `<p class="muted">${formatDate(escalation.last_inbound_at, 'full')} ${formatTime(escalation.last_inbound_at)}</p>` : ''}
                        </div>` : ''}

                        <div class="detail-section">
                            <h3>Escalation</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span class="label">Urgency</span>
                                    <span class="value urgency-${escalation.urgency}">${escalation.urgency ? escalation.urgency.toUpperCase() : 'SAME_DAY'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Status</span>
                                    <span class="value status-${escalation.status}">${escalation.status ? escalation.status.toUpperCase() : 'OPEN'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Opened</span>
                                    <span class="value">${formatDate(escalation.created_at, 'full')} ${formatTime(escalation.created_at)}</span>
                                </div>
                                ${escalation.doctor_call_requested_at ? `
                                <div class="detail-item">
                                    <span class="label">Call request</span>
                                    <span class="value">${formatDate(escalation.doctor_call_requested_at, 'full')} ${formatTime(escalation.doctor_call_requested_at)}</span>
                                </div>` : ''}
                            </div>
                        </div>
                        
                        <div class="detail-actions">
                            ${isOpenEscalationStatus(escalation.status) ? `
                            <button type="button" class="btn-primary" onclick="window.components.markSpecialistCalled(${escalation.patient_id || 0}, ${escalation.id})">
                                <i class="fas fa-phone"></i> ${t('mark_patient_called')}
                            </button>` : `
                            <p class="badge badge-success" style="display:inline-flex;align-items:center;gap:8px;padding:10px 14px;">
                                <i class="fas fa-check"></i> ${t('status_called')}
                            </p>`}
                            <button type="button" class="btn-secondary" onclick="window.components.viewPatient(${escalation.patient_id || 0}); window.components.closeEscalationModal();">
                                <i class="fas fa-user"></i> View Patient Record
                            </button>
                            <button type="button" class="btn-secondary" onclick="window.components.closeEscalationModal()">
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
                        setupPhoneLocalInput(document.getElementById('phoneLocal'));
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
                                const phone = normalizeKenyaPhone(body.phone_local);
                                if (!phone) {
                                    throw new Error(currentLanguage === 'sw'
                                        ? 'Weka tarakimu 9 baada ya +254 (mf. 712345678)'
                                        : 'Enter 9 digits after +254 (e.g. 712345678)');
                                }
                                body.phone = phone;
                                delete body.phone_local;
                                
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
                            this.filterAppointmentsList();
                            this.setupAppointmentsFilters();
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
                                if (content) this.filterAppointmentsList();
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

        async toggleEscalationDetails(escId) {
            const modal = document.getElementById('escalationDetailsModal');
            if (!modal) {
                showNotification('Could not open details', 'error');
                return;
            }

            let escalation = this.findEscalationById(escId);
            if (!escalation) {
                try {
                    const res = await api.get(`/api/escalation.php?id=${encodeURIComponent(escId)}`);
                    escalation = res.escalation;
                    if (escalation) {
                        state._escalationCache = state._escalationCache || [];
                        const idx = state._escalationCache.findIndex(e => Number(e.id) === Number(escId));
                        if (idx >= 0) state._escalationCache[idx] = escalation;
                        else state._escalationCache.push(escalation);
                    }
                } catch (err) {
                    showNotification(err.message || 'Could not load escalation', 'error');
                    return;
                }
            }

            if (!escalation) {
                showNotification('Escalation not found — try refreshing', 'error');
                return;
            }

            modal.innerHTML = this.renderEscalationDetailsModal(escalation);
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
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
            
            <div id="escalationDetailsModal" class="modal hidden" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="escalationModalTitle"></div>
            <div id="wipeDataModal" class="modal hidden" role="dialog" aria-labelledby="wipeModalTitle"></div>
            
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
        window.components.openWipeDataModal = () => components.openWipeDataModal();
        window.components.closeWipeDataModal = () => components.closeWipeDataModal();
        window.components.wipeDataStepContinue = () => components.wipeDataStepContinue();
        window.components.wipeDataGoBack = () => components.wipeDataGoBack();
        window.components.submitWipeDataErase = () => components.submitWipeDataErase();
        window.components.setHpvResult = (id, r) => components.setHpvResult(id, r);
        window.components.confirmHpvResult = (id) => components.confirmHpvResult(id);
        window.components.markSpecialistCalled = (pid, eid) => components.markSpecialistCalled(pid, eid);
        
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
