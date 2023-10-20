import { useEffect, useState } from 'react';
import { getUsers } from './api.mjs';
import { useNavigate } from 'react-router-dom';
import './style/Global.css'

function Search() {
    let [list, setList] = useState([]);
    let navigate = useNavigate();

    async function handleSubmit(search) {
        let usersArray = await getUsers(search);
        if (usersArray) {
            setList(usersArray);
        }
        else {
            setList([]);
        }
    }

    useEffect(() => {
        handleSubmit('');
    }, []);

    return (
        <div>
            <input
                type='text'
                placeholder='Search for users'
                onChange={(event) => { handleSubmit(event.target.value) }}
            />
            <p><span id='user'></span></p>
            {list.map(user => <button className='Button' onClick={(event)=>navigate(`/profile/${event.target.innerHTML}`)} key={user.username}>{user.username}</button>)}
        </div>
    )

}

export default Search;