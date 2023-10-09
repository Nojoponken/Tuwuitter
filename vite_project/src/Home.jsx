// import logo from './logo.svg';
// import Login from './Login.jsx'
import React, { useState, useEffect } from 'react';
import Post from './Post.jsx';
// import { Route, createBrowserRouter, createRoutesFromElement, RouterProvider } from 'react-router-dom';
// import Login from './Login.jsx';
// import Home from './Home.jsx';
// import Header from './Header.jsx';
import './Home.css';

// const router = createBrowserRouter(
//   createRoutesFromElement(
//     <Route path='/' element={<Header/>}>
//       <Route index element={<Home/>} />
//       <Route path='login' element={<Login/>} />
//       {/* <Route path='register' element={<Register/>} /> */}
//     </Route>
//   )
// );

function Home({}) {
  const [posts, setPosts] = useState([]);
  const [textToPost, setTextToPost] = useState([]);
  const [check, setCheck] = useState([]);
  const backend = 'http://localhost:8000';

  useEffect(() => {
    async function doStuff() {
      let response = await fetch(`${backend}/messages`);
      let data = await response.json();
      setPosts(data);
    }
    doStuff();
  }, [posts]);


  function handleSubmit(event) {
    event.preventDefault();
    console.log(textToPost);
    fetch(`${backend}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: textToPost })
    });
    setTextToPost('');
  }

  return (
    <div className='Home'>
      {/* <Login /> */}
      <form onSubmit={handleSubmit} className='Form'>
        <textarea onChange={(event) => setTextToPost(event.target.value)} value={textToPost} className='Text-area'></textarea>
        <input type='submit' value='Powost' className='Submit-button' />
      </form>
      <main className='Post-section'>
        {posts.toReversed().map((post) => (
          <Post key={post.id} content={post.content} author={post.name} date={post.date} read={post.read} id={post.id} backend={backend}/>
        ))}
      </main>
    </div>
  );
}
export default Home;
