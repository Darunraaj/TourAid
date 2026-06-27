// Location Service — Geo-location processing and geo-fence validation

const EARTH_RADIUS_KM = 6371;

/**
 * Haversine formula — calculates real-world distance between two GPS coordinates
 * Used for proximity-based alert dispatch to nearest police officers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c; // Distance in km
}

/**
 * Check if a coordinate point is inside a geo-fence polygon
 * Uses ray-casting algorithm for point-in-polygon detection
 */
function isInsideGeoFence(latitude, longitude, fenceCoordinates) {
  const coords = JSON.parse(fenceCoordinates);
  let inside = false;
  const x = longitude, y = latitude;

  for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    const xi = coords[i].lng, yi = coords[i].lat;
    const xj = coords[j].lng, yj = coords[j].lat;
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Find nearest available police officer to a given location
 */
async function findNearestOfficer(db, latitude, longitude) {
  const officers = await db.getAllQuery(
    `SELECT id, name, badge_number, phone, station, current_location 
     FROM police_officers WHERE status = 'on_duty' AND current_location IS NOT NULL`
  );

  let nearest = null;
  let minDistance = Infinity;

  for (const officer of officers) {
    const loc = JSON.parse(officer.current_location);
    const distance = calculateDistance(latitude, longitude, loc.latitude, loc.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...officer, distance_km: Math.round(distance * 10) / 10 };
    }
  }
  return nearest;
}

/**
 * Validate tourist location against all active geo-fences
 */
async function validateGeoFences(db, latitude, longitude) {
  const fences = await db.getAllQuery(
    `SELECT * FROM geo_fences WHERE is_active = 1`
  );

  const results = { inSafeZone: false, inRestrictedZone: false, zones: [] };

  for (const fence of fences) {
    if (isInsideGeoFence(latitude, longitude, fence.coordinates)) {
      results.zones.push({ name: fence.name, type: fence.fence_type });
      if (fence.fence_type === 'safe_zone' || fence.fence_type === 'tourist_area') {
        results.inSafeZone = true;
      }
      if (fence.fence_type === 'restricted_zone') {
        results.inRestrictedZone = true;
      }
    }
  }
  return results;
}

module.exports = { calculateDistance, isInsideGeoFence, findNearestOfficer, validateGeoFences };

