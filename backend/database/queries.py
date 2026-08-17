from .db import load_dataframe


ACCIDENTS_FILE = "accidents.csv"
LOCATIONS_FILE = "locations.csv"
POLICE_UNITS_FILE = "police_units.csv"
TRAFFIC_HISTORY_FILE = "traffic_history.csv"


def get_accidents():
    """
    Return all accident records.
    """

    return load_dataframe(
        ACCIDENTS_FILE
    )


def get_locations():
    """
    Return all monitored locations.
    """

    return load_dataframe(
        LOCATIONS_FILE
    )


def get_police_units():
    """
    Return all police units.
    """

    return load_dataframe(
        POLICE_UNITS_FILE
    )


def get_traffic_history():
    """
    Return historical traffic records.
    """

    return load_dataframe(
        TRAFFIC_HISTORY_FILE
    )


def get_available_police_units():
    """
    Return police units whose status is available.

    Handles common column-name variations.
    """

    dataframe = get_police_units()

    if dataframe.empty:
        return dataframe

    status_column = None

    for column in dataframe.columns:
        normalized = str(
            column
        ).strip().lower()

        if normalized in {
            "status",
            "unit_status",
            "availability"
        }:
            status_column = column
            break

    if status_column is None:
        return dataframe

    values = (
        dataframe[status_column]
        .astype(str)
        .str.strip()
        .str.lower()
    )

    return dataframe[
        values.isin({
            "available",
            "active",
            "free",
            "ready"
        })
    ].copy()


def get_location_by_id(location_id):
    """
    Find a location using its ID.
    """

    dataframe = get_locations()

    if dataframe.empty:
        return None

    id_column = None

    for column in dataframe.columns:
        normalized = str(
            column
        ).strip().lower()

        if normalized in {
            "id",
            "location_id",
            "zone_id",
            "locationid"
        }:
            id_column = column
            break

    if id_column is None:
        return None

    matches = dataframe[
        dataframe[id_column].astype(str)
        == str(location_id)
    ]

    if matches.empty:
        return None

    return matches.iloc[0].to_dict()


def get_accident_count():
    """
    Return total number of recorded accidents.
    """

    dataframe = get_accidents()

    if dataframe.empty:
        return 0

    return len(dataframe)


def get_traffic_history_count():
    """
    Return number of historical traffic records.
    """

    dataframe = get_traffic_history()

    if dataframe.empty:
        return 0

    return len(dataframe)