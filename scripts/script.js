// DOM Elements
const eventForm = document.getElementById('eventForm');
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
const editEventForm = document.getElementById('editEventForm');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  initializePage();
  highlightCurrentNav();
  listEvents();
});

function initializePage() {
  // Set up event listeners for elements that exist on this page
  if (eventForm) {
    eventForm.addEventListener('submit', handleEventCreation);
  }
  
  if (editEventForm) {
    editEventForm.addEventListener('submit', handleEventUpdate);
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeEditModal);
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', listEvents);
  }
  
  if (filterSelect) {
    filterSelect.addEventListener('change', listEvents);
  }
  
  if (dateFilterInput) {
    dateFilterInput.addEventListener('change', listEvents);
  }
  
  if (homeSearchInput) {
    homeSearchInput.addEventListener('input', listEvents);
  }
  
  if (homeFilterSelect) {
    homeFilterSelect.addEventListener('change', listEvents);
  }
  
  if (homeDateFilterInput) {
    homeDateFilterInput.addEventListener('change', listEvents);
  }
  
  // Global event listeners
  window.addEventListener('click', (e) => {
    if (editModal && e.target === editModal) {
      closeEditModal();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (editModal && editModal.style.display === 'block' && e.key === 'Escape') {
      closeEditModal();
    }
  });
}

function highlightCurrentNav() {
  const navButtons = document.querySelectorAll('.nav-button');
  if (navButtons.length > 0) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navButtons.forEach(btn => {
      btn.classList.remove('active-nav');
      const btnPage = btn.getAttribute('href').split('/').pop();
      if (btnPage === currentPage) {
        btn.classList.add('active-nav');
      }
    });
  }
}

// ========== Event CRUD Operations ==========

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
  
  const id = Date.now().toString();
  const event = { 
    id, 
    title, 
    date: `${date}T${time}`, // Combine date and time
    location, 
    description 
  };
  
  let events = JSON.parse(localStorage.getItem('events') || '[]');
  events.push(event);
  localStorage.setItem('events', JSON.stringify(events));
  
  showMessage('Event created successfully!', 'success');
  this.reset();
  
  // Redirect to home page after creation
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 1500);
}

function handleEventUpdate(e) {
  e.preventDefault();
  
  const id = document.getElementById('editId').value;
  const title = document.getElementById('editTitle').value.trim();
  const date = document.getElementById('editDate').value;
  const location = document.getElementById('editLocation').value.trim();
  const description = document.getElementById('editDescription').value.trim();
  
  if (!title || !date || !location || !description) {
    showMessage('Please fill in all fields', 'error', 'editMessage');
    return;
  }
  
  let events = JSON.parse(localStorage.getItem('events') || []);
  const eventIndex = events.findIndex(e => e.id === id);
  
  if (eventIndex !== -1) {
    events[eventIndex] = { id, title, date, location, description };
    localStorage.setItem('events', JSON.stringify(events));
    
    showMessage('Event updated successfully!', 'success', 'editMessage');
    
    setTimeout(() => {
      closeEditModal();
      listEvents();
    }, 1500);
  }
}

function listEvents() {
  const now = new Date();
  const events = JSON.parse(localStorage.getItem('events') || '[]');
  
  // Get filter values for both sections
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const filterValue = filterSelect ? filterSelect.value : 'all';
  const dateFilterValue = dateFilterInput ? dateFilterInput.value : '';
  
  const homeSearchTerm = homeSearchInput ? homeSearchInput.value.toLowerCase() : '';
  const homeFilterValue = homeFilterSelect ? homeFilterSelect.value : 'all';
  const homeDateFilterValue = homeDateFilterInput ? homeDateFilterInput.value : '';
  
  // Sort events by date (newest first)
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Clear containers if they exist
  if (eventsListContainer) eventsListContainer.innerHTML = '';
  if (homeEventsContainer) homeEventsContainer.innerHTML = '';
  
  let foundEvents = false;
  let foundHomeEvents = false;
  
  events.forEach(event => {
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate >= now;
    
    // Format date and time for display
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Check filters for manage section
    const matchesSearch = event.title.toLowerCase().includes(searchTerm) || 
                         event.description.toLowerCase().includes(searchTerm);
    const matchesFilter = 
      filterValue === 'all' || 
      (filterValue === 'upcoming' && isUpcoming) || 
      (filterValue === 'past' && !isUpcoming);
    const matchesDate = !dateFilterValue || event.date.split('T')[0] === dateFilterValue;
    
    // Check filters for home section
    const matchesHomeSearch = event.title.toLowerCase().includes(homeSearchTerm) || 
                            event.description.toLowerCase().includes(homeSearchTerm);
    const matchesHomeFilter = 
      homeFilterValue === 'all' || 
      (homeFilterValue === 'upcoming' && isUpcoming) || 
      (homeFilterValue === 'past' && !isUpcoming);
    const matchesHomeDate = !homeDateFilterValue || event.date.split('T')[0] === homeDateFilterValue;
    
    // Create event card for manage section
    if (eventsListContainer && matchesSearch && matchesFilter && matchesDate) {
      foundEvents = true;
      const eventCard = createEventCard(event, formattedDate, formattedTime, !isUpcoming, false);
      eventsListContainer.appendChild(eventCard);
    }
    
    // Create event card for home section
    if (homeEventsContainer && matchesHomeSearch && matchesHomeFilter && matchesHomeDate) {
      foundHomeEvents = true;
      const eventCard = createEventCard(event, formattedDate, formattedTime, !isUpcoming, true);
      homeEventsContainer.appendChild(eventCard);
    }
  });
  
  // Show "no events" messages if needed
  if (eventsListContainer && !foundEvents) {
    eventsListContainer.innerHTML = '<div class="no-events">No events found matching your criteria.</div>';
  }
  
  if (homeEventsContainer) {
    if (!foundHomeEvents) {
      homeEventsContainer.innerHTML = '<div class="no-events">No events to display. Create your first event!</div>';
    } else {
      homeEventsContainer.insertAdjacentHTML('afterbegin', '<div class="list-title">Your Events</div>');
    }
  }
}

function createEventCard(event, formattedDate, formattedTime, isPast, isReadOnly) {
  const div = document.createElement('div');
  div.className = `event ${isPast ? 'past' : ''}`;
  div.dataset.id = event.id;
  
  let actionsHTML = '';
  if (!isReadOnly) {
    actionsHTML = `
      <div class="actions">
        <button class="warning edit-btn" data-id="${event.id}">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="danger delete-btn" data-id="${event.id}">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    `;
  }
  
  div.innerHTML = `
    <h3>${event.title}</h3>
    <div class="event-meta">
      <span><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
      <span><i class="fas fa-clock"></i> ${formattedTime}</span>
      <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
    </div>
    <p>${event.description}</p>
    ${actionsHTML}
  `;
  
  // Add event listeners to buttons if they exist
  if (!isReadOnly) {
    const editBtn = div.querySelector('.edit-btn');
    const deleteBtn = div.querySelector('.delete-btn');
    
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(event.id);
      });
    }
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteEvent(event.id);
      });
    }
  }
  
  return div;
}

function deleteEvent(id) {
  if (!confirm('Are you sure you want to delete this event?')) return;
  
  let events = JSON.parse(localStorage.getItem('events') || '[]');
  events = events.filter(event => event.id !== id);
  localStorage.setItem('events', JSON.stringify(events));
  listEvents();
  
  // Show confirmation message
  const messageEl = document.createElement('div');
  messageEl.className = 'success';
  messageEl.innerHTML = '<i class="fas fa-check-circle"></i> Event deleted successfully!';
  messageEl.style.margin = '1rem 0';
  messageEl.style.padding = '0.8rem';
  messageEl.style.borderRadius = '4px';
  messageEl.style.textAlign = 'center';
  messageEl.style.animation = 'fadeIn 0.3s ease';
  
  if (eventsListContainer) {
    eventsListContainer.prepend(messageEl);
  }
  if (homeEventsContainer) {
    homeEventsContainer.prepend(messageEl);
  }
  
  setTimeout(() => {
    messageEl.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      messageEl.remove();
    }, 300);
  }, 3000);
}

function openEditModal(id) {
  let events = JSON.parse(localStorage.getItem('events') || '[]');
  const eventToEdit = events.find(e => e.id === id);
  
  if (!eventToEdit) return;
  
  // Split date and time if they're combined
  const [date, time] = eventToEdit.date.includes('T') ? 
    eventToEdit.date.split('T') : 
    [eventToEdit.date, '00:00'];
  
  document.getElementById('editId').value = eventToEdit.id;
  document.getElementById('editTitle').value = eventToEdit.title;
  document.getElementById('editDate').value = date;
  document.getElementById('editTime').value = time;
  document.getElementById('editLocation').value = eventToEdit.location;
  document.getElementById('editDescription').value = eventToEdit.description;
  
  editModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeEditModal() {
  editModal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function showMessage(text, type, elementId = 'message') {
  const messageEl = document.getElementById(elementId);
  if (messageEl) {
    messageEl.textContent = text;
    messageEl.className = type;
    
    setTimeout(() => {
      messageEl.textContent = '';
      messageEl.className = '';
    }, 3000);
  }
}