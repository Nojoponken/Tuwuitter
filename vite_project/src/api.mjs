// import bcrypt from 'bcryptjs-react';

// Address that the backend is running on
const backend = 'http://localhost:8000';

async function signUp(username, password) {
    if (username.length == 0 || username.length > 16) {
        return false;
    }

    let response = await fetch(`${backend}/signup`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'username': username, 'password': password})
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
    return user.username;
}

async function getPosts() {
    // Ask backend for all posts
    let response = await fetch(`${backend}/messages`);

    // Parse to get an array of JSON objects
    let posts = await response.json();

    // Return the array with the posts
    return posts;
}

async function getUser(search) {
    console.log(search);
    let response = await fetch(`${backend}/users`, {
        method: 'GET',
        credentials: 'include'
    });

    let users = await response.json();
    const matching = []; // use for adding matching usernames and retur list
    for (let i = 0; i < users.length; i++) {
        let user = users[i].username;
        if (user.includes(search)) {
            matching.push(user);
        }
    }
    console.log(matching);
    if (matching.length == 0){
        console.log('no user matched your search')
    } 
    else {
        return matching;
    }
}

async function makePost(content) { // Returns bool if work or not
    // Trim white spaces
    content = content.trim();

    // Make sure the length is appropriate
    if (content.length == 0 || content.length > 140) {
        return false;
    }

    // Ask backend to post and wait for response
    let response = await fetch(`${backend}/messages`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
    })

    // If the posting was unsuccessful
    if (!response.ok) {
        return false;
    }

    // Successfully posted
    return true;
}

async function markRead(id) {
    fetch(`${backend}/messages/${id}`, { method: 'PATCH' });
}

export { signUp, logIn, logOut, getLogin, getPosts, makePost, markRead, getUser };