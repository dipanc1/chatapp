import React from 'react'
import { Avatar, Box, FlatList, Flex, HStack, Spacer, Text, VStack } from 'native-base'
import Members from './Members'
import UserListItem from '../UserItems/UserListItem'

const Groups = () => {
  const data = [{
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    fullName: "Aafreen Khan",
    timeStamp: "12:47 PM",
    recentText: "Good Day!",
  }, {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    fullName: "Sujitha Mathur",
    timeStamp: "11:11 PM",
    recentText: "Cheer up, there!",
  }, {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    fullName: "Anci Barroco",
    timeStamp: "6:22 PM",
    recentText: "Good Day!",
  }, {
    id: "68694a0f-3da1-431f-bd56-142371e29d72",
    fullName: "Aniket Kumar",
    timeStamp: "8:56 PM",
    recentText: "All the best",
  }, {
    id: "28694a0f-3da1-471f-bd96-142456e29d72",
    fullName: "Kiara",
    timeStamp: "12:47 PM",
    recentText: "I will call today.",
  }]
  
  return (
    // <FlatList data={data} renderItem={({
    //   item
    // }) =>
    //   <Flex justifyContent={'flex-start'} p={'2'}>
    //     <UserListItem item={item} />
    //   </Flex>
    // } keyExtractor={item => item.id} />
    <Members />
  )
}

export default Groups