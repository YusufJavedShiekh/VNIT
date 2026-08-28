import json
import os
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from flask import (
    Blueprint,
    jsonify,
    request,
    current_app
)

from werkzeug.utils import secure_filename

from computer_vision.video_processor import (
    VideoProcessor
)


video_bp = Blueprint(
    "video",
    __name__,
    url_prefix="/api/videos"
)


ALLOWED_EXTENSIONS = {
    "mp4",
    "avi",
    "mov",
    "mkv",
    "webm"
}


MAX_VIDEO_SIZE = (
    1 * 1024 * 1024 * 1024
)


# ---------------------------------------------------------
# PERSISTENT STORAGE
# ---------------------------------------------------------

PROJECT_ROOT = Path(
    __file__
).resolve().parents[2]

DATA_FOLDER = (
    PROJECT_ROOT / "data"
)

RESULTS_FILE = (
    DATA_FOLDER /
    "video_analysis_results.json"
)


def ensure_results_file():
    """
    Create persistent video-analysis
    storage if it does not exist.
    """

    DATA_FOLDER.mkdir(
        parents=True,
        exist_ok=True
    )

    if not RESULTS_FILE.exists():
        RESULTS_FILE.write_text(
            "[]",
            encoding="utf-8"
        )


def load_saved_results():
    """
    Load all previously completed
    video analyses.
    """

    ensure_results_file()

    try:
        content = (
            RESULTS_FILE.read_text(
                encoding="utf-8"
            )
        )

        if not content.strip():
            return []

        data = json.loads(
            content
        )

        if isinstance(data, list):
            return data

        return []

    except (
        json.JSONDecodeError,
        OSError
    ):
        return []


def save_analysis_result(
    result
):
    """
    Append a completed analysis
    to persistent storage.
    """

    results = (
        load_saved_results()
    )

    results.append(result)

    RESULTS_FILE.write_text(
        json.dumps(
            results,
            indent=2
        ),
        encoding="utf-8"
    )


# ---------------------------------------------------------
# HELPERS
# ---------------------------------------------------------

def allowed_file(
    filename
):
    """
    Check whether a video extension
    is supported.
    """

    if (
        not filename
        or "." not in filename
    ):
        return False

    extension = (
        filename
        .rsplit(".", 1)[1]
        .lower()
    )

    return (
        extension
        in ALLOWED_EXTENSIONS
    )


# ---------------------------------------------------------
# UPLOAD
# ---------------------------------------------------------

@video_bp.route(
    "/upload",
    methods=["POST"]
)
def upload_video():
    """
    Upload one CCTV video.

    Multiple videos are supported by
    the frontend through sequential
    individual requests.
    """

    if (
        request.content_length
        and
        request.content_length
        > MAX_VIDEO_SIZE
    ):
        return jsonify({
            "success": False,
            "message": (
                "Video file is larger "
                "than the 1 GB limit."
            )
        }), 413

    if "video" not in request.files:
        return jsonify({
            "success": False,
            "message": (
                "No video file provided"
            )
        }), 400

    video = request.files[
        "video"
    ]

    if not video.filename:
        return jsonify({
            "success": False,
            "message": (
                "No video selected"
            )
        }), 400

    if not allowed_file(
        video.filename
    ):
        return jsonify({
            "success": False,
            "message": (
                "Unsupported video format"
            )
        }), 400

    original_filename = (
        video.filename
    )

    safe_filename = (
        secure_filename(
            original_filename
        )
    )

    if not safe_filename:
        return jsonify({
            "success": False,
            "message": (
                "Invalid video filename"
            )
        }), 400

    upload_folder = (
        current_app.config[
            "UPLOAD_FOLDER"
        ]
    )

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

    unique_filename = (
        f"{uuid4().hex}_"
        f"{safe_filename}"
    )

    filepath = os.path.join(
        upload_folder,
        unique_filename
    )

    video.save(filepath)

    area = request.form.get(
        "area",
        ""
    )

    return jsonify({
        "success": True,
        "message": (
            "Video uploaded successfully"
        ),
        "video": {
            "filename":
                unique_filename,
            "original_filename":
                original_filename,
            "path":
                filepath,
            "area":
                area,
            "status":
                "uploaded"
        }
    }), 201


# ---------------------------------------------------------
# ANALYSIS
# ---------------------------------------------------------

@video_bp.route(
    "/analyze",
    methods=["POST"]
)
def analyze_video():
    """
    Analyze one uploaded video
    through the VIGIL CV + AI pipeline.
    """

    data = request.get_json(
        silent=True
    )

    if not data:
        return jsonify({
            "success": False,
            "message": (
                "No video analysis "
                "data provided"
            )
        }), 400

    filename = data.get(
        "filename"
    )

    area = data.get(
        "area",
        ""
    )

    original_filename = (
        data.get(
            "original_filename"
        )
    )

    if not filename:
        return jsonify({
            "success": False,
            "message": (
                "Video filename "
                "is required"
            )
        }), 400

    safe_filename = os.path.basename(
        filename
    )

    upload_folder = (
        current_app.config[
            "UPLOAD_FOLDER"
        ]
    )

    video_path = os.path.join(
        upload_folder,
        safe_filename
    )

    if not os.path.exists(
        video_path
    ):
        return jsonify({
            "success": False,
            "message": (
                "Video file not found"
            )
        }), 404

    try:
        processor = (
            VideoProcessor()
        )

        results = (
            processor.process_video(
                video_path
            )
        )

        analysis_id = str(
            uuid4()
        )

        completed_at = (
            datetime.now()
            .isoformat()
        )

        stored_result = {
            "analysis_id":
                analysis_id,

            "filename":
                safe_filename,

            "original_filename":
                original_filename,

            "area":
                area,

            "completed_at":
                completed_at,

            "results":
                results
        }

        save_analysis_result(
            stored_result
        )

        return jsonify({
            "success": True,
            "message": (
                "Video analysis "
                "completed"
            ),
            "analysis_id":
                analysis_id,
            "area":
                area,
            "results":
                results
        })

    except Exception as error:

        return jsonify({
            "success": False,
            "message": (
                "Video analysis failed"
            ),
            "error":
                str(error)
        }), 500


# ---------------------------------------------------------
# ALL STORED RESULTS
# ---------------------------------------------------------

@video_bp.route(
    "/results",
    methods=["GET"]
)
def all_video_results():
    """
    Return stored video analyses.

    Optional:
        ?area=Sitabuldi
    """

    results = (
        load_saved_results()
    )

    area = request.args.get(
        "area"
    )

    if area:
        results = [
            result
            for result in results
            if result.get("area")
            == area
        ]

    return jsonify({
        "success": True,
        "count":
            len(results),
        "results":
            results
    })


# ---------------------------------------------------------
# SINGLE VIDEO RESULT
# ---------------------------------------------------------

@video_bp.route(
    "/results/<filename>",
    methods=["GET"]
)
def video_results(
    filename
):
    """
    Return the latest stored analysis
    for a particular uploaded filename.
    """

    safe_filename = (
        os.path.basename(
            filename
        )
    )

    results = (
        load_saved_results()
    )

    matches = [
        result
        for result in results
        if result.get(
            "filename"
        ) == safe_filename
    ]

    if not matches:
        return jsonify({
            "success": False,
            "message": (
                "No saved analysis "
                "found for this video"
            )
        }), 404

    return jsonify({
        "success": True,
        "filename":
            safe_filename,
        "results":
            matches[-1]
    })