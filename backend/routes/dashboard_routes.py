from flask import Blueprint, jsonify


dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/dashboard"
)


@dashboard_bp.route("/summary", methods=["GET"])
def dashboard_summary():
    """
    Returns the main dashboard summary.
    """

    return jsonify({
        "success": True,
        "data": {
            "total_incidents": 0,
            "high_risk_zones": 0,
            "active_cameras": 0,
            "available_units": 0
        }
    })


@dashboard_bp.route("/traffic", methods=["GET"])
def dashboard_traffic():
    """
    Returns traffic information used by dashboard charts.
    """

    return jsonify({
        "success": True,
        "data": {
            "labels": [],
            "traffic": []
        }
    })


@dashboard_bp.route("/status", methods=["GET"])
def dashboard_status():
    """
    Returns the current VIGIL system status.
    """

    return jsonify({
        "success": True,
        "status": "online",
        "location": "Nagpur"
    })