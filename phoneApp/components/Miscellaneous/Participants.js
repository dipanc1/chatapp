import { Button, FlatList, Flex, HStack, Text, VStack } from 'native-base'
import React from 'react'
import UserListItem from '../UserItems/UserListItem'
import Searchbar from './Searchbar'

const Participants = () => {

  const data = [{
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    fullName: "Aafreen Khan",
    timeStamp: "12:47 PM",
    recentText: "Good Day!",
    avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
  }, {
    id: "28694a0f-3da1-471f-bd96-142456e29d72",
    fullName: "Kiara",
    timeStamp: "12:47 PM",
    recentText: "I will call today.",
    avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr01zI37DYuR8bMV5exWQBSw28C1v_71CAh8d7GP1mplcmTgQA6Q66Oo--QedAN1B4E1k&usqp=CAU"
  }]

  return (
    <Flex bg={'white'} flex={1}>

      <HStack my={'2'} alignItems={'center'} justifyContent={'space-around'}>
        <Text color={'#2E354B'}>2 Members</Text>
        <Button variant={'ghost'} colorScheme={'cyan'}>Add</Button>
      </HStack>

      <VStack p={'5'}>

        <Searchbar placeholder={"Search User"} />

        <FlatList mt={'5'} data={data}
          renderItem=
          {
            ({ item }) =>
              <UserListItem item={item} />
          }
          keyExtractor={item => item.id} />

      </VStack>

    </Flex>
  )
}

export default Participants