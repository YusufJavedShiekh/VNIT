import os
import joblib


BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "risk_model.pkl"
)


def load_risk_model():
    """
    Load the trained VIGIL risk model.

    Returns:
        The trained model if it exists.
        None if the model is unavailable.
    """

    if not os.path.exists(MODEL_PATH):
        return None

    try:
        return joblib.load(MODEL_PATH)

    except Exception as error:
        print(
            f"Unable to load risk model: {error}"
        )
        return None


def model_exists():
    """
    Check whether the trained risk model exists.
    """

    return os.path.exists(
        MODEL_PATH
    )


def get_model_path():
    """
    Return the path of the trained risk model.
    """

    return MODEL_PATH