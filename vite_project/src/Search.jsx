import { useState } from "react";
import { getUser } from "./api.mjs";

function Search() {

    function handleSubmit(event) {
        event.preventDefault();
        let search = document.getElementById('searchUsers').value;

        getUser(search);
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
            <p></p>
        </div>
    )

}

export default Search;