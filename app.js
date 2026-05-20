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
                { id:
