// TourAid – Map & Geo-location Handling

let currentLat = null;
let currentLng = null;
let watchId = null;

// Start continuously watching tourist location
function startLocationWatch(touristId, token) {
  if (!navigator.geolocation) return;

  watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      currentLat = latitude;
      currentLng = longitude;

      updateMap(latitude, longitude);

      // Send location update to backend
      try {
        await fetch(`/api/tourists/${touristId}/location`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ latitude, longitude, accuracy })
        });
      } catch (err) {
        console.error('Location update failed:', err);
      }
    },
    (err) => console.error('Geolocation error:', err),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
  );
}

// Stop tracking location
function stopLocationWatch() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

// Update map display with current coordinates
function updateMap(latitude, longitude) {
  const mapDiv = document.getElementById('map');
  if (!mapDiv) return;

  mapDiv.innerHTML = `
    <div style="text-align:center; padding: 20px;">
      <div style="font-size: 48px;">📍</div>
      <p style="font-size: 15px; font-weight: 600; color: #1a365d; margin-top: 10px;">
        Your Current Location
      </p>
      <p style="font-size: 13px; color: #4a5568; margin-top: 6px;">
        Latitude: <strong>${latitude.toFixed(6)}</strong>
      </p>
      <p style="font-size: 13px; color: #4a5568;">
        Longitude: <strong>${longitude.toFixed(6)}</strong>
      </p>
      <a 
        href="https://maps.google.com/?q=${latitude},${longitude}" 
        target="_blank"
        style="display:inline-block; margin-top:14px; padding: 10px 20px; 
               background:#2b6cb0; color:white; border-radius:8px; 
               text-decoration:none; font-size:13px; font-weight:600;">
        Open in Google Maps 🗺️
      </a>
    </div>
  `;
}

// Haversine formula – distance in km between two GPS points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Get current coordinates as a promise
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}
