import cv2


class VehicleDetector:
    """
    Basic vehicle detector using OpenCV background subtraction.

    This is the initial VIGIL detector. It detects moving objects
    and filters them using size and shape constraints.

    A trained object-detection model can later replace this class
    without changing the rest of the pipeline.
    """

    def __init__(
        self,
        min_area=500,
        max_area=50000
    ):
        self.min_area = min_area
        self.max_area = max_area

        self.background_subtractor = (
            cv2.createBackgroundSubtractorMOG2(
                history=500,
                varThreshold=50,
                detectShadows=True
            )
        )

    def detect(self, frame):
        """
        Detect moving vehicle-like objects in a frame.

        Returns:
            list of dictionaries containing bounding boxes.
        """

        if frame is None:
            return []

        mask = self.background_subtractor.apply(frame)

        # Remove shadows.
        _, mask = cv2.threshold(
            mask,
            200,
            255,
            cv2.THRESH_BINARY
        )

        # Remove small noise.
        kernel = cv2.getStructuringElement(
            cv2.MORPH_RECT,
            (5, 5)
        )

        mask = cv2.morphologyEx(
            mask,
            cv2.MORPH_OPEN,
            kernel
        )

        mask = cv2.morphologyEx(
            mask,
            cv2.MORPH_CLOSE,
            kernel
        )

        contours, _ = cv2.findContours(
            mask,
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE
        )

        detections = []

        for contour in contours:
            area = cv2.contourArea(contour)

            if area < self.min_area:
                continue

            if area > self.max_area:
                continue

            x, y, width, height = cv2.boundingRect(contour)

            if width <= 0 or height <= 0:
                continue

            aspect_ratio = width / float(height)

            # Ignore extremely thin objects.
            if aspect_ratio < 0.2 or aspect_ratio > 5.0:
                continue

            detections.append({
                "bbox": [x, y, width, height],
                "area": float(area),
                "center": [
                    int(x + width / 2),
                    int(y + height / 2)
                ]
            })

        return detections