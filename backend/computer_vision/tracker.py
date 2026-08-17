import math


class CentroidTracker:
    """
    Lightweight centroid-based object tracker.

    Each detected object receives a persistent ID while it
    remains visible across consecutive frames.
    """

    def __init__(
        self,
        max_distance=80,
        max_missing_frames=15
    ):
        self.max_distance = max_distance
        self.max_missing_frames = max_missing_frames

        self.next_id = 1
        self.objects = {}

    def _distance(self, point_a, point_b):
        return math.sqrt(
            (point_a[0] - point_b[0]) ** 2 +
            (point_a[1] - point_b[1]) ** 2
        )

    def _register(self, detection):
        object_id = self.next_id
        self.next_id += 1

        self.objects[object_id] = {
            "id": object_id,
            "center": detection["center"],
            "bbox": detection["bbox"],
            "missing": 0,
            "previous_center": detection["center"]
        }

    def _remove(self, object_id):
        if object_id in self.objects:
            del self.objects[object_id]

    def update(self, detections):
        """
        Match new detections with previously tracked objects.

        Returns:
            List of tracked objects.
        """

        if not detections:
            for object_id in list(self.objects.keys()):
                self.objects[object_id]["missing"] += 1

                if (
                    self.objects[object_id]["missing"]
                    > self.max_missing_frames
                ):
                    self._remove(object_id)

            return list(self.objects.values())

        if not self.objects:
            for detection in detections:
                self._register(detection)

            return list(self.objects.values())

        unmatched_detections = set(range(len(detections)))
        unmatched_objects = set(self.objects.keys())

        matches = []

        for object_id in list(self.objects.keys()):
            current_center = self.objects[object_id]["center"]

            best_index = None
            best_distance = float("inf")

            for index in unmatched_detections:
                detection_center = detections[index]["center"]

                distance = self._distance(
                    current_center,
                    detection_center
                )

                if (
                    distance < best_distance
                    and distance <= self.max_distance
                ):
                    best_distance = distance
                    best_index = index

            if best_index is not None:
                matches.append(
                    (object_id, best_index)
                )

                unmatched_detections.remove(best_index)
                unmatched_objects.remove(object_id)

        # Update matched objects.
        for object_id, detection_index in matches:
            detection = detections[detection_index]

            self.objects[object_id]["previous_center"] = (
                self.objects[object_id]["center"]
            )

            self.objects[object_id]["center"] = (
                detection["center"]
            )

            self.objects[object_id]["bbox"] = (
                detection["bbox"]
            )

            self.objects[object_id]["missing"] = 0

        # Increase missing count for unmatched objects.
        for object_id in unmatched_objects:
            self.objects[object_id]["missing"] += 1

            if (
                self.objects[object_id]["missing"]
                > self.max_missing_frames
            ):
                self._remove(object_id)

        # Register new detections.
        for detection_index in unmatched_detections:
            self._register(
                detections[detection_index]
            )

        return list(self.objects.values())