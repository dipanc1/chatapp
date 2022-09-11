import { View, Text } from 'react-native'
import React from 'react'
import { Flex, HStack, Icon, IconButton, VStack } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PhoneAppContext } from '../../context/PhoneAppContext'

const Streaming = () => {

    const [toggle, setToggle] = React.useState(false);
    const { dispatch } = React.useContext(PhoneAppContext);

    return (
        <Flex flex={1} py={'1'} bg={'primary.100'}>
            {/* TOP PART */}
            <HStack flex={'2'} alignItems={'center'} justifyContent={'space-between'} my={'1'} mx={'5'}>
                <VStack>
                    <Text>Group Name</Text>
                    <Text>Host:</Text>
                </VStack>
                <HStack alignItems={'center'}>
                    <Icon mx={'1'} as={<MaterialIcons name="access-time" size={24} color="#3cc4b7" />} />

                    <Text>00:25:20</Text>
                </HStack>
            </HStack>
            {/* MIDDLE PART  */}
            <Flex flex={'8'} justifyContent={'center'} alignItems={'center'} bg={'primary.200'} m={'5'}>
                <Text>VIDEO</Text>
            </Flex>
            {/* BOTTOM PART */}
            <HStack flex={'3'} mx={'2'} justifyContent={'space-between'}>
                <Flex justifyContent={'center'} alignItems={'center'}>
                    <IconButton onPress={() => setToggle(!toggle)} bg={'primary.200'} icon={<MaterialIcons name={toggle ? "volume-up" : "volume-off"} size={24} color="#9F85F7" />} />
                    <Text>Volume</Text>
                </Flex>
                <Flex justifyContent={'center'} alignItems={'center'}>
                    <IconButton onPress={() => setToggle(!toggle)} bg={'primary.200'} icon={<MaterialIcons name={toggle ? "mic" : "mic-off"} size={24} color="#EFAA86" />} />
                    <Text>Mute</Text>
                </Flex>
                <Flex justifyContent={'center'} alignItems={'center'}>
                    <IconButton onPress={
                        () => { dispatch({ type: 'SET_FULLSCREEN', payload: true }) }
                    } bg={'primary.200'} icon={<MaterialIcons name="fullscreen" size={24} color="#EFAA86" />} />
                    <Text>Full Screen</Text>
                </Flex>
                <Flex justifyContent={'center'} alignItems={'center'}>
                    <IconButton onPress={
                        () => { dispatch({ type: 'SET_STREAM', payload: false }) }
                    } bg={'primary.200'} icon={<MaterialIcons name="cancel-presentation" size={24} color="#ff4343" />} />
                    <Text>Leave</Text>
                </Flex>
            </HStack>
        </Flex>
    )
}

export default Streaming