import { useState } from "react";
import { getUser } from "./api.mjs";

function Search() {
    let [list, setlist] = useState([]);

    function displayUsers(usersArray) {
        for (let i = 0; i < usersArray.length; i++) {
            let user = usersArray[i];
            document.getElementById('user').innerHTML = user;
            // setlist(prev => [list, user]);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        let search = document.getElementById('searchUsers').value;
        let usersArray = await getUser(search);

        displayUsers(usersArray);
    }

    return (
        <div>
            <form onSubmit={(event) => handleSubmit(event)}>
                <input
                    type='text'
                    placeholder='Search for users'
                    id='searchUsers'
                />
                <button type='button' onClick={handleSubmit}>Search</button>
            </form>
            <p><span id='user'></span></p>
            {/* {list.map(user => <p>{user}</p>)} */}
        </div>
    )

}

export default Search;