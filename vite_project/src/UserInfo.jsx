import { useEffect, useState } from 'react';
import { sendFriendRequest, denyFriendRequest, unfriend, getFriends, getLogin } from './api.mjs'
import { useNavigate } from 'react-router-dom';

import './style/Global.css';
import './style/UserInfo.css';

function UserInfo(props) {
    const [friendList, setFriendList] = useState([]);
    const [friendStatus, setFriendStatus] = useState('');
    let navigate = useNavigate();

    async function handleFriendRequest() {
        console.log(friendStatus);
        if (friendStatus === 'friends') {
            await unfriend(props.user);
        }
        else if (friendStatus === 'pending') {
            await denyFriendRequest(props.user);
        }
        else {
            await sendFriendRequest(props.user);
        }
        handleFriendList();
    }

    async function handleFriendList() {
        let login = await getLogin();
        let newFriendList = await getFriends(props.user);
        
        if (newFriendList.includes(login.username)) {
            setFriendStatus('friends');
        }
        else if (login.outgoing.includes(props.user)) {
            setFriendStatus('pending');
        }
        else {
            setFriendStatus('');
        }

        setFriendList(newFriendList);
    }

    useEffect(() => {
        handleFriendList();
    }, [friendStatus])

    return (
        <div className='UserInfo-border'>
            <div className='UserInfo'>
                <h2 className='Name'>
                    {props.user}
                </h2>
                <button className={(friendStatus === '') ? 'Friend-button Button' : 'Friend-button Button Red-button'} onClick={() => handleFriendRequest()}>
                    {
                        (friendStatus === 'friends') ? 'Unfriend' :
                            (friendStatus === 'pending') ? 'Remove Friend Request' :
                                'Send Friend Request'
                    }
                </button><br />
                <h3>Friends:</h3>
                {friendList.map(user => <button className='Button' onClick={(event) => navigate(`/profile/${event.target.innerHTML}`)} key={user}>{user}</button>)}
            </div>
        </div>

    );
}

export default UserInfo;