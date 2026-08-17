def safe_float(value, default=0.0):
    """
    Safely convert a value to float.
    """

    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def calculate_risk_category(score):
    """
    Convert a numerical risk score into a VIGIL category.
    """

    score = safe_float(score)

    if score >= 70:
        return "High"

    if score >= 40:
        return "Medium"

    return "Low"


def calculate_recommended_units(
    risk_score,
    incident_count=0
):
    """
    Estimate the number of police units recommended
    for a risk zone.
    """

    risk_score = safe_float(
        risk_score
    )

    incident_count = int(
        safe_float(
            incident_count
        )
    )

    if risk_score >= 85:
        units = 3

    elif risk_score >= 70:
        units = 2

    elif risk_score >= 40:
        units = 1

    else:
        units = 0

    # Add one unit when several incidents are active.
    if incident_count >= 3:
        units += 1

    return min(
        units,
        4
    )


def calculate_priority_score(
    risk_score,
    incident_count=0
):
    """
    Calculate police-deployment priority.
    """

    risk_score = safe_float(
        risk_score
    )

    incident_count = int(
        safe_float(
            incident_count
        )
    )

    priority = (
        risk_score * 0.75
        +
        min(
            incident_count * 5,
            25
        )
    )

    return round(
        min(
            priority,
            100
        ),
        2
    )