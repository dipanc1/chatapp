import './message.scss'

const Message = ({ own }) => {
    return (
        <div className={own ? 'message own' : 'message'}>
            <div className="messageTop">
                <img src="https://via.placeholder.com/150" alt="avatar" className='chatbox-message-avatar' />
                <p className='messageText'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id. </p>
            </div>
            <div className="messageBottom">
                1 hour ago
            </div>
        </div>
    )
}

export default Message