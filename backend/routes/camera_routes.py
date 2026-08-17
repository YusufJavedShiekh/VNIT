from flask import Blueprint, jsonify, request


camera_bp = Blueprint(
    "camera",
    __name__,
    url_prefix="/api/cameras"
)


@camera_bp.route("/", methods=["GET"])
def get_cameras():
    """
    Return registered CCTV cameras.
    """

    return jsonify({
        "success": True,
        "cameras": []
    })


@camera_bp.route("/active", methods=["GET"])
def get_active_cameras():
    """
    Return currently active CCTV cameras.
    """

    return jsonify({
        "success": True,
        "cameras": []
    })


@camera_bp.route("/<int:camera_id>", methods=["GET"])
def get_camera(camera_id):
    """
    Return information about one camera.
    """

    return jsonify({
        "success": True,
        "camera": {
            "id": camera_id
        }
    })


@camera_bp.route("/<int:camera_id>/status", methods=["GET"])
def camera_status(camera_id):
    """
    Return the current status of a camera.
    """

    return jsonify({
        "success": True,
        "camera_id": camera_id,
        "status": "offline"
    })


@camera_bp.route("/<int:camera_id>/analyze", methods=["POST"])
def analyze_camera(camera_id):
    """
    Start/request analysis of a camera feed.

    Actual processing will be handled by
    computer_vision/video_processor.py.
    """

    data = request.get_json(silent=True) or {}

    return jsonify({
        "success": True,
        "message": "Camera analysis request received",
        "camera_id": camera_id,
        "analysis": {
            "status": "queued",
            "options": data
        }
    })