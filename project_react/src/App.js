// import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import './App.css';


function App() {
  const [posts, setPosts] = useState([]);
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    async function doStuff() {
      let response = await fetch("http://localhost:8000/messages");
      let data = await response.json();
      setPosts(data);
      setPostList(posts.map((d) => <article key={d.id}>
        <p className="Post-content">{d.content}</p>
        <p className="Post-author">{d.name}</p>
        <p className="Post-date">{d.date}</p>
        <input type="checkbox"/>
      </article>));
    }
    doStuff();
  }, ["http://localhost:8000/messages"]);

  return (
    <div className="App">
      <form className="Form">
        <textarea className="Text-area"></textarea>
        <input type="submit" value="Powost" className="Submit-button" />
      </form>
      <main className="Post-section">
        {postList}
      </main>
    </div>
  );
}
export default App;
