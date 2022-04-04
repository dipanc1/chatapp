import axios from 'axios'
import React from 'react'
import { PhoneNumberContext } from '../../context/phoneNumberContext'
import Conversation from '../conversation/Conversation'
import "./conversations.scss"

const Conversations = () => {
    const { dispatch } = React.useContext(PhoneNumberContext);
    const [conversations, setConversations] = React.useState([])
    const user = JSON.parse(localStorage.getItem('user'))

    const convo = React.useContext(PhoneNumberContext);
    console.log(convo)

    React.useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/conversation/${user._id}`)
                // console.log(res);
                setConversations(res.data);
            } catch (err) {
                console.log(err)
            }
        }
        getConversations();
    }, [user._id]);
          
        
        return (
            <div className='conversations'>
            <input
                type="text"
                id="search"
                name='search'
                placeholder='Search'
            />
            <div className="conversations-list">
                <div className="conversation-title">
                    <h5>Conversations</h5>
                    <img src="/images/down-arrow.png" alt="down arrow" className='down-arrow' />
                </div>
                <hr style={{ 'color': "#f3f7fc" }} />
                {conversations.map((c) => (
                    <div className="conversation-avatar-name" key={c._id} onClick={()=> dispatch({type:"SET_CURRENT_CHAT", payload: c})}>
                        <Conversation conversation={c} currentUser={user} />
                    </div>
                ))}
            </div>
            <div className="groups-list">
                <div className="group-title">
                    <h5>Groups</h5>
                    <img src="/images/down-arrow.png" alt="down arrow" className='down-arrow' />
                </div>
                <hr style={{ 'color': "#f3f7fc" }} />
                <div className="group-icon-name disabled">
                    <div className="group-name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot-group disabled"></span>
                </div>
                <div className="group-icon-name disabled">
                    <div className="group-name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot-group disabled"></span>
                </div>
                <div className="group-icon-name disabled">
                    <div className="group-name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot-group disabled"></span>
                </div>
                <div className="group-icon-name">
                    <div className="group-name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot-group">
                        <div className="dot-groupN">
                            9
                        </div>
                    </span>
                </div>
                <div className="group-icon-name disabled">
                    <div className="group-name">
                        <img src="https://via.placeholder.com/150" alt="avatar" className='icon' />
                        <p>John Doe</p>
                    </div>
                    <span className="dot-group disabled"></span>
                </div>
            </div>
        </div>
    )
}

export default Conversations