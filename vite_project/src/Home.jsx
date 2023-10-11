import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLogin, getPosts, makePost } from './api.mjs';

import Post from './Post.jsx';
import './Home.css';


function Home({ }) {
  const [posts, setPosts] = useState([]);
  const [textToPost, setTextToPost] = useState([]);
  const [login, setLogin] = useState('');
  const navigate = useNavigate();

  async function updateMessages() {
    let newPosts = await getPosts();
    setPosts(newPosts);
  }

  async function checkSession() {
    let username = await getLogin();

    // Not logged in, go to login page
    if (!username) {
      navigate('/login');
    }

    // Set variable to display username and such
    setLogin(username);
  }

  useEffect(() => {
    checkSession();
    updateMessages();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    // Only empty textbox when the posting was successful
    if (await makePost(textToPost)) {
      setTextToPost('');
    }

    // Update messages just for fun
    updateMessages();
  }

  return (
    <div className='Home'>
      {/* <Login /> */}
      <p>{login}</p>
      <form onSubmit={handleSubmit} className='Form'>
        <textarea onChange={(event) => setTextToPost(event.target.value)} value={textToPost} className='Text-area'></textarea>
        <input type='submit' value='Powost' className='Submit-button' />
      </form>
      <main className='Post-section'>
        {posts.toReversed().map((post) => (
          <Post key={post.id} content={post.content} author={post.name} date={post.date} read={post.read} id={post.id} />
        ))}
      </main>
    </div>
  );
}
export default Home;
