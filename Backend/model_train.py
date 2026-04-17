import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge, Lasso
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
import joblib
import warnings

warnings.filterwarnings('ignore')

# ========== PREPROCESSING ==========
print("Loading data...")
df = pd.read_csv('../Data/car_price_prediction_.csv')
print(f"Initial shape: {df.shape}")

# Remove unnecessary columns
if 'Car ID' in df.columns:
    df = df.drop('Car ID', axis=1)

# Fix illogical values
df.loc[df['Fuel Type'] == 'Electric', 'Engine Size'] = 0

# Create new features
current_year = 2026
df['Car Age'] = current_year - df['Year']
df['Price per KM'] = df['Price'] / (df['Mileage'] + 1)

# Encode categorical variables
condition_order = {'New': 3, 'Like New': 2, 'Used': 1}
df['Condition Code'] = df['Condition'].map(condition_order)

# One-Hot Encoding
df = pd.get_dummies(df, columns=['Fuel Type', 'Transmission'])

# Label Encoding
le_brand = LabelEncoder()
le_model = LabelEncoder()
df['Brand Code'] = le_brand.fit_transform(df['Brand'])
df['Model Code'] = le_model.fit_transform(df['Model'])

# Select features
feature_cols = [
    'Brand Code', 'Model Code', 'Year', 'Car Age',
    'Engine Size', 'Mileage', 'Condition Code', 'Price per KM'
]
feature_cols += [col for col in df.columns if col.startswith('Fuel Type_')]
feature_cols += [col for col in df.columns if col.startswith('Transmission_')]

X = df[feature_cols]
y = df['Price']

# Handle missing values
print(f"NaN before handling: {X.isnull().sum().sum()}")
imputer = SimpleImputer(strategy='median')
X = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)
print(f"NaN after handling: {X.isnull().sum().sum()}")

# Remove price outliers
Q1 = y.quantile(0.25)
Q3 = y.quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

mask = (y >= lower_bound) & (y <= upper_bound)
X = X[mask]
y = y[mask]
print(f"Removed {(~mask).sum()} price outliers")

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, shuffle=True
)

print(f"\nData ready!")
print(f"X_train shape: {X_train.shape}, X_test shape: {X_test.shape}")
print(f"Features used: {len(feature_cols)}")
print("=" * 50)

# ========== CHECK FOR NaN ==========
print("\nChecking for NaN values:")
print(f"NaN in X_train: {np.isnan(X_train).sum()}")
print(f"NaN in X_test: {np.isnan(X_test).sum()}")

# Remove any rows with NaN (just in case)
nan_train = np.isnan(X_train).any(axis=1)
nan_test = np.isnan(X_test).any(axis=1)

if nan_train.any():
    print(f"Removing {nan_train.sum()} rows with NaN from X_train")
    X_train = X_train[~nan_train]
    y_train = y_train[~nan_train]

if nan_test.any():
    print(f"Removing {nan_test.sum()} rows with NaN from X_test")
    X_test = X_test[~nan_test]
    y_test = y_test[~nan_test]

print(f"After cleaning: X_train shape: {X_train.shape}, X_test shape: {X_test.shape}")
print("=" * 50)

# ========== TRAINING MODELS ==========
print("\nStarting Model Training...")

models = {
    'Random Forest': RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        random_state=42
    ),
    'Gradient Boosting': GradientBoostingRegressor(
        n_estimators=150,
        learning_rate=0.1,
        max_depth=5,
        random_state=42
    ),
    'Ridge Regression': Ridge(alpha=1.0),
    'Lasso Regression': Lasso(alpha=0.01)
}

results = {}
best_model = None
best_score = -np.inf

for name, model in models.items():
    print(f"\nTraining {name}...")

    try:
        model.fit(X_train, y_train)

        y_pred_train = model.predict(X_train)
        y_pred_test = model.predict(X_test)

        train_r2 = r2_score(y_train, y_pred_train)
        test_r2 = r2_score(y_test, y_pred_test)
        test_mae = mean_absolute_error(y_test, y_pred_test)
        test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))

        results[name] = {
            'Train R²': train_r2,
            'Test R²': test_r2,
            'MAE': test_mae,
            'RMSE': test_rmse
        }

        print(f"Train R²: {train_r2:.4f}")
        print(f"Test R²: {test_r2:.4f}")
        print(f"MAE: ${test_mae:.2f}")
        print(f"RMSE: ${test_rmse:.2f}")

        if test_r2 > best_score:
            best_score = test_r2
            best_model = model

    except Exception as e:
        print(f"Failed: {str(e)}")
        continue

print("\n" + "=" * 50)
print("BEST MODEL:")
print(f"Model: {best_model.__class__.__name__}")
print(f"Test R²: {best_score:.4f}")

# Save model and preprocessors
if best_model:
    joblib.dump(best_model, 'car_price_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    joblib.dump(le_brand, 'label_encoder_brand.pkl')
    joblib.dump(le_model, 'label_encoder_model.pkl')
    joblib.dump(feature_cols, 'feature_columns.pkl')
    joblib.dump(imputer, 'imputer.pkl')
    print("\nModel and preprocessors saved successfully!")
else:
    print("\nNo valid model found!")

print("\n" + "=" * 50)
print("RESULTS SUMMARY:")
results_df = pd.DataFrame(results).T
print(results_df.round(4))