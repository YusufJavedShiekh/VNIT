import numpy as np


class RiskPredictor:
    """
    Wrapper around the VIGIL machine-learning model.

    This class keeps model prediction separate from
    the Flask routes and risk-analysis logic.
    """

    def __init__(self, model=None):
        self.model = model

    def is_available(self):
        """
        Check whether a trained model is loaded.
        """

        return self.model is not None

    def predict(self, features):
        """
        Generate a prediction from the trained model.

        Args:
            features: List or array containing the
                      six VIGIL model features.

        Returns:
            Dictionary containing prediction information,
            or None if prediction cannot be performed.
        """

        if self.model is None:
            return None

        try:
            feature_array = np.asarray(
                features,
                dtype=float
            )

            feature_array = feature_array.reshape(
                1,
                -1
            )

            prediction = self.model.predict(
                feature_array
            )

            raw_prediction = prediction[0]

            confidence = None

            # Some classification models provide
            # predict_proba(). Our current RandomForest
            # regression model does not, so this is optional.
            if hasattr(
                self.model,
                "predict_proba"
            ):
                try:
                    probabilities = (
                        self.model.predict_proba(
                            feature_array
                        )
                    )

                    confidence = float(
                        np.max(
                            probabilities[0]
                        )
                    )

                except Exception:
                    confidence = None

            return {
                "raw_prediction": raw_prediction,
                "confidence": confidence
            }

        except Exception as error:

            print(
                f"Risk prediction error: {error}"
            )

            return None