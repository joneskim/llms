# services/gateway/app/core/config.py

class Settings:
    FRONTEND_SERVICE_URL = "http://frontend:80"
    BACKEND_SERVICE_URL = "http://backend:8000"
    DATA_ANALYSIS_SERVICE_URL = "http://data_analysis:8000"

settings = Settings()
