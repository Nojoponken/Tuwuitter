import React, { useState, useEffect } from 'react';

function Post(props) {
    const [content, setContent] = useState([]);
    const [author, setAuthor] = useState([]);
    const [date, setDate] = useState([]);
    const [read, setRead] = useState([]);
    const id = props.id;
    const backend = 'http://localhost:8000';


    useEffect(() => {
        setContent(props.content);
        setAuthor(props.author);
        setDate(props.date);
        setRead(props.read);
    }, []);

    return (
        <div className={read ? 'Post Post-read' : 'Post'}>
            <p className='Post-content'>{content}</p>
            <p className='Post-author'>{author}</p>
            <p className='Post-date'>{date}</p>
            <input className='Post-checkbox' type='checkbox' checked={read} onChange={
                (event) => {
                    setRead(!read);
                    fetch(`${backend}/messages/${id}`, { method: 'PATCH' });
                }
            } />
        </div>
    );
}
export default Post;