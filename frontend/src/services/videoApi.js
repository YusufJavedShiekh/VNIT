const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5000";

export async function uploadTrafficVideo(
  file,
  area
) {
  const formData =
    new FormData();

  formData.append(
    "video",
    file
  );

  formData.append(
    "area",
    area
  );

  const response =
    await fetch(
      `${API_BASE_URL}/api/video/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

  if (!response.ok) {
    throw new Error(
      `Video upload failed: ${response.status}`
    );
  }

  return response.json();
}

export async function getCameras() {
  const response =
    await fetch(
      `${API_BASE_URL}/api/cameras`
    );

  if (!response.ok) {
    throw new Error(
      `Camera request failed: ${response.status}`
    );
  }

  return response.json();
}

export async function getCamera(
  cameraId
) {
  const response =
    await fetch(
      `${API_BASE_URL}/api/cameras/${cameraId}`
    );

  if (!response.ok) {
    throw new Error(
      `Camera request failed: ${response.status}`
    );
  }

  return response.json();
}