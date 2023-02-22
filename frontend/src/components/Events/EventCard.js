import React, {
  useContext,
  useState
} from 'react'
import { NavLink } from "react-router-dom";
import {
  GridItem,
  Image,
  Flex,
  Text,
  Button,
  Box,
  UnorderedList,
  ListItem
} from '@chakra-ui/react';
import { AppContext } from '../../context/AppContext';
import { backend_url } from '../../baseApi';
import axios from 'axios';
import EventModal from '../UserModals/EventModal';

const EventCard = ({
  id,
  title,
  date,
  time,
  imageUrl,
  description
}) => {
  const [toggleEventMenu, setToggleEventMenu] = useState(false);
  const { selectedChat } = useContext(AppContext);
  const user = JSON.parse(localStorage.getItem('user'));
  const [name, setEventName] = useState("");
  const [descriptiond, setDescriptiond] = useState();
  const [dated, setDated] = useState(date);
  const [timed, setTimed] = useState(time);
  const [selectedImage, setSelectedImage] = React.useState(null);

  const fileInputRef = React.createRef();

  const cloudName = 'dipanc1';
  const pictureUpload = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0 && (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png')) {
      setSelectedImage(e.target.files[0]);
    } else {
      alert('Please select a valid image file');
    }
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (selectedChat.groupAdmin._id !== user._id) return alert("You are not the admin of this group");

    if (name === "" || description === "" || date === "" || time === "") return alert("Feilds cannot be empty");

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    if (selectedImage === null) {
      await axios.put(`${backend_url}/conversation/event/${selectedChat._id}`, {
        name,
        description,
        date,
        time
      }, config)
        .then((res) => {
          // console.log(selectedChat)
          alert(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const formData = new FormData();
      formData.append('api_key', '835688546376544')
      formData.append('file', selectedImage);
      formData.append('upload_preset', 'chat-app');

      await axios.post(pictureUpload, formData)
        .then((res) => {
          axios.put(`${backend_url}/conversation/event/${selectedChat._id}`, {
            name,
            description,
            date,
            time,
            thumbnail: res.data.url
          }, config)
            .then((res) => {
              alert(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }

  }

  const deleteEvent = async (id) => {
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
        console.log(res);
        alert('Event deleted successfully');
      });
    } catch (error) {
      console.log(error);
      alert('Error deleting event');
    }

  }



  return (
    <>
      <NavLink>
        <GridItem bg='#EAE4FF' w='100%' overflow='hidden' borderRadius='10px'>
          <Image src={imageUrl} w='100%' height='220px' objectFit='cover' />
          <Flex alignItems='center' justifyContent='space-between' px='20px' py='10px'>
            <Box>
              <Text flex='1' fontSize='18px'>
                {title}
              </Text>
              <Text color='#999' pt='4px' fontSize='13px'>
                {time} AM
              </Text>
            </Box>
            <Box position='relative' zIndex='1'>
              <Button type='button' onClick={() => setToggleEventMenu(!toggleEventMenu)} bg='transparent'>
                <Image height='22px' src='https://ik.imagekit.io/sahildhingra/3dot-menu.png' />
              </Button>
              {
                toggleEventMenu && (
                  <Box overflow='hidden' className='lightHover' width='fit-content' position='absolute' borderRadius='10px' boxShadow='md' background='#fff' right='0' bottom='100%'>
                    <UnorderedList listStyleType='none' ms='0'>
                      <ListItem p='10px 50px 10px 20px' display='flex' alignItems='center'>
                        <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/save.png" />
                        <Text>Save</Text>
                      </ListItem>
                      <ListItem p='10px 50px 10px 20px' display='flex' alignItems='center'>
                        <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/draw.png" />
                        <Text>Edit</Text>
                      </ListItem>
                      <ListItem onClick={() => {
                        deleteEvent(id);
                        setToggleEventMenu(!toggleEventMenu);
                      }} p='10px 50px 10px 20px' display='flex' alignItems='center'>
                        <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/trash.png" />
                        <Text color='#FF0000'>Delete</Text>
                      </ListItem>
                    </UnorderedList>
                  </Box>
                )
              }
            </Box>
          </Flex>
        </GridItem>
      </NavLink>
      <EventModal />
    </>
  )
}

export default EventCard;