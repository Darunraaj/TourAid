// TourAid – Main Application Logic

const API_BASE = '/api';

// Load dashboard stats on page load
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadActiveAlerts();
});

// Fetch and display dashboard statistics
async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/alerts/stats?days=1`);
    const data = await res.json();
    if (data.success) {
      document.getElementById('activeAlerts').textContent = data.stats.active ?? '--';
      document.getElementById('resolvedAlerts').textContent = data.stats.resolved ?? '--';
    }

    const touristRes = await fetch(`${API_BASE}/tourists/stats/all`);
    const touristData = await touristRes.json();
    if (touristData.success) {
      document.getElementById('totalTourists').textContent = touristData.stats.total ?? '--';
    }
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

// Send an emergency alert with current GPS location
async function sendAlert(alertType) {
  const confirmed = confirm(`Send ${alertType.toUpperCase()} alert? Your live location will be shared.`);
  if (!confirmed) return;

  showBanner(`Sending ${alertType} alert... Getting your location...`);

  if (!navigator.geolocation) {
    showBanner('Geolocation not supported on this device.', true);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      try {
        const token = localStorage.getItem('token');
        const touristId = localStorage.getItem('touristId');

        const res = await fetch(`${API_BASE}/alerts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            tourist_id: touristId || 1,
            alert_type: alertType,
            location: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`,
            latitude, longitude,
            priority: alertType === 'panic' ? 'critical' : 'high'
          })
        });

        const data = await res.json();
        if (data.success) {
          showBanner(`✅ ${alertType.toUpperCase()} alert sent! Help is on the way.`);
          loadActiveAlerts();
        } else {
          showBanner('Failed to send alert. Please call 100 directly.', true);
        }
      } catch (err) {
        showBanner('Network error. Please call 100 directly.', true);
      }
    },
    () => showBanner('Location access denied. Enable GPS and try again.', true)
  );
}

// Share current location with system
function shareLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported on your device.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      showBanner(`📍 Location shared: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      if (typeof updateMap === 'function') updateMap(latitude, longitude);
    },
    () => alert('Unable to get your location. Please enable GPS.')
  );
}

// Show top banner message
function showBanner(message, isError = false) {
  const banner = document.getElementById('alertBanner');
  banner.textContent = message;
  banner.style.background = isError ? '#744210' : '#276749';
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 5000);
}
