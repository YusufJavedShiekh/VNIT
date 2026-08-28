import os
from datetime import datetime

import cv2

from .vehicle_detector import (
    VehicleDetector
)

from .tracker import (
    CentroidTracker
)

from .speed_estimator import (
    SpeedEstimator
)

from .traffic_analyzer import (
    TrafficAnalyzer
)

from .incident_detector import (
    IncidentDetector
)

from ai.risk_model import (
    VIGILRiskModel
)


class VideoProcessor:
    """
    Main VIGIL CCTV processing pipeline.

    Pipeline:

        Video
          ↓
        Vehicle Detection
          ↓
        Tracking
          ↓
        Speed Estimation
          ↓
        Traffic Analysis
          ↓
        Incident Detection
          ↓
        VIGIL Risk Model
          ↓
        Persistent structured result
    """

    def __init__(
        self,
        fps=30.0,
        meters_per_pixel=0.05
    ):

        self.vehicle_detector = (
            VehicleDetector()
        )

        self.tracker = (
            CentroidTracker()
        )

        self.speed_estimator = (
            SpeedEstimator(
                fps=fps,
                meters_per_pixel=
                    meters_per_pixel
            )
        )

        self.traffic_analyzer = (
            TrafficAnalyzer()
        )

        self.incident_detector = (
            IncidentDetector()
        )

        self.risk_model = (
            VIGILRiskModel()
        )


    def process_video(
        self,
        video_path,
        sample_every=5,
        max_frames=None
    ):
        """
        Process a video and return
        structured VIGIL analysis.
        """

        if not os.path.exists(
            video_path
        ):
            raise FileNotFoundError(
                f"Video not found: {video_path}"
            )

        capture = cv2.VideoCapture(
            video_path
        )

        if not capture.isOpened():
            raise RuntimeError(
                "Unable to open video"
            )

        fps = capture.get(
            cv2.CAP_PROP_FPS
        )

        if not fps or fps <= 0:
            fps = self.speed_estimator.fps

        self.speed_estimator.fps = fps

        total_frames = int(
            capture.get(
                cv2.CAP_PROP_FRAME_COUNT
            )
        )

        frame_width = int(
            capture.get(
                cv2.CAP_PROP_FRAME_WIDTH
            )
        )

        frame_height = int(
            capture.get(
                cv2.CAP_PROP_FRAME_HEIGHT
            )
        )

        frame_number = 0

        processed_frames = 0

        vehicle_counts = []

        speed_history = []

        all_incidents = []

        timeline = []


        while True:

            success, frame = (
                capture.read()
            )

            if not success:
                break

            frame_number += 1

            if (
                frame_number
                % sample_every
                != 0
            ):
                continue

            if (
                max_frames is not None
                and
                processed_frames
                >= max_frames
            ):
                break


            detections = (
                self.vehicle_detector.detect(
                    frame
                )
            )


            tracked_objects = (
                self.tracker.update(
                    detections
                )
            )


            speeds = []

            for obj in (
                tracked_objects
            ):

                speed = (
                    self.speed_estimator.estimate(
                        obj.get(
                            "previous_center"
                        ),
                        obj.get(
                            "center"
                        ),
                        frame_gap=
                            sample_every
                    )
                )

                speeds.append(
                    speed
                )


            traffic = (
                self.traffic_analyzer.analyze(
                    tracked_objects,
                    speeds
                )
            )


            incidents = (
                self.incident_detector.detect(
                    tracked_objects,
                    speeds
                )
            )


            vehicle_counts.append(
                traffic[
                    "vehicle_count"
                ]
            )


            speed_history.extend(
                speeds
            )


            all_incidents.extend(
                incidents
            )


            # -----------------------------------------
            # TIMELINE DATA
            # -----------------------------------------

            timestamp_seconds = (
                frame_number / fps
            )

            timeline.append({
                "frame":
                    frame_number,

                "timestamp_seconds":
                    round(
                        timestamp_seconds,
                        2
                    ),

                "vehicle_count":
                    traffic[
                        "vehicle_count"
                    ],

                "average_speed_kmh":
                    traffic[
                        "average_speed_kmh"
                    ],

                "traffic_density":
                    traffic[
                        "traffic_density"
                    ],

                "incident_count":
                    len(incidents)
            })


            processed_frames += 1


        capture.release()


        # ---------------------------------------------
        # FINAL TRAFFIC STATISTICS
        # ---------------------------------------------

        average_vehicle_count = 0

        if vehicle_counts:
            average_vehicle_count = round(
                sum(
                    vehicle_counts
                )
                /
                len(
                    vehicle_counts
                ),
                2
            )


        average_speed = 0.0

        if speed_history:
            average_speed = round(
                sum(
                    speed_history
                )
                /
                len(
                    speed_history
                ),
                2
            )


        unique_incidents = (
            self._remove_duplicate_incidents(
                all_incidents
            )
        )


        final_density = (
            self.traffic_analyzer
            .calculate_density(
                int(
                    average_vehicle_count
                )
            )
        )


        # ---------------------------------------------
        # VIGIL AI RISK
        # ---------------------------------------------

        current_time = (
            datetime.now()
        )

        risk_result = (
            self.risk_model.predict(
                traffic={
                    "vehicle_count":
                        average_vehicle_count,

                    "average_vehicle_count":
                        average_vehicle_count,

                    "average_speed_kmh":
                        average_speed,

                    "traffic_density":
                        final_density
                },

                incidents=
                    unique_incidents,

                hour=
                    current_time.hour,

                day_of_week=
                    current_time.weekday()
            )
        )


        # ---------------------------------------------
        # FINAL RESULT
        # ---------------------------------------------

        return {

            "video": {
                "path":
                    video_path,

                "fps":
                    fps,

                "total_frames":
                    total_frames,

                "processed_frames":
                    processed_frames,

                "width":
                    frame_width,

                "height":
                    frame_height
            },

            "traffic": {
                "average_vehicle_count":
                    average_vehicle_count,

                "average_speed_kmh":
                    average_speed,

                "traffic_density":
                    final_density
            },

            "risk":
                risk_result,

            "incidents":
                unique_incidents,

            "timeline":
                timeline
        }


    def _remove_duplicate_incidents(
        self,
        incidents
    ):
        """
        Remove repeated incident records.
        """

        unique = []

        seen = set()

        for incident in incidents:

            key = (
                incident.get(
                    "type"
                ),

                incident.get(
                    "vehicle_id"
                ),

                incident.get(
                    "severity"
                )
            )

            if key in seen:
                continue

            seen.add(
                key
            )

            unique.append(
                incident
            )

        return unique