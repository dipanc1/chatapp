import { launchImageLibrary } from 'react-native-image-picker';
import React from 'react'
import { Avatar, Box, Button, FormControl, IconButton, Input, Modal, Stack, TextArea, VStack } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DatePicker from 'react-native-date-picker'
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { api_key, folder, pictureUpload } from '../../production';


const EventModal = ({ user, fetchAgain, setFetchAgain, showModal, setShowModal, eventType, eventName, setEventName, description, setDescription, date, setDate, time, setTime, selectedImage, setSelectedImage, createEventLoading, setCreateEventLoading, handleSubmit }) => {
  const [openDate, setOpenDate] = React.useState(false)
  const [openTime, setOpenTime] = React.useState(false)

  const { getCloudinarySignature, timestamp, signature } = React.useContext(PhoneAppContext);

  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
    };
    await getCloudinarySignature();
    await launchImageLibrary(options, (response) => {
      if (!response.didCancel) {
        const res = response.assets.map((item) => item);
        if (res.error) {
          console.log('ImagePicker Error: ', res.error);
        } else {
          const uri = res[0].uri;
          const type = res[0].type;
          const name = res[0].fileName;
          const source = {
            uri,
            type,
            name,
          }
          cloudinaryUpload(source);
        }
      }
    });
  }


  const cloudinaryUpload = (photo) => {
    let apiUrl = pictureUpload;
    const data = new FormData()
    data.append('api_key', api_key)
    data.append('file', photo);
    data.append('folder', folder)
    data.append('timestamp', timestamp)
    data.append('signature', signature)
    fetch(apiUrl, {
      method: "post",
      body: data
    }).then(res => res.json()).
      then(data => {
        setSelectedImage(data.secure_url)
      }).catch(err => {
        console.log(err)
        alert("An Error Occured While Uploading")
      })
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
                <TextArea h={20} variant={'filled'} color={'primary.900'} placeholder="Add a description"
                  value={description} onChangeText={
                    (text) => setDescription(text)
                  }
                />
              </Stack>
              <Stack my={'1'} flexDirection={'row'}>
                <Button w={'50%'} colorScheme="violet" rounded={'lg'} variant={'ghost'} onPress={() => setOpenDate(true)} >
                  {(eventType === "Edit" && date) ? date.toString().split('GMT')[0] : (eventType !== "Edit" && date) ? date.toDateString() : 'Date'}
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
                  {(eventType === "Edit" && time) ? time.toString().split('GMT')[0] : (eventType !== "Edit" && time) ? time.toTimeString().split(' ')[0] : 'Time'}
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
                uri: (selectedImage !== null ? selectedImage : "https://images.unsplash.com/photo-1601233749202-95d04d5b3c00?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2876&q=80")
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