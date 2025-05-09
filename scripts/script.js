
const eventForm = document.getElementById('eventForm');
const editEventForm = document.getElementById('editEventForm');
const eventsListContainer = document.getElementById('eventsList');
const homeEventsContainer = document.getElementById('homeEvents');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const dateFilterInput = document.getElementById('dateFilter');
const homeSearchInput = document.getElementById('homeSearch');
const homeFilterSelect = document.getElementById('homeFilter');
const homeDateFilterInput = document.getElementById('homeDateFilter');
const editModal = document.getElementById('editModal');
const closeBtn = document.querySelector('.close-btn');
const messageBox = document.getElementById('message');

// Storage Helpers
function getEventsFromStorage() {
  return JSON.parse(localStorage.getItem('events')) || [];
}

function saveEventsToStorage(events) {
  localStorage.setItem('events', JSON.stringify(events));
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initializePage();
  highlightCurrentNav();
  listEvents();
});

// Event Listeners Initialization
function initializePage() {
  if (eventForm) eventForm.addEventListener('submit', handleEventCreation);
  if (editEventForm) editEventForm.addEventListener('submit', handleEventUpdate);
  if (closeBtn) closeBtn.addEventListener('click', closeEditModal);

  if (searchInput) searchInput.addEventListener('input', listEvents);
  if (filterSelect) filterSelect.addEventListener('change', listEvents);
  if (dateFilterInput) dateFilterInput.addEventListener('change', listEvents);
  if (homeSearchInput) homeSearchInput.addEventListener('input', listEvents);
  if (homeFilterSelect) homeFilterSelect.addEventListener('change', listEvents);
  if (homeDateFilterInput) homeDateFilterInput.addEventListener('change', listEvents);

  window.addEventListener('click', (e) => {
    if (editModal && e.target === editModal) closeEditModal();
  });

  document.addEventListener('keydown', (e) => {
    if (editModal && editModal.style.display === 'block' && e.key === 'Escape') {
      closeEditModal();
    }
  });
}

// Highlight Current Page in Navigation
function highlightCurrentNav() {
  const navButtons = document.querySelectorAll('.nav-button');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navButtons.forEach(btn => {
    const btnPage = btn.getAttribute('href').split('/').pop();
    btn.classList.toggle('active-nav', btnPage === currentPage);
  });
}

// Create Event
function handleEventCreation(e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const location = document.getElementById('location').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!title || !date || !time || !location || !description) {
    showMessage('Please fill in all fields', 'error');
    return;
  }

  const newEvent = {
    id: Date.now().toString(),
    title,
    date: `${date}T${time}`,
    location,
    description
  };

  const events = getEventsFromStorage();
  events.push(newEvent);
  saveEventsToStorage(events);

  showMessage('Event created successfully!', 'success');
  eventForm.reset();

  setTimeout(() => {
    window.location.href = '../index.html';
  }, 1500);
}

// Update Event
function handleEventUpdate(e) {
  e.preventDefault();

  const id = document.getElementById('editId').value;
  const title = document.getElementById('editTitle').value.trim();
  const date = document.getElementById('editDate').value;
  const time = document.getElementById('editTime').value;
  const location = document.getElementById('editLocation').value.trim();
  const description = document.getElementById('editDescription').value.trim();

  if (!title || !date || !time || !location || !description) {
    showMessage('Please fill in all fields', 'error', 'editMessage');
    return;
  }

  const events = getEventsFromStorage();
  const index = events.findIndex(e => e.id === id);

  if (index !== -1) {
    events[index] = { id, title, date: `${date}T${time}`, location, description };
    saveEventsToStorage(events);
    showMessage('Event updated successfully!', 'success', 'editMessage');

    setTimeout(() => {
      closeEditModal();
      listEvents();
    }, 1500);
  }
}

// List Events for Both Home & Manage Views
function listEvents() {
  const now = new Date();
  const events = getEventsFromStorage().sort((a, b) => new Date(a.date) - new Date(b.date));

  const searchTerm = searchInput?.value.toLowerCase() || '';
  const filterValue = filterSelect?.value || 'all';
  const dateFilter = dateFilterInput?.value || '';
  const homeSearchTerm = homeSearchInput?.value.toLowerCase() || '';
  const homeFilterValue = homeFilterSelect?.value || 'all';
  const homeDateFilter = homeDateFilterInput?.value || '';

  let foundEvents = false, foundHomeEvents = false;

  if (eventsListContainer) eventsListContainer.innerHTML = '';
  if (homeEventsContainer) homeEventsContainer.innerHTML = '';

  events.forEach(event => {
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate >= now;

    const formattedDate = eventDate.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });

    const formattedTime = eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });

    const matchesSearch = event.title.toLowerCase().includes(searchTerm) || event.description.toLowerCase().includes(searchTerm);
    const matchesFilter = filterValue === 'all' || (filterValue === 'upcoming' && isUpcoming) || (filterValue === 'past' && !isUpcoming);
    const matchesDate = !dateFilter || event.date.startsWith(dateFilter);

    const matchesHomeSearch = event.title.toLowerCase().includes(homeSearchTerm) || event.description.toLowerCase().includes(homeSearchTerm);
    const matchesHomeFilter = homeFilterValue === 'all' || (homeFilterValue === 'upcoming' && isUpcoming) || (homeFilterValue === 'past' && !isUpcoming);
    const matchesHomeDate = !homeDateFilter || event.date.startsWith(homeDateFilter);

    if (eventsListContainer && matchesSearch && matchesFilter && matchesDate) {
      foundEvents = true;
      eventsListContainer.appendChild(createEventCard(event, formattedDate, formattedTime, !isUpcoming, false));
    }

    if (homeEventsContainer && matchesHomeSearch && matchesHomeFilter && matchesHomeDate) {
      foundHomeEvents = true;
      homeEventsContainer.appendChild(createEventCard(event, formattedDate, formattedTime, !isUpcoming, true));
    }
  });

  if (eventsListContainer && !foundEvents) {
    eventsListContainer.innerHTML = '<div class="no-events">No events found matching your criteria.</div>';
  }

  if (homeEventsContainer && !foundHomeEvents) {
    homeEventsContainer.innerHTML = '<div class="no-events">No events to display. Create your first event!</div>';
  }
}

// Create Event Card
function createEventCard(event, formattedDate, formattedTime, isPast, isReadOnly) {
  const div = document.createElement('div');
  div.className = `event ${isPast ? 'past' : ''}`;
  div.dataset.id = event.id;

  div.innerHTML = `
    <h3>${event.title}</h3>
    <div class="event-meta">
      <span><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
      <span><i class="fas fa-clock"></i> ${formattedTime}</span>
      <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
    </div>
    <p>${event.description}</p>
    ${!isReadOnly ? `
      <div class="actions">
        <button class="warning edit-btn" data-id="${event.id}"><i class="fas fa-edit"></i> Edit</button>
        <button class="danger delete-btn" data-id="${event.id}"><i class="fas fa-trash"></i> Delete</button>
      </div>` : ''}
  `;

  if (!isReadOnly) {
    div.querySelector('.edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal(event.id);
    });
    div.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteEvent(event.id);
    });
  }

  return div;
}

// Delete Event
function deleteEvent(id) {
  if (!confirm('Are you sure you want to delete this event?')) return;
  const events = getEventsFromStorage().filter(e => e.id !== id);
  saveEventsToStorage(events);
  listEvents();
  showMessage('Event deleted successfully!', 'success');
}

// Edit Modal Controls
function openEditModal(id) {
  const event = getEventsFromStorage().find(e => e.id === id);
  if (!event) return;

  const [date, time] = event.date.split('T');
  document.getElementById('editId').value = event.id;
  document.getElementById('editTitle').value = event.title;
  document.getElementById('editDate').value = date;
  document.getElementById('editTime').value = time;
  document.getElementById('editLocation').value = event.location;
  document.getElementById('editDescription').value = event.description;

  editModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeEditModal() {
  editModal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Display Message
function showMessage(text, type, elementId = 'message') {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.textContent = text;
  el.className = type;
  setTimeout(() => {
    el.textContent = '';
    el.className = '';
  }, 3000);
}
