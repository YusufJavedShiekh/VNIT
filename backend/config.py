import os

from dotenv import load_dotenv


load_dotenv()


class Config:
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "vigil-development-secret"
    )

    MAX_CONTENT_LENGTH = 100 * 1024 * 1024

    UPLOAD_FOLDER = os.path.join(
        os.path.dirname(__file__),
        "uploads"
    )

    JSON_SORT_KEYS = False