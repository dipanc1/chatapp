import { Flex } from 'native-base'
import React from 'react'
import { ChatBoxComponent } from '../UserChat/Chatbox'

const ChatMembers = () => {
  return (
    <Flex flex={1} p={4}>
      <ChatBoxComponent />
    </Flex>
  )
}

export default ChatMembers