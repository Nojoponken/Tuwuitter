import { useEffect, useState } from 'react';
import { getUsers } from './api.mjs';
import { useNavigate } from 'react-router-dom';
import './style/Global.css';
import './style/Search.css';

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
        <div className='Search-list'>
            <input
                type='text'
                placeholder='Search for users'
                onChange={(event) => { handleSubmit(event.target.value) }}
            />

            {list.map(user => 
                <div key={user.username}>
                    <button className='Button' onClick={(event) => navigate(`/profile/${event.target.innerHTML}`)} >
                        {user.username}
                    </button>
                </div>
            )}
        </div>
    );
}

export default Search;