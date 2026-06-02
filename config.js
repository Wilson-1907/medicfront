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
  
  APP_NAME: "Nyeri Level 4 Hospital — HPV Care",
  APP_VERSION: "2.9.0",
  /** Nurse enters digits after this prefix (lab register: NC/NTHC/001/022). */
  CLIENT_ID_PREFIX: "NC/NTHC/001/"
};
