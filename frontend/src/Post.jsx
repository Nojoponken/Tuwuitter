import React, { useState, useEffect } from "react";
import { markRead } from "./api.mjs";

function Post(props) {
  const [content, setContent] = useState([]);
  const [author, setAuthor] = useState([]);
  const [date, setDate] = useState([]);
  const [read, setRead] = useState([]);
  const id = props.id;

  useEffect(() => {
    setContent(props.content);
    setAuthor(props.author);
    setDate(props.date);
    setRead(props.read);
  }, []);

  return (
    <div className={read ? "Post Post-read" : "Post"}>
      <p className="Post-content">{content}</p>
      <p className="Post-author">{author}</p>
      <p className="Post-date">{date}</p>
      <input
        className="Post-checkbox"
        type="checkbox"
        checked={read}
        onChange={() => {
          setRead(!read);
          markRead(id);
        }}
      />
    </div>
  );
}
export default Post;
