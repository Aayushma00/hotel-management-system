from fastapi import FastAPI
import pickle

app = FastAPI()

# Load prophet model
with open("prophet_model.pkl", "rb") as f:
    model = pickle.load(f)

# Load metrics
with open("model_metrics.pkl", "rb") as f:
    metrics = pickle.load(f)


@app.get("/forecast")
def get_forecast():

    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)

    result = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(30)
    result["ds"] = result["ds"].astype(str)

    return result.to_dict(orient="records")


@app.get("/metrics")
def get_metrics():
    return {
        "accuracy": round(metrics.get("accuracy", 0), 2),
        "mae": round(metrics.get("mae", 0), 2),
        "rmse": round(metrics.get("rmse", 0), 2)
    }