<!-- 

██╗  ██╗██╗   ██╗███████╗███████╗███████╗██╗███╗   ██╗███████╗ █████╗ ██╗  ██╗██████╗  █████╗ ███╗   ██╗       ██╗
██║  ██║██║   ██║██╔════╝██╔════╝██╔════╝██║████╗  ██║╚══███╔╝██╔══██╗██║  ██║██╔══██╗██╔══██╗████╗  ██║      ███║
███████║██║   ██║███████╗███████╗█████╗  ██║██╔██╗ ██║  ███╔╝ ███████║███████║██████╔╝███████║██╔██╗ ██║█████╗╚██║
██╔══██║██║   ██║╚════██║╚════██║██╔══╝  ██║██║╚██╗██║ ███╔╝  ██╔══██║██╔══██║██╔══██╗██╔══██║██║╚██╗██║╚════╝ ██║
██║  ██║╚██████╔╝███████║███████║███████╗██║██║ ╚████║███████╗██║  ██║██║  ██║██║  ██║██║  ██║██║ ╚████║       ██║
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝       ╚═╝

 -->

# 🚗 **Car Price Prediction System**

<div align="center">
  <!-- Hero Image Placeholder -->
  <img src="https://raw.githubusercontent.com/HusseinZahran-1/car-price-prediction/main/assets/hero.png" alt="Car Price Prediction Hero" width="800"/>
</div>

---

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/HusseinZahran-1/car-price-prediction/releases)
[![Python](https://img.shields.io/badge/python-3.14%2B-green)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/flask-2.3.3-red)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/license-MIT-yellow)](LICENSE)

> **AI‑Powered Car Price Prediction** – Achieve **98% accuracy** with a sleek 3‑D glassmorphism UI.

---

## 📚 Table of Contents
- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📂 Project Structure](#-project-structure)
- [⚙️ Installation](#-installation)
- [🚀 Usage](#-usage)
- [📊 API Documentation](#-api-documentation)
- [📈 Model Performance](#-model-performance)
- [🖼️ Screenshots](#-screenshots)
- [🔮 Future Improvements](#-future-improvements)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [📞 Contact & Support](#-contact--support)

---

## 🌟 Overview
The **Car Price Prediction System** is a full‑stack web application that predicts used‑car prices based on a rich set of specifications. It combines a **Random Forest** model (R² = 0.9868) with a **3‑D glassmorphism** front‑end for an immersive user experience.

### Problem Statement
Used‑car pricing is often inconsistent and subjective. Our solution provides an objective, data‑driven valuation.

### Solution
A responsive web app that:
- Accepts detailed car specs.
- Returns an instant, accurate market price.
- Stores recent predictions locally for quick reference.

---

## ✨ Features
### Backend
- ✅ **Random Forest Regressor** – 98% accuracy.
- ✅ **Flask REST API** – Simple `/predict` endpoint.
- ✅ **Data Pre‑processing** – Handles missing values & outliers.
- ✅ **Feature Engineering** – Car age, price‑per‑km, etc.
- ✅ **CORS & Error Handling** – Robust production‑ready API.

### Frontend
- ✅ **3‑D Glassmorphism UI** – Modern, premium look.
- ✅ **Authentication Mock** – Demo login with local storage.
- ✅ **Any Car Support** – Works for any brand/model.
- ✅ **Prediction History** – Last 15 predictions saved locally.
- ✅ **Dashboard Stats** – Total predictions, average price.
- ✅ **Popular Suggestions** – Quick‑select common models.
- ✅ **Responsive & Animated** – Works on all devices with smooth hover effects.

---

## 🛠 Tech Stack
### Backend
| Technology | Version | Role |
|------------|---------|------|
| Python | 3.14+ | Core language |
| Flask | 2.3.3 | API server |
| scikit‑learn | 1.3.2 | ML model |
| pandas | 2.1.4 | Data handling |
| numpy | 1.26.2 | Numerical ops |
| joblib | 1.3.2 | Model serialization |

### Frontend
| Technology | Role |
|------------|------|
| HTML5 | Structure |
| CSS3 | Styling & 3‑D effects |
| JavaScript (ES6) | Interactivity & API calls |
| Font Awesome 6 | Icons |

---

## 📂 Project Structure
```
car-price-prediction/
├─ backend/
│  ├─ app.py                 # Flask API server
│  ├─ car_price_model.pkl    # Trained Random Forest model
│  ├─ scaler.pkl             # StandardScaler
│  ├─ label_encoder_brand.pkl
│  ├─ label_encoder_model.pkl
│  ├─ feature_columns.pkl
│  ├─ imputer.pkl            # Missing‑value handler
│  └─ requirements.txt
├─ frontend/
│  ├─ index.html
│  ├─ login.html
│  ├─ dashboard.html
│  ├─ script.js
│  └─ style.css
├─ data/
│  └─ car_price_prediction_.csv
└─ README.md
```

---

## ⚙️ Installation
### Prerequisites
- Python 3.14+ 
- `pip` 
- Git (optional)

### Steps
```bash
# Clone the repo
git clone https://github.com/HusseinZahran-1/car-price-prediction.git
cd car-price-prediction

# Backend setup
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r backend/requirements.txt

# Run the API server
python backend/app.py
```
Open `frontend/index.html` in your browser to interact with the UI.

---

## 🚀 Usage
1. **Open** `frontend/index.html`.
2. **Enter** car specifications (brand, model, year, engine size, etc.).
3. **Click** *Predict* – the app calls the Flask API and displays the price.
4. **View** prediction history and dashboard stats.

---

## 📊 API Documentation
- **Endpoint**: `POST /predict`
- **Payload** (JSON):
```json
{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "engine_size": 1.8,
  "fuel_type": "Petrol",
  "transmission": "Automatic",
  "mileage": 15000,
  "condition": "Like New"
}
```
- **Response**:
```json
{ "predicted_price": 21500 }
```

---

## 📈 Model Performance
- **R² Score**: **0.9868**
- **Mean Absolute Error**: **$1,639.82**
- Trained on **2,500+** car listings.

---

## 🖼️ Screenshots
<div align="center">
  <img src="https://raw.githubusercontent.com/HusseinZahran-1/car-price-prediction/main/assets/screenshot_dashboard.png" alt="Dashboard" width="800"/>
</div>

---

## 🔮 Future Improvements
- 📱 Mobile app (React Native / Flutter).
- 🔄 Real‑time model retraining with new listings.
- 🌐 Multi‑language support.
- 📊 Advanced analytics (price trends, market heatmaps).

---

## 🤝 Contributing
Contributions are welcome! Please fork the repo, create a feature branch, and submit a pull request.

---

## 📜 License
This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support
**Project Maintainer**: Hussein Zahran
- Email: [husseinzahran05@gmail.com](mailto:husseinzahran05@gmail.com)
- GitHub: [HusseinZahran-1](https://github.com/HusseinZahran-1)

---

<div align="center">
  Made with ❤️ by **Hussein Zahran**
</div>