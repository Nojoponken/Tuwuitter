import { useEffect, useState } from 'react';
import { sendFriendRequest, getFriends } from './api.mjs'
import { useNavigate } from 'react-router-dom';

import './style/Global.css';
import './style/UserInfo.css';

function UserInfo(props) {
    let [friendList, setFriendList] = useState([]);
    let navigate = useNavigate();

    async function handleFriendRequest() {
        await sendFriendRequest(props.user)
    }

    useEffect(() => {
        getFriends(props.user).then((friends) => {
            setFriendList(friends);
        })
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
                <h3>Friends:</h3>
                {friendList.map(user => <button className='Button' onClick={(event) => navigate(`/profile/${event.target.innerHTML}`)} key={user}>{user}</button>)}
            </div>
        </div>

    );
}

export default UserInfo;