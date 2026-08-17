class TrafficAnalyzer:
    """
    Calculates traffic statistics from tracked vehicles.
    """

    def __init__(
        self,
        low_threshold=5,
        medium_threshold=15,
        high_threshold=30
    ):
        self.low_threshold = low_threshold
        self.medium_threshold = medium_threshold
        self.high_threshold = high_threshold

    def calculate_density(self, vehicle_count):
        """
        Convert vehicle count into a traffic-density category.
        """

        if vehicle_count >= self.high_threshold:
            return "High"

        if vehicle_count >= self.medium_threshold:
            return "Medium"

        if vehicle_count >= self.low_threshold:
            return "Low"

        return "Very Low"

    def analyze(
        self,
        tracked_objects,
        speed_values=None
    ):
        """
        Generate traffic statistics for the current frame.
        """

        speed_values = speed_values or []

        vehicle_count = len(tracked_objects)

        average_speed = 0.0

        if speed_values:
            average_speed = round(
                sum(speed_values) /
                len(speed_values),
                2
            )

        density = self.calculate_density(
            vehicle_count
        )

        return {
            "vehicle_count": vehicle_count,
            "average_speed_kmh": average_speed,
            "traffic_density": density
        }