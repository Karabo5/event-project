// script.js
const eventForm = document.getElementById('eventForm');

function getEventsFromStorage() {
  return JSON.parse(localStorage.getItem('events')) || [];
}

function saveEventsToStorage(events) {
  localStorage.setItem('events', JSON.stringify(events));
}

// Render Events: Home Section
function renderHomeEvents() {
  const homeEventsList = document.getElementById('homeEvents');
  const searchQuery = document.getElementById('homeSearch').value.toLowerCase();
  const filterType = document.getElementById('homeFilter').value;
  const dateFilter = document.getElementById('homeDateFilter').value;

  let events = getEventsFromStorage();
  let filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const isUpcoming = eventDate >= today;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery);
    const matchesDate = dateFilter ? event.date === dateFilter : true;
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'upcoming' && isUpcoming) ||
      (filterType === 'past' && !isUpcoming);
    return matchesSearch && matchesDate && matchesFilter;
  });

  homeEventsList.innerHTML = '';
  if (filteredEvents.length === 0) {
    homeEventsList.innerHTML = '<p class="no-events">No events found.</p>';
    return;
  }

  filteredEvents.forEach(event => {
    const eventElement = document.createElement('div');
    eventElement.className = `event ${new Date(event.date) < new Date() ? 'past' : ''}`;
    eventElement.innerHTML = `
      <h3>${event.title}</h3>
      <div class="event-meta">
        <span><i class="fas fa-calendar"></i> ${event.date}</span>
        <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
      </div>
      <p>${event.description}</p>
    `;
    homeEventsList.appendChild(eventElement);
  });
}

// Render Events: Manage Events Section
function renderViewEvents() {
  const viewEventsList = document.getElementById('eventsList');
  const searchQuery = document.getElementById('search').value.toLowerCase();
  const filterType = document.getElementById('filter').value;
  const dateFilter = document.getElementById('dateFilter').value;

  let events = getEventsFromStorage();
  let filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const isUpcoming = eventDate >= today;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery);
    const matchesDate = dateFilter ? event.date === dateFilter : true;
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'upcoming' && isUpcoming) ||
      (filterType === 'past' && !isUpcoming);
    return matchesSearch && matchesDate && matchesFilter;
  });

  viewEventsList.innerHTML = '';
  if (filteredEvents.length === 0) {
    viewEventsList.innerHTML = '<p class="no-events">No events found.</p>';
    return;
  }

  filteredEvents.forEach(event => {
    const eventElement = document.createElement('div');
    eventElement.className = `event ${new Date(event.date) < new Date() ? 'past' : ''}`;
    eventElement.innerHTML = `
      <h3>${event.title}</h3>
      <div class="event-meta">
        <span><i class="fas fa-calendar"></i> ${event.date}</span>
        <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
      </div>
      <p>${event.description}</p>
    `;
    viewEventsList.appendChild(eventElement);
  });
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  renderHomeEvents(); // Render Home events on page load
  renderViewEvents(); // Render Manage events on page load
});

// Event listeners for Home section filters
document.getElementById('homeSearch').addEventListener('input', renderHomeEvents);
document.getElementById('homeFilter').addEventListener('change', renderHomeEvents);
document.getElementById('homeDateFilter').addEventListener('change', renderHomeEvents);

// Event listeners for Manage section filters
document.getElementById('search').addEventListener('input', renderViewEvents);
document.getElementById('filter').addEventListener('change', renderViewEvents);
document.getElementById('dateFilter').addEventListener('change', renderViewEvents);

// Event creation (if missing)
eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const location = document.getElementById('location').value;
  const description = document.getElementById('description').value;

  const events = getEventsFromStorage();
  events.push({ title, date, location, description });
  saveEventsToStorage(events);

  eventForm.reset();
  document.getElementById('message').innerHTML = '<p class="success">Event created successfully!</p>';
  renderHomeEvents(); // Update Home display
  renderViewEvents(); // Update Manage display
});

