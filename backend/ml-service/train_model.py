import pandas as pd
import pickle
import os
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error
from dotenv import load_dotenv
import numpy as np

# Load backend .env
load_dotenv("../.env")

TOTAL_ROOMS = int(os.getenv("TOTAL_ROOMS"))

print("TOTAL ROOMS:", TOTAL_ROOMS)

# Load dataset
df = pd.read_csv("hotel_bookings.csv")

# Create datetime column
df["arrival_date"] = pd.to_datetime(
    df["arrival_date_year"].astype(str) + "-" +
    df["arrival_date_month"] + "-" +
    df["arrival_date_day_of_month"].astype(str)
)

# Aggregate daily bookings
daily_bookings = df.groupby("arrival_date").size().reset_index(name="y")
daily_bookings.rename(columns={"arrival_date": "ds"}, inplace=True)

# Scale bookings
original_max = daily_bookings["y"].max()
scale_factor = TOTAL_ROOMS / original_max
daily_bookings["y"] = daily_bookings["y"] * scale_factor

# 🔥 TRAIN / TEST SPLIT (80/20)
split_index = int(len(daily_bookings) * 0.8)

train_data = daily_bookings.iloc[:split_index]
test_data = daily_bookings.iloc[split_index:]

print("Training size:", len(train_data))
print("Testing size:", len(test_data))

# Train model on TRAIN data only
model = Prophet()
model.fit(train_data)

# Predict on TEST dates only
future_test = test_data[["ds"]]
forecast_test = model.predict(future_test)

# Evaluate using TEST data
mae = mean_absolute_error(test_data["y"], forecast_test["yhat"])
rmse = np.sqrt(mean_squared_error(test_data["y"], forecast_test["yhat"]))

mean_actual = test_data["y"].mean()
accuracy = 100 - ((mae / mean_actual) * 100)

print("Validation MAE:", mae)
print("Validation RMSE:", rmse)
print("Validation Accuracy:", accuracy)

# Save trained model (trained on train data)
with open("prophet_model.pkl", "wb") as f:
    pickle.dump(model, f)

# Save validation metrics
with open("model_metrics.pkl", "wb") as f:
    pickle.dump({
        "mae": float(mae),
        "rmse": float(rmse),
        "accuracy": float(accuracy)
    }, f)

print("Model and validation metrics saved successfully!")