import os

import pandas as pd


BACKEND_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

DATA_DIR = os.path.join(
    BACKEND_DIR,
    "data"
)


def get_data_path(filename):
    """
    Return the absolute path of a VIGIL data file.
    """

    return os.path.join(
        DATA_DIR,
        filename
    )


def file_exists(filename):
    """
    Check whether a data file exists.
    """

    return os.path.exists(
        get_data_path(filename)
    )


def load_dataframe(filename):
    """
    Load a CSV file into a pandas DataFrame.

    Returns an empty DataFrame if the file does not
    exist or cannot be read.
    """

    path = get_data_path(
        filename
    )

    if not os.path.exists(path):
        return pd.DataFrame()

    try:
        return pd.read_csv(path)

    except (
        pd.errors.EmptyDataError,
        pd.errors.ParserError,
        OSError,
        ValueError
    ):
        return pd.DataFrame()


def save_dataframe(
    dataframe,
    filename
):
    """
    Save a DataFrame to the VIGIL data directory.
    """

    os.makedirs(
        DATA_DIR,
        exist_ok=True
    )

    path = get_data_path(
        filename
    )

    dataframe.to_csv(
        path,
        index=False
    )

    return path