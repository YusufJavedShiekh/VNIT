from flask import Blueprint, jsonify, request

from optimization.police_allocator import PoliceAllocator


police_bp = Blueprint(
    "police",
    __name__,
    url_prefix="/api/police"
)


allocator = PoliceAllocator()


@police_bp.route("/units", methods=["GET"])
def get_police_units():
    """
    Return currently available police units.

    Database integration will replace the temporary data.
    """

    return jsonify({
        "success": True,
        "units": []
    })


@police_bp.route("/allocation", methods=["GET"])
def get_allocation():
    """
    Return the current police deployment.
    """

    return jsonify({
        "success": True,
        "allocation": []
    })


@police_bp.route("/recommendations", methods=["GET"])
def get_recommendations():
    """
    Generate deployment recommendations from risk zones.
    """

    # Temporary API input until the database is connected.
    zones = [
        {
            "zone_id": "NGP-001",
            "location": "Nagpur",
            "risk_level": "High",
            "risk_score": 85,
            "recommended_units": 2,
            "incidents": [
                {
                    "type": "accident",
                    "severity": "high"
                }
            ]
        }
    ]

    police_units = [
        {
            "unit_id": "UNIT-001",
            "status": "available"
        },
        {
            "unit_id": "UNIT-002",
            "status": "available"
        }
    ]

    result = allocator.allocate(
        zones,
        police_units
    )

    return jsonify({
        "success": True,
        "recommendations": result
    })


@police_bp.route("/allocate", methods=["POST"])
def allocate_units():
    """
    Generate a police deployment from supplied
    risk zones and available units.
    """

    data = request.get_json(
        silent=True
    )

    if not data:
        return jsonify({
            "success": False,
            "message": "No allocation data provided"
        }), 400

    zones = data.get(
        "zones",
        []
    )

    police_units = data.get(
        "police_units",
        []
    )

    if not zones:
        return jsonify({
            "success": False,
            "message": "No risk zones provided"
        }), 400

    if not police_units:
        return jsonify({
            "success": False,
            "message": "No police units provided"
        }), 400

    try:
        result = allocator.allocate(
            zones,
            police_units
        )

        return jsonify({
            "success": True,
            "allocation": result
        })

    except Exception as error:
        return jsonify({
            "success": False,
            "message": "Police allocation failed",
            "error": str(error)
        }), 500


@police_bp.route("/override", methods=["POST"])
def manual_override():
    """
    Allow an officer to manually change the
    recommended deployment.
    """

    data = request.get_json(
        silent=True
    )

    if not data:
        return jsonify({
            "success": False,
            "message": "No override data provided"
        }), 400

    return jsonify({
        "success": True,
        "message": "Manual deployment override received",
        "override": data
    })


@police_bp.route("/comparison", methods=["POST"])
def deployment_comparison():
    """
    Compare current deployment with the
    AI-recommended deployment.
    """

    data = request.get_json(
        silent=True
    )

    if not data:
        return jsonify({
            "success": False,
            "message": "No comparison data provided"
        }), 400

    current = data.get(
        "current_deployment",
        []
    )

    recommended = data.get(
        "recommended_deployment",
        []
    )

    return jsonify({
        "success": True,
        "comparison": {
            "current_deployment": current,
            "recommended_deployment": recommended,
            "current_units": len(current),
            "recommended_units": len(recommended),
            "difference": (
                len(recommended)
                - len(current)
            )
        }
    })