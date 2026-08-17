const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";

const NAGPUR_VIEWBOX =
  "78.95,21.25,79.25,21.00";

function isInsideNagpur(result) {
  const lat = Number(result.lat);
  const lng = Number(result.lon);

  return (
    lat >= 21.00 &&
    lat <= 21.25 &&
    lng >= 78.95 &&
    lng <= 79.25
  );
}

function normalizeResult(result) {
  const address = result.address || {};

  return {
    id: String(result.place_id),

    name:
      result.name ||
      result.display_name.split(",")[0],

    displayName: result.display_name,

    lat: Number(result.lat),
    lng: Number(result.lon),

    type: result.type,
    category: result.category,

    address,

    road:
      address.road ||
      address.pedestrian ||
      "",

    neighbourhood:
      address.neighbourhood ||
      address.suburb ||
      address.quarter ||
      "",

    city:
      address.city ||
      address.town ||
      address.municipality ||
      "Nagpur",

    district:
      address.state_district ||
      "Nagpur",
  };
}

export async function searchNagpurLocations(
  query
) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    q: `${query}, Nagpur, Maharashtra, India`,
    format: "jsonv2",
    addressdetails: "1",
    limit: "12",
    bounded: "1",
    viewbox: NAGPUR_VIEWBOX,
  });

  try {
    const response = await fetch(
      `${NOMINATIM_URL}?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Location API returned ${response.status}`
      );
    }

    const data = await response.json();

    return data
      .filter(isInsideNagpur)
      .map(normalizeResult);
  } catch (error) {
    console.error(
      "Nagpur location search failed:",
      error
    );

    return [];
  }
}

export async function geocodeLocation(
  query
) {
  const results =
    await searchNagpurLocations(query);

  return results[0] || null;
}

export async function searchNagpurStreets(
  areaName
) {
  if (!areaName) {
    return [];
  }

  return searchNagpurLocations(
    `${areaName} roads streets`
  );
}