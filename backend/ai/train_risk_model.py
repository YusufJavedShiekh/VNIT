import os

import joblib
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error


# ============================================================
# VIGIL PROJECT PATHS
# ============================================================

# VNIT/
PROJECT_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

# VNIT/data/traffic_history.csv
DATA_PATH = os.path.join(
    PROJECT_DIR,
    "data",
    "traffic_history.csv"
)

# VNIT/backend/models/risk_model.pkl
MODEL_PATH = os.path.join(
    PROJECT_DIR,
    "backend",
    "models",
    "risk_model.pkl"
)


def density_to_number(value):
    """
    Convert traffic-density text into a numerical value.
    """

    mapping = {
        "Low": 1,
        "Medium": 2,
        "High": 3,
        "Very High": 4
    }

    return mapping.get(
        str(value).strip(),
        1
    )


def train():

    print("=" * 60)
    print("VIGIL RISK MODEL TRAINING")
    print("=" * 60)

    print()
    print("Project directory:")
    print(PROJECT_DIR)

    print()
    print("Looking for traffic data:")
    print(DATA_PATH)

    # --------------------------------------------------------
    # Check whether the CSV actually exists
    # --------------------------------------------------------

    if not os.path.exists(DATA_PATH):

        print()
        print("ERROR: traffic_history.csv was not found.")
        print()
        print("Expected location:")
        print(DATA_PATH)

        return

    print()
    print("Traffic data found.")
    print("Loading dataset...")

    # --------------------------------------------------------
    # Load dataset
    # --------------------------------------------------------

    dataframe = pd.read_csv(
        DATA_PATH
    )

    print()
    print(
        f"Loaded {len(dataframe)} traffic records."
    )

    # --------------------------------------------------------
    # Convert traffic density
    # --------------------------------------------------------

    dataframe[
        "traffic_density_score"
    ] = (
        dataframe[
            "traffic_density"
        ].apply(
            density_to_number
        )
    )

    # --------------------------------------------------------
    # Features used by VIGIL
    # --------------------------------------------------------

    features = [
        "hour",
        "day_of_week",
        "vehicle_count",
        "average_speed_kmh",
        "traffic_density_score",
        "accident_count"
    ]

    # --------------------------------------------------------
    # Verify required columns
    # --------------------------------------------------------

    missing_columns = [
        column
        for column in features + ["risk_score"]
        if column not in dataframe.columns
    ]

    if missing_columns:

        print()
        print(
            "ERROR: Missing columns:"
        )

        for column in missing_columns:
            print(
                f"  - {column}"
            )

        return

    # --------------------------------------------------------
    # Prepare X and y
    # --------------------------------------------------------

    X = dataframe[
        features
    ]

    y = dataframe[
        "risk_score"
    ]

    # --------------------------------------------------------
    # Train/test split
    # --------------------------------------------------------

    X_train, X_test, y_train, y_test = (
        train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42
        )
    )

    # --------------------------------------------------------
    # Create model
    # --------------------------------------------------------

    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=8,
        random_state=42
    )

    # --------------------------------------------------------
    # Train
    # --------------------------------------------------------

    print()
    print("Training VIGIL risk model...")

    model.fit(
        X_train,
        y_train
    )

    # --------------------------------------------------------
    # Evaluate
    # --------------------------------------------------------

    predictions = model.predict(
        X_test
    )

    error = mean_absolute_error(
        y_test,
        predictions
    )

    print()
    print(
        f"Model MAE: {error:.2f}"
    )

    # --------------------------------------------------------
    # Save model
    # --------------------------------------------------------

    os.makedirs(
        os.path.dirname(
            MODEL_PATH
        ),
        exist_ok=True
    )

    joblib.dump(
        model,
        MODEL_PATH
    )

    print()
    print("Model saved successfully.")
    print(
        f"Model path: {MODEL_PATH}"
    )

    print()
    print("=" * 60)
    print("VIGIL RISK MODEL TRAINING COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    train()