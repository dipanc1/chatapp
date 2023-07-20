import { launchImageLibrary } from 'react-native-image-picker';
import React from 'react'
import { Avatar, Box, Button, FormControl, IconButton, Input, Modal, Stack, VStack } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DatePicker from 'react-native-date-picker'


const EventModal = ({ user, fetchAgain, setFetchAgain, showModal, setShowModal, eventType, eventName, setEventName, description, setDescription, date, setDate, time, setTime, selectedImage, setSelectedImage, createEventLoading, setCreateEventLoading, handleSubmit }) => {
  const [openDate, setOpenDate] = React.useState(false)
  const [openTime, setOpenTime] = React.useState(false)
  const [pic, setPic] = React.useState(null)

  const pickImage = async () => {
    const options = {
      // includeBase64: true,
      mediaType: 'photo',
      // saveToPhotos: true,
    };
    await launchImageLibrary(options, (response) => {

      console.log('Response = ', response.assets.map((item) => item));
      const res = response.assets.map((item) => item);
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else {
        const uri = res.uri;
        const type = res.type;
        const name = res.fileName;
        const source = {
          uri,
          type,
          name,
        }
      }
    });
  }

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{
      _dark: {
        bg: "coolGray.800"
      },
      bg: "warmGray.50"
    }}>
      <Modal.Content maxWidth="350" maxH="800">
        <Modal.CloseButton />
        <Modal.Header>{eventType + ' Event'}</Modal.Header>
        <Modal.Body>
          <VStack space={'4'} alignItems={'center'}>
            <FormControl>
              <Stack my={'1'}>
                <FormControl.Label>Event Name</FormControl.Label>
                <Input value={eventName} onChangeText={
                  (text) => setEventName(text)
                } variant={'filled'} color={'primary.900'} placeholder="Name the event" />
              </Stack>
              <Stack my={'1'}>
                <FormControl.Label>Description</FormControl.Label>
                <Input variant={'filled'} color={'primary.900'} placeholder="Add a description"
                  value={description} onChangeText={
                    (text) => setDescription(text)
                  }
                />
              </Stack>
              <Stack my={'1'} flexDirection={'row'}>
                <Button w={'50%'} colorScheme="violet" rounded={'lg'} variant={'ghost'} onPress={() => setOpenDate(true)} >
                  {(eventType === "Edit" && date) ? date : (eventType !== "Edit" && date) ? date.toDateString() : 'Date'}
                </Button>
                <DatePicker
                  androidVariant='iosClone'
                  modal
                  open={openDate}
                  date={new Date()}
                  onConfirm={(date) => {
                    setOpenDate(false)
                    setDate(date)
                  }}
                  onCancel={() => {
                    setOpenDate(false)
                  }}
                  mode='date'
                />

                <Button w={'50%'} variant={'ghost'} colorScheme="violet" rounded={'lg'} onPress={() => setOpenTime(true)} >
                  {(eventType === "Edit" && time) ? time : (eventType !== "Edit" && time) ? time.toTimeString().split(' ')[0] : 'Time'}
                </Button>
                <DatePicker
                  modal
                  open={openTime}
                  date={new Date()}
                  onConfirm={(date) => {
                    setOpenTime(false)
                    setTime(date)
                  }}
                  onCancel={() => {
                    setOpenTime(false)
                  }}
                  mode='time'
                />

              </Stack>
            </FormControl>
            <Box display={'flex'} alignItems={'flex-end'}>
              <Avatar bg="pink.600" alignSelf="center" size="xl" source={{
                uri: (pic !== null ? pic : "https://images.unsplash.com/photo-1601233749202-95d04d5b3c00?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2876&q=80")
              }}>
                GG
              </Avatar>
              <IconButton onPress={() => pickImage()} variant={'ghost'} _icon={{
                as: MaterialIcons, name: "edit"
              }} size={'md'} />
            </Box>


            <Button colorScheme="violet" rounded={'lg'} w={'100%'} onPress={handleSubmit}>
              {eventType}
            </Button>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

export default EventModal