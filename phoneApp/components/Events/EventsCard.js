import React from 'react'
import { AspectRatio, Box, VStack, HStack, Heading, Image, Stack, Text, FlatList } from 'native-base'
import OptionsModal from '../UserModals/OptionsModal'
import JoinGroupModal from '../UserModals/JoinGroupModal'
import { SafeAreaView, TouchableOpacity } from 'react-native'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import axios from 'axios'
import { backend_url } from '../../production'

const EventsCard = ({ data, screen, selectEvent, chatName, user, showModal, setShowModal, chatId, navigation }) => {

  const { selectedChat } = React.useContext(PhoneAppContext)

  const deleteEvent = async (id) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      // toast({
      //   title: "You are not the admin of this group",
      //   status: "error",
      //   duration: 3000,
      //   isClosable: true,
      // });
      console.log('You are not the admin of this group')
      return;
    }

    const newEvents = selectedChat.events.filter((event) => event._id !== id);
    selectedChat.events = newEvents;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
    };

    try {
      await axios.delete(`${backend_url}/conversation/event/delete/${id}/${selectedChat._id}`, config).then((res) => {
        // toast({
        //   title: "Event Deleted!",
        //   description: "Event deleted successfully",
        //   status: "success",
        //   duration: 5000,
        //   isClosable: true,
        //   position: "bottom-left",
        // });
        console.log(res.data)
      });
    } catch (error) {
      await axios.get(`${backend_url}/conversation/event/${selectedChat._id}`, config).then((res) => {
        selectedChat.events = res.data;
      }).catch((err) => {
        console.log(err);
      });
      // toast({
      //   title: "Error Occured!",
      //   description: "Something went wrong",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom-left",
      // });
    }

  }

  const renderItem = ({ item }) => (
    <Box alignItems="center" my={'4'}>
      <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
        borderColor: "coolGray.600",
        backgroundColor: "gray.700"
      }} _web={{
        shadow: 2,
        borderWidth: 0
      }} _light={{
        backgroundColor: "gray.50"
      }}>
        <TouchableOpacity onPress={() => {
          screen && selectEvent(item.chatId)
        }}>
          <AspectRatio w="100%" ratio={4 / 3}>
            <Image source={{
              uri: item?.thumbnail ?? "https://www.telemonks.com/wp-content/themes/appon/assets/images/no-image/No-Image-Found-400x264.png"
            }} alt="image" />
          </AspectRatio>
        </TouchableOpacity>
        <Stack p="4" space={2}>
          <HStack space={'24'} alignItems="center" justifyContent={'space-between'}>
            <Heading size="md">
              {item?.name}
            </Heading>
            {!screen && <OptionsModal group={false} deleteEvent={deleteEvent} eventId={item._id} />}
          </HStack>
          <Text color="coolGray.600" _dark={{
            color: "warmGray.200"
          }} fontWeight="400">
            {item?.time} AM
          </Text>
        </Stack>
      </Box>
    </Box>
  )

  return (
    <>
      <Box flex={1}>
        <FlatList data={data} renderItem={renderItem} />
        <JoinGroupModal showModal={showModal} setShowModal={setShowModal} chatName={chatName} user={user} chatId={chatId} navigation={navigation} />
      </Box>
    </>
  )
}

export default EventsCard