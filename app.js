// Nyeri Town Health Center — HPV Patient Engagement Console

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURATION
    // ============================================
    const cfg = window.HPV_CONFIG || {};
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
            search_placeholder: "Search by name or client number...",
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
            hpv_recorded_positive: "HPV positive recorded on {date}.",
            hpv_recorded_negative: "HPV negative recorded on {date}.",
            hpv_status_recorded: "Recorded",
            hpv_step_record: "Step 1 — Record lab result",
            hpv_step_confirm: "Step 2 — Confirm & notify patient",
            hpv_confirm_hint: "Confirmation sends the result to the patient and starts gentle FAQ tips that continue until VIA is recorded.",
            hpv_confirm_need_result: "Record positive or negative above before you can confirm.",
            hpv_confirm_need_appointment: "Book the clinic visit below first. That sends the HPV result and appointment confirmation together.",
            hpv_positive_book_appt: "HPV positive recorded. Book the clinic visit below — that sends the result and appointment to the patient.",
            hpv_confirm_dialog: "Confirm this patient as HPV {result} and send the result plus follow-up guidance by SMS?",
            hpv_unavailable: "HPV result recording could not be enabled on the server. Please try again later or contact support.",
            mark_patient_called: "Mark as called",
            mark_patient_called_confirm: "Confirm you have spoken with this patient on the phone? This removes the request from open escalations.",
            patient_called_success: "Marked as called. Open escalation cleared.",
            status_called: "Called",
            specialist_called_on: "Hospital confirmed they called this patient on {date}.",
            specialist_request_open: "Patient requested a call from a health specialist.",
            call_patient_btn: "Call patient",
            call_patient_sub: "Opens your phone dialler with their number and marks this request complete.",
            use_call_button_above: "Use the Call patient button in the Contact section above.",
            reg_age_label: "Age",
            reg_age_empty: "Enter age or date of birth",
            reg_age_or_dob_required: "Enter the patient age or date of birth.",
            reg_dob_optional: "Date of birth (optional)",
            reg_age_hint: "Enter age directly, or pick date of birth to calculate it automatically.",
            reg_age_years: "years",
            reg_hiv_status: "HIV status",
            reg_hpv_done: "HPV screening done before?",
            reg_hpv_prior: "Prior HPV result",
            reg_residence: "Place of residence",
            reg_via_result: "VIA (Visual Inspection) result",
            reg_via_date: "Date of VIA",
            reg_has_cancer: "Patient has cancer — send referral to Nyeri County Referral Hospital",
            reg_treatment_date: "Date of treatment (if any)",
            reg_via_not_done: "Not done yet",
            reg_via_after_test_hint: "VIA is recorded on the patient page after the test is done.",
            via_result_title: "VIA (Visual Inspection) result",
            via_result_hint: "Record the VIA result after the patient has been tested. Follow-up messages are sent when opted in.",
            via_record_positive: "Record POSITIVE",
            via_record_negative: "Record NEGATIVE",
            via_record_save: "Save VIA result & notify patient",
            via_recorded_negative: "VIA negative recorded on {date}. Annual check-up reminders scheduled.",
            via_recorded_positive: "VIA positive recorded on {date}.",
            via_unavailable: "VIA recording is not available on this server.",
            book_appt_inline_title: "Book appointment",
            book_appt_inline_hint: "For HPV positive, booking sends the lab result SMS first, then the appointment confirmation. Gentle FAQ tips continue until VIA is recorded.",
            book_appt_submit: "Book & notify patient",
            book_appt_hpv_sent: "Appointment booked. HPV result and appointment confirmation sent to patient.",
            book_appt_confirm_only: "Appointment confirmation sent to patient.",
            reg_open_patient_hint: "Open the patient record to record today's HPV lab result.",
            appt_attendance_hint: "After the appointment date, confirm whether the patient came.",
            appt_patient_attended: "Patient attended",
            appt_patient_missed: "Did not attend",
            appt_attended_via_hint: "Marked as attended. Record the VIA result below.",
            appt_missed_sent: "Marked as missed. Patient notified.",
            appt_status_completed: "Attended",
            appt_status_no_show: "Missed",
            visit_workflow_title: "Clinic visit — attendance & VIA",
            visit_workflow_intro: "When the appointment day arrives, confirm whether the patient came, then record the VIA test result.",
            visit_workflow_intro_followup: "Confirm whether the patient attended this follow-up appointment. VIA is only done at the first visit.",
            care_path_title: "Afya Rafiki care pathway",
            care_path_order_hint: "Follow in order: 1) HPV lab result → 2) Clinic visit → 3) VIA test.",
            care_path_hpv: "HPV lab result",
            care_path_visit: "Clinic visit",
            care_path_via: "VIA test",
            care_path_done: "Done",
            care_path_action: "Action needed",
            care_path_hpv_record: "Record HPV lab result",
            care_path_hpv_confirm: "Confirm & notify patient (HPV result SMS)",
            care_path_attendance: "Confirm attendance for clinic visit",
            care_path_via_record: "Record VIA result after the test",
            care_path_out_of_order: "VIA was recorded before the HPV result was confirmed. Confirm HPV below so the patient receives the lab result message.",
            via_step_record: "Step 1 — Record VIA result",
            visit_step_attendance: "Step 1 — Did the patient attend?",
            visit_step_via: "Step 2 — Record VIA result from this visit",
            visit_appt_on: "Appointment:",
            appt_manage_visit: "Manage visit",
            appt_workflow_panel_hint: "First visit: confirm attendance, then record VIA. Follow-up visits: attendance only. Messages are sent automatically.",
            appt_workflow_upcoming: "Next appointment is scheduled. Return on that day to confirm attendance and record VIA.",
            appt_select_patient_workflow: "Select a patient to confirm attendance and record VIA results.",
            reg_screening_section: "Clinical screening",
            reg_followup_preview: "Follow-up reminders (SMS if opted in)",
            reg_followup_via_neg: "VIA negative → annual check-up in 1 year",
            reg_followup_hiv_hpv_neg: "HIV positive + HPV negative → check-up in 5 years",
            reg_followup_hiv_hpv_pos: "HIV positive + HPV positive → check-up in 3 years",
            reg_followup_referral: "VIA positive + cancer → immediate referral SMS",
            nyeri_referral_title: "Refer to Nyeri County Referral Hospital",
            nyeri_referral_intro: "When HPV and VIA are both complete, refer the patient for specialist review and further treatment.",
            nyeri_referral_test_hpv: "HPV test confirmed",
            nyeri_referral_test_via: "VIA test recorded",
            nyeri_referral_ready: "All screening tests are complete. Schedule the referral appointment and notify the patient.",
            nyeri_referral_pending: "Complete all tests above before sending a referral.",
            nyeri_referral_appt_date: "Referral appointment date",
            nyeri_referral_send: "Send referral to Nyeri",
            nyeri_referral_sent: "Referral sent to Nyeri County Referral Hospital.",
            nyeri_referral_already: "Patient already referred to Nyeri County Referral Hospital.",
            nyeri_referral_need_date: "Enter the referral appointment date.",
            screening_profile: "Screening profile",
            screening_next_checkup: "Next check-up",
            reg_client_no: "Client number",
            reg_client_no_hint: "Enter only the unique digits from the lab register (e.g. 022). Full ID:",
            reg_hiv_not_known: "Not known",
            reg_consent_signed: "Patient signed written consent at registration (required for SMS)",
            reg_enrollment_details: "Registration details",
            reg_contact_channel: "Contact channel",
            reg_opted_in: "Receives SMS/WhatsApp",
            no_client_number: "No client number on file — register with a lab serial or contact admin."
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
            search_placeholder: "Tafuta kwa jina au nambari ya mteja...",
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
            hpv_recorded_positive: "HPV chanya imewekwa {date}.",
            hpv_recorded_negative: "HPV hasi imewekwa {date}.",
            hpv_status_recorded: "Imewekwa",
            hpv_step_record: "Hatua 1 — Weka matokeo ya maabara",
            hpv_step_confirm: "Hatua 2 — Thibitisha & mjulishe mgonjwa",
            hpv_confirm_hint: "Uthibitisha hutuma matokeo kwa mgonjwa na kuanza vidokezo vya FAQ hadi VIA iwekwe.",
            hpv_confirm_need_result: "Weka chanya au hasi hapo juu kabla ya kuthibitisha.",
            hpv_confirm_need_appointment: "Panga ziara ya kliniki hapa chini kwanza. Hiyo hutuma matokeo ya HPV na uthibitisho wa miadi pamoja.",
            hpv_positive_book_appt: "HPV chanya imewekwa. Panga ziara ya kliniki hapa chini — hiyo hutuma matokeo na miadi kwa mgonjwa.",
            hpv_confirm_dialog: "Thibitisha mgonjwa huyu kama HPV {result} na kutuma matokeo pamoja na mwongozo kwa SMS?",
            hpv_unavailable: "Kuweka matokeo ya HPV hakupatikani kwenye seva. Jaribu tena baadaye au wasiliana na msaada.",
            mark_patient_called: "Weka alipigiwa simu",
            mark_patient_called_confirm: "Thibitisha umemzungumzia mgonjwa huyu kwa simu? Ombi litaondolewa kwenye escalations wazi.",
            patient_called_success: "Imewekwa alipigiwa simu. Escalation imefungwa.",
            status_called: "Amepigiwa simu",
            specialist_called_on: "Hospitali imethibitisha kumpigia mgonjwa simu {date}.",
            specialist_request_open: "Mgonjwa ameomba kuzungumza na mhudumu wa afya.",
            call_patient_btn: "Mpigie mgonjwa",
            call_patient_sub: "Hufungua simu yako na nambari yake na kuweka ombi kama limekamilika.",
            use_call_button_above: "Tumia kitufe cha Mpigie mgonjwa kwenye sehemu ya Mawasiliano hapo juu.",
            reg_age_label: "Umri",
            reg_age_empty: "Weka umri au tarehe ya kuzaliwa",
            reg_age_or_dob_required: "Weka umri wa mgonjwa au tarehe ya kuzaliwa.",
            reg_dob_optional: "Tarehe ya kuzaliwa (si lazima)",
            reg_age_hint: "Weka umri moja kwa moja, au chagua tarehe ya kuzaliwa kuhesabu kiotomatiki.",
            reg_age_years: "miaka",
            reg_hiv_status: "Hali ya VVU",
            reg_hpv_done: "Uchunguzi wa HPV umefanywa hapo awali?",
            reg_hpv_prior: "Matokeo ya awali ya HPV",
            reg_residence: "Mahali pa makazi",
            reg_via_result: "Matokeo ya VIA",
            reg_via_date: "Tarehe ya VIA",
            reg_has_cancer: "Mgonjwa ana saratani — tuma rufaa kwa Hospitali ya Rufaa ya Kaunti ya Nyeri",
            reg_treatment_date: "Tarehe ya matibabu (ikiwa ipo)",
            reg_via_not_done: "Haijafanyika bado",
            reg_via_after_test_hint: "VIA inawekwa kwenye ukurasa wa mgonjwa baada ya kipimo kufanyika.",
            via_result_title: "Matokeo ya VIA",
            via_result_hint: "Weka matokeo ya VIA baada ya mgonjwa kupimwa. Ujumbe wa ufuatiliaji hutumwa ikiwa amejisajili.",
            via_record_positive: "Weka CHANYA",
            via_record_negative: "Weka HASI",
            via_record_save: "Hifadhi matokeo ya VIA & mjulishe mgonjwa",
            via_recorded_negative: "VIA hasi imewekwa {date}. Ukumbusho wa uchunguzi wa kila mwaka umepangwa.",
            via_recorded_positive: "VIA chanya imewekwa {date}.",
            via_unavailable: "Kuweka matokeo ya VIA hakupatikani kwenye seva.",
            book_appt_inline_title: "Panga miadi",
            book_appt_inline_hint: "Kwa HPV chanya, kupanga miadi hutuma matokeo ya maabara kwanza, kisha uthibitisho wa miadi. Vidokezo vya FAQ vinaendelea hadi VIA iwekwe.",
            book_appt_submit: "Panga & mjulishe mgonjwa",
            book_appt_hpv_sent: "Miadi imepangwa. Matokeo ya HPV na uthibitisho wa miadi vimetumwa kwa mgonjwa.",
            book_appt_confirm_only: "Ujumbe wa uthibitisho wa miadi umetumwa kwa mgonjwa.",
            reg_open_patient_hint: "Fungua rekodi ya mgonjwa kuweka matokeo ya HPV ya leo.",
            appt_attendance_hint: "Baada ya tarehe ya miadi, thibitisha kama mgonjwa alifika.",
            appt_patient_attended: "Alihudhuria",
            appt_patient_missed: "Hakuja",
            appt_attended_via_hint: "Imewekwa alihudhuria. Weka matokeo ya VIA hapa chini.",
            appt_missed_sent: "Imewekwa hakuhudhuria. Mgonjwa amejulishwa.",
            appt_status_completed: "Alihudhuria",
            appt_status_no_show: "Hakuhudhuria",
            visit_workflow_title: "Ziara ya kliniki — mahudhurio na VIA",
            visit_workflow_intro: "Siku ya miadi inapofika, thibitisha kama mgonjwa alifika, kisha weka matokeo ya kipimo cha VIA.",
            visit_workflow_intro_followup: "Thibitisha kama mgonjwa alihudhuria miadi hii ya ufuatiliaji. VIA hufanywa tu katika ziara ya kwanza.",
            care_path_title: "Safari ya huduma — Afya Rafiki",
            care_path_order_hint: "Fuata mpangilio: 1) Matokeo ya HPV → 2) Ziara ya kliniki → 3) Kipimo cha VIA.",
            care_path_hpv: "Matokeo ya HPV",
            care_path_visit: "Ziara ya kliniki",
            care_path_via: "Kipimo cha VIA",
            care_path_done: "Imekamilika",
            care_path_action: "Inahitaji hatua",
            care_path_hpv_record: "Weka matokeo ya HPV",
            care_path_hpv_confirm: "Thibitisha & mjulishe mgonjwa (SMS ya HPV)",
            care_path_attendance: "Thibitisha mahudhurio kwa miadi",
            care_path_via_record: "Weka matokeo ya VIA baada ya kipimo",
            care_path_out_of_order: "VIA iliwekwa kabla ya kuthibitisha HPV. Thibitisha HPV hapa chini ili mgonjwa apate ujumbe wa matokeo ya maabara.",
            via_step_record: "Hatua 1 — Weka matokeo ya VIA",
            visit_step_attendance: "Hatua 1 — Je, mgonjwa alihudhuria?",
            visit_step_via: "Hatua 2 — Weka matokeo ya VIA kutoka ziara hii",
            visit_appt_on: "Miadi:",
            appt_manage_visit: "Simamia ziara",
            appt_workflow_panel_hint: "Ziara ya kwanza: thibitisha mahudhurio, kisha weka VIA. Miadi ya ufuatiliaji: mahudhurio tu. Ujumbe hutumwa kiotomatiki.",
            appt_workflow_upcoming: "Miadi ijayo imepangwa. Rudi siku ya miadi kuthibitisha mahudhurio na kuweka VIA.",
            appt_select_patient_workflow: "Chagua mgonjwa kuthibitisha mahudhurio na kuweka matokeo ya VIA.",
            reg_screening_section: "Uchunguzi wa kliniki",
            reg_followup_preview: "Ukumbusho wa ufuatiliaji (SMS ikiwa amejisajili)",
            reg_followup_via_neg: "VIA hasi → uchunguzi wa mwaka baada ya mwaka 1",
            reg_followup_hiv_hpv_neg: "VVU chanya + HPV hasi → uchunguzi baada ya miaka 5",
            reg_followup_hiv_hpv_pos: "VVU chanya + HPV chanya → uchunguzi baada ya miaka 3",
            reg_followup_referral: "VIA chanya + saratani → SMS ya rufaa mara moja",
            nyeri_referral_title: "Rufaa kwa Hospitali ya Rufaa ya Kaunti ya Nyeri",
            nyeri_referral_intro: "HPV na VIA zikikamilika, mpe rufaa mgonjwa kwa daktari bingwa na matibabu zaidi.",
            nyeri_referral_test_hpv: "Kipimo cha HPV kimehakikishwa",
            nyeri_referral_test_via: "Kipimo cha VIA kimewekwa",
            nyeri_referral_ready: "Vipimo vyote vimekamilika. Weka tarehe ya miadi ya rufaa na mjulishe mgonjwa.",
            nyeri_referral_pending: "Kamilisha vipimo hapo juu kabla ya kutuma rufaa.",
            nyeri_referral_appt_date: "Tarehe ya miadi ya rufaa",
            nyeri_referral_send: "Tuma rufaa Nyeri",
            nyeri_referral_sent: "Rufaa imetumwa kwa Hospitali ya Rufaa ya Kaunti ya Nyeri.",
            nyeri_referral_already: "Mgonjwa tayari amepewa rufaa Hospitali ya Rufaa ya Kaunti ya Nyeri.",
            nyeri_referral_need_date: "Weka tarehe ya miadi ya rufaa.",
            screening_profile: "Wasifu wa uchunguzi",
            screening_next_checkup: "Uchunguzi ujao",
            reg_client_no: "Nambari ya mteja",
            reg_client_no_hint: "Weka tarakimu za kipekee kutoka kwenye daftari (mf. 022). Nambari kamili:",
            reg_hiv_not_known: "Haijulikani",
            reg_consent_signed: "Mgonjwa amesaini fomu ya idhini kwa maandishi (inahitajika kwa SMS)",
            reg_enrollment_details: "Maelezo ya usajili",
            reg_contact_channel: "Njia ya mawasiliano",
            reg_opted_in: "Hupokea SMS/WhatsApp",
            no_client_number: "Hakuna nambari ya mteja — sajili kwa serial ya maabara au wasiliana na msimamizi."
        }
    };

    function clientIdPrefix() {
        return (window.HPV_CONFIG && window.HPV_CONFIG.CLIENT_ID_PREFIX) || 'NC/NTHC/001/';
    }

    function formatClientId(p) {
        if (p?.external_mrn) return String(p.external_mrn);
        if (p?.client_id) return String(p.client_id);
        return '';
    }

    function patientClientSuffix(refOrPatient) {
        if (refOrPatient && typeof refOrPatient === 'object') {
            const cid = formatClientId(refOrPatient);
            if (!cid) return '';
            const prefix = clientIdPrefix();
            return cid.startsWith(prefix) ? cid.slice(prefix.length) : cid;
        }
        const s = String(refOrPatient ?? '').trim();
        if (!s) return '';
        const prefix = clientIdPrefix();
        if (s.startsWith(prefix)) return s.slice(prefix.length);
        if (s.includes('/')) {
            const parts = s.split('/').filter(Boolean);
            return parts[parts.length - 1] || '';
        }
        return (s.replace(/\D/g, '') || s);
    }

    function fullClientIdFromRef(ref) {
        const suffix = patientClientSuffix(ref);
        if (!suffix) return '';
        const digits = suffix.replace(/\D/g, '');
        return digits ? clientIdPrefix() + digits : '';
    }

    function patientOpenRef(p) {
        const suffix = patientClientSuffix(p);
        return suffix || null;
    }

    function patientClientLabel(p) {
        return formatClientId(p) || '—';
    }

    function escJsString(s) {
        return JSON.stringify(String(s ?? ''));
    }

    function getPatientPrimaryPhone(p) {
        const contacts = p?.contacts || [];
        const primary = contacts.find((c) => Number(c.is_primary) === 1) || contacts[0];
        return primary?.address ? String(primary.address).trim() : '';
    }

    function safeRender(fn, fallbackMsg) {
        try {
            return fn();
        } catch (err) {
            console.error(fallbackMsg, err);
            return `
                <div class="card" style="margin:1rem;padding:20px;border-left:4px solid #dc2626">
                    <p><strong>${escapeHtml(fallbackMsg)}</strong></p>
                    <p class="muted">${escapeHtml(err.message || String(err))}</p>
                </div>`;
        }
    }

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

    function appointmentOnOrPastDay(appt) {
        const start = new Date(appt?.scheduled_start || '');
        if (Number.isNaN(start.getTime())) {
            return false;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const apptDay = new Date(start);
        apptDay.setHours(0, 0, 0, 0);
        return apptDay.getTime() <= today.getTime();
    }

    function appointmentNeedsAttendanceCheck(appt) {
        const status = (appt?.status || '').toLowerCase();
        if (!['proposed', 'confirmed'].includes(status)) {
            return false;
        }
        return appointmentOnOrPastDay(appt);
    }

    function patientHasConfirmedAppointment(appointments) {
        return (appointments || []).some((a) => {
            const status = (a.status || '').toLowerCase();
            return ['confirmed', 'completed', 'no_show'].includes(status);
        });
    }

    function viaIsRecorded(p) {
        const v = (p?.via_result || '').toLowerCase();
        return v === 'positive' || v === 'negative';
    }

    function hpvTestComplete(p) {
        if (!p) {
            return false;
        }
        if (p.hpv_result_confirmed_at) {
            return true;
        }
        if (p.hpv_workflow_enabled === false) {
            const prior = (p.hpv_prior_result || '').toLowerCase();
            if (prior === 'positive' || prior === 'negative') {
                return true;
            }
            const r = (p.hpv_screening_result || '').toLowerCase();
            return r === 'positive' || r === 'negative';
        }
        return false;
    }

    function getNyeriReferralStatus(p) {
        const fromApi = p?.nyeri_referral_status;
        if (fromApi && typeof fromApi === 'object') {
            return fromApi;
        }
        const hpvComplete = hpvTestComplete(p);
        const viaComplete = viaIsRecorded(p);
        return {
            hpv_complete: hpvComplete,
            via_complete: viaComplete,
            all_complete: hpvComplete && viaComplete,
            already_referred: Boolean(p?.nyeri_referral_at),
            referral_at: p?.nyeri_referral_at || null,
            referral_appointment_date: p?.nyeri_referral_appointment_date || null,
            hospital: 'Nyeri County Referral Hospital',
        };
    }

    function appointmentDateInputValue(scheduledStart) {
        if (!scheduledStart) {
            return '';
        }
        const d = new Date(scheduledStart);
        if (Number.isNaN(d.getTime())) {
            return '';
        }
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    function appointmentSortKey(a) {
        const ts = new Date(a?.scheduled_start || 0).getTime();
        return Number.isFinite(ts) ? ts : Number(a?.id) || 0;
    }

    function getFirstPatientAppointment(appointments) {
        return [...(appointments || [])].sort((a, b) => {
            const diff = appointmentSortKey(a) - appointmentSortKey(b);
            return diff !== 0 ? diff : (Number(a?.id) || 0) - (Number(b?.id) || 0);
        })[0] || null;
    }

    function isFirstPatientAppointment(appt, appointments) {
        if (!appt) {
            return false;
        }
        const first = getFirstPatientAppointment(appointments);
        return Boolean(first && Number(first.id) === Number(appt.id));
    }

    function getCarePathState(p, appointments) {
        const list = appointments || [];
        const result = (p.hpv_screening_result || 'pending').toLowerCase();
        const hpvRecorded = Boolean(p.hpv_result_recorded_at) && (result === 'positive' || result === 'negative');
        const hpvConfirmed = Boolean(p.hpv_result_confirmed_at) && hpvRecorded;
        const viaDone = viaIsRecorded(p);
        const pendingAttendance = list.find((a) => appointmentNeedsAttendanceCheck(a));
        const visitDone = viaDone || !pendingAttendance && list.some((a) => (a.status || '').toLowerCase() === 'completed');

        let nextKey = null;
        if (!hpvRecorded) {
            nextKey = 'care_path_hpv_record';
        } else if (!hpvConfirmed) {
            nextKey = 'care_path_hpv_confirm';
        } else if (pendingAttendance && !viaDone) {
            nextKey = 'care_path_attendance';
        } else if (hpvConfirmed && !viaDone && patientHasConfirmedAppointment(list)) {
            const wf = getVisitWorkflowState(p, list);
            if (wf.needsVia) {
                nextKey = 'care_path_via_record';
            }
        }

        return {
            hpvRecorded,
            hpvConfirmed,
            viaDone,
            visitDone: visitDone || viaDone,
            pendingAttendance: Boolean(pendingAttendance) && !viaDone,
            nextKey,
            outOfOrder: viaDone && !hpvConfirmed,
        };
    }

    function getVisitWorkflowState(p, appointments) {
        const list = appointments || [];
        if (viaIsRecorded(p)) {
            return {
                pendingAttendance: null,
                completedVisit: null,
                needsVia: false,
                active: false,
                visitAppt: null,
                isFollowUpVisit: false,
            };
        }
        const apptConfirmed = patientHasConfirmedAppointment(list);
        const pendingAttendance = list.find((a) => appointmentNeedsAttendanceCheck(a));
        const firstCompleted = [...list]
            .filter((a) => (a.status || '').toLowerCase() === 'completed')
            .sort((a, b) => appointmentSortKey(a) - appointmentSortKey(b))[0] || null;
        const needsVia = apptConfirmed
            && !viaIsRecorded(p)
            && Boolean(firstCompleted)
            && isFirstPatientAppointment(firstCompleted, list)
            && !pendingAttendance;
        const active = Boolean(pendingAttendance) || needsVia;
        const visitAppt = pendingAttendance || (needsVia ? firstCompleted : null);
        const isFollowUpVisit = Boolean(pendingAttendance)
            && !isFirstPatientAppointment(pendingAttendance, list);
        return {
            pendingAttendance,
            completedVisit: firstCompleted,
            needsVia,
            active,
            visitAppt,
            isFollowUpVisit,
        };
    }

    function appointmentStatusLabel(status) {
        const s = (status || '').toLowerCase();
        if (s === 'completed') return t('appt_status_completed');
        if (s === 'no_show') return t('appt_status_no_show');
        if (s === 'confirmed') return currentLanguage === 'sw' ? 'Imethibitishwa' : 'Confirmed';
        return escapeHtml(status || '—');
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
        apptWorkflowPatient: null,
        focusApptBookingAfterLoad: false,
        selectedPatientId: null,
        selectedPatientRef: null,
        isLoading: false,
        isRegistering: false,
        _loadToken: 0,
        _suppressHashRoute: false
    };

    function bumpLoadToken() {
        state._loadToken += 1;
        return state._loadToken;
    }

    function isLoadTokenCurrent(token) {
        return token === state._loadToken;
    }

    function showAppLoadingOverlay(container) {
        if (!container) return;
        removeAppLoadingOverlay();
        const overlay = document.createElement('div');
        overlay.id = 'appLoadingOverlay';
        overlay.className = 'app-loading-overlay';
        overlay.setAttribute('aria-busy', 'true');
        overlay.innerHTML = '<div class="loading-spinner"></div><p>Loading…</p>';
        container.appendChild(overlay);
    }

    function removeAppLoadingOverlay() {
        document.getElementById('appLoadingOverlay')?.remove();
    }

    function navigateToPatient(patientRef, internalId = 0) {
        const ref = patientClientSuffix(patientRef) || patientOpenRef(patientRef);
        const pid = Number(internalId || 0);
        if (!ref && pid < 1) {
            showNotification(t('no_client_number'), 'error');
            return;
        }
        if (typeof window.components?.viewPatient === 'function') {
            window.components.viewPatient(ref || pid, pid);
        }
    }

    function applyRouteFromHash() {
        const hash = (window.location.hash || '').replace(/^#\/?/, '');
        if (!hash) return;
        const parts = hash.split('/').filter(Boolean);
        if (parts[0] === 'patient' && parts[1]) {
            const ref = decodeURIComponent(parts[1]);
            if (ref) {
                state.currentTab = 'patient';
                state.selectedPatientRef = patientClientSuffix(ref);
                navigateToPatient(ref);
                return;
            }
        }
        const tabIds = ['dashboard', 'patients', 'register', 'appointments', 'messages'];
        if (tabIds.includes(parts[0]) && typeof window.components?.switchTab === 'function') {
            window.components.switchTab(parts[0]);
        }
    }

    function setRouteHash(path) {
        const next = path ? `#/${path}` : '#/dashboard';
        if (window.location.hash === next) {
            return;
        }
        state._suppressHashRoute = true;
        window.location.hash = next;
        state._suppressHashRoute = false;
    }

    function onHashRouteChange() {
        if (state._suppressHashRoute) {
            return;
        }
        applyRouteFromHash();
    }
    
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
        if (type === 'staff_custom') return 'Custom';
        if (type === 'escalation_notice') return 'Escalation';
        if (type === 'engagement_boost') return 'Health Tip';
        if (type === 'appointment_booked' || type === 'appointment_rescheduled') return 'Appointment';
        if (type === 'appointment_reminder') return 'Reminder';
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

    function calculateAgeFromDob(dobStr) {
        if (!dobStr || !/^\d{4}-\d{2}-\d{2}$/.test(dobStr)) {
            return null;
        }
        const dob = new Date(dobStr + 'T12:00:00');
        if (Number.isNaN(dob.getTime())) {
            return null;
        }
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age -= 1;
        }
        return age >= 0 && age < 130 ? age : null;
    }

    function getPatientAge(p) {
        if (!p) {
            return null;
        }
        const dobAge = calculateAgeFromDob(p.date_of_birth);
        if (dobAge !== null) {
            return dobAge;
        }
        const stored = Number(p.age);
        if (Number.isFinite(stored) && stored > 0 && stored <= 120) {
            return stored;
        }
        return null;
    }

    function formatPatientAge(p) {
        const age = getPatientAge(p);
        if (age === null) {
            return '—';
        }
        return `${age} ${t('reg_age_years')}`;
    }

    function resolveRegisterAgeDob(form) {
        const dob = (form.querySelector('[name="date_of_birth"]')?.value || '').trim();
        const ageRaw = (form.querySelector('[name="age"]')?.value || '').trim();
        if (dob) {
            const age = calculateAgeFromDob(dob);
            if (age === null) {
                throw new Error(t('reg_age_or_dob_required'));
            }
            return { date_of_birth: dob, age };
        }
        const age = Number(ageRaw);
        if (!Number.isFinite(age) || age < 1 || age > 120) {
            throw new Error(t('reg_age_or_dob_required'));
        }
        return { date_of_birth: '', age };
    }

    function updateRegisterAgeDisplay(form) {
        const dobInput = form?.querySelector('[name="date_of_birth"]');
        const ageInput = form?.querySelector('[name="age"]');
        if (!dobInput || !ageInput) {
            return;
        }
        const fromDob = calculateAgeFromDob(dobInput.value);
        if (fromDob !== null) {
            ageInput.value = String(fromDob);
            ageInput.readOnly = true;
            ageInput.classList.add('reg-age-auto');
        } else {
            ageInput.readOnly = false;
            ageInput.classList.remove('reg-age-auto');
        }
    }

    function updateRegisterConditionalFields(form) {
        if (!form) {
            return;
        }
        const hpvDone = form.querySelector('[name="hpv_done_before"]')?.value || '';
        const hpvPriorWrap = document.getElementById('regHpvPriorWrap');

        if (hpvPriorWrap) {
            hpvPriorWrap.style.display = hpvDone === 'yes' ? '' : 'none';
        }
        updateRegisterFollowupPreview(form);
    }

    function updateRegisterFollowupPreview(form) {
        const box = document.getElementById('regFollowupPreview');
        if (!box || !form) {
            return;
        }
        const hiv = form.querySelector('[name="hiv_status"]')?.value || '';
        const hpvDone = form.querySelector('[name="hpv_done_before"]')?.value || '';
        const hpvPrior = form.querySelector('[name="hpv_prior_result"]')?.value || '';

        const lines = [];
        if (hiv === 'positive' && hpvDone === 'yes' && hpvPrior === 'negative') {
            lines.push(t('reg_followup_hiv_hpv_neg'));
        }
        if (hiv === 'positive' && hpvDone === 'yes' && hpvPrior === 'positive') {
            lines.push(t('reg_followup_hiv_hpv_pos'));
        }
        box.innerHTML = lines.length
            ? `<ul class="reg-followup-list">${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul>`
            : `<p class="muted">${currentLanguage === 'sw' ? 'Jaza taarifa za uchunguzi kuona mpango wa ufuatiliaji.' : 'Complete screening fields to see follow-up plan.'}</p>`;
    }

    function setupRegisterForm(form) {
        if (!form || form.dataset.bound === '1') {
            return;
        }
        form.dataset.bound = '1';
        setupPhoneLocalInput(document.getElementById('phoneLocal'));

        const dobInput = form.querySelector('[name="date_of_birth"]');
        const ageInput = form.querySelector('[name="age"]');
        if (dobInput) {
            dobInput.addEventListener('change', () => updateRegisterAgeDisplay(form));
            dobInput.addEventListener('input', () => updateRegisterAgeDisplay(form));
        }
        if (ageInput) {
            ageInput.addEventListener('input', () => {
                if (!dobInput?.value) {
                    ageInput.readOnly = false;
                    ageInput.classList.remove('reg-age-auto');
                }
            });
        }

        ['hpv_done_before', 'hiv_status', 'hpv_prior_result'].forEach((name) => {
            const el = form.querySelector(`[name="${name}"]`);
            if (el) {
                el.addEventListener('change', () => updateRegisterConditionalFields(form));
            }
        });

        const clientSuffix = form.querySelector('#clientNoSuffix');
        const clientPreview = document.getElementById('clientIdPreview');
        const updateClientPreview = () => {
            const suffix = (clientSuffix?.value || '').replace(/\D/g, '');
            if (clientPreview) {
                clientPreview.textContent = suffix ? clientIdPrefix() + suffix : clientIdPrefix() + '…';
            }
        };
        if (clientSuffix) {
            clientSuffix.addEventListener('input', updateClientPreview);
        }
        updateClientPreview();

        updateRegisterAgeDisplay(form);
        updateRegisterConditionalFields(form);
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

                const raw = await response.text();
                let data = {};
                if (raw) {
                    try {
                        data = JSON.parse(raw);
                    } catch (parseErr) {
                        if (!response.ok) {
                            throw new Error(raw.slice(0, 200) || `HTTP ${response.status}`);
                        }
                    }
                }

                if (!response.ok) {
                    throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
                }

                if (data.ok === false && data.error) {
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
        
        async post(url, body, retry = false) {
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

    async function fetchPatientByRef(ref, internalIdFallback = 0) {
        const fullId = fullClientIdFromRef(ref);
        if (fullId) {
            try {
                return await api.get(`/api/patients.php?client_id=${encodeURIComponent(fullId)}`);
            } catch (err) {
                /* try internal id below */
            }
        }
        const id = Number(internalIdFallback || 0);
        if (id > 0) {
            return await api.get(`/api/patients.php?id=${id}`);
        }
        if (/^\d{1,6}$/.test(String(ref || ''))) {
            return await api.get(`/api/patients.php?id=${Number(ref)}`);
        }
        throw new Error(t('no_client_number'));
    }
    
    // ============================================
    // UI COMPONENTS
    // ============================================
    const components = {
        setupActionDelegation() {
            if (components._delegationBound) {
                return;
            }
            components._delegationBound = true;
            document.addEventListener('click', (e) => {
                const el = e.target.closest('[data-action]');
                if (!el || el.disabled) {
                    return;
                }
                const action = el.getAttribute('data-action');
                const patientId = Number(el.getAttribute('data-patient-id') || 0);
                const escalationId = Number(el.getAttribute('data-escalation-id') || 0);
                const result = el.getAttribute('data-result') || '';
                const phone = el.getAttribute('data-phone') || '';
                const tab = el.getAttribute('data-tab') || '';

                const patientRef = el.getAttribute('data-patient-ref') || '';
                const internalId = Number(el.getAttribute('data-patient-id') || 0);
                if (action === 'view-patient' && (patientRef || internalId > 0)) {
                    e.preventDefault();
                    navigateToPatient(patientRef || internalId, internalId);
                } else if (action === 'switch-tab' && tab) {
                    e.preventDefault();
                    window.components.switchTab(tab);
                } else if (action === 'hpv-record-positive' && patientId) {
                    e.preventDefault();
                    components.setHpvResult(patientId, 'positive');
                } else if (action === 'hpv-record-negative' && patientId) {
                    e.preventDefault();
                    components.setHpvResult(patientId, 'negative');
                } else if (action === 'hpv-confirm' && patientId) {
                    e.preventDefault();
                    components.confirmHpvResult(patientId, result);
                } else if (action === 'via-pick-positive' && patientId) {
                    e.preventDefault();
                    components.pickViaResult(patientId, 'positive');
                } else if (action === 'via-pick-negative' && patientId) {
                    e.preventDefault();
                    components.pickViaResult(patientId, 'negative');
                } else if (action === 'via-record-submit' && patientId) {
                    e.preventDefault();
                    components.recordViaResult(patientId);
                } else if (action === 'book-appt-submit' && patientId) {
                    e.preventDefault();
                    components.bookPatientAppointment(patientId);
                } else if (action === 'appt-mark-attended') {
                    e.preventDefault();
                    const apptId = Number(el.getAttribute('data-appointment-id') || 0);
                    if (apptId > 0) {
                        components.markAppointmentAttended(apptId, patientId);
                    }
                } else if (action === 'appt-mark-missed') {
                    e.preventDefault();
                    const apptId = Number(el.getAttribute('data-appointment-id') || 0);
                    if (apptId > 0) {
                        components.markAppointmentMissed(apptId, patientId);
                    }
                } else if (action === 'nyeri-referral-submit' && patientId) {
                    e.preventDefault();
                    components.sendNyeriReferral(patientId);
                } else if (action === 'open-appt-visit' && patientId) {
                    e.preventDefault();
                    components.openPatientAppointmentVisit(patientId);
                } else if (action === 'call-patient' && patientId) {
                    e.preventDefault();
                    components.callPatientAndMarkDone(patientId, escalationId, phone);
                } else if (action === 'wipe-open') {
                    e.preventDefault();
                    components.openWipeDataModal();
                } else if (action === 'wipe-continue') {
                    e.preventDefault();
                    components.wipeDataStepContinue();
                } else if (action === 'wipe-back') {
                    e.preventDefault();
                    components.wipeDataGoBack();
                } else if (action === 'wipe-close') {
                    e.preventDefault();
                    components.closeWipeDataModal();
                } else if (action === 'wipe-confirm') {
                    e.preventDefault();
                    components.submitWipeDataErase();
                }
            });
        },

        bindPatientTableRows(root) {
            const scope = root || document;
            scope.querySelectorAll('#patientsTableBody .patient-row[data-patient-id]').forEach((row) => {
                const ref = row.getAttribute('data-patient-ref') || '';
                const pid = Number(row.getAttribute('data-patient-id') || 0);
                if (!ref && pid < 1) {
                    return;
                }
                row.style.cursor = 'pointer';
                row.onclick = (e) => {
                    if (e.target.closest('button, a')) {
                        return;
                    }
                    e.preventDefault();
                    navigateToPatient(ref || pid, pid);
                };
                row.onkeydown = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigateToPatient(ref || pid, pid);
                    }
                };
            });
        },

        async reloadPatientDetail(patientRef, internalIdFallback = 0) {
            const ref = patientRef || state.selectedPatientRef;
            const pid = Number(internalIdFallback || state.selectedPatientId || 0);
            if (!ref && pid < 1) {
                return;
            }
            const loadToken = bumpLoadToken();
            const app = document.getElementById('app');
            try {
                const response = await fetchPatientByRef(ref || pid, pid);
                const routeRef = patientOpenRef(response.patient) || patientClientSuffix(ref) || String(pid);
                if (!isLoadTokenCurrent(loadToken) || state.currentTab !== 'patient') {
                    return;
                }
                if (!response || !response.patient) {
                    throw new Error('Patient not found');
                }
                state.patientDetail = response.patient;
                state.selectedPatientId = response.patient.id;
                state.selectedPatientRef = patientOpenRef(response.patient) || routeRef;
                state.currentTab = 'patient';
                if (app) {
                    app.innerHTML = safeRender(() => this.renderPatientDetail(), 'Could not display patient');
                }
            } catch (err) {
                if (!isLoadTokenCurrent(loadToken)) {
                    return;
                }
                showNotification(err.message || t('server_error'), 'error');
                if (app) {
                    app.innerHTML = this.renderConnectionError(err);
                }
            }
        },

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
            
            const activeTab = state.currentTab === 'patient' ? 'patients' : state.currentTab;
            nav.innerHTML = tabs.map(tab => `
                <a href="#/${tab.id}" class="nav-item ${activeTab === tab.id ? 'active' : ''}"
                    data-action="switch-tab" data-tab="${tab.id}" role="tab">
                    <i class="fas ${tab.icon}"></i>
                    <span>${t(tab.label)}</span>
                </a>
            `).join('');
        },
        
        switchTab(tabId) {
            state.currentTab = tabId;
            if (tabId !== 'patient') {
                state.selectedPatientId = null;
                state.selectedPatientRef = null;
                state.patientDetail = null;
            }
            if (tabId === 'messages' && state._pendingEscalationOpen) {
                state._scrollToEscalations = true;
            }
            if (tabId !== 'patient') {
                setRouteHash(tabId);
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
                    <button type="button" class="btn-danger" data-action="wipe-open">
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
            modal.onkeydown = (ev) => {
                if (ev.key !== 'Enter') return;
                if (state._wipeStep === 1) {
                    components.wipeDataStepContinue();
                } else {
                    components.submitWipeDataErase();
                }
            };
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
                            <button type="button" class="btn-secondary" data-action="wipe-close" aria-label="Close">&times;</button>
                        </div>
                        <div class="wipe-modal-body">
                            <p class="muted">${t('wipe_all_hint')}</p>
                            <p>${t('wipe_modal_step1')}</p>
                            <label class="form-label" for="wipePasswordInput">${t('wipe_password_prompt')}</label>
                            <input type="password" id="wipePasswordInput" class="form-input" autocomplete="off"
                                   placeholder="Administrator password">
                        </div>
                        <div class="wipe-modal-actions">
                            <button type="button" class="btn-secondary" data-action="wipe-close">${t('cancel')}</button>
                            <button type="button" class="btn-primary" data-action="wipe-continue">${t('wipe_continue')}</button>
                        </div>
                    </div>`;
            }
            return `
                <div class="modal-content wipe-modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-trash-alt" style="color:#b91c1c"></i> ${t('wipe_confirm_btn')}</h2>
                        <button type="button" class="btn-secondary" data-action="wipe-close" aria-label="Close">&times;</button>
                    </div>
                    <div class="wipe-modal-body">
                        <p>${t('wipe_modal_step2')}</p>
                        <label class="form-label" for="wipePasswordConfirmInput">${t('wipe_password_confirm_label')}</label>
                        <input type="password" id="wipePasswordConfirmInput" class="form-input" autocomplete="off"
                               placeholder="Administrator password">
                        <p id="wipeModalError" class="wipe-modal-error hidden"></p>
                    </div>
                    <div class="wipe-modal-actions">
                        <button type="button" class="btn-secondary" data-action="wipe-back">${t('wipe_back')}</button>
                        <button type="button" class="btn-secondary" data-action="wipe-close">${t('cancel')}</button>
                        <button type="button" class="btn-danger" id="wipeConfirmEraseBtn" data-action="wipe-confirm">
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
                                <div class="appointment-item clickable" ${apt.patient_id ? `data-action="open-appt-visit" data-patient-id="${apt.patient_id}" role="button" tabindex="0"` : ''} style="cursor:${apt.patient_id ? 'pointer' : 'default'};">
                                    <div class="appointment-time">
                                        <i class="far fa-clock"></i>
                                        <span>${formatTime(apt.scheduled_start)}</span>
                                    </div>
                                    <div class="appointment-details">
                                        <div class="patient-name">
                                            ${escapeHtml(apt.full_name || patientClientLabel(apt))}
                                            ${apt.client_id ? `<span class="muted" style="font-size:0.85em;margin-left:6px">${escapeHtml(patientClientLabel(apt))}</span>` : ''}
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
                    ${recent.slice(0, 6).map(patient => {
                        const pref = patientOpenRef(patient);
                        return `
                        <div class="patient-card ${pref ? 'clickable' : ''}" role="${pref ? 'link' : 'group'}" tabindex="${pref ? '0' : '-1'}"
                            ${pref ? `data-action="view-patient" data-patient-ref="${escapeHtml(pref)}"` : ''}
                            aria-label="Open ${escapeHtml(patient.full_name)}">
                            ${pref ? '' : `<p class="muted" style="font-size:0.75rem;margin:0 0 4px">${t('no_client_number')}</p>`}
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
                            ${pref ? '<i class="fas fa-chevron-right" style="color: var(--gray-400);"></i>' : ''}
                        </div>`;
                    }).join('')}
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
                                    <th>${t('reg_client_no')}</th>
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
            
            return patients.map(patient => {
                const pref = patientOpenRef(patient);
                const clientLabel = patientClientLabel(patient);
                const routeSeg = pref || String(patient.id);
                return `
                <tr class="patient-row clickable" data-patient-ref="${escapeHtml(pref || '')}" data-patient-id="${patient.id}"
                    aria-label="Open patient ${escapeHtml(patient.full_name)}">
                    <td><strong>${escapeHtml(clientLabel !== '—' ? clientLabel : `#${patient.id}`)}</strong></td>
                    <td>
                        <a href="#/patient/${encodeURIComponent(routeSeg)}" class="patient-link"
                           data-action="view-patient" data-patient-ref="${escapeHtml(pref || '')}" data-patient-id="${patient.id}">
                            ${escapeHtml(patient.full_name)}
                        </a>
                    </td>
                    <td>${patient.phone || '-'}</td>
                    <td><span class="badge badge-info">${patient.preferred_language === 'sw' ? '🇹🇿 Kiswahili' : '🇬🇧 English'}</span></td>
                    <td><span class="badge badge-secondary">${patient.primary_channel || 'sms'}</span></td>
                    <td><span class="badge ${patient.status === 'active' ? 'badge-success' : 'badge-danger'}">${patient.status || 'active'}</span></td>
                    <td class="patient-row-actions">
                        <button type="button" class="btn-secondary" style="padding: 4px 12px; font-size: 0.7rem;"
                            data-action="view-patient" data-patient-ref="${escapeHtml(pref || '')}" data-patient-id="${patient.id}">
                            ${t('view_record')} <i class="fas fa-chevron-right"></i>
                        </button>
                    </td>
                </tr>`;
            }).join('');
        },

        renderPatientDetail() {
            const p = state.patientDetail;
            if (!p) return this.renderLoading();

            const contacts = p.contacts || [];
            const appointments = p.appointments || [];
            const dcr = p.doctor_call_request;
            const phone = getPatientPrimaryPhone(p);
            const openEscalationId = (p.escalations || []).find((e) => isOpenEscalationStatus(e.status))?.id || 0;
            const showCallBtn = phone && (
                isSpecialistCallPending(dcr)
                || (p.escalations || []).some((e) => isOpenEscalationStatus(e.status))
            );
            const clientId = formatClientId(p) || '—';
            const ageStr = formatPatientAge(p);
            const primaryContact = contacts.find((c) => Number(c.is_primary) === 1) || contacts[0];
            const posNeg = (v) => {
                const x = (v || '').toLowerCase();
                if (x === 'positive') return currentLanguage === 'sw' ? 'Chanya' : 'Positive';
                if (x === 'negative') return currentLanguage === 'sw' ? 'Hasi' : 'Negative';
                if (x === 'not_known') return t('reg_hiv_not_known');
                if (x === 'yes') return currentLanguage === 'sw' ? 'Ndiyo' : 'Yes';
                if (x === 'no') return currentLanguage === 'sw' ? 'Hapana' : 'No';
                if (x === 'not_done') return t('reg_via_not_done');
                if (x === '' || x === 'unknown') return t('reg_hiv_not_known');
                return escapeHtml(String(v || '—'));
            };
            const hpvDone = (p.hpv_done_before || '').toLowerCase();

            return `
                <div class="fade-in-up">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <a href="#/patients" class="btn-secondary patient-back-link"
                                    data-action="switch-tab" data-tab="patients">
                                    <i class="fas fa-arrow-left"></i> Back
                                </a>
                                <i class="fas fa-user"></i>
                                <span>${escapeHtml(p.full_name)}</span>
                            </div>
                            <span class="badge ${p.status === 'active' ? 'badge-success' : 'badge-danger'}">${p.status || 'active'}</span>
                        </div>
                        <div class="client-id-banner">
                            <span class="label">${t('reg_client_no')}</span>
                            <strong class="client-id-value">${escapeHtml(clientId)}</strong>
                        </div>
                    </div>

                    <div class="card" style="margin-top:1rem;">
                        <div class="card-header">
                            <div class="card-title"><i class="fas fa-clipboard-list"></i> ${t('reg_enrollment_details')}</div>
                        </div>
                        <div class="detail-grid" style="padding:16px;">
                            <div class="detail-item"><span class="label">${t('patient_name')}</span><span class="value">${escapeHtml(p.full_name)}</span></div>
                            <div class="detail-item"><span class="label">${t('reg_age_label')}</span><span class="value">${ageStr}</span></div>
                            <div class="detail-item"><span class="label">${t('reg_dob_optional')}</span><span class="value">${p.date_of_birth ? formatDate(p.date_of_birth, 'full') : '—'}</span></div>
                            <div class="detail-item"><span class="label">${t('select_language')}</span><span class="value">${p.preferred_language === 'sw' ? 'Kiswahili' : 'English'}</span></div>
                            <div class="detail-item"><span class="label">${t('phone_number')}</span><span class="value">${escapeHtml(phone || '—')}</span></div>
                            <div class="detail-item"><span class="label">${t('reg_contact_channel')}</span><span class="value">${primaryContact ? String(primaryContact.channel || 'sms').toUpperCase() : '—'}</span></div>
                            <div class="detail-item"><span class="label">${t('reg_opted_in')}</span><span class="value">${primaryContact && primaryContact.opted_in ? (currentLanguage === 'sw' ? 'Ndiyo' : 'Yes') : (currentLanguage === 'sw' ? 'Hapana' : 'No')}</span></div>
                            <div class="detail-item"><span class="label">${t('reg_hiv_status')}</span><span class="value">${posNeg(p.hiv_status)}</span></div>
                            <div class="detail-item"><span class="label">${t('reg_hpv_done')}</span><span class="value">${posNeg(hpvDone)}</span></div>
                            ${hpvDone === 'yes' ? `<div class="detail-item"><span class="label">${t('reg_hpv_prior')}</span><span class="value">${posNeg(p.hpv_prior_result)}</span></div>` : ''}
                            <div class="detail-item full-width"><span class="label">${t('reg_residence')}</span><span class="value">${escapeHtml(p.place_of_residence || '—')}</span></div>
                            ${patientHasConfirmedAppointment(appointments) ? `
                            <div class="detail-item"><span class="label">${t('reg_via_result')}</span><span class="value">${posNeg(p.via_result)}</span></div>
                            <div class="detail-item"><span class="label">${t('reg_via_date')}</span><span class="value">${p.via_date ? formatDate(p.via_date, 'full') : '—'}</span></div>
                            <div class="detail-item"><span class="label">${t('reg_has_cancer')}</span><span class="value">${Number(p.has_cancer) === 1 ? (currentLanguage === 'sw' ? 'Ndiyo' : 'Yes') : (currentLanguage === 'sw' ? 'Hapana' : 'No')}</span></div>
                            <div class="detail-item"><span class="label">${t('reg_treatment_date')}</span><span class="value">${p.treatment_date ? formatDate(p.treatment_date, 'full') : '—'}</span></div>` : ''}
                            <div class="detail-item"><span class="label">${t('screening_next_checkup')}</span><span class="value">${p.next_checkup_at ? formatDate(p.next_checkup_at, 'full') : '—'}</span></div>
                            <div class="detail-item"><span class="label">Registered</span><span class="value">${formatDate(p.registration_at, 'full')}</span></div>
                            <div class="detail-item full-width"><span class="label">Notes</span><span class="value">${escapeHtml(p.notes || 'None')}</span></div>
                        </div>
                    </div>

                    ${this.renderCarePathBanner(p, appointments)}
                    ${this.renderHpvResultCard(p)}
                    ${this.renderVisitWorkflowCard(p, appointments)}
                    ${this.renderViaResultCard(p, appointments)}
                    ${this.renderNyeriReferralCard(p)}

                    <div class="card contact-card" style="margin-top:1rem;">
                        <div class="card-header"><div class="card-title"><i class="fas fa-phone"></i> Contact</div></div>
                        <div style="padding:16px;">
                            ${contacts.length === 0 ? '<p class="muted">No contact on file.</p>' : contacts.map(c => `
                                <div class="meta-tag" style="margin-bottom:8px;">
                                    <i class="fas fa-${c.channel === 'whatsapp' ? 'comment' : 'sms'}"></i>
                                    ${c.channel.toUpperCase()}: ${escapeHtml(c.address)}
                                    ${c.opted_in ? '<span class="badge badge-success">Opted in</span>' : '<span class="badge badge-danger">Opted out</span>'}
                                </div>
                            `).join('')}
                            ${phone ? `
                            <a href="tel:${String(phone).replace(/[^\d+]/g, '')}" class="btn-call-patient"
                               data-action="call-patient"
                               data-patient-id="${p.id}"
                               data-escalation-id="${openEscalationId}"
                               data-phone="${String(phone).replace(/[^\d+]/g, '')}">
                                <i class="fas fa-phone-alt"></i> ${t('call_patient_btn')} — ${escapeHtml(phone)}
                            </a>
                            ${showCallBtn ? `<p class="muted call-patient-hint">${t('call_patient_sub')}</p>` : ''}
                            ` : ''}
                        </div>
                    </div>

                    ${this.renderHealthSpecialistCard(p, dcr, showCallBtn)}

                    <div class="card" style="margin-top:1rem;">
                        <div class="card-header">
                            <div class="card-title"><i class="fas fa-calendar"></i> Appointments</div>
                            <button type="button" class="btn-primary btn-sm"
                                data-action="open-appt-visit" data-patient-id="${p.id}">
                                <i class="fas fa-clipboard-check"></i> ${t('appt_manage_visit')}
                            </button>
                        </div>
                        <div style="padding:16px;">
                            ${appointments.length === 0 ? '<p class="muted">No appointments yet.</p>' : appointments.map(a => this.renderPatientAppointmentItem(a, p.id)).join('')}
                            ${this.renderPatientBookApptForm(p)}
                        </div>
                    </div>

                </div>
            `;
        },

        renderScreeningProfileCard(p) {
            if (p.screening_enabled === false) {
                return '';
            }
            if (!p.hiv_status && !p.place_of_residence && !p.via_result) {
                return '';
            }
            const ageStr = formatPatientAge(p);
            const posNeg = (v) => {
                const x = (v || '').toLowerCase();
                if (x === 'positive') return currentLanguage === 'sw' ? 'Chanya' : 'Positive';
                if (x === 'negative') return currentLanguage === 'sw' ? 'Hasi' : 'Negative';
                if (x === 'not_known') return t('reg_hiv_not_known');
                if (x === 'yes') return currentLanguage === 'sw' ? 'Ndiyo' : 'Yes';
                if (x === 'no') return currentLanguage === 'sw' ? 'Hapana' : 'No';
                if (x === 'not_done') return t('reg_via_not_done');
                if (x === '' || x === 'unknown') return t('reg_hiv_not_known');
                return escapeHtml(String(v || '—'));
            };
            const hpvDone = (p.hpv_done_before || '').toLowerCase();
            return `
                <div class="card screening-profile-card" style="margin-top:1rem;">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-notes-medical"></i> ${t('screening_profile')}</div>
                    </div>
                    <div class="detail-grid" style="padding:16px;">
                        <div class="detail-item"><span class="label">${t('reg_age_label')}</span><span class="value">${ageStr}</span></div>
                        <div class="detail-item"><span class="label">${t('reg_hiv_status')}</span><span class="value">${posNeg(p.hiv_status)}</span></div>
                        <div class="detail-item"><span class="label">${t('reg_hpv_done')}</span><span class="value">${posNeg(hpvDone)}</span></div>
                        ${hpvDone === 'yes' ? `<div class="detail-item"><span class="label">${t('reg_hpv_prior')}</span><span class="value">${posNeg(p.hpv_prior_result)}</span></div>` : ''}
                        <div class="detail-item full-width"><span class="label">${t('reg_residence')}</span><span class="value">${escapeHtml(p.place_of_residence || '—')}</span></div>
                        <div class="detail-item"><span class="label">${t('reg_via_result')}</span><span class="value">${posNeg(p.via_result)}</span></div>
                        <div class="detail-item"><span class="label">${t('reg_via_date')}</span><span class="value">${p.via_date ? formatDate(p.via_date, 'full') : '—'}</span></div>
                        ${Number(p.has_cancer) === 1 ? `<div class="detail-item"><span class="label">${t('reg_has_cancer')}</span><span class="badge badge-warning">Yes</span></div>` : ''}
                        <div class="detail-item"><span class="label">${t('reg_treatment_date')}</span><span class="value">${p.treatment_date ? formatDate(p.treatment_date, 'full') : '—'}</span></div>
                        <div class="detail-item"><span class="label">${t('screening_next_checkup')}</span><span class="value">${p.next_checkup_at ? formatDate(p.next_checkup_at, 'full') : '—'}</span></div>
                    </div>
                </div>`;
        },

        renderHealthSpecialistCard(p, dcr, showCallBtn) {
            if (!dcr && !(p.escalations || []).some(e => isOpenEscalationStatus(e.status))) {
                return '';
            }
            if (!dcr) {
                return `
                <div class="card specialist-request-card open" style="margin-top:1rem;">
                    <div class="card-header"><div class="card-title"><i class="fas fa-user-md"></i> Health Specialist Request</div></div>
                    <div style="padding:16px;">
                        <p>${t('specialist_request_open')}</p>
                        <p class="muted">${t('use_call_button_above')}</p>
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
                        ${showCallBtn ? `<p class="muted" style="margin-top:12px">${t('use_call_button_above')}</p>` : ''}
                    </div>
                </div>`;
        },

        renderCarePathBanner(p, appointments = []) {
            if (p.hpv_workflow_enabled === false && p.screening_enabled === false) {
                return '';
            }
            const cp = getCarePathState(p, appointments);
            const step = (done, label) => `
                <div class="care-path-step ${done ? 'care-path-done' : ''}">
                    <i class="fas fa-${done ? 'check-circle' : 'circle'}"></i>
                    <span>${escapeHtml(label)}</span>
                    ${done ? `<span class="badge badge-success" style="margin-left:6px;">${t('care_path_done')}</span>` : ''}
                </div>`;

            return `
                <div class="card care-path-card" style="margin-top:1rem;border-left:4px solid #0d6efd;">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-route"></i> ${t('care_path_title')}</div>
                        ${cp.nextKey ? `<span class="badge badge-warning">${t('care_path_action')}</span>` : ''}
                    </div>
                    <div style="padding:16px;">
                        <p class="muted" style="margin:0 0 12px;font-size:0.9rem;">${t('care_path_order_hint')}</p>
                        <div class="care-path-steps">
                            ${step(cp.hpvConfirmed, t('care_path_hpv'))}
                            ${step(cp.visitDone, t('care_path_visit'))}
                            ${step(cp.viaDone, t('care_path_via'))}
                        </div>
                        ${cp.outOfOrder ? `<p class="hpv-confirm-disabled" style="margin:12px 0 0;"><i class="fas fa-exclamation-triangle"></i> ${t('care_path_out_of_order')}</p>` : ''}
                        ${cp.nextKey && !cp.outOfOrder ? `<p style="margin:12px 0 0;"><strong>${t('care_path_action')}:</strong> ${t(cp.nextKey)}</p>` : ''}
                        ${cp.nextKey && cp.outOfOrder ? `<p style="margin:12px 0 0;"><strong>${t('care_path_action')}:</strong> ${t('care_path_hpv_confirm')}</p>` : ''}
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

            const appointments = p.appointments || [];
            const hasUpcomingAppt = appointments.some(
                (a) => ['proposed', 'confirmed'].includes((a.status || '').toLowerCase())
            );
            const needsApptForPositive = result === 'positive' && !hasUpcomingAppt;
            const recordedAwaitingConfirm = hasResult && Boolean(recorded) && !confirmed;

            if (recordedAwaitingConfirm) {
                const dateStr = hpvFormatConfirmedDate(recorded);
                const summaryKey = result === 'positive' ? 'hpv_recorded_positive' : 'hpv_recorded_negative';
                const summary = t(summaryKey).replace('{date}', dateStr);
                const recordedBorder = result === 'positive' ? 'hpv-card-positive' : 'hpv-card-negative';
                const viaAlready = viaIsRecorded(p);
                return `
                <div class="card hpv-result-card ${recordedBorder}" style="margin-top:1rem;">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-vial"></i> ${t('hpv_result_title')}</div>
                        <span class="badge badge-warning"><i class="fas fa-clock"></i> ${t('hpv_awaiting')}</span>
                    </div>
                    <div class="hpv-result-body">
                        ${viaAlready ? `<p class="hpv-confirm-disabled" style="margin:0 0 12px;"><i class="fas fa-exclamation-triangle"></i> ${t('care_path_out_of_order')}</p>` : ''}
                        <div class="hpv-confirmed-banner">
                            <i class="fas fa-vial"></i>
                            <p>${escapeHtml(summary)}</p>
                        </div>
                        <p class="hpv-result-badge-line">
                            <span class="badge ${result === 'positive' ? 'badge-warning' : 'badge-success'} hpv-result-badge-lg">
                                ${escapeHtml(hpvResultLabel(result))}
                            </span>
                        </p>
                        <div class="hpv-step-block hpv-step-confirm hpv-step-active" style="margin-top:16px;">
                            <h4 class="hpv-step-title">${t('hpv_step_confirm')}</h4>
                            <p class="muted">${t('hpv_confirm_hint')}</p>
                            ${needsApptForPositive ? `
                            <p class="hpv-confirm-disabled muted"><i class="fas fa-info-circle"></i> ${t('hpv_confirm_need_appointment')}</p>` : `
                            <button type="button" class="btn-danger hpv-confirm-btn"
                                data-action="hpv-confirm" data-patient-id="${p.id}" data-result="${result}">
                                <i class="fas fa-paper-plane"></i> ${t('hpv_confirm_notify')}
                            </button>`}
                        </div>
                    </div>
                </div>`;
            }

            return `
                <div class="card hpv-result-card ${borderClass}" style="margin-top:1rem;">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-vial"></i> ${t('hpv_result_title')}</div>
                    </div>
                    <div class="hpv-result-body">
                        <p class="muted hpv-result-intro">${t('hpv_result_hint')}</p>
                        <div class="hpv-step-block hpv-step-active">
                            <h4 class="hpv-step-title">${t('hpv_step_record')}</h4>
                            <div class="hpv-record-actions">
                                <button type="button" class="btn-primary"
                                    data-action="hpv-record-positive" data-patient-id="${p.id}">
                                    <i class="fas fa-plus-circle"></i> ${t('hpv_record_positive')}
                                </button>
                                <button type="button" class="btn-secondary"
                                    data-action="hpv-record-negative" data-patient-id="${p.id}">
                                    <i class="fas fa-minus-circle"></i> ${t('hpv_record_negative')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        scrollToAppointmentBookingForm() {
            requestAnimationFrame(() => {
                const form = document.getElementById('appointmentForm');
                const target = form?.closest('.appointments-form-card') || form;
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                const dateInput = form?.querySelector('[name="scheduled_start"]');
                if (dateInput) {
                    dateInput.focus();
                }
            });
        },

        async setHpvResult(patientId, result) {
            const id = Number(patientId);
            const isPositive = String(result).toLowerCase() === 'positive';
            showNotification(
                isPositive ? 'Recording HPV positive…' : 'Recording HPV negative…',
                'info'
            );
            try {
                const data = await api.post('/api/hpv_result.php', {
                    action: 'set_result',
                    patient_id: id,
                    result: String(result),
                }, false);
                if (isPositive) {
                    showNotification(data.message || t('hpv_positive_book_appt'), 'ok');
                    state.focusApptBookingAfterLoad = true;
                    await this.openPatientAppointmentVisit(id);
                    return;
                }
                showNotification(data.message || `Recorded HPV ${result.toUpperCase()}`, 'ok');
                await this.reloadPatientDetail();
            } catch (err) {
                showNotification(err.message || t('server_error'), 'error');
            }
        },

        async callPatientAndMarkDone(patientId, escalationId, phone) {
            const id = Number(patientId);
            const tel = String(phone || getPatientPrimaryPhone(state.patientDetail) || '').replace(/[^\d+]/g, '');
            if (tel) {
                window.location.href = `tel:${tel}`;
            }
            showNotification('Marking as called…', 'info');
            try {
                const data = await api.post('/api/escalation.php', {
                    action: 'mark_called',
                    patient_id: id,
                    escalation_id: Number(escalationId) || 0,
                }, false);
                showNotification(data.message || t('patient_called_success'), 'ok');
                this.closeEscalationModal();
                state.messages = null;
                state.dashboard = null;
                if (state.currentTab === 'patient') {
                    await this.reloadPatientDetail();
                } else if (state.currentTab === 'messages') {
                    await this.loadCurrentTab();
                } else {
                    await this.loadCurrentTab();
                }
            } catch (err) {
                showNotification(err.message || t('server_error'), 'error');
            }
        },

        async markSpecialistCalled(patientId, escalationId) {
            const phone = getPatientPrimaryPhone(state.patientDetail);
            await this.callPatientAndMarkDone(patientId, escalationId, phone);
        },

        renderViaRecordFormBody(p, defaultViaDate = '') {
            const dateVal = defaultViaDate || appointmentDateInputValue(new Date().toISOString());
            return `
                        <p class="muted hpv-result-intro">${t('via_result_hint')}</p>
                        <input type="hidden" name="via_result" value="">
                        <div class="hpv-step-block">
                            <h4 class="hpv-step-title">${t('via_step_record')}</h4>
                            <div class="hpv-record-actions">
                                <button type="button" class="btn-primary" data-action="via-pick-positive" data-patient-id="${p.id}">
                                    <i class="fas fa-plus-circle"></i> ${t('via_record_positive')}
                                </button>
                                <button type="button" class="btn-secondary" data-action="via-pick-negative" data-patient-id="${p.id}">
                                    <i class="fas fa-minus-circle"></i> ${t('via_record_negative')}
                                </button>
                            </div>
                        </div>
                        <div class="form-group" style="margin-top:12px;">
                            <label class="form-label">${t('reg_via_date')} *</label>
                            <input type="date" name="via_date" class="form-input" required value="${escapeHtml(dateVal)}">
                        </div>
                        <div class="form-group full-width" id="viaCancerWrap-${p.id}" style="display:none;">
                            <label class="checkbox-label reg-cancer-label">
                                <input type="checkbox" name="has_cancer" value="1">
                                <span>${t('reg_has_cancer')}</span>
                            </label>
                        </div>
                        <div class="form-group" id="viaTreatmentWrap-${p.id}" style="display:none;">
                            <label class="form-label">${t('reg_treatment_date')}</label>
                            <input type="date" name="treatment_date" class="form-input">
                        </div>
                        <button type="button" class="btn-primary" style="margin-top:12px;"
                            data-action="via-record-submit" data-patient-id="${p.id}">
                            <i class="fas fa-paper-plane"></i> ${t('via_record_save')}
                        </button>`;
        },

        renderVisitWorkflowCard(p, appointments) {
            if (p.screening_enabled === false) {
                return '';
            }
            const wf = getVisitWorkflowState(p, appointments);
            if (!wf.active || !wf.visitAppt) {
                return '';
            }
            const appt = wf.visitAppt;
            const apptWhen = `${formatDate(appt.scheduled_start, 'full')} ${formatTime(appt.scheduled_start)}`;
            const defaultViaDate = appointmentDateInputValue(appt.scheduled_start);

            return `
                <div class="card visit-workflow-card hpv-card-pending" style="margin-top:1rem;border-left:4px solid var(--accent);" id="visitWorkflowCard-${p.id}">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-clipboard-check"></i> ${t('visit_workflow_title')}</div>
                        <span class="badge badge-warning">${currentLanguage === 'sw' ? 'Inahitaji hatua' : 'Action needed'}</span>
                    </div>
                    <div class="hpv-result-body" style="padding:16px;">
                        <p class="muted" style="margin:0 0 12px;">${t(wf.isFollowUpVisit ? 'visit_workflow_intro_followup' : 'visit_workflow_intro')}</p>
                        <p style="margin:0 0 16px;"><strong>${t('visit_appt_on')}</strong> ${escapeHtml(apptWhen)}</p>

                        ${wf.pendingAttendance ? `
                        <div class="hpv-step-block hpv-step-active">
                            <h4 class="hpv-step-title">${t('visit_step_attendance')}</h4>
                            <p class="muted" style="margin:0 0 10px;font-size:0.9rem;">${t('appt_attendance_hint')}</p>
                            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                                <button type="button" class="btn-primary"
                                    data-action="appt-mark-attended" data-patient-id="${p.id}" data-appointment-id="${appt.id}">
                                    <i class="fas fa-check"></i> ${t('appt_patient_attended')}
                                </button>
                                <button type="button" class="btn-secondary" style="color:var(--danger);border-color:var(--danger);"
                                    data-action="appt-mark-missed" data-patient-id="${p.id}" data-appointment-id="${appt.id}">
                                    <i class="fas fa-times"></i> ${t('appt_patient_missed')}
                                </button>
                            </div>
                        </div>` : ''}

                        ${wf.needsVia && !wf.pendingAttendance && patientHasConfirmedAppointment(appointments) ? `
                        <div class="hpv-step-block hpv-step-active" id="viaRecordCard-${p.id}">
                            <h4 class="hpv-step-title">${t('visit_step_via')}</h4>
                            <div id="viaRecordForm-${p.id}">
                                ${this.renderViaRecordFormBody(p, defaultViaDate)}
                            </div>
                        </div>` : ''}
                    </div>
                </div>`;
        },

        renderNyeriReferralCard(p) {
            if (p.screening_enabled === false) {
                return '';
            }
            const status = getNyeriReferralStatus(p);
            const hospital = escapeHtml(status.hospital || 'Nyeri County Referral Hospital');
            const check = (done) => done
                ? '<i class="fas fa-check-circle" style="color:var(--success)"></i>'
                : '<i class="fas fa-circle" style="color:var(--muted);font-size:0.65rem"></i>';

            if (status.already_referred) {
                const when = status.referral_at ? formatDate(status.referral_at, 'full') : '—';
                const appt = status.referral_appointment_date
                    ? formatDate(status.referral_appointment_date, 'full')
                    : '—';
                return `
                <div class="card nyeri-referral-card" style="margin-top:1rem;border-left:4px solid var(--success);">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-hospital"></i> ${t('nyeri_referral_title')}</div>
                        <span class="badge badge-success">${currentLanguage === 'sw' ? 'Rufaa imetumwa' : 'Referred'}</span>
                    </div>
                    <div style="padding:16px;">
                        <p class="muted" style="margin:0 0 12px;">${escapeHtml(t('nyeri_referral_already'))}</p>
                        <p style="margin:0;"><strong>${hospital}</strong></p>
                        <p class="muted" style="margin:8px 0 0;">
                            ${currentLanguage === 'sw' ? 'Miadi' : 'Appointment'}: ${escapeHtml(appt)}
                            · ${currentLanguage === 'sw' ? 'Imetumwa' : 'Sent'}: ${escapeHtml(when)}
                        </p>
                    </div>
                </div>`;
            }

            const defaultDate = appointmentDateInputValue(new Date().toISOString());
            return `
                <div class="card nyeri-referral-card" style="margin-top:1rem;border-left:4px solid #6f42c1;" id="nyeriReferralCard-${p.id}">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-hospital"></i> ${t('nyeri_referral_title')}</div>
                    </div>
                    <div style="padding:16px;">
                        <p class="muted" style="margin:0 0 14px;">${t('nyeri_referral_intro')}</p>
                        <ul class="reg-followup-list" style="margin:0 0 16px;padding-left:1.2rem;">
                            <li>${check(status.hpv_complete)} ${t('nyeri_referral_test_hpv')}</li>
                            <li>${check(status.via_complete)} ${t('nyeri_referral_test_via')}</li>
                        </ul>
                        ${status.all_complete ? `
                        <p style="margin:0 0 12px;">${t('nyeri_referral_ready')}</p>
                        <div class="form-group" style="margin-bottom:12px;">
                            <label class="form-label">${t('nyeri_referral_appt_date')} *</label>
                            <input type="date" id="nyeriReferralDate-${p.id}" class="form-input" value="${escapeHtml(defaultDate)}">
                        </div>
                        <button type="button" class="btn-primary"
                            data-action="nyeri-referral-submit" data-patient-id="${p.id}">
                            <i class="fas fa-paper-plane"></i> ${t('nyeri_referral_send')}
                        </button>
                        <p class="muted" style="margin:10px 0 0;font-size:0.85rem;">
                            <i class="fas fa-info-circle"></i> ${hospital}
                        </p>` : `
                        <p class="muted" style="margin:0;"><i class="fas fa-info-circle"></i> ${t('nyeri_referral_pending')}</p>`}
                    </div>
                </div>`;
        },

        async sendNyeriReferral(patientId) {
            const dateInput = document.getElementById(`nyeriReferralDate-${patientId}`);
            const referralDate = (dateInput?.value || '').trim();
            if (!referralDate) {
                showNotification(t('nyeri_referral_need_date'), 'error');
                return;
            }
            if (!confirm(currentLanguage === 'sw'
                ? 'Tuma rufaa kwa Hospitali ya Rufaa ya Kaunti ya Nyeri na ujumbe kwa mgonjwa?'
                : 'Send referral to Nyeri County Referral Hospital and notify the patient?')) {
                return;
            }
            showNotification(t('processing'), 'info');
            try {
                const data = await api.post('/api/referral.php', {
                    patient_id: Number(patientId),
                    referral_appointment_date: referralDate,
                }, false);
                showNotification(
                    data.referral_sent ? t('nyeri_referral_sent') : t('success'),
                    'ok'
                );
                await this.reloadPatientDetail();
            } catch (err) {
                showNotification(err.message || t('server_error'), 'error');
            }
        },

        renderViaResultCard(p, appointments = []) {
            if (p.screening_enabled === false) {
                return `
                <div class="card via-result-card via-card-pending" style="margin-top:1rem;">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-eye"></i> ${t('via_result_title')}</div>
                    </div>
                    <div class="hpv-result-body">
                        <p class="muted">${t('via_unavailable')}</p>
                    </div>
                </div>`;
            }

            if (!patientHasConfirmedAppointment(appointments)) {
                return '';
            }

            const via = (p.via_result || '').toLowerCase();
            const hasRecorded = viaIsRecorded(p);
            const wf = getVisitWorkflowState(p, appointments);
            const borderClass = hasRecorded
                ? (via === 'positive' ? 'hpv-card-positive' : 'hpv-card-negative')
                : 'hpv-card-pending';

            if (hasRecorded) {
                const dateStr = p.via_date ? formatDate(p.via_date, 'full') : '—';
                const summaryKey = via === 'positive' ? 'via_recorded_positive' : 'via_recorded_negative';
                const summary = t(summaryKey).replace('{date}', dateStr);
                return `
                <div class="card via-result-card ${borderClass}" style="margin-top:1rem;">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-eye"></i> ${t('via_result_title')}</div>
                        <span class="badge badge-success"><i class="fas fa-check-circle"></i> ${t('hpv_confirmed')}</span>
                    </div>
                    <div class="hpv-result-body">
                        <div class="hpv-confirmed-banner">
                            <i class="fas fa-check-circle"></i>
                            <p>${escapeHtml(summary)}</p>
                        </div>
                        <p class="hpv-result-badge-line">
                            <span class="badge ${via === 'positive' ? 'badge-warning' : 'badge-success'} hpv-result-badge-lg">
                                ${escapeHtml(hpvResultLabel(via))}
                            </span>
                        </p>
                        ${Number(p.has_cancer) === 1 ? `<p class="muted">${escapeHtml(t('reg_followup_referral'))}</p>` : ''}
                        ${p.next_checkup_at ? `<p class="muted">${t('screening_next_checkup')}: ${formatDate(p.next_checkup_at, 'full')}</p>` : ''}
                    </div>
                </div>`;
            }

            if (wf.active) {
                return '';
            }

            return `
                <div class="card via-result-card ${borderClass}" style="margin-top:1rem;" id="viaRecordCard-${p.id}">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-eye"></i> ${t('via_result_title')}</div>
                    </div>
                    <div class="hpv-result-body" id="viaRecordForm-${p.id}">
                        ${this.renderViaRecordFormBody(p, '')}
                    </div>
                </div>`;
        },

        renderPatientAppointmentItem(a, patientId) {
            const status = (a.status || '').toLowerCase();
            const badgeClass = status === 'completed' ? 'badge-success'
                : status === 'no_show' ? 'badge-danger'
                    : status === 'confirmed' ? 'badge-success' : 'badge-warning';
            return `
                <div class="appointment-item" style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border);">
                    <strong>${formatDate(a.scheduled_start, 'full')} ${formatTime(a.scheduled_start)}</strong>
                    <span class="badge ${badgeClass}">${appointmentStatusLabel(a.status)}</span>
                    ${a.department ? `<div>${escapeHtml(a.department)}</div>` : ''}
                    ${a.reason ? `<div class="muted">${escapeHtml(a.reason)}</div>` : ''}
                </div>`;
        },

        async markAppointmentAttended(appointmentId, patientId) {
            showNotification(t('processing'), 'info');
            try {
                const data = await api.post('/api/appointments.php', {
                    action: 'mark_attended',
                    appointment_id: Number(appointmentId),
                }, false);
                showNotification(
                    data.record_via_next ? t('appt_attended_via_hint') : t('success'),
                    'ok'
                );
                await this.refreshAfterVisitAction(patientId);
                if (data.record_via_next) {
                    const visitCard = document.getElementById(`visitWorkflowCard-${patientId}`)
                        || document.getElementById(`viaRecordCard-${patientId}`);
                    if (visitCard) {
                        visitCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            } catch (err) {
                showNotification(err.message || t('server_error'), 'error');
            }
        },

        async markAppointmentMissed(appointmentId, patientId) {
            const ok = window.confirm(
                currentLanguage === 'sw'
                    ? 'Weka kuwa hakuhudhuria na kumjulisha mgonjwa kwa SMS/WhatsApp?'
                    : 'Mark as missed and notify the patient by SMS/WhatsApp?'
            );
            if (!ok) {
                return;
            }
            showNotification(t('processing'), 'info');
            try {
                const data = await api.post('/api/appointments.php', {
                    action: 'mark_missed',
                    appointment_id: Number(appointmentId),
                }, false);
                showNotification(
                    data.missed_message_sent ? t('appt_missed_sent') : t('success'),
                    'ok'
                );
                await this.refreshAfterVisitAction(patientId);
            } catch (err) {
                showNotification(err.message || t('server_error'), 'error');
            }
        },

        renderPatientBookApptForm(p) {
            return `
                <div class="patient-book-appt" style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
                    <h4 style="margin:0 0 8px;"><i class="fas fa-calendar-plus"></i> ${t('book_appt_inline_title')}</h4>
                    <p class="muted" style="margin:0 0 12px;font-size:0.9rem;">${t('book_appt_inline_hint')}</p>
                    <form id="patientBookApptForm-${p.id}" class="form-container">
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Date & Time *</label>
                                <input type="datetime-local" name="scheduled_start" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Department</label>
                                <input type="text" name="department" class="form-input" placeholder="e.g. VIA / HPV Clinic">
                            </div>
                        </div>
                        <div class="form-group full-width">
                            <label class="form-label">Reason for Visit *</label>
                            <textarea name="reason" class="form-textarea" required rows="2"></textarea>
                        </div>
                        <button type="button" class="btn-primary" data-action="book-appt-submit" data-patient-id="${p.id}">
                            <i class="fas fa-calendar-check"></i> ${t('book_appt_submit')}
                        </button>
                    </form>
                </div>`;
        },

        pickViaResult(patientId, result) {
            const form = document.getElementById(`viaRecordForm-${patientId}`);
            if (!form) {
                return;
            }
            const hidden = form.querySelector('[name="via_result"]');
            if (hidden) {
                hidden.value = result;
            }
            const posBtn = form.querySelector('[data-action="via-pick-positive"]');
            const negBtn = form.querySelector('[data-action="via-pick-negative"]');
            if (posBtn) {
                posBtn.classList.toggle('hpv-selected', result === 'positive');
            }
            if (negBtn) {
                negBtn.classList.toggle('hpv-selected', result === 'negative');
            }
            const cancerWrap = document.getElementById(`viaCancerWrap-${patientId}`);
            const treatmentWrap = document.getElementById(`viaTreatmentWrap-${patientId}`);
            const showExtra = result === 'positive';
            if (cancerWrap) {
                cancerWrap.style.display = showExtra ? '' : 'none';
            }
            if (treatmentWrap) {
                treatmentWrap.style.display = showExtra ? '' : 'none';
            }
            if (!showExtra) {
                const cancerCb = form.querySelector('[name="has_cancer"]');
                if (cancerCb) {
                    cancerCb.checked = false;
                }
            }
        },

        async recordViaResult(patientId) {
            const form = document.getElementById(`viaRecordForm-${patientId}`);
            if (!form) {
                return;
            }
            const viaResult = form.querySelector('[name="via_result"]')?.value || '';
            const viaDate = form.querySelector('[name="via_date"]')?.value || '';
            const hasCancer = form.querySelector('[name="has_cancer"]')?.checked ? 1 : 0;
            const treatmentDate = form.querySelector('[name="treatment_date"]')?.value || '';
            if (!viaResult || !viaDate) {
                showNotification(
                    currentLanguage === 'sw'
                        ? 'Chagua matokeo ya VIA na tarehe ya kipimo.'
                        : 'Select VIA result and test date.',
                    'error'
                );
                return;
            }
            showNotification('Recording VIA result…', 'info');
            try {
                const data = await api.post('/api/via_result.php', {
                    patient_id: Number(patientId),
                    via_result: viaResult,
                    via_date: viaDate,
                    has_cancer: hasCancer,
                    treatment_date: treatmentDate || undefined,
                }, false);
                let msg = currentLanguage === 'sw'
                    ? 'Matokeo ya VIA yamehifadhiwa na ujumbe umetumwa kwa mgonjwa.'
                    : 'VIA result recorded and message sent to patient.';
                if (data.referral_sent) {
                    msg += currentLanguage === 'sw' ? ' (SMS ya rufaa.)' : ' (Referral pathway.)';
                }
                if (data.next_checkup_at) {
                    msg += ` ${t('screening_next_checkup')}: ${formatDate(data.next_checkup_at, 'full')}.`;
                }
                showNotification(msg, 'ok');
                await this.refreshAfterVisitAction(patientId);
            } catch (err) {
                showNotification(err.message || t('server_error'), 'error');
            }
        },

        async bookPatientAppointment(patientId) {
            const form = document.getElementById(`patientBookApptForm-${patientId}`);
            if (!form) {
                return;
            }
            const fd = new FormData(form);
            const body = Object.fromEntries(fd.entries());
            body.action = 'add';
            body.patient_id = Number(patientId);
            const btn = form.querySelector('[data-action="book-appt-submit"]');
            if (btn?.disabled) {
                return;
            }
            if (btn) {
                btn.disabled = true;
            }
            showNotification(t('processing'), 'info');
            try {
                const data = await api.post('/api/appointments.php', body);
                let bookedMsg = t('book_appt_confirm_only');
                if (data.hpv_result_sent) {
                    bookedMsg = t('book_appt_hpv_sent');
                    if (data.counseling_started) {
                        bookedMsg += currentLanguage === 'sw'
                            ? ' Vidokezo vya FAQ vitaendelea hadi VIA iwekwe.'
                            : ' Gentle FAQ tips will continue until VIA is recorded.';
                    }
                }
                showNotification(bookedMsg, 'ok');
                form.reset();
                await this.reloadPatientDetail();
            } catch (err) {
                showNotification(err.message || t('server_error'), 'error');
            } finally {
                if (btn) {
                    btn.disabled = false;
                }
            }
        },

        async confirmHpvResult(patientId, resultHint) {
            const label = hpvResultLabel(resultHint || '');
            if (!window.confirm(t('hpv_confirm_dialog').replace('{result}', label))) {
                return;
            }
            showNotification('Sending result to patient…', 'info');
            try {
                const data = await api.post('/api/hpv_result.php', {
                    action: 'confirm_result',
                    patient_id: Number(patientId),
                }, false);
                showNotification(
                    data.counseling_started
                        ? 'Result sent. Follow-up messages will go out gently over the next hours and days (not all at once).'
                        : 'Result sent to patient.',
                    'ok'
                );
                await this.reloadPatientDetail();
            } catch (err) {
                showNotification(err.message, 'error');
            }
        },

        async viewPatient(ref, internalIdFallback = 0) {
            const pid = Number(internalIdFallback || 0);
            const routeRef = patientClientSuffix(ref) || patientOpenRef(ref) || (pid > 0 ? String(pid) : '');
            if (!routeRef) {
                showNotification(t('no_client_number'), 'error');
                return;
            }
            const loadToken = bumpLoadToken();
            state.selectedPatientRef = patientClientSuffix(ref) || null;
            state.selectedPatientId = pid || null;
            state.currentTab = 'patient';
            state.patientDetail = null;
            setRouteHash(`patient/${encodeURIComponent(routeRef)}`);
            this.renderNav();
            const app = document.getElementById('app');
            const hadContent = Boolean(app && app.innerHTML.trim());
            if (app) {
                if (hadContent) {
                    showAppLoadingOverlay(app);
                } else {
                    app.innerHTML = this.renderLoading();
                }
            }
            try {
                const response = await fetchPatientByRef(ref || pid, pid);
                if (!isLoadTokenCurrent(loadToken) || state.currentTab !== 'patient') {
                    return;
                }
                if (!response || !response.patient) {
                    throw new Error('Patient not found');
                }
                state.patientDetail = response.patient;
                state.selectedPatientId = response.patient.id;
                state.selectedPatientRef = patientOpenRef(response.patient) || state.selectedPatientRef;
                if (state.selectedPatientRef) {
                    setRouteHash(`patient/${encodeURIComponent(state.selectedPatientRef)}`);
                }
                if (app) {
                    removeAppLoadingOverlay();
                    app.innerHTML = safeRender(() => this.renderPatientDetail(), 'Could not display patient');
                }
            } catch (err) {
                if (!isLoadTokenCurrent(loadToken)) {
                    return;
                }
                console.error('viewPatient failed:', err);
                showNotification(err.message || t('connection_error'), 'error');
                if (app) {
                    removeAppLoadingOverlay();
                    app.innerHTML = this.renderConnectionError(err);
                }
            }
        },

        async openPatientAppointmentVisit(patientId) {
            const id = Number(patientId);
            if (id < 1) {
                return;
            }
            state.selectedPatientId = id;
            state.currentTab = 'appointments';
            setRouteHash('appointments');
            this.renderNav();
            const app = document.getElementById('app');
            if (app && state.apptWorkflowPatient?.id !== id) {
                app.innerHTML = this.renderLoading();
            }
            try {
                const response = await api.get(`/api/patients.php?id=${id}`);
                if (!response?.patient) {
                    throw new Error('Patient not found');
                }
                state.apptWorkflowPatient = response.patient;
                if (state.currentTab === 'appointments') {
                    if (app) {
                        app.innerHTML = this.renderAppointmentsPage();
                    }
                    this.setupAppointmentsPageAfterRender();
                    if (state.focusApptBookingAfterLoad) {
                        state.focusApptBookingAfterLoad = false;
                        this.scrollToAppointmentBookingForm();
                    }
                }
            } catch (err) {
                showNotification(err.message || t('server_error'), 'error');
                if (state.currentTab === 'appointments' && app) {
                    app.innerHTML = this.renderAppointmentsPage();
                    this.setupAppointmentsPageAfterRender();
                    if (state.focusApptBookingAfterLoad) {
                        state.focusApptBookingAfterLoad = false;
                        this.scrollToAppointmentBookingForm();
                    }
                }
            }
        },

        scheduleForPatient(patientId) {
            this.openPatientAppointmentVisit(patientId);
        },

        renderApptPatientWorkflowPanel(p) {
            if (!p) {
                return `
                    <div class="card appointments-workflow-card" style="margin-top:1rem;">
                        <div style="padding:16px;">
                            <p class="muted" style="margin:0;"><i class="fas fa-info-circle"></i> ${t('appt_select_patient_workflow')}</p>
                        </div>
                    </div>`;
            }
            const appointments = p.appointments || [];
            const wf = getVisitWorkflowState(p, appointments);
            const nextAppt = appointments.find((a) => ['proposed', 'confirmed'].includes((a.status || '').toLowerCase()));
            const pref = patientOpenRef(p) || String(p.id);
            return `
                <div class="card appointments-workflow-card" style="margin-top:1rem;border:2px solid var(--accent);">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fas fa-user-check"></i>
                            ${escapeHtml(p.full_name)} — ${t('appt_manage_visit')}
                        </div>
                        <button type="button" class="btn-secondary btn-sm"
                            data-action="view-patient" data-patient-ref="${escapeHtml(pref)}" data-patient-id="${p.id}">
                            <i class="fas fa-user"></i> ${t('view_record')}
                        </button>
                    </div>
                    <div style="padding:0 16px 16px;">
                        <p class="muted" style="margin:0 0 12px;">${t('appt_workflow_panel_hint')}</p>
                        ${wf.active ? this.renderVisitWorkflowCard(p, appointments).replace('margin-top:1rem;', 'margin-top:0;') : ''}
                        ${!wf.active && nextAppt ? `
                        <p class="muted" style="margin:0;">
                            <i class="fas fa-calendar"></i> ${t('appt_workflow_upcoming')}
                            <br><strong>${formatDate(nextAppt.scheduled_start, 'full')} ${formatTime(nextAppt.scheduled_start)}</strong>
                        </p>` : ''}
                        ${!wf.active && !nextAppt ? `<p class="muted" style="margin:0;">${t('no_appointments')}</p>` : ''}
                    </div>
                </div>`;
        },

        async refreshApptWorkflowPanel(patientId) {
            const id = Number(patientId || state.selectedPatientId || 0);
            if (id < 1) {
                return;
            }
            try {
                const response = await api.get(`/api/patients.php?id=${id}`);
                if (response?.patient) {
                    state.apptWorkflowPatient = response.patient;
                    state.selectedPatientId = id;
                }
                const mount = document.getElementById('apptPatientWorkflowMount');
                if (mount && state.currentTab === 'appointments') {
                    mount.innerHTML = this.renderApptPatientWorkflowPanel(state.apptWorkflowPatient);
                }
                const apptRes = await api.get('/api/appointments.php');
                state.appointments = apptRes.items || [];
                this.filterAppointmentsList();
            } catch (err) {
                console.error('refreshApptWorkflowPanel:', err);
            }
        },

        async refreshAfterVisitAction(patientId) {
            const id = Number(patientId);
            if (state.currentTab === 'appointments') {
                await this.refreshApptWorkflowPanel(id);
                return;
            }
            if (state.currentTab === 'patient') {
                await this.reloadPatientDetail();
            }
        },

        setupAppointmentsPageAfterRender() {
            const sel = document.getElementById('apptPatientSelect');
            if (sel) {
                if (state.selectedPatientId) {
                    sel.value = String(state.selectedPatientId);
                }
                if (!sel.dataset.bound) {
                    sel.dataset.bound = '1';
                    sel.addEventListener('change', async () => {
                        const pid = Number(sel.value || 0);
                        if (pid > 0) {
                            await this.openPatientAppointmentVisit(pid);
                        } else {
                            state.apptWorkflowPatient = null;
                            state.selectedPatientId = null;
                            const mount = document.getElementById('apptPatientWorkflowMount');
                            if (mount) {
                                mount.innerHTML = this.renderApptPatientWorkflowPanel(null);
                            }
                        }
                    });
                }
            }

            (async () => {
                try {
                    const response = await api.get('/api/appointments.php');
                    state.appointments = response.items || [];
                    this.filterAppointmentsList();
                    this.setupAppointmentsFilters();
                } catch (err) {
                    const content = document.getElementById('appointmentsContent');
                    if (content) {
                        content.innerHTML = this.renderConnectionError(err);
                    }
                }
            })();

            const apptForm = document.getElementById('appointmentForm');
            if (apptForm && !apptForm.dataset.bound) {
                apptForm.dataset.bound = '1';
                apptForm.onsubmit = async (e) => {
                    e.preventDefault();
                    const submitBtn = apptForm.querySelector('button[type="submit"]');
                    if (submitBtn?.disabled) {
                        return;
                    }
                    if (submitBtn) {
                        submitBtn.disabled = true;
                    }
                    const fd = new FormData(apptForm);
                    const body = Object.fromEntries(fd.entries());
                    body.action = 'add';
                    try {
                        await api.post('/api/appointments.php', body);
                        showNotification(
                            currentLanguage === 'sw'
                                ? 'Miadi imepangwa. Ujumbe wa uthibitisho umetumwa kwa mgonjwa.'
                                : 'Appointment booked. Confirmation message sent to patient.',
                            'ok'
                        );
                        const pid = Number(body.patient_id || 0);
                        if (pid > 0) {
                            await this.refreshApptWorkflowPanel(pid);
                        } else {
                            const apptRes = await api.get('/api/appointments.php');
                            state.appointments = apptRes.items || [];
                            this.filterAppointmentsList();
                        }
                        apptForm.reset();
                        if (sel && state.selectedPatientId) {
                            sel.value = String(state.selectedPatientId);
                        }
                    } catch (err) {
                        showNotification(err.message, 'error');
                    } finally {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                        }
                    }
                };
            }
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
                                <label class="form-label">${t('reg_dob_optional')}</label>
                                <input type="date" name="date_of_birth" class="form-input">
                            </div>

                            <div class="form-group">
                                <label class="form-label">${t('reg_age_label')} *</label>
                                <input type="number" name="age" class="form-input" min="1" max="120" inputmode="numeric"
                                    placeholder="${currentLanguage === 'sw' ? 'mf. 35' : 'e.g. 35'}">
                                <small class="form-hint-muted">${t('reg_age_hint')}</small>
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
                                <label class="form-label">${t('reg_client_no')} *</label>
                                <div class="client-id-input-group">
                                    <span class="client-id-prefix" id="clientIdPrefix">${escapeHtml(clientIdPrefix())}</span>
                                    <input type="text" name="client_no_suffix" id="clientNoSuffix" class="form-input client-id-suffix"
                                           required maxlength="6" inputmode="numeric" pattern="[0-9]{1,6}"
                                           placeholder="022" autocomplete="off">
                                </div>
                                <small class="form-hint-muted">${t('reg_client_no_hint')} <strong id="clientIdPreview">${escapeHtml(clientIdPrefix())}…</strong></small>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">${t('select_channel')} *</label>
                                <select name="contact_channel" class="form-select" required>
                                    <option value="sms">📱 SMS</option>
                                    <option value="whatsapp">💬 WhatsApp</option>
                                </select>
                            </div>

                            <div class="form-group full-width reg-screening-section">
                                <h3 class="reg-section-title"><i class="fas fa-stethoscope"></i> ${t('reg_screening_section')}</h3>
                            </div>

                            <div class="form-group">
                                <label class="form-label">${t('reg_hiv_status')} *</label>
                                <select name="hiv_status" class="form-select" required>
                                    <option value="">—</option>
                                    <option value="negative">${currentLanguage === 'sw' ? 'Hasi' : 'Negative'}</option>
                                    <option value="positive">${currentLanguage === 'sw' ? 'Chanya' : 'Positive'}</option>
                                    <option value="not_known">${t('reg_hiv_not_known')}</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">${t('reg_hpv_done')} *</label>
                                <select name="hpv_done_before" class="form-select" required>
                                    <option value="">—</option>
                                    <option value="no">${currentLanguage === 'sw' ? 'Hapana' : 'No'}</option>
                                    <option value="yes">${currentLanguage === 'sw' ? 'Ndiyo' : 'Yes'}</option>
                                </select>
                            </div>

                            <div class="form-group" id="regHpvPriorWrap" style="display:none;">
                                <label class="form-label">${t('reg_hpv_prior')} *</label>
                                <select name="hpv_prior_result" class="form-select">
                                    <option value="">—</option>
                                    <option value="negative">${currentLanguage === 'sw' ? 'Hasi' : 'Negative'}</option>
                                    <option value="positive">${currentLanguage === 'sw' ? 'Chanya' : 'Positive'}</option>
                                </select>
                            </div>

                            <div class="form-group full-width">
                                <label class="form-label">${t('reg_residence')} *</label>
                                <input type="text" name="place_of_residence" class="form-input" required
                                    placeholder="${currentLanguage === 'sw' ? 'Mf. Nyeri, Mweiga' : 'e.g. Nyeri Town, Mweiga'}">
                            </div>

                            <div class="form-group full-width">
                                <label class="form-label">${t('reg_followup_preview')}</label>
                                <div id="regFollowupPreview" class="reg-followup-preview card" style="padding:12px;"></div>
                            </div>
                            
                            <div class="form-group full-width">
                                <label class="form-label">Notes</label>
                                <textarea name="notes" class="form-textarea" rows="3"></textarea>
                            </div>
                            
                            <div class="form-group full-width">
                                <label class="checkbox-label">
                                    <input type="checkbox" name="opt_in" checked required>
                                    <span>✅ ${t('reg_consent_signed')}</span>
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

                    <div id="apptPatientWorkflowMount">
                        ${this.renderApptPatientWorkflowPanel(state.apptWorkflowPatient)}
                    </div>

                    <div class="card appointments-section appointments-form-card" id="appointmentsBookingCard">
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
                                        ${(state.patients || []).map(p => `<option value="${p.id}">${escapeHtml(p.full_name)} — ${escapeHtml(patientClientLabel(p))}</option>`).join('')}
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
                                        <article class="appointment-card-v2 status-${apt.status || 'proposed'}" ${apt.patient_id ? `data-action="open-appt-visit" data-patient-id="${apt.patient_id}" role="button" tabindex="0" style="cursor:pointer"` : ''}>
                                            <div class="appt-card-top">
                                                <div class="appointment-patient-avatar">${(apt.full_name || 'P').charAt(0).toUpperCase()}</div>
                                                <div class="appt-card-headline">
                                                    <h4>${escapeHtml(apt.full_name || 'Unknown Patient')}</h4>
                                                    <span class="appt-id">${escapeHtml(patientClientLabel(apt))}</span>
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
                                                ${apt.patient_id ? `<button type="button" class="btn-primary btn-sm" data-action="open-appt-visit" data-patient-id="${apt.patient_id}"><i class="fas fa-clipboard-check"></i> ${t('appt_manage_visit')}</button>` : ''}
                                                ${patientOpenRef(apt) ? `<button type="button" class="btn-secondary btn-sm" data-action="view-patient" data-patient-ref="${escapeHtml(patientOpenRef(apt) || '')}" data-patient-id="${apt.patient_id || 0}"><i class="fas fa-user"></i> ${t('view_record')}</button>` : ''}
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
                    String(apt.patient_id || '').includes(q) ||
                    (apt.client_id || '').toLowerCase().includes(q) ||
                    patientClientSuffix(apt.client_id || '').includes(q.replace(/\D/g, ''))
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
                            <p class="muted">Send a personalised message to one patient or broadcast to all active, opted-in patients. WhatsApp uses the approved template <code>afya_staff_message</code> (your text goes in variable {{1}}).</p>
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
                                    ${(state.patients || []).map(p => `<option value="${p.id}">${escapeHtml(p.full_name || '')} — ${escapeHtml(patientClientLabel(p))}</option>`).join('')}
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
                                    <p class="escalation-id">${escapeHtml(patientClientLabel(esc))} · ${esc.phone ? escapeHtml(esc.phone) : 'No phone'}</p>
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
                            ${patientOpenRef(esc) ? `<button class="btn-secondary btn-sm" onclick="event.stopPropagation(); window.components.viewPatient(${escJsString(patientOpenRef(esc))})">
                                <i class="fas fa-user"></i> Patient
                            </button>` : ''}
                            ${isOpenEscalationStatus(esc.status) && esc.phone ? `
                            <a class="btn-primary btn-sm" style="display:inline-flex;align-items:center;gap:6px;text-decoration:none"
                               href="tel:${String(esc.phone).replace(/[^\d+]/g, '')}"
                               data-action="call-patient"
                               data-patient-id="${esc.patient_id || 0}"
                               data-escalation-id="${esc.id}"
                               data-phone="${escapeHtml(esc.phone)}"
                               onclick="event.stopPropagation()">
                                <i class="fas fa-phone"></i> ${t('call_patient_btn')}
                            </a>` : ''}
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
                                    <span class="label">${t('reg_client_no')}</span>
                                    <span class="value">${escapeHtml(patientClientLabel(escalation))}</span>
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
                            ${isOpenEscalationStatus(escalation.status) && escalation.phone ? `
                            <a class="btn-primary" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px"
                               href="tel:${String(escalation.phone).replace(/[^\d+]/g, '')}"
                               data-action="call-patient"
                               data-patient-id="${escalation.patient_id || 0}"
                               data-escalation-id="${escalation.id}"
                               data-phone="${escapeHtml(escalation.phone)}">
                                <i class="fas fa-phone"></i> ${t('call_patient_btn')}
                            </a>` : `
                            <p class="badge badge-success" style="display:inline-flex;align-items:center;gap:8px;padding:10px 14px;">
                                <i class="fas fa-check"></i> ${t('status_called')}
                            </p>`}
                            ${patientOpenRef(escalation) ? `<button type="button" class="btn-secondary" onclick="window.components.viewPatient(${escJsString(patientOpenRef(escalation))}); window.components.closeEscalationModal();">
                                <i class="fas fa-user"></i> View Patient Record
                            </button>` : ''}
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

            const loadToken = bumpLoadToken();
            const tabAtStart = state.currentTab;
            
            state.isLoading = true;
            app.innerHTML = this.renderLoading();
            
            try {
                if (tabAtStart === 'dashboard') {
                    const response = await api.get('/api/dashboard.php');
                    if (!isLoadTokenCurrent(loadToken) || state.currentTab !== 'dashboard') {
                        return;
                    }
                    state.dashboard = response;
                    app.innerHTML = this.renderDashboard();
                    showNotification(t('ready'), 'ok');
                } 
                else if (tabAtStart === 'patients') {
                    const response = await api.get('/api/patients.php');
                    if (!isLoadTokenCurrent(loadToken) || state.currentTab !== 'patients') {
                        return;
                    }
                    state.patients = response.items || [];
                    app.innerHTML = this.renderPatients();
                    this.bindPatientTableRows(app);
                    
                    const searchBtn = document.getElementById('searchBtn');
                    const searchInput = document.getElementById('patientSearch');
                    
                    if (searchBtn && searchInput) {
                        const performSearch = async () => {
                            if (state.currentTab !== 'patients') {
                                return;
                            }
                            const query = searchInput.value.trim();
                            const response = await api.get(`/api/patients.php?q=${encodeURIComponent(query)}`);
                            if (state.currentTab !== 'patients') {
                                return;
                            }
                            state.patients = response.items || [];
                            const tbody = document.getElementById('patientsTableBody');
                            if (tbody) {
                                tbody.innerHTML = this.renderPatientsTable();
                                this.bindPatientTableRows(tbody);
                            }
                        };
                        
                        searchBtn.onclick = performSearch;
                        searchInput.onkeypress = (e) => {
                            if (e.key === 'Enter') performSearch();
                        };
                    }
                } 
                else if (tabAtStart === 'register') {
                    if (!isLoadTokenCurrent(loadToken) || state.currentTab !== 'register') {
                        return;
                    }
                    app.innerHTML = this.renderRegister();
                    const form = document.getElementById('registerForm');
                    if (form) {
                        setupRegisterForm(form);
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
                                const ageDob = resolveRegisterAgeDob(form);
                                body.date_of_birth = ageDob.date_of_birth;
                                body.age = ageDob.age;
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
                                let msg = result.message || t('success');
                                if (result.client_id) {
                                    msg += ` ${t('reg_client_no')}: ${result.client_id}.`;
                                }
                                if (result.next_checkup_at) {
                                    msg += ` ${t('screening_next_checkup')}: ${formatDate(result.next_checkup_at, 'full')}.`;
                                }
                                if (result.referral_sent) {
                                    msg += currentLanguage === 'sw'
                                        ? ' SMS ya rufaa imetumwa.'
                                        : ' Referral SMS sent.';
                                }
                                showNotification(msg + ' ' + t('reg_open_patient_hint'), 'ok');
                                form.reset();
                                
                                const overlay = document.querySelector('.loading-overlay');
                                if (overlay) overlay.remove();
                                submitBtn.disabled = false;
                                
                                if (result.patient_id) {
                                    setTimeout(() => {
                                        navigateToPatient(result.client_id || result.patient_id, result.patient_id);
                                    }, 800);
                                } else {
                                    setTimeout(() => this.switchTab('patients'), 1500);
                                }
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
                else if (tabAtStart === 'patient') {
                    if (!state.selectedPatientRef && !state.selectedPatientId) {
                        this.switchTab('patients');
                        return;
                    }
                    await this.reloadPatientDetail(state.selectedPatientRef);
                }
                else if (tabAtStart === 'appointments') {
                    if (!isLoadTokenCurrent(loadToken) || state.currentTab !== 'appointments') {
                        return;
                    }
                    try {
                        const pr = await api.get('/api/patients.php');
                        state.patients = pr.items || [];
                    } catch (e) { /* optional */ }
                    if (!isLoadTokenCurrent(loadToken) || state.currentTab !== 'appointments') {
                        return;
                    }
                    if (state.selectedPatientId && !state.apptWorkflowPatient) {
                        try {
                            const pr = await api.get(`/api/patients.php?id=${state.selectedPatientId}`);
                            state.apptWorkflowPatient = pr.patient || null;
                        } catch (e) { /* optional */ }
                    }
                    app.innerHTML = this.renderAppointmentsPage();
                    this.setupAppointmentsPageAfterRender();
                } 
                else if (tabAtStart === 'messages') {
                    const response = await api.get('/api/message_center.php');
                    if (!isLoadTokenCurrent(loadToken) || state.currentTab !== 'messages') {
                        return;
                    }
                    state.messages = response;
                    try {
                        const pr = await api.get('/api/patients.php');
                        state.patients = pr.items || [];
                    } catch (e) { /* patient picker is optional */ }
                    if (!isLoadTokenCurrent(loadToken) || state.currentTab !== 'messages') {
                        return;
                    }
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
                if (!isLoadTokenCurrent(loadToken)) {
                    return;
                }
                console.error('Error loading tab:', error);
                app.innerHTML = this.renderConnectionError(error);
                showNotification(`${t('error')}: ${error.message}`, 'error');
            } finally {
                if (isLoadTokenCurrent(loadToken)) {
                    state.isLoading = false;
                }
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
                    showNotification(res.failed ? `Sent to ${res.sent}, failed ${res.failed}` : `Message sent to ${res.sent} patient(s)`, res.failed ? 'error' : 'ok');
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
            if (!apt?.patient_id) {
                showNotification('Appointment not found', 'error');
                return;
            }
            this.openPatientAppointmentVisit(apt.patient_id);
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
                                <div class="logo-text">${cfg.APP_NAME || 'Nyeri Town Health Center'}</div>
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
                <p>© 2026 ${cfg.APP_NAME || 'Nyeri Town Health Center'} | ${cfg.APP_VERSION || 'HPV Care'} | ${API_BASE_URL}</p>
            </footer>
        `;
        
        window.components = components;

        components.setupActionDelegation();
        window.addEventListener('hashchange', onHashRouteChange);
        
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
        const bootHash = (window.location.hash || '').replace(/^#\/?/, '');
        if (bootHash) {
            applyRouteFromHash();
        } else {
            components.loadCurrentTab();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
