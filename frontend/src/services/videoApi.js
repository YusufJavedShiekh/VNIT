const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5000";


// ---------------------------------------------------------
// SINGLE VIDEO
// ---------------------------------------------------------

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

  const uploadResponse =
    await fetch(
      `${API_BASE_URL}/api/videos/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

  if (!uploadResponse.ok) {
    let message =
      `Video upload failed: ${uploadResponse.status}`;

    try {
      const errorData =
        await uploadResponse.json();

      message =
        errorData.message ||
        message;
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  const uploadResult =
    await uploadResponse.json();

  if (!uploadResult.success) {
    throw new Error(
      uploadResult.message ||
      "Video upload failed"
    );
  }

  const filename =
    uploadResult.video?.filename;

  if (!filename) {
    throw new Error(
      "Uploaded video filename was not returned."
    );
  }

  const analyzeResponse =
    await fetch(
      `${API_BASE_URL}/api/videos/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          filename,
          original_filename:
            uploadResult.video
              ?.original_filename ||
            file.name,
          area,
        }),
      }
    );

  if (!analyzeResponse.ok) {
    let message =
      `Video analysis failed: ${analyzeResponse.status}`;

    try {
      const errorData =
        await analyzeResponse.json();

      message =
        errorData.message ||
        message;
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  const analysisResult =
    await analyzeResponse.json();

  if (!analysisResult.success) {
    throw new Error(
      analysisResult.message ||
      "Video analysis failed"
    );
  }

  return {
    ...analysisResult,
    upload:
      uploadResult,
    area,
  };
}


// ---------------------------------------------------------
// MULTIPLE VIDEOS
// SEQUENTIAL PROCESSING
// ---------------------------------------------------------

export async function
uploadTrafficVideosSequentially(
  files,
  area,
  onProgress
) {
  const results = [];

  for (
    let index = 0;
    index < files.length;
    index += 1
  ) {
    const file =
      files[index];

    if (onProgress) {
      onProgress({
        current:
          index + 1,
        total:
          files.length,
        filename:
          file.name,
        status:
          "processing",
      });
    }

    try {
      const result =
        await uploadTrafficVideo(
          file,
          area
        );

      results.push({
        success:
          true,
        filename:
          file.name,
        result,
      });

      if (onProgress) {
        onProgress({
          current:
            index + 1,
          total:
            files.length,
          filename:
            file.name,
          status:
            "completed",
        });
      }

    } catch (error) {

      results.push({
        success:
          false,
        filename:
          file.name,
        error:
          error.message ||
          "Video processing failed",
      });

      if (onProgress) {
        onProgress({
          current:
            index + 1,
          total:
            files.length,
          filename:
            file.name,
          status:
            "failed",
        });
      }
    }
  }

  return results;
}


// ---------------------------------------------------------
// STORED HISTORY
// ---------------------------------------------------------

export async function
getVideoAnalysisHistory(
  area = ""
) {
  const query =
    area
      ? `?area=${encodeURIComponent(area)}`
      : "";

  const response =
    await fetch(
      `${API_BASE_URL}/api/videos/results${query}`
    );

  if (!response.ok) {
    throw new Error(
      `Video history request failed: ${response.status}`
    );
  }

  return response.json();
}


// ---------------------------------------------------------
// SINGLE STORED RESULT
// ---------------------------------------------------------

export async function
getVideoAnalysisResult(
  filename
) {
  const response =
    await fetch(
      `${API_BASE_URL}/api/videos/results/${encodeURIComponent(
        filename
      )}`
    );

  if (!response.ok) {
    throw new Error(
      `Video result request failed: ${response.status}`
    );
  }

  return response.json();
}


// ---------------------------------------------------------
// CAMERA APIs
// ---------------------------------------------------------

export async function
getCameras() {
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


export async function
getCamera(cameraId) {
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