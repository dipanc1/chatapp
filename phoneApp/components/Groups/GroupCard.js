import { Box, Center, FlatList, HStack, Text, VStack } from 'native-base';
import React from 'react'
import OptionsModal from '../UserModals/OptionsModal';

const GroupCard = () => {

  return (
    <FlatList data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} renderItem={() =>
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
              Vikram
            </Text>
            <OptionsModal group={true}/>
          </HStack>

          <HStack w={'72'} py={'5'} px={'3'} alignItems={'center'} justifyContent={'space-between'}>

            <VStack>
              <Text bold>
                Members
              </Text>
              <Text color={'primary.400'}>
                10
              </Text>
            </VStack>

            <VStack>
              <Text bold>
                Upcoming Events
              </Text>
              <Text color={'primary.400'} textAlign={'right'}>
                1
              </Text>
            </VStack>

          </HStack>

        </VStack>
      </Center >
    } />
  )
}

export default GroupCard