// import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import './App.css';


function App() {
  const [posts, setPosts] = useState([]);
  const [textToPost, setTextToPost] = useState([]);
  const [check, setCheck] = useState([]);
  const backend = "http://localhost:8000";

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
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: textToPost })
    });
    setTextToPost("");
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="Form">
        <textarea onChange={(event) => setTextToPost(event.target.value)} value={textToPost} className="Text-area"></textarea>
        <input type="submit" value="Powost" className="Submit-button" />
      </form>
      <main className="Post-section">
        {posts.toReversed().map((post) => (
          <article key={post.id} className="Post-body" style={{
            backgroundColor: post.read
              ? "#c062"
              : "none",
          }}>
            <p className="Post-content">{post.content}</p>
            <p className="Post-author">{post.name}</p>
            <p className="Post-date">{post.date}</p>
            <input type="checkbox" checked={post.read} onChange={() => setCheck(!check)} className="Post-checkbox" />
          </article>
        ))}
      </main>
    </div>
  );
}
export default App;
