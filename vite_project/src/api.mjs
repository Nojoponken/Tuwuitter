// Address that the backend is running on
const backend = 'http://localhost:8000';

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

async function makePost(content) {
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

export { getLogin, getPosts, makePost };