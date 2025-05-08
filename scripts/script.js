

const eventForm = document.getElementById('eventForm');
const eventNameInput = document.getElementById('eventName');
const eventList = document.getElementById('eventList');



function getEventsFromStorage() {
  return JSON.parse(localStorage.getItem('events')) || [];
}

function saveEventsToStorage(events) {
  localStorage.setItem('events', JSON.stringify(events));
}

eventForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = eventNameInput.value.trim();
  if (!name) return;

  const newEvent = {
    id: Date.now(),
    name
  };

  const events = getEventsFromStorage();
  events.push(newEvent);
  saveEventsToStorage(events);
  eventNameInput.value = '';
  renderEvents();
});


function renderEvents() {
  const events = getEventsFromStorage();
  eventList.innerHTML = '';

  events.forEach(event => {
    const li = document.createElement('li');
    li.textContent = event.name;

    
    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update';
    updateBtn.onclick = () => {
      const newName = prompt('Enter new name:', event.name);
      if (newName) updateEvent(event.id, newName);
    };

    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteEventById(event.id);

    li.appendChild(updateBtn);
    li.appendChild(deleteBtn);
    eventList.appendChild(li);
  });
}



function updateEvent(id, newName) {
  const events = getEventsFromStorage();
  const index = events.findIndex(event => event.id === id);
  if (index !== -1) {
    events[index].name = newName;
    saveEventsToStorage(events);
    renderEvents();
  }
}


function deleteEventById(id) {
  let events = getEventsFromStorage();
  events = events.filter(event => event.id !== id);
  saveEventsToStorage(events);
  renderEvents();
}


renderEvents();


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

document.addEventListener('DOMContentLoaded', () => {
  renderHomeEvents(); 
  renderViewEvents(); 
});


document.getElementById('homeSearch').addEventListener('input', renderHomeEvents);
document.getElementById('homeFilter').addEventListener('change', renderHomeEvents);
document.getElementById('homeDateFilter').addEventListener('change', renderHomeEvents);


document.getElementById('search').addEventListener('input', renderViewEvents);
document.getElementById('filter').addEventListener('change', renderViewEvents);
document.getElementById('dateFilter').addEventListener('change', renderViewEvents);


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
  renderHomeEvents(); 
  renderViewEvents();
});


