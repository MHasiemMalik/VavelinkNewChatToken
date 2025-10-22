// room_ui.js - With Robust Resizing Logic

const memberContainer = document.getElementById('members__container');
const memberButton = document.getElementById('members__button');

const chatContainer = document.getElementById('messages__container');
const chatButton = document.getElementById('chat__button');

let activeMemberContainer = false;

// The click listener for the members button remains the same.
// It simply toggles the panel's visibility on mobile.
memberButton.addEventListener('click', () => {
    activeMemberContainer = !activeMemberContainer;
    if (activeMemberContainer) {
        memberContainer.style.display = 'block';
    } else {
        memberContainer.style.display = 'none';
    }
});

// The chat button logic is unaffected and remains the same.
let activeChatContainer = false;
chatButton.addEventListener('click', () => {
    activeChatContainer = !activeChatContainer;
    if (activeChatContainer) {
        chatContainer.style.display = 'block';
    } else {
        chatContainer.style.display = 'none';
    }
});


// --- NEW: Robust Resizing Function ---
const handleResize = () => {
    if (window.innerWidth > 649) {
        // If the screen is wide (desktop), always show the members panel.
        // This overrides any previous state and fixes the "stuck" issue.
        memberContainer.style.display = 'block';
    } else {
        // If the screen is narrow (mobile), respect the user's choice.
        // If the panel was closed (activeMemberContainer is false), keep it hidden.
        if (!activeMemberContainer) {
            memberContainer.style.display = 'none';
        }
    }
};

// Add an event listener that calls our function whenever the window is resized.
window.addEventListener('resize', handleResize);

// Call the function once when the page first loads to set the correct initial state.
handleResize();