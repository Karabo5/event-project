document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('eventForm');
    const editEventForm = document.getElementById('editEventForm');
    const editModal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close-btn');
  
    // Show/hide sections
    window.showSection = (id) => {
      document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
      document.getElementById(id).classList.add('active');
    };
  
    // Utility functions
    const getEvents = () => JSON.parse(localStorage.getItem('events')) || [];
    const saveEvents = (events) => localStorage.setItem('events', JSON.stringify(events));
  
    // CREATE
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value.trim();
      const date = document.getElementById('date').value;
      const location = document.getElementById('location').value.trim();
      const description = document.getElementById('description').value.trim();
  
      const newEvent = {
        id: Date.now(),
        title,
        date,
        location,
        description
      };
  
      const events = getEvents();
      events.push(newEvent);
      saveEvents(events);
      eventForm.reset();
      document.getElementById('message').textContent = 'Event created successfully!';
      renderManageEvents();
      renderHomeEvents();
    });
  
    // READ & DISPLAY
    function renderManageEvents() {
      const list = document.getElementById('eventsList');
      list.innerHTML = '';
      const events = getEvents();
  
      events.forEach(event => {
        const div = document.createElement('div');
        div.className = 'event-card';
        div.innerHTML = `
          <h3>${event.title}</h3>
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p>${event.description}</p>
          <button onclick="editEvent(${event.id})">Edit</button>
          <button onclick="deleteEvent(${event.id})">Delete</button>
        `;
        list.appendChild(div);
      });
    }
  
    function renderHomeEvents() {
      const list = document.getElementById('homeEvents');
      list.innerHTML = '';
      const events = getEvents();
  
      events.forEach(event => {
        const div = document.createElement('div');
        div.className = 'event-card';
        div.innerHTML = `
          <h3>${event.title}</h3>
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p>${event.description}</p>
        `;
        list.appendChild(div);
      });
    }
  
    // UPDATE
    window.editEvent = (id) => {
      const events = getEvents();
      const event = events.find(e => e.id === id);
      if (!event) return;
  
      document.getElementById('editId').value = event.id;
      document.getElementById('editTitle').value = event.title;
      document.getElementById('editDate').value = event.date;
      document.getElementById('editLocation').value = event.location;
      document.getElementById('editDescription').value = event.description;
  
      editModal.style.display = 'block';
    };
  
    editEventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = parseInt(document.getElementById('editId').value);
      const updatedEvent = {
        id,
        title: document.getElementById('editTitle').value.trim(),
        date: document.getElementById('editDate').value,
        location: document.getElementById('editLocation').value.trim(),
        description: document.getElementById('editDescription').value.trim()
      };
  
      let events = getEvents();
      const index = events.findIndex(e => e.id === id);
      if (index !== -1) {
        events[index] = updatedEvent;
        saveEvents(events);
        editModal.style.display = 'none';
        renderManageEvents();
        renderHomeEvents();
        document.getElementById('editMessage').textContent = '';
      }
    });
  
    closeBtn.addEventListener('click', () => {
      editModal.style.display = 'none';
    });
  
    // DELETE
    window.deleteEvent = (id) => {
      if (!confirm('Are you sure you want to delete this event?')) return;
      let events = getEvents();
      events = events.filter(e => e.id !== id);
      saveEvents(events);
      renderManageEvents();
      renderHomeEvents();
    };
  
    // Initial Render
    renderManageEvents();
    renderHomeEvents();
  });
  