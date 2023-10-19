import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { getPosts, makePost } from './api.mjs';

import Post from './Post.jsx';
import UserInfo from './UserInfo.jsx';

import './style/Global.css';
import './style/Home.css';


function Home({ }) {
  let { profile } = useParams();
  const [posts, setPosts] = useState([]);
  const [textToPost, setTextToPost] = useState([]);

  async function updateMessages() {
    let newPosts = await getPosts(profile);
    setPosts(newPosts);
  }

  useEffect(() => {
    updateMessages();
  }, [profile]);

  async function handleSubmit(event) {
    event.preventDefault();

    // Only empty textbox when the posting was successful
    if (await makePost(textToPost, profile)) {
      setTextToPost('');
    }

    // Update messages just for fun
    updateMessages();
  }

  return (
    <div className='Home'>
      <aside>
        <UserInfo user={profile} />
      </aside>
      <main>
        <form onSubmit={handleSubmit} className='Form'>
          <textarea onChange={(event) => setTextToPost(event.target.value)} value={textToPost} className='Text-area'></textarea>
          <input type='submit' value='Powost' className='Submit-button Button' />
        </form>
        <div className='Post-section'>
          {posts.toReversed().map((post) => (
            <Post key={post.id} content={post.content} author={post.name} date={post.date} read={post.read} id={post.id} />
          ))}
        </div></main>
    </div>
  );
}
export default Home;
