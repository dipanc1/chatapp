import axios from 'axios'
import React from 'react'
import { PhoneNumberContext } from '../../context/phoneNumberContext'
import Conversation from '../conversation/Conversation'
import Loading from '../Loading'
import UserListItem from '../UserAvatar/UserListItem'
import "./conversations.scss"

const Conversations = () => {
    const { dispatch } = React.useContext(PhoneNumberContext);
    const [conversations, setConversations] = React.useState([])
    const [search, setSearch] = React.useState('')
    const [searchResults, setSearchResults] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const user = JSON.parse(localStorage.getItem('user'))

    const convo = React.useContext(PhoneNumberContext);
    console.log(convo)

    // search bar to search for users
    const handleSearch = async (e) => {
        setSearch(e.target.value)
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`http://localhost:8000/users?search=${search}`, config)
            // console.log(data);
            setLoading(false);
            setSearchResults(data);
        } catch (error) {
            console.log(error)
        }
    }

    //posting a new chat, problem is sending user._id on click
    const handleChat = async (user) => {
        console.log(user)
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(`http://localhost:8000/conversation/${user}`, config)
            console.log(data);
            setLoading(false);
            dispatch({ type: 'SET_CURRENT_CHAT', payload: data.conversation })
        } catch (error) {
            console.log(error)
        }

    }

    React.useEffect(() => {
        const getConversations = async () => {
            try {
                setLoading(true);
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.get(`http://localhost:8000/conversation/`, config)
                console.log(data.map(convo => convo.users.find(member => member !== user._id)));
                setConversations(data);
            } catch (err) {
                console.log(err)
            }
        }
        getConversations();
    }, [user._id, user.token]);


    return (
        <div className='conversations'>
            <div className="search">

                <input
                    type="text"
                    id="search"
                    name='search'
                    placeholder='Search'
                    value={search}
                    onChange={handleSearch}
                />
            </div>
            <div className="conversations-list">
                <div className="conversation-title">
                    <h5>Conversations</h5>
                    <img src="/images/down-arrow.png" alt="down arrow" className='down-arrow' />
                </div>
                <hr style={{ 'color': "#f3f7fc" }} />
                {
                    loading ?
                        <div className="loading">
                            <Loading />
                        </div>
                        :
                        search.length > 0 ?
                            searchResults?.map(user => (
                                <div className="conversation-avatar-name" key={user._id} onClick={handleChat}>
                                    <UserListItem user={user}
                                    />
                                </div>
                            ))

                            : conversations.map((c) => (
                                <div className="conversation-avatar-name" key={c._id} onClick={() => dispatch({ type: "SET_CURRENT_CHAT", payload: c })}>
                                    <Conversation conversation={c} currentUser={user} />
                                </div>
                            ))
                }


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