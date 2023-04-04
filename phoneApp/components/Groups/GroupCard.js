import { Box, Center, FlatList, HStack, Icon, Text, VStack } from 'native-base';
import React from 'react'
import OptionsModal from '../UserModals/OptionsModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const GroupCard = ({ data, user }) => {
  
  return (
    <FlatList data={data} renderItem={({ item, i }) => (
      <Center px={3} my={5}>
        <VStack
          bg={`primary.100`}
          w={'80'}
          rounded="xl"
          alignItems={'center'}
          _text={{
            fontSize: 'md',
            fontWeight: 'medium',
            color: 'warmGray.50',
            textAlign: 'center'
          }}>

          <HStack w={'72'} py={'5'} px={'3'} alignItems={'center'} justifyContent={'space-between'}>
            <Text fontSize={'3xl'} color={'primary.300'}>
              {item.chatName}
            </Text>
            {user?._id === item.groupAdmin._id &&
              <Icon as={MaterialIcons} name='verified' color={'primary.300'} size={5} />
            }
            <OptionsModal group={true} />
          </HStack>

          <HStack w={'72'} py={'5'} px={'3'} alignItems={'center'} justifyContent={'space-between'}>

            <VStack>
              <Text bold>
                Members
              </Text>
              <Text color={'primary.400'}>
                {item.users.length}
              </Text>
            </VStack>

            <VStack>
              <Text bold>
                Upcoming Events
              </Text>
              <Text color={'primary.400'} textAlign={'right'}>
                {item.events.length}
              </Text>
            </VStack>

          </HStack>

        </VStack>
      </Center >
    )}
      keyExtractor={(item) => item._id}
    />
  )
}

export default GroupCard