import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getLogin, getPosts, makePost } from "./api.mjs";

import Post from "./Post.jsx";
import UserInfo from "./UserInfo.jsx";

import "./style/Global.css";
import "./style/Home.css";
import Profile from "./Profile.jsx";

function Home({}) {
  const [error, setError] = useState(false);

  let { profile } = useParams();
  let navigate = useNavigate();

  if (!profile) {
    navigate("/login");
    return;
  }

  const [posts, setPosts] = useState([]);
  const [textToPost, setTextToPost] = useState([]);
  const [isHome, setIsHome] = useState([]);

  async function checkProfile() {
    let login = await getLogin();
    setIsHome(profile == login.username);
  }

  async function updateMessages() {
    let newPosts = await getPosts(profile);
    setPosts(newPosts);
  }

  useEffect(() => {
    updateMessages();
    setError(false);
    checkProfile();
  }, [profile]);

  async function handleSubmit(event) {
    event.preventDefault();

    // Only empty textbox when the posting was successful
    if (await makePost(textToPost, profile)) {
      setError(false);
      setTextToPost("");
    } else {
      setError(true);
    }

    // Update messages just for fun
    updateMessages();
  }

  return (
    <div className="Home">
      <aside>
        {isHome ? <Profile user={profile} /> : <UserInfo user={profile} />}
      </aside>
      <main>
        <form onSubmit={handleSubmit} className="Form">
          <textarea
            onChange={(event) => setTextToPost(event.target.value)}
            value={textToPost}
            className="Text-area"
          ></textarea>
          <input
            type="submit"
            value="Powost"
            className="Submit-button Button"
          />
        </form>
        <p className={error ? "error" : "error hide"}>
          Error occured when trying to post
        </p>
        <div className="Post-section">
          {posts.toReversed().map((post) => (
            <Post
              key={post.id}
              content={post.content}
              author={post.name}
              date={post.date}
              read={post.read}
              id={post.id}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
export default Home;
