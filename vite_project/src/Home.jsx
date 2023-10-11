import React, { useState, useEffect } from 'react';
import Post from './Post.jsx';
import './Home.css';


function Home({ }) {
  const [posts, setPosts] = useState([]);
  const [textToPost, setTextToPost] = useState([]);
  const [check, setCheck] = useState([]);
  const [login, setLogin] = useState('');
  const backend = 'http://localhost:8000';

  useEffect(() => {
    async function doStuff() {
      let response = await fetch(`${backend}/messages`);
      let data = await response.json();
      setPosts(data);
    }
    async function getSession() {
      let response = await fetch(`${backend}/session`, {method: 'GET', credentials: 'include'});
      let user = await response.json();
      console.log(user);
      setLogin(user.username);
    }
    doStuff();
    getSession();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    console.log(textToPost);
    setTextToPost(textToPost.trim());
    if (textToPost.length != 0 && textToPost.length <= 140) {
      fetch(`${backend}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToPost, user: login })
      });
      setTextToPost('');
    }
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
          <Post key={post.id} content={post.content} author={post.name} date={post.date} read={post.read} id={post.id} backend={backend} />
        ))}
      </main>
    </div>
  );
}
export default Home;
