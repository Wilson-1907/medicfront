window.PHV_CONFIG = {
  BACKEND_BASE_URL: "https://medicback.onrender.com"
};
window.PHV_CONFIG = {
  // Your actual backend URL
  BACKEND_BASE_URL: "https://medicback.onrender.com",
  
  // API Endpoints based on your repository structure
  ENDPOINTS: {
    DASHBOARD: "/api/dashboard.php",
    PATIENTS: "/api/patients.php",
    APPOINTMENTS: "/api/appointments.php",
    MESSAGE_CENTER: "/api/message_center.php",
    PATIENT_VIEW: "/patient_view.php",
    PATIENT_NEW: "/patient_new.php",
    LOGIN: "/login.php",
    LOGOUT: "/logout.php"
  },
  
  // Set to false to use real backend
  MOCK_FALLBACK: true, // Will use mock data only if backend fails
  
  // App Settings
  APP_NAME: "Nyeri Level 4 Hospital",
  APP_VERSION: "2.0.0"
};
