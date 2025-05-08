// script will be used to merge all events and final modification so they work as one
const eventForm = document.getElementById('eventForm');

function getEventsFromStorage() {
  return JSON.parse(localStorage.getItem('events')) || [];
}

function saveEventsToStorage(events) {
  localStorage.setItem('events', JSON.stringify(events));
}

function listEvents() {
  const now = new Date().toISOString().split('T')[0];
  const events = JSON.parse(localStorage.getItem('events') || '[]');
  
  // For manage section
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const filterValue = filterSelect ? filterSelect.value : 'all';
  const dateFilterValue = dateFilterInput ? dateFilterInput.value : '';
  
  // For home section
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
    // For manage section
    const matchesSearch = event.title.toLowerCase().includes(searchTerm);
    const isUpcoming = event.date >= now;
    const matchesFilter = 
      filterValue === 'all' || 
      (filterValue === 'upcoming' && isUpcoming) || 
      (filterValue === 'past' && !isUpcoming);
    const matchesDate = !dateFilterValue || event.date === dateFilterValue;
    
    // For home section
    const matchesHomeSearch = event.title.toLowerCase().includes(homeSearchTerm);
    const matchesHomeFilter = 
      homeFilterValue === 'all' || 
      (homeFilterValue === 'upcoming' && isUpcoming) || 
      (homeFilterValue === 'past' && !isUpcoming);
    const matchesHomeDate = !homeDateFilterValue || event.date === homeDateFilterValue;
    
    // Create event card for manage section if matches criteria
    if (matchesSearch && matchesFilter && matchesDate && eventsListContainer) {
      foundEvents = true;
      const eventCard = createEventCard(event, !isUpcoming, false);
      eventsListContainer.appendChild(eventCard);
    }
    
    // Create event card for home section if matches criteria
    if (matchesHomeSearch && matchesHomeFilter && matchesHomeDate && homeEventsContainer) {
      foundHomeEvents = true;
      const eventCard = createEventCard(event, !isUpcoming, true);
      homeEventsContainer.appendChild(eventCard);
    }
  });