import { useEffect, useState } from 'react';
import { sendFriendRequest, getIncoming, getFriends, getLogin } from './api.mjs'
import { useNavigate } from 'react-router-dom';

import './style/Global.css';
import './style/UserInfo.css';

function Profile(props) {
    let [friendList, setFriendList] = useState([]);
    let [incomingList, setIncomingList] = useState([]);
    let navigate = useNavigate();

    async function incomingFriendRequest() {
        let sessionUser = await getLogin()
            getIncoming(sessionUser.username).then((incoming) => {
                setIncomingList(incoming);
        });
    }

    async function handleFriendRequest() {
        await sendFriendRequest(props.user)
    }

    useEffect(() => {
        getFriends(props.user).then((friends) => {
            setFriendList(friends);
        })
        incomingFriendRequest();
    }, [props])

    return (
        <div className='UserInfo-border'>
            <div className='UserInfo'>
                <h2 className='Name'>
                    {props.user}
                </h2>
                <button className='Friend-button Button' onClick={() => handleFriendRequest()}>
                    Send friend request
                </button>

                <h3>Incoming friend requests:</h3>
                {incomingList.map(requests => <button className='Button' key={requests}>{requests}</button>)}

                <h3>Friends:</h3>
                {friendList.map(user => <button className='Button' onClick={(event) => navigate(`/profile/${event.target.innerHTML}`)} key={user}>{user}</button>)}
            </div>
        </div>

    );
}

export default Profile;