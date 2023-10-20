import bcrypt from 'bcryptjs-react';

// Address that the backend is running on
const backend = 'http://localhost:8000';

async function signUp(username, password) {
    if (username.length == 0 || username.length > 16) {
        return false;
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

    let response = await fetch(`${backend}/signup`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'username': username, 'password': hashedPassword })
        });

    if (!response.ok) {
        return false;
    }

    return true;
}

async function logIn(username, password) {

    let response = await fetch(`${backend}/login`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'username': username, 'password': password })
        });

    if (!response.ok) {
        return false;
    }

    return true;
}

async function logOut() { // Returns bool if work or not
    // Ask server to logout and save response
    let response = await fetch(`${backend}/logout`, {
        method: 'POST',
        credentials: 'include'
    });

    // Check that logout work
    if (!response.ok) {
        return false;
    }

    // Logout worked owo
    return true;
}

async function getLogin() {
    // Ask backend for our username
    let response = await fetch(`${backend}/session`, {
        method: 'GET',
        credentials: 'include'
    });

    // Not logged in 
    if (!response.ok) {
        return null;
    }

    // Parse response into JSON
    let user = await response.json();

    // Return the relevant data
    return user;
}

async function getUsers(search) {
    let response = await fetch(`${backend}/users`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'search': search })
    });

    let users = await response.json();
    return users;
}

async function makePost(content, profile) { // Returns bool if work or not
    // Trim white spaces
    content = content.trim();

    // Make sure the length is appropriate
    if (content.length == 0 || content.length > 140) {
        return false;
    }

    // Ask backend to post and wait for response
    let response = await fetch(`${backend}/posts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'message': content, 'profile': profile })
    })
    
    // If the posting was unsuccessful
    if (!response.ok) {
        return false;
    }
    
    // Successfully posted
    return true;
}

async function getPosts(profile) {
    // Ask backend for all posts
    let response = await fetch(`${backend}/posts/${profile}`);

    // Parse to get an array of JSON objects
    let posts = await response.json();

    // Return the array with the posts
    return posts;
}

async function markRead(id) {
    fetch(`${backend}/read/${id}`, { method: 'PATCH' });
}

async function sendFriendRequest(user) {
    fetch(`${backend}/friend`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'target': user })

    });
}

async function getFriends(user) {
    let response = await fetch(`${backend}/friend/${user}`);
    
    let friendList = response.json();
    return friendList;
}

async function getIncoming(user) {
    let response = await fetch(`${backend}/incoming/${user}`);

    let incomingList = response.json();
    return incomingList;
}


export { signUp, logIn, logOut, getLogin, getUsers, makePost, getPosts, markRead, sendFriendRequest, getFriends, getIncoming };