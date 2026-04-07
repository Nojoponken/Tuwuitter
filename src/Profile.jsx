import { useEffect, useState } from 'react';
import { getLogin } from './api.mjs'
import { useNavigate } from 'react-router-dom';
import Request from './Request';

import './style/Global.css';
import './style/UserInfo.css';

function Profile(props) {
    let [friendList, setFriendList] = useState([]);
    let [incomingList, setIncomingList] = useState([]);
    let navigate = useNavigate();

    async function handleFriendUpdate() {
        let sessionUser = await getLogin();

        setIncomingList(sessionUser.incoming);
        setFriendList(sessionUser.friends);
    }

    useEffect(() => {
        handleFriendUpdate();
    }, [props, friendList])

    return (
        <div className='UserInfo-border'>
            <div className='UserInfo'>
                <h2 className='Name'>
                    {props.user}
                </h2>

                <h3>Incoming friend requests:</h3>
                {incomingList.map(request =>
                    <Request key={request} user={request} update={handleFriendUpdate} />
                )}

                <h3>Friends:</h3>
                {friendList.map(user => <button className='Button' onClick={(event) => navigate(`/profile/${event.target.innerHTML}`)} key={user}>{user}</button>)}
            </div>
        </div>

    );
}

export default Profile;