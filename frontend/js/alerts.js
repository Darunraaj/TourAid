// TourAid – Alert UI Components

const ALERT_ICONS = {
  panic:   '🚨',
  medical: '🏥',
  crime:   '🚔',
  lost:    '📍'
};

const PRIORITY_COLORS = {
  critical: '#e53e3e',
  high:     '#dd6b20',
  medium:   '#d69e2e',
  low:      '#38a169'
};

// Load and render active alerts list
async function loadActiveAlerts() {
  const container = document.getElementById('alertsList');
  if (!container) return;

  try {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/alerts/active?limit=10', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (!data.success || data.alerts.length === 0) {
      container.innerHTML = '<p class="loading">✅ No active alerts at this time.</p>';
      return;
    }

    container.innerHTML = data.alerts.map(alert => renderAlertCard(alert)).join('');
  } catch (err) {
    container.innerHTML = '<p class="loading">Unable to load alerts. Check connection.</p>';
  }
}

// Render a single alert card
function renderAlertCard(alert) {
  const icon = ALERT_ICONS[alert.alert_type] || '⚠️';
  const priorityColor = PRIORITY_COLORS[alert.priority] || '#718096';
  const time = new Date(alert.created_at).toLocaleTimeString();

  return `
    <div class="alert-item ${alert.alert_type}">
      <div class="alert-type">${icon} ${alert.alert_type.toUpperCase()}</div>
      <div class="alert-name">${alert.tourist_name || 'Tourist'}</div>
      <div class="alert-location">📍 ${alert.location}</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        <span class="alert-priority" style="background:${priorityColor}20; color:${priorityColor};">
          ${alert.priority.toUpperCase()}
        </span>
        <span style="font-size:11px; color:#718096;">🕐 ${time}</span>
      </div>
      ${alert.tourist_phone ? `
        <a href="tel:${alert.tourist_phone}" 
           style="display:inline-block; margin-top:8px; padding:6px 14px; 
                  background:#276749; color:white; border-radius:6px; 
                  text-decoration:none; font-size:12px; font-weight:600;">
          📞 Call Tourist
        </a>` : ''}
    </div>
  `;
}

// Escalate alert priority
async function escalateAlert(alertId, newPriority) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/alerts/${alertId}/escalate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ priority: newPriority })
    });
    const data = await res.json();
    if (data.success) {
      loadActiveAlerts();
      showBanner(`Alert escalated to ${newPriority.toUpperCase()}`);
    }
  } catch (err) {
    console.error('Escalation failed:', err);
  }
}

// Resolve an alert
async function resolveAlert(alertId, officerId) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/alerts/${alertId}/resolve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ resolved_by: officerId })
    });
    const data = await res.json();
    if (data.success) {
      loadActiveAlerts();
      showBanner('✅ Alert resolved successfully.');
    }
  } catch (err) {
    console.error('Resolve failed:', err);
  }
}

// Auto-refresh alerts every 30 seconds
setInterval(loadActiveAlerts, 30000);
