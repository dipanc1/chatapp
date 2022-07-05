import React from 'react'
import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, handleFunction }) => {
    const style = {
        backgroundColor: 'purple',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px',
        borderRadius: '10%',
        width: '5vw',
        margin: '0.1vw',
    }

    const style2 = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        border: '1px solid white',
        borderRadius: '50%',
        padding: '4px',
        cursor: 'pointer',
    }

    return (
        <Badge
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            bgColor={'#3CC4B7'}
            cursor="pointer"
            onClick={handleFunction}
        >
            {user.username}
            {/* will show admin here  */}
            {/* {admin === user._id && <span> (Admin)</span>} */}
            <CloseIcon pl={1} />
        </Badge>
    )
}

export default UserBadgeItem