document.addEventListener("DOMContentLoaded", () => {
  const eventList = document.getElementById("event-list");
  const messageBox = document.getElementById("message");

 
  function showMessage(msg, type = "success") {
    messageBox.textContent = msg;
    messageBox.className = `message ${type}`;
    messageBox.style.display = "block";
    setTimeout(() => (messageBox.style.display = "none"), 3000);
  }

  
  function getEvents() {
    return JSON.parse(localStorage.getItem("events")) || [];
  }

 
  function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
  }


  function deleteEvent(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    let events = getEvents();
    events = events.filter((event) => event.id !== id);
    saveEvents(events);
    renderEvents();
    showMessage("Event deleted successfully!");
  }


  function renderEvents() {
    const events = getEvents();
    eventList.innerHTML = "";

    if (events.length === 0) {
      eventList.innerHTML = "<p>No events found.</p>";
      return;
    }

    events.forEach((event) => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
        <h4>${event.title}</h4>
        <p>${event.description}</p>
        <p><strong>Date:</strong> ${event.date} <strong>Time:</strong> ${event.time}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <div class="actions">
          <button onclick="deleteEvent('${event.id}')"><i class="fas fa-trash-alt"></i> Delete</button>
        </div>
      `;
      eventList.appendChild(card);
    });
  }

  
  window.deleteEvent = deleteEvent;


  renderEvents();
});
