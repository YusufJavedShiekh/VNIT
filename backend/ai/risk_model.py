from .model_utils import load_risk_model
from .predictor import RiskPredictor

from database.queries import get_accidents


class VIGILRiskModel:
    """
    Main VIGIL traffic-risk prediction engine.

    The trained model expects these six features:

        1. hour
        2. day_of_week
        3. vehicle_count
        4. average_speed_kmh
        5. traffic_density_score
        6. accident_count
    """

    def __init__(self):

        model = load_risk_model()

        self.predictor = RiskPredictor(
            model
        )

        self.accidents = (
            get_accidents()
        )

    # -------------------------------------------------
    # Utility functions
    # -------------------------------------------------

    def _safe_number(
        self,
        value,
        default=0.0
    ):
        """
        Safely convert a value to a number.
        """

        try:
            return float(value)

        except (
            TypeError,
            ValueError
        ):
            return default

    def _density_score(
        self,
        density
    ):
        """
        Convert traffic density into the numerical
        representation used by the ML model.
        """

        mapping = {
            "low": 1,
            "medium": 2,
            "high": 3,
            "very high": 4
        }

        return mapping.get(
            str(
                density
            ).strip().lower(),
            1
        )

    def _day_to_number(
        self,
        day
    ):
        """
        Convert weekday name to numerical value.
        """

        if isinstance(
            day,
            (int, float)
        ):
            return int(day)

        mapping = {
            "monday": 0,
            "tuesday": 1,
            "wednesday": 2,
            "thursday": 3,
            "friday": 4,
            "saturday": 5,
            "sunday": 6
        }

        return mapping.get(
            str(
                day
            ).strip().lower(),
            0
        )

    def _accident_count(self):
        """
        Return the number of recorded accidents.
        """

        if self.accidents.empty:
            return 0

        return len(
            self.accidents
        )

    # -------------------------------------------------
    # Feature preparation
    # -------------------------------------------------

    def create_features(
        self,
        traffic=None,
        incidents=None,
        hour=12,
        day_of_week=0
    ):
        """
        Convert current traffic information into
        the feature vector required by the ML model.
        """

        traffic = (
            traffic or {}
        )

        incidents = (
            incidents or []
        )

        vehicle_count = (
            self._safe_number(
                traffic.get(
                    "vehicle_count",
                    traffic.get(
                        "average_vehicle_count",
                        0
                    )
                )
            )
        )

        average_speed = (
            self._safe_number(
                traffic.get(
                    "average_speed_kmh",
                    0
                )
            )
        )

        traffic_density = (
            traffic.get(
                "traffic_density",
                "Low"
            )
        )

        density_score = (
            self._density_score(
                traffic_density
            )
        )

        historical_accidents = (
            self._accident_count()
        )

        current_incidents = len(
            incidents
        )

        total_accident_pressure = (
            historical_accidents
            +
            current_incidents
        )

        return [[
            self._safe_number(
                hour
            ),
            self._day_to_number(
                day_of_week
            ),
            vehicle_count,
            average_speed,
            density_score,
            total_accident_pressure
        ]]

    # -------------------------------------------------
    # Risk classification
    # -------------------------------------------------

    def _risk_level(
        self,
        score
    ):
        """
        Convert a numerical risk score into
        a VIGIL risk category.
        """

        if score >= 70:
            return "High"

        if score >= 40:
            return "Medium"

        return "Low"

    # -------------------------------------------------
    # Prediction
    # -------------------------------------------------

    def predict(
        self,
        traffic=None,
        incidents=None,
        hour=12,
        day_of_week=0
    ):
        """
        Generate a VIGIL risk prediction.
        """

        features = self.create_features(
            traffic=traffic,
            incidents=incidents,
            hour=hour,
            day_of_week=day_of_week
        )

        result = (
            self.predictor.predict(
                features
            )
        )

        # Model unavailable.
        if result is None:

            return {
                "risk_score": 0,
                "risk_level": "Low",
                "confidence": None,
                "model_available": False,
                "features": {
                    "hour": features[0][0],
                    "day_of_week": features[0][1],
                    "vehicle_count": features[0][2],
                    "average_speed_kmh": features[0][3],
                    "traffic_density_score": features[0][4],
                    "accident_count": features[0][5]
                }
            }

        score = self._safe_number(
            result.get(
                "raw_prediction",
                0
            )
        )

        # Keep score between 0 and 100.
        score = max(
            0,
            min(
                score,
                100
            )
        )

        score = round(
            score,
            2
        )

        return {
            "risk_score": score,
            "risk_level": self._risk_level(
                score
            ),
            "confidence": result.get(
                "confidence"
            ),
            "model_available": (
                self.predictor.is_available()
            ),
            "features": {
                "hour": features[0][0],
                "day_of_week": features[0][1],
                "vehicle_count": features[0][2],
                "average_speed_kmh": features[0][3],
                "traffic_density_score": features[0][4],
                "accident_count": features[0][5]
            }
        }