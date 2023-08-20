import React from 'react'
import { AspectRatio, Box, VStack, HStack, Heading, Image, Stack, Text, FlatList, IconButton, Flex, Spinner } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import OptionsModal from '../UserModals/OptionsModal'
import JoinGroupModal from '../UserModals/JoinGroupModal'
import { TouchableOpacity } from 'react-native'
import { PhoneAppContext } from '../../context/PhoneAppContext'
import axios from 'axios'
import { backend_url } from '../../production'
import Pagination from '../Miscellaneous/Pagination'

import animationData from '../../assets/red-dot.json';
import StreamModal from '../UserModals/StreamModalWeb'

const EventsCard = ({ data, screen, selectEvent, chatName, user, showModal, setShowModal, chatId, navigation, currentPage, totalPages, totalCount, currentCount, hasNextPage, hasPrevPage, paginateFunction, fetchAgain, setFetchAgain, loading }) => {

  const { selectedChat, userInfo } = React.useContext(PhoneAppContext);

  const [meetingIdExists, setMeetingIdExists] = React.useState(false);
  const [open, setOpen] = React.useState(false);


  const admin = selectedChat?.isGroupChat && selectedChat?.groupAdmin._id === userInfo?._id;

  const handleStream = () => {
    setOpen(true);
  }

  const deleteEvent = async (id) => {
    if (selectedChat.groupAdmin._id !== userInfo?._id) {
      alert('You are not the admin of this group')
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
        alert(res.data.message)
        selectedChat.events.filter((event) => event._id !== id);
      });
    } catch (error) {
      await axios.get(`${backend_url}/conversation/event/${selectedChat._id}`, config).then((res) => {
        selectedChat.events = res.data;
      }).catch((err) => {
        console.log(err);
        alert('Something went wrong')
      });
      alert('Something went wrong')
    }

  }

  React.useEffect(() => {
    if (selectedChat?.isGroupChat) {
      try {
        const checkStream = async () => {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            }
          }
          const { data } = await axios.get(`${backend_url}/conversation/streaming/${selectedChat._id}`, config);
          if (data) {
            setMeetingIdExists(true)
          } else {
            setMeetingIdExists(false);
          }
        }
        checkStream();
      } catch (error) {
        console.log(error);
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat])

  const renderItem = ({ item, index }) => (
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
          <AspectRatio width="100%" ratio={4 / 3}>
            <Image source={{
              uri: item.thumbnail || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO4x5DoFLdcrUSSjGFMyTkoCJSLREShpkety_TZHXi&s"
            }} alt="image" />
          </AspectRatio>
        </TouchableOpacity>
        <Stack p="4" space={2}>
          <HStack space={'24'} justifyContent={'space-between'}>
            <Heading size="md" maxW={'40'}>
              {item?.name}
            </Heading>
            {!screen && admin && <OptionsModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} eventDetails={item} admin={admin} group={false} deleteEvent={deleteEvent} eventId={item._id} user={user} chat={selectedChat} />}
          </HStack>
          <HStack space={'24'} alignItems="center" justifyContent={'space-between'}>
            <Text color="coolGray.600" _dark={{
              color: "warmGray.200"
            }} fontWeight="400">
              {item?.time?.split('T')[1]?.slice(0, 5)}
            </Text>
            {selectedChat?.isGroupChat && (admin || meetingIdExists) && (index === 0) && !screen &&
              <>
                <IconButton onPress={handleStream} icon={<MaterialIcons name="videocam" size={24} color={'black'} />} />
                {!admin &&
                  <Lottie style={{
                    width: 30,
                    position: 'absolute',
                    zIndex: -1,
                  }}
                    source={animationData} autoPlay loop />}
              </>
            }
          </HStack>
        </Stack>
      </Box>
    </Box>
  )

  return (
    <>
      <Box flex={1}>
        {loading
          ?
          <Flex flex={1} alignItems={"center"} justifyContent="center">
            <Spinner size={'lg'} color={'primary.300'} />
          </Flex>
          :
          <FlatList data={data} renderItem={renderItem} />}

        {(screen && !loading) && <Pagination paginateFunction={paginateFunction} currentPage={currentPage} totalPages={totalPages} totalCount={totalCount} currentCount={currentCount} hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} />}

        <JoinGroupModal showModal={showModal} setShowModal={setShowModal} chatName={chatName} user={user} chatId={chatId} navigation={navigation} />

        <StreamModal admin={admin} user={user} open={open} setOpen={setOpen} />
      </Box>
    </>
  )
}

export default EventsCard