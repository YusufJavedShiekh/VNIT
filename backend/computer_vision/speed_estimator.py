class SpeedEstimator:
    """
    Estimates vehicle speed from movement between frames.

    The conversion from pixels to meters depends on camera
    calibration. The default value is only a placeholder and
    should be calibrated for each CCTV camera.
    """

    def __init__(
        self,
        fps=30.0,
        meters_per_pixel=0.05
    ):
        self.fps = fps
        self.meters_per_pixel = meters_per_pixel

    def estimate(
        self,
        previous_center,
        current_center,
        frame_gap=1
    ):
        """
        Estimate speed in km/h.
        """

        if (
            previous_center is None
            or current_center is None
        ):
            return 0.0

        dx = current_center[0] - previous_center[0]
        dy = current_center[1] - previous_center[1]

        pixel_distance = (
            (dx ** 2 + dy ** 2) ** 0.5
        )

        real_distance_meters = (
            pixel_distance *
            self.meters_per_pixel
        )

        time_seconds = (
            frame_gap / self.fps
        )

        if time_seconds <= 0:
            return 0.0

        meters_per_second = (
            real_distance_meters /
            time_seconds
        )

        km_per_hour = (
            meters_per_second * 3.6
        )

        return round(km_per_hour, 2)