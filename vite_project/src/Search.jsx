import { useEffect, useState } from "react";
import { getUser } from "./api.mjs";

function Search() {
    let [list, setList] = useState([]);

    async function handleSubmit(search) {
        let usersArray = await getUser(search);
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
            {list.map(user => <p key={user}>{user}</p>)}
        </div>
    )

}

export default Search;