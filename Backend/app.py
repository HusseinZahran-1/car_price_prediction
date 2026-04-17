from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model and preprocessors
print("Loading model and preprocessors...")
model = joblib.load('car_price_model.pkl')
scaler = joblib.load('scaler.pkl')
le_brand = joblib.load('label_encoder_brand.pkl')
le_model = joblib.load('label_encoder_model.pkl')
feature_columns = joblib.load('feature_columns.pkl')
imputer = joblib.load('imputer.pkl')

print("All files loaded successfully!")


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        # Get input values
        brand = data['brand']
        model_name = data['model']
        year = int(data['year'])
        engine_size = float(data['engine_size'])
        fuel_type = data['fuel_type']
        transmission = data['transmission']
        mileage = float(data['mileage'])
        condition = data['condition']

        # Calculate derived features
        current_year = 2026
        car_age = current_year - year
        price_per_km = 0

        # Encode brand and model - Handle unknown values
        try:
            brand_code = le_brand.transform([brand])[0]
        except:
            # For unknown brands, use the most common brand code (median)
            brand_code = int(np.median(le_brand.transform(le_brand.classes_)))
            print(f"Unknown brand '{brand}', using default code: {brand_code}")

        try:
            model_code = le_model.transform([model_name])[0]
        except:
            # For unknown models, use the most common model code
            model_code = int(np.median(le_model.transform(le_model.classes_)))
            print(f"Unknown model '{model_name}', using default code: {model_code}")

        # Condition code
        condition_map = {'New': 3, 'Like New': 2, 'Used': 1}
        condition_code = condition_map.get(condition, 1)

        # Create feature dictionary
        feature_dict = {
            'Brand Code': brand_code,
            'Model Code': model_code,
            'Year': year,
            'Car Age': car_age,
            'Engine Size': engine_size,
            'Mileage': mileage,
            'Condition Code': condition_code,
            'Price per KM': price_per_km
        }

        # Add one-hot encoded features
        for fuel in ['Diesel', 'Electric', 'Hybrid', 'Petrol']:
            feature_dict[f'Fuel Type_{fuel}'] = 1 if fuel_type == fuel else 0

        for trans in ['Automatic', 'Manual']:
            feature_dict[f'Transmission_{trans}'] = 1 if transmission == trans else 0

        # Create DataFrame
        input_df = pd.DataFrame([feature_dict])

        # Ensure all columns exist
        for col in feature_columns:
            if col not in input_df.columns:
                input_df[col] = 0

        # Reorder columns
        input_df = input_df[feature_columns]

        # Handle missing values
        input_df = pd.DataFrame(imputer.transform(input_df), columns=input_df.columns)

        # Scale features
        input_scaled = scaler.transform(input_df)

        # Predict
        prediction = model.predict(input_scaled)[0]

        return jsonify({
            'success': True,
            'predicted_price': round(prediction, 2),
            'currency': 'USD',
            'message': f'Prediction for {brand} {model_name}'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


@app.route('/brands', methods=['GET'])
def get_brands():
    """Return list of known brands"""
    return jsonify({
        'brands': le_brand.classes_.tolist()
    })


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)