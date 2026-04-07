import { useNavigate } from "react-router-dom";
import {  acceptFriendRequest, denyFriendRequest, sendFriendRequest } from "./api.mjs";

function Request(props){
    let navigate = useNavigate();

    function handleNavigate(){
        navigate(`/profile/${props.user}`);
    }

    async function handleAccept(){
        await acceptFriendRequest(props.user);
        props.update();
    }

    async function handleDeny(){
        await denyFriendRequest(props.user);
        props.update();
    }

    return (
        <div>
            <button className='Button Button-start' onClick={() => handleNavigate()}>
                {props.user}
            </button>
            <button className='Button Green-button' onClick={() => handleAccept()}>
                Accept
            </button>
            <button className='Button Button-end Red-button' onClick={() => handleDeny()}>
                Deny
            </button>
        </div>
    );
}

export default Request;