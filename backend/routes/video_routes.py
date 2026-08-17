import os

from flask import Blueprint, jsonify, request, current_app

from computer_vision.video_processor import VideoProcessor


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


def allowed_file(filename):
    """
    Check whether the uploaded file has a supported
    video extension.
    """

    if not filename or "." not in filename:
        return False

    extension = filename.rsplit(".", 1)[1].lower()

    return extension in ALLOWED_EXTENSIONS


@video_bp.route("/upload", methods=["POST"])
def upload_video():
    """
    Upload a CCTV/video file for VIGIL analysis.
    """

    if "video" not in request.files:
        return jsonify({
            "success": False,
            "message": "No video file provided"
        }), 400

    video = request.files["video"]

    if video.filename == "":
        return jsonify({
            "success": False,
            "message": "No video selected"
        }), 400

    if not allowed_file(video.filename):
        return jsonify({
            "success": False,
            "message": "Unsupported video format"
        }), 400

    upload_folder = current_app.config["UPLOAD_FOLDER"]

    os.makedirs(upload_folder, exist_ok=True)

    filename = video.filename
    filepath = os.path.join(
        upload_folder,
        filename
    )

    video.save(filepath)

    return jsonify({
        "success": True,
        "message": "Video uploaded successfully",
        "video": {
            "filename": filename,
            "path": filepath,
            "status": "uploaded"
        }
    }), 201


@video_bp.route("/analyze", methods=["POST"])
def analyze_video():
    """
    Process an uploaded CCTV video through the VIGIL
    computer-vision pipeline.
    """

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "No video analysis data provided"
        }), 400

    filename = data.get("filename")

    if not filename:
        return jsonify({
            "success": False,
            "message": "Video filename is required"
        }), 400

    upload_folder = current_app.config[
        "UPLOAD_FOLDER"
    ]

    video_path = os.path.join(
        upload_folder,
        filename
    )

    if not os.path.exists(video_path):
        return jsonify({
            "success": False,
            "message": "Video file not found"
        }), 404

    try:
        processor = VideoProcessor()

        results = processor.process_video(
            video_path
        )

        return jsonify({
            "success": True,
            "message": "Video analysis completed",
            "results": results
        })

    except Exception as error:
        return jsonify({
            "success": False,
            "message": "Video analysis failed",
            "error": str(error)
        }), 500

@video_bp.route("/results/<filename>", methods=["GET"])
def video_results(filename):
    """
    Return analysis results for a processed video.
    """

    return jsonify({
        "success": True,
        "filename": filename,
        "results": {
            "vehicles": [],
            "traffic": {},
            "speed": {},
            "incidents": []
        }
    })