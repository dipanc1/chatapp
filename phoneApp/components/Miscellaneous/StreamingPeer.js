import React from 'react'
import { Button, Flex, HStack, Icon, IconButton, VStack, Text } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import { RTCView, useMeeting, useParticipant } from '@videosdk.live/react-native-sdk'
import axios from 'axios'
import { backend_url } from '../../production'

const Streaming = ({ fetchAgain, setFetchAgain, user, admin }) => {


    return (
        <Flex flex={1} py={'1'} bg={'primary.100'}>
            <Text>
                Streaming
            </Text>
        </Flex>
    )
}

export default Streaming