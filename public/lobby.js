const form = document.getElementById('lobby__form');

// If there's a display name saved from a previous session, fill it in
let displayName = sessionStorage.getItem('display_name');
if (displayName) {
    form.name.value = displayName;
}

// Listen for the form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Save the user's display name to the browser's session storage
    sessionStorage.setItem('display_name', e.target.name.value);

    // Get the room name from the form
    let inviteCode = e.target.room.value;
    // If no room name is entered, create a random one
    if (!inviteCode) {
        inviteCode = String(Math.floor(Math.random() * 1000000));
    }
    
    // Redirect the user to the chat room (index.html) with the room name in the URL
    window.location = `index.html?room=${inviteCode}`;
});