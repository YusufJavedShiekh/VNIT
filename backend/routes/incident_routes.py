from flask import Blueprint, jsonify, request


incident_bp = Blueprint(
    "incident",
    __name__,
    url_prefix="/api/incidents"
)


@incident_bp.route("/", methods=["GET"])
def get_incidents():
    """
    Return detected/reported incidents.

    Later this will read incidents from the database.
    """

    return jsonify({
        "success": True,
        "incidents": []
    })


@incident_bp.route("/recent", methods=["GET"])
def get_recent_incidents():
    """
    Return the most recent incidents.
    """

    return jsonify({
        "success": True,
        "incidents": []
    })


@incident_bp.route("/<int:incident_id>", methods=["GET"])
def get_incident(incident_id):
    """
    Return one incident by ID.
    """

    return jsonify({
        "success": True,
        "incident": {
            "id": incident_id
        }
    })


@incident_bp.route("/", methods=["POST"])
def create_incident():
    """
    Create a manually reported incident.

    This can later also be used by the AI/CV system
    when an incident is automatically detected.
    """

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "No incident data provided"
        }), 400

    return jsonify({
        "success": True,
        "message": "Incident received",
        "incident": data
    }), 201


@incident_bp.route("/simulate", methods=["POST"])
def simulate_incident():
    """
    Used by IncidentSimulator.jsx.

    This allows the frontend to simulate an incident
    during development/testing.
    """

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "No simulation data provided"
        }), 400

    return jsonify({
        "success": True,
        "message": "Incident simulation received",
        "result": {
            "incident_type": data.get(
                "incident_type",
                "unknown"
            ),
            "severity": data.get(
                "severity",
                "medium"
            ),
            "location": data.get(
                "location",
                None
            )
        }
    })


@incident_bp.route("/types", methods=["GET"])
def incident_types():
    """
    Return incident categories recognized by VIGIL.
    """

    return jsonify({
        "success": True,
        "types": [
            "accident",
            "collision",
            "traffic_jam",
            "overspeeding",
            "wrong_way",
            "vehicle_breakdown",
            "road_obstruction",
            "other"
        ]
    })