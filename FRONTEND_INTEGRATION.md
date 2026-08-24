# Frontend Integration Guide

## Filtering Events in Your Application

To ensure only real August-September 2026 events are displayed, update your API queries to filter out sample/dummy events.

---

## API Query Examples

### 1. Fetch Active Events Only

**JavaScript/React:**
```javascript
// In your API client (src/api/base44Client.js or component)
const fetchActiveEvents = async () => {
  const response = await fetch('http://localhost:3001/event');
  const allEvents = await response.json();
  
  // Filter out sample events
  const activeEvents = allEvents.filter(event => !event.is_sample);
  
  return activeEvents;
};
```

**Alternative with URL params (if json-server supports):**
```javascript
const response = await fetch('http://localhost:3001/event?is_sample=false');
```

### 2. Fetch August-September 2026 Events

```javascript
const fetchAugSepEvents = async () => {
  const response = await fetch('http://localhost:3001/event');
  const allEvents = await response.json();
  
  // Filter for Aug-Sep 2026 and active events
  const events = allEvents.filter(event => {
    if (event.is_sample) return false;
    const date = new Date(event.start_date);
    return date >= new Date('2026-08-01') && date < new Date('2026-10-01');
  });
  
  return events.sort((a, b) => 
    new Date(a.start_date) - new Date(b.start_date)
  );
};
```

### 3. Fetch Recent Articles

```javascript
const fetchRecentArticles = async () => {
  const response = await fetch('http://localhost:3001/article');
  const articles = await response.json();
  
  // Sort by published date, newest first
  return articles
    .filter(article => !article.is_sample)
    .sort((a, b) => 
      new Date(b.published_date) - new Date(a.published_date)
    )
    .slice(0, 10); // Get latest 10
};
```

---

## React Component Example

```jsx
import { useState, useEffect } from 'react';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/event');
        const data = await response.json();
        
        // Filter active events only
        const activeEvents = data
          .filter(event => !event.is_sample)
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        
        setEvents(activeEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="events-list">
      <h2>Upcoming Events in Yogyakarta</h2>
      {events.map(event => (
        <div key={event.id} className="event-card">
          <img src={event.cover_image_url} alt={event.title_en} />
          <h3>{event.title_en}</h3>
          <p>{event.excerpt_en || event.description_en?.substring(0, 150) + '...'}</p>
          <div className="event-meta">
            <span>{new Date(event.start_date).toLocaleDateString()}</span>
            <span>{event.venue}</span>
            <span>{event.price_idr === 0 ? 'Free' : `IDR ${event.price_idr.toLocaleString()}`}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventsList;
```

---

## Update Existing API Calls

### Find and Update These Patterns:

**Before:**
```javascript
// Old code that fetches all events
fetch('/api/event')
  .then(res => res.json())
  .then(data => setEvents(data));
```

**After:**
```javascript
// New code that filters sample events
fetch('/api/event')
  .then(res => res.json())
  .then(data => {
    const activeEvents = data.filter(e => !e.is_sample);
    setEvents(activeEvents);
  });
```

---

## Homepage Highlights

To show featured events on homepage:

```javascript
const fetchHighlightedEvents = async () => {
  const response = await fetch('http://localhost:3001/event');
  const data = await response.json();
  
  return data
    .filter(event => 
      !event.is_sample && 
      event.is_homepage_highlight === true
    )
    .slice(0, 3); // Top 3 highlighted events
};
```

---

## Production VPS Configuration

### Update API Base URL

**Development:**
```javascript
const API_BASE_URL = 'http://localhost:3001';
```

**Production:**
```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001'
  : 'https://demo.experiencejogja.com/api';
```

Or use environment variable:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

---

## Nginx Configuration (Already Set Up)

Your VPS Nginx is already configured to proxy `/api/*` to json-server:

```nginx
location /api {
    proxy_pass http://127.0.0.1:3001/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

This means:
- Frontend: `https://demo.experiencejogja.com`
- API: `https://demo.experiencejogja.com/api/event`
- json-server: `http://127.0.0.1:3001/event`

---

## Testing Checklist

- [ ] Events page shows 13 real events only
- [ ] No dummy/sample events visible
- [ ] Blog/articles page shows 2 new posts
- [ ] Event dates are August-September 2026
- [ ] Event details pages load correctly
- [ ] Images display (even if placeholder)
- [ ] Pricing displays in IDR correctly
- [ ] Bilingual content works (EN/ID toggle)
- [ ] Links to event pages work
- [ ] Homepage highlights show featured events

---

## Deployment Steps

1. **Test locally:**
   ```bash
   npm run dev
   # Visit http://localhost:5173
   # Check events page, articles, homepage
   ```

2. **Build for production:**
   ```bash
   npm run build
   # Creates dist/ folder
   ```

3. **Deploy to VPS:**
   ```bash
   # On VPS (already set up with deploy.sh)
   cd /var/www/demo.experiencejogja.com
   git pull
   npm ci
   npm run build
   
   # Restart json-server
   sudo systemctl restart experiencejogja-json-server
   ```

4. **Verify:**
   - Visit https://demo.experiencejogja.com
   - Check events display correctly
   - Test API: https://demo.experiencejogja.com/api/event

---

## Troubleshooting

**Issue: Still seeing old/dummy events**
- Clear browser cache
- Check if filter `!event.is_sample` is applied
- Verify json-server restarted with new db.json

**Issue: API returns empty array**
- Check json-server is running: `systemctl status experiencejogja-json-server`
- Test API directly: `curl http://localhost:3001/event`
- Check Nginx proxy logs: `sudo tail -f /var/log/nginx/access.log`

**Issue: Images not loading**
- Placeholder Unsplash URLs should work
- For production, replace with local or Shutterstock images
- Check image URLs in db.json

---

## Summary

**Key Changes Required in Frontend:**
1. Filter events where `is_sample !== true`
2. Sort events by `start_date`
3. Handle bilingual content (EN/ID)
4. Update API base URL for production

**No Changes Needed:**
- API structure remains the same
- Event fields unchanged
- Nginx configuration already correct
- json-server already configured

---

**Last Updated:** August 24, 2026 14:27 WIB
