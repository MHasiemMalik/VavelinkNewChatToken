/*const APP_ID = "78785dac0ccf4a68bd3aba8758520ddc"

let uid = sessionStorage.getItem('uid')
if(!uid){
    uid = String(Math.floor(Math.random() * 10000))
    sessionStorage.setItem('uid', uid)
}

let token = null;
let client;

let rtmClient;
let channel;

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
let roomId = urlParams.get('room')

if(!roomId){
    roomId = 'main'
}

let displayName = sessionStorage.getItem('display_name')
if(!displayName){
    window.location = 'lobby.html'
}

let localTracks = []
let remoteUsers = {}

let localScreenTracks;
let sharingScreen = false;

let joinRoomInit = async () => {
    rtmClient = await AgoraRTM.createInstance(APP_ID)
    await rtmClient.login({uid,token})

    await rtmClient.addOrUpdateLocalUserAttributes({'name':displayName})

    channel = await rtmClient.createChannel(roomId)
    await channel.join()

    channel.on('MemberJoined', handleMemberJoined)
    channel.on('MemberLeft', handleMemberLeft)
    channel.on('ChannelMessage', handleChannelMessage)

    getMembers()
    addBotMessageToDom(`~>Creator: [~Mohammed Hasiem Malik~] : Hello '${displayName}' , Welcome to The VaveLink :)`)
    addBotMessageToDom(`Please find the Top left option to know the No. of users present in this Room. Thank You :)  `)

    
    await client.join(APP_ID, roomId, token, uid)

    client.on('user-published', handleUserPublished)
    client.on('user-left', handleUserLeft)
}

let joinStream = async () => {
    document.getElementById('join-btn').style.display = 'none'
   document.getElementById(`user-container-${uid}`).addEventListener('click', expandVideoFrame)
}

let handleUserPublished = async (user, mediaType) => {
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    let item = document.getElementById(`user-container-${user.uid}`)
    if(item){
        item.remove()
    }
 
}


let leaveStream = async (e) => {
    e.preventDefault()

    document.getElementById('join-btn').style.display = 'block'

    channel.sendMessage({text:JSON.stringify({'type':'user_left', 'uid':uid})})
}



document.getElementById('join-btn').addEventListener('click', joinStream)
document.getElementById('leave-btn').addEventListener('click', leaveStream)


joinRoomInit()*/


/*
const APP_ID = "78785dac0ccf4a68bd3aba8758520ddc";

let uid = sessionStorage.getItem('uid');
if (!uid) {
    uid = String(Math.floor(Math.random() * 10000));
    sessionStorage.setItem('uid', uid);
}

let token = null;
let client;
let rtmClient;
let channel;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let roomId = urlParams.get('room');

if (!roomId) {
    roomId = 'main';
}

let displayName = sessionStorage.getItem('display_name');
if (!displayName) {
    window.location = 'lobby.html';
}

let localTracks = [];
let remoteUsers = {};
let localScreenTracks;
let sharingScreen = false;

let joinRoomInit = async () => {
    if (typeof AgoraRTM === "undefined") {
        console.error("Agora RTM SDK not loaded! Check your <script> tag.");
        return;
    }

    console.log("AgoraRTM SDK Loaded:", AgoraRTM); // ✅ Debugging

    // ✅ FIXED: Use correct function for Agora RTM SDK v2.2.1
    rtmClient = AgoraRTM.createInstance(APP_ID); // 🔹 FIXED

    await rtmClient.login({ uid, token }); // 🔹 RTM Login

    await rtmClient.addOrUpdateLocalUserAttributes({ 'name': displayName });

    // ✅ Correctly create and join the RTM channel
    channel = rtmClient.createChannel(roomId);
    await channel.join();

    channel.on('MemberJoined', handleMemberJoined);
    channel.on('MemberLeft', handleMemberLeft);
    channel.on('ChannelMessage', handleChannelMessage);

    getMembers();
    addBotMessageToDom(`~>Creator: [~Mohammed Hasiem Malik~] : Hello '${displayName}' , Welcome to The VaveLink :)`);
    addBotMessageToDom(`Please find the Top left option to know the No. of users present in this Room. Thank You :)`);

    // ✅ Initialize Agora RTC for Video/Audio
    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    await client.join(APP_ID, roomId, token, uid);

    client.on('user-published', handleUserPublished);
    client.on('user-left', handleUserLeft);
};



// ✅ Other Functions Remain the Same
document.getElementById('join-btn').addEventListener('click', joinStream);
document.getElementById('leave-btn').addEventListener('click', leaveStream);

joinRoomInit();

*/

import AgoraRTC from "agora-rtc-sdk-ng";  // ✅ Import RTC SDK
import * as AgoraRTM from "agora-rtm-sdk";  // ✅ Import RTM SDK properly

const APP_ID = "78785dac0ccf4a68bd3aba8758520ddc";

let uid = sessionStorage.getItem("uid");
if (!uid) {
    uid = String(Math.floor(Math.random() * 10000)); // Convert to string explicitly
    sessionStorage.setItem("uid", uid);
}

let token = null;
let client;
let rtmClient;
let channel;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let roomId = urlParams.get("room") || "main";

let displayName = sessionStorage.getItem("display_name");
if (!displayName) {
    window.location = "lobby.html";
}

let localTracks = [];
let remoteUsers = {};
let localScreenTracks;
let sharingScreen = false;

const joinRoomInit = async () => {
    console.log("Agora RTM SDK:", AgoraRTM);
    console.log("Agora RTC SDK:", AgoraRTC);

    // ✅ Ensure UID is properly formatted
    uid = String(uid).trim();
    console.log("Final Processed UID:", uid, "| Length:", uid.length);

    if (!uid || uid.length > 64 || /[^a-zA-Z0-9_\- ]/.test(uid)) {
        console.error("❌ Invalid UID:", uid);
        alert("Invalid user ID! Only letters, numbers, '-', and '_' are allowed.");
        return;
    }

    console.log("✅ Valid UID:", uid);

    try {
        // ✅ Correct Agora RTM Client Initialization
        rtmClient = AgoraRTM.createInstance(APP_ID);  // ✅ Fix: Correct way to initialize RTM Client
        
        console.log("Logging into RTM with UID:", uid);
        await rtmClient.login({ uid, token });
        console.log("✅ RTM Login Successful!");

        // ✅ Create & join the RTM channel
        channel = rtmClient.createChannel(roomId);
        await channel.join();
        console.log(`✅ Joined RTM Channel: ${roomId}`);

        // ✅ Set user attributes
        await rtmClient.addOrUpdateLocalUserAttributes({ name: displayName });

    } catch (error) {
        console.error("❌ RTM Login Error:", error);
        return;
    }

    getMembers();
    addBotMessageToDom(`~>Creator: [~Mohammed Hasiem Malik~] : Hello '${displayName}', Welcome to The VaveLink :)`);
    addBotMessageToDom(`Please find the Top left option to know the No. of users present in this Room. Thank You :)`);

    // ✅ Initialize Agora RTC
    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    await client.join(APP_ID, roomId, token, uid);

    client.on("user-published", handleUserPublished);
    client.on("user-left", handleUserLeft);
};

// ✅ Function: Join Stream
const joinStream = async () => {
    document.getElementById("join-btn").style.display = "none";
    document.getElementById(`user-container-${uid}`).addEventListener("click", expandVideoFrame);
};

// ✅ Function: Handle User Published
const handleUserPublished = async (user, mediaType) => {
    remoteUsers[user.uid] = user;
    await client.subscribe(user, mediaType);
};

// ✅ Function: Handle User Left
const handleUserLeft = async (user) => {
    delete remoteUsers[user.uid];
    let item = document.getElementById(`user-container-${user.uid}`);
    if (item) {
        item.remove();
    }
};

// ✅ Function: Leave Stream
const leaveStream = async (e) => {
    e.preventDefault();
    document.getElementById("join-btn").style.display = "block";

    if (channel) {
        channel.sendMessage({ text: JSON.stringify({ type: "user_left", uid }) });
    }
};

// ✅ Event Listeners
document.getElementById("join-btn").addEventListener("click", joinStream);
document.getElementById("leave-btn").addEventListener("click", leaveStream);

// ✅ Start the Room Initialization
joinRoomInit();
