import { sendFriendRequest } from './api.mjs'

import './style/Global.css';
import './style/UserInfo.css';

function UserInfo(props) {
    async function handleFriendRequest() {
        await sendFriendRequest(props.user)
    }

    return (
        <div className='UserInfo'>
            <h2 className='Name'>
                {props.user}
            </h2>
            <button className='Friend-button Button' onClick={() => handleFriendRequest()}>
                Send friend request
            </button>
        </div>

    );
}

export default UserInfo;