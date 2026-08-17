class IncidentDetector:
    """
    Detects traffic incidents from computer-vision signals.

    This is the first rule-based incident layer.
    More advanced incident classification can later
    be added using a trained model.
    """

    def __init__(
        self,
        overspeed_threshold=80.0,
        stopped_frames_threshold=30
    ):
        self.overspeed_threshold = (
            overspeed_threshold
        )

        self.stopped_frames_threshold = (
            stopped_frames_threshold
        )

        self.stationary_counts = {}

    def _update_stationary_count(
        self,
        object_id,
        previous_center,
        current_center
    ):
        if (
            previous_center is None
            or current_center is None
        ):
            return 0

        movement = (
            abs(
                current_center[0]
                - previous_center[0]
            )
            +
            abs(
                current_center[1]
                - previous_center[1]
            )
        )

        if movement <= 2:
            self.stationary_counts[object_id] = (
                self.stationary_counts.get(
                    object_id,
                    0
                ) + 1
            )
        else:
            self.stationary_counts[object_id] = 0

        return self.stationary_counts[object_id]

    def detect(
        self,
        tracked_objects,
        speed_values=None
    ):
        """
        Detect possible traffic incidents.
        """

        speed_values = speed_values or []

        incidents = []

        for index, obj in enumerate(
            tracked_objects
        ):
            object_id = obj["id"]

            speed = 0.0

            if index < len(speed_values):
                speed = speed_values[index]

            # Overspeeding.
            if speed >= self.overspeed_threshold:
                incidents.append({
                    "type": "overspeeding",
                    "severity": "medium",
                    "vehicle_id": object_id,
                    "speed_kmh": speed
                })

            # Long stationary vehicle.
            stationary_count = (
                self._update_stationary_count(
                    object_id,
                    obj.get("previous_center"),
                    obj.get("center")
                )
            )

            if (
                stationary_count
                >= self.stopped_frames_threshold
            ):
                incidents.append({
                    "type": "vehicle_breakdown",
                    "severity": "medium",
                    "vehicle_id": object_id
                })

        return incidents