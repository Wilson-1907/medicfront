window.HPV_CONFIG = {
  // Your actual backend URL
  BACKEND_BASE_URL: "https://medicback.onrender.com",
  
  // NO MOCK DATA - Pure backend only
  USE_MOCK_DATA: false,
  
  // API Endpoints
  ENDPOINTS: {
    DASHBOARD: "/api/dashboard.php",
    PATIENTS: "/api/patients.php",
    APPOINTMENTS: "/api/appointments.php",
    MESSAGE_CENTER: "/api/message_center.php"
  },
  
  APP_NAME: "Nyeri Town Health Center",
  APP_PROGRAM: "HPV Care",
  APP_CREDIT: "TechFlare Solutions",
  APP_VERSION: "2.9.2",
  /** Full client ID: NTHC/{file}/{patient} e.g. NTHC/01/05 */
  CLIENT_ID_PREFIX: "NTHC/"
};
