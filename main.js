// main.js - Code for CDN-loaded SDK

// The AgoraRTM object will be globally available from the script tag in index.html
// We do not need to import it.

// --- Configuration ---
const APP_ID = "de30962ae073400b9f3a8ea05fa95118"; // Your chat App ID
let rtmClient;
let channel;

// --- User and Room Info ---
let uid = sessionStorage.getItem("uid");
if (!uid) {
    uid = String(Math.floor(Math.random() * 10000));
    sessionStorage.setItem("uid", uid);
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomId = urlParams.get("room");

if (!roomId) {
    window.location = "lobby.html";
}

let displayName = sessionStorage.getItem("display_name");
if (!displayName) {
    window.location = "lobby.html";
}

// --- Functions ---

const fetchToken = async (uid) => {
    // --- THIS IS THE FIX ---
    // Get the server URL from the environment variable set by Vercel/Netlify.
    // Provide localhost as a fallback for local development.
    const serverUrl = import.meta.env.VITE_TOKEN_SERVER_URL || 'http://localhost:8080'; 

    console.log("Attempting to connect to token server:", serverUrl); // Add log for debugging

    try {
        const response = await fetch(`${serverUrl}/get-rtm-token?uid=${uid}`); // Use the serverUrl variable
        if (!response.ok) throw new Error('Failed to fetch RTM token');
        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error("RTM Token fetch error:", error);
        alert("Failed to get authentication token. See console for details.");
        return null;
    }
};

const joinRoomInit = async () => {
    // Use the globally available AgoraRTM object
    rtmClient = AgoraRTM.createInstance(APP_ID);
    
    const token = await fetchToken(uid);
    if (!token) {
        console.error("Login aborted due to missing token.");
        return;
    }

    await rtmClient.login({ uid, token });

    await rtmClient.addOrUpdateLocalUserAttributes({ name: displayName });

    channel = rtmClient.createChannel(roomId);
    await channel.join();

    channel.on("MemberJoined", handleMemberJoined);
    channel.on("MemberLeft", handleMemberLeft);
    channel.on("ChannelMessage", handleChannelMessage);

    getMembers();
    addBotMessageToDom(`Welcome to the room, ${displayName}! 👋`);
};

const handleMemberJoined = async (MemberId) => {
    addMemberToDom(MemberId);
    const { name } = await rtmClient.getUserAttributesByKeys(MemberId, ['name']);
    addBotMessageToDom(`${name} has joined the room.`);
    updateMemberTotal();
};

const handleMemberLeft = async (MemberId) => {
    removeMemberFromDom(MemberId);
    updateMemberTotal();
};

const handleChannelMessage = async (messageData, MemberId) => {
    const data = JSON.parse(messageData.text);
    const { name } = await rtmClient.getUserAttributesByKeys(MemberId, ['name']);
    addMessageToDom(name, data.message);
};

const getMembers = async () => {
    const members = await channel.getMembers();
    updateMemberTotal();
    for (const memberId of members) {
        addMemberToDom(memberId);
    }
};

const addMemberToDom = async (MemberId) => {
    const { name } = await rtmClient.getUserAttributesByKeys(MemberId, ['name']);
    const membersWrapper = document.getElementById('member__list');
    
    if (document.getElementById(`member__${MemberId}__wrapper`)) return;

    const memberItem = `
        <div class="member__wrapper" id="member__${MemberId}__wrapper">
            <span class="green__icon"></span>
            <p class="member_name">${name || MemberId}</p>
        </div>`;
    membersWrapper.insertAdjacentHTML('beforeend', memberItem);
};

const removeMemberFromDom = async (MemberId) => {
    const memberWrapper = document.getElementById(`member__${MemberId}__wrapper`);
    if (memberWrapper) {
        const name = memberWrapper.querySelector('.member_name').textContent;
        addBotMessageToDom(`${name} has left the room.`);
        memberWrapper.remove();
    }
};

const updateMemberTotal = async () => {
    const members = await channel.getMembers();
    document.getElementById('members__count').innerText = members.length;
};

const sendMessage = async (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    if (!message.trim()) return;

    const rtmMessage = rtmClient.createMessage({ text: JSON.stringify({ type: 'chat', message }) });
    await channel.sendMessage(rtmMessage);

    addMessageToDom(displayName, message);
    e.target.reset();
};

const addMessageToDom = (name, message) => {
    const messagesWrapper = document.getElementById('messages');
    const newMessage = `
        <div class="message__wrapper">
            <div class="message__body">
                <strong class="message__author">${name}</strong>
                <p class="message__text">${message}</p>
            </div>
        </div>`;
    messagesWrapper.insertAdjacentHTML('beforeend', newMessage);
    messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
};

const addBotMessageToDom = (botMessage) => {
    const messagesWrapper = document.getElementById('messages');
    const newMessage = `
        <div class="message__wrapper">
            <div class="message__body__bot">
                <strong class="message__author__bot">VaveLink Bot</strong>
                <p class="message__text__bot">${botMessage}</p>
            </div>
        </div>`;
    messagesWrapper.insertAdjacentHTML('beforeend', newMessage);
    messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
};

const leaveChannel = async () => {
    await channel.leave();
    await rtmClient.logout();
};

// --- DEFINITIVE FIX ---
// This function will start our application logic.
const startApp = () => {
    document.getElementById('message__form').addEventListener('submit', sendMessage);
    window.addEventListener('beforeunload', leaveChannel);
    joinRoomInit();
};

// This interval will check every 100ms if the AgoraRTM SDK has been loaded.
// Once it's loaded, it will start the app and clear itself.
const waitForAgoraSDK = setInterval(() => {
    if (window.AgoraRTM) {
        clearInterval(waitForAgoraSDK); // Stop checking
        startApp(); // Start our application
    } else {
        console.log("Waiting for Agora RTM SDK to load...");
    }
}, 100);
