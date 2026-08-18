from flask import Flask, jsonify
from flask_cors import CORS

from config import Config

from routes.dashboard_routes import dashboard_bp
from routes.risk_routes import risk_bp
from routes.police_routes import police_bp
from routes.incident_routes import incident_bp
from routes.camera_routes import camera_bp
from routes.video_routes import video_bp


def create_app():
    app = Flask(__name__)

   

    # Load configuration
    app.config.from_object(Config)

    app.config["MAX_CONTENT_LENGTH"] = (
        1 * 1024 * 1024 * 1024
    )

    # Enable React frontend -> Flask backend communication
    CORS(app)

    # Register API blueprints
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(risk_bp)
    app.register_blueprint(police_bp)
    app.register_blueprint(incident_bp)
    app.register_blueprint(camera_bp)
    app.register_blueprint(video_bp)


    @app.route("/")
    def home():
        return jsonify({
            "success": True,
            "message": "VIGIL Backend is running",
            "system": "VIGIL",
            "location": "Nagpur"
        })

    @app.route("/api/health")
    def health():
        return jsonify({
            "success": True,
            "status": "online",
            "service": "VIGIL Backend"
        })

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )