// Function to add a new contact
function addContact() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    if (!isValidPhone(phone)) {
        showMessage("Phone number must be 10 digits long");
        return;
    }
    fetch('/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, phone })
    })
      .then(response => response.json())
      .then(data => {
        displayContacts();
        showMessage(data.message);
      })
      .catch(error => console.error('Error adding contact:', error));
}

// Function to delete a contact
function deleteContact(id) {
    fetch(`/contacts/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        displayContacts();
        showMessage(data.message);
      })
      .catch(error => console.error('Error deleting contact:', error));
}

// Function to modify a contact
function modifyContact(id) {
    const newName = prompt("Enter new name:");
    const newPhone = prompt("Enter new phone number:");
    if (!isValidPhone(newPhone)) {
        showMessage("Phone number must be 10 digits long");
        return;
    }
    fetch(`/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName, phone: newPhone })
    })
      .then(response => response.json())
      .then(data => {
        displayContacts();
        showMessage(data.message);
      })
      .catch(error => console.error('Error modifying contact:', error));
}

// Function to display contacts
function displayContacts() {
    fetch('/contacts')
      .then(response => response.json())
      .then(contacts => {
        const contactsList = document.getElementById("contacts");
        contactsList.innerHTML = "";
        contacts.forEach(contact => {
          const li = document.createElement("li");
          li.textContent = `${contact.id}. ${contact.name} - ${contact.phone}`;
          contactsList.appendChild(li);

          // Add delete button
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", function() {
            deleteContact(contact.id);
          });
          li.appendChild(deleteButton);

          // Add modify button
          const modifyButton = document.createElement("button");
          modifyButton.textContent = "Modify";
          modifyButton.addEventListener("click", function() {
            modifyContact(contact.id);
          });
          li.appendChild(modifyButton);
        });
      })
      .catch(error => console.error('Error fetching contacts:', error));
}
  
// Function to show message
function showMessage(message) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.style.display = "block";
    setTimeout(() => {
      messageDiv.textContent = "";
      messageDiv.style.display = "none";
    }, 3000);
}

// Function to validate phone number
function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
}

// Function to handle add button click
document.getElementById("addBtn").addEventListener("click", function () {
    addContact();
});

// Function to handle view button click
document.getElementById("viewBtn").addEventListener("click", function () {
    document.getElementById("contactList").style.display = "block";
    document.getElementById("editOptions").style.display = "none";
    displayContacts();
});

// Function to handle edit button click
document.getElementById("editBtn").addEventListener("click", function () {
    document.getElementById("contactList").style.display = "none";
    document.getElementById("editOptions").style.display = "block";
});

// Initialize the application
displayContacts();
