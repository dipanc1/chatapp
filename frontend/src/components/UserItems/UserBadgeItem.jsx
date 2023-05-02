import React from 'react'
import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, handleFunction }) => {

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