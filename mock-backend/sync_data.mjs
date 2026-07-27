import { createClient } from '@base44/sdk';
import fs from 'fs';

async function syncData() {
  try {
    console.log('Connecting to Base44...');
    const base44 = createClient({
      appId: '6a5745b9539f530d423709d4', // The ID from the sandbox URL
      appBaseUrl: 'https://app.base44.com',
      requiresAuth: false
    });

    console.log('Fetching Events...');
    const events = await base44.entities.Event.list();
    
    console.log('Fetching Destinations...');
    const destinations = await base44.entities.Destination.list();
    
    console.log('Fetching Articles...');
    const articles = await base44.entities.Article.list();

    console.log('Fetching Map Places...');
    const mapPlaces = await base44.entities.MapPlace.list();
    
    console.log('Fetching Map Pins...');
    const mapPins = await base44.entities.MapPinPosition.list();

    // Preserve the auth fields from current db.json
    let currentDb = {};
    if (fs.existsSync('./mock-backend/db.json')) {
      currentDb = JSON.parse(fs.readFileSync('./mock-backend/db.json', 'utf8'));
    }

    const newDb = {
      ...currentDb,
      event: events,
      destination: destinations,
      article: articles,
      mapplace: mapPlaces,
      mappinposition: mapPins
    };

    fs.writeFileSync('./mock-backend/db.json', JSON.stringify(newDb, null, 2));
    console.log('Successfully synced all dummy data from Base44 to local db.json!');
  } catch (error) {
    console.error('Failed to sync data:', error);
  }
}

syncData();
