import { Avatar, Tag, TagCloseButton, TagLabel } from '@chakra-ui/react';
import './chatOnline.scss'

const ChatOnline = ({ user1, handleFunction }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <Tag _hover={
            {
                backgroundColor: '#b5cbfe',
                color: '#000',
                borderColor: '#000',
                cursor: 'pointer',
            }
        } p={'2'} size={'lg'} colorScheme='green' borderRadius='full'>
            <Avatar
                src={user1.pic}
                size={'lg'}
                name={user1.username}
                ml={-1}
                mr={2}
            />
            <TagLabel>{user1.username}</TagLabel>
            {
                user._id === user1._id ? null : <TagCloseButton onClick={handleFunction} />
            }
        </Tag>
    )
}

export default ChatOnline