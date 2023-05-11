import { Box, Flex, Image, ListItem, Text, UnorderedList, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import GroupSettingsModal from '../UserModals/GroupSettingsModal';
import axios from 'axios';
import { backend_url } from '../../baseApi';
import AddMembersModal from '../UserModals/AddMembersModal';
import { AppContext } from '../../context/AppContext';

const GroupCard = ({
  chatId,
  name,
  members,
  upcomingEvents,
  isAdmin,
  fetchAgain,
  setFetchAgain,
  admin
}) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [toggleGroupMenu, setToggleGroupMenu] = useState(false);
  const [groupChatName, setGroupChatName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [renameLoading, setRenameLoading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()

  const { userInfo, fullScreen } = React.useContext(AppContext);

  const toast = useToast();

  const handleRename = async () => {
    if (!groupChatName) {
      return
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }
      const body = {
        chatName: groupChatName,
        chatId: chatId
      }
      await axios.put(`${backend_url}/conversation/rename`, body, config)
      toast({
        title: "Group chat renamed",
        description: "Group chat renamed to " + groupChatName,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setRenameLoading(false);
      setFetchAgain(!fetchAgain);
      setGroupChatName('');
      onClose();
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Rename Group Chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setRenameLoading(false);
    }
  }

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`${backend_url}/users?search=${search}`, config)
      setSearchResults(data.users);
      // console.log(searchResults);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  const handleAddUser = async (user1) => {
    // console.warn("USER ID TO ADD", selectedChat.users.map(user => user._id).includes(user1));
    if (members.map(user => user._id).includes(user1)) {
      return toast({
        title: "Error Occured!",
        description: "User already in group chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    if (admin._id !== userInfo._id) {
      return toast({
        title: "Error Occured!",
        description: "You are not the admin of this group chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${backend_url}/conversation/groupadd`,
        {
          chatId: chatId,
          userId: user1,
        },
        config
      );
      console.log(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toast({
        title: "Success!",
        description: "User added to group chat",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to add user to group chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setSearch('');

  }


  return (
    <Box p='18px 29px' borderRadius='10px' border="0">
      <Flex justifyContent="space-between">
        <Flex>
          <Flex>
            <Text as="h2" color="#9F85F7" fontSize="26px" fontWeight="500">{name}</Text>
          </Flex>
          {
            isAdmin && (
              <Image ml='17px' h="32px" src="https://ik.imagekit.io/sahildhingra/crown-icon.png" />
            )
          }
        </Flex>
        {isAdmin &&
          <Box position='relative'>
            <Image onClick={() => setToggleGroupMenu(!toggleGroupMenu)} px='10px' cursor="pointer" h="32px" src="https://ik.imagekit.io/sahildhingra/3dot-menu.png" />
            {
              toggleGroupMenu && (
                <Box zIndex='1' overflow='hidden' className='lightHover' width='fit-content' position='absolute' borderRadius='10px' boxShadow='md' background='#fff' right='0' top='100%'>
                  <UnorderedList listStyleType='none' ms='0'>
                    <ListItem onClick={onAddOpen} cursor={"pointer"} whiteSpace='pre' p='10px 50px 10px 20px' display='flex' alignItems='center'>
                      <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/user.png" />
                      <Text>Add Member</Text>
                    </ListItem>
                    <ListItem cursor={"pointer"} whiteSpace='pre' p='10px 50px 10px 20px' display='flex' alignItems='center'>
                      <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/events.png" />
                      <Text>Create Event</Text>
                    </ListItem>
                    <ListItem cursor={"pointer"} onClick={onOpen} p='10px 50px 10px 20px' display='flex' alignItems='center'>
                      <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/settings.png" />
                      <Text>Settings</Text>
                    </ListItem>
                  </UnorderedList>
                </Box>
              )
            }
          </Box>}

      </Flex>
      <Flex pt="60px" justifyContent="space-between">
        <Box>
          <Text color="#032E2B" fontWeight="600" as="h3">Members</Text>
          <Text color="#737373">{members.length}</Text>
        </Box>
        <Box textAlign="right">
          <Text color="#032E2B" fontWeight="600" as="h3">Upcoming Events</Text>
          <Text color="#737373">{upcomingEvents}</Text>
        </Box>
      </Flex>
      <GroupSettingsModal
        isOpen={isOpen}
        onClose={onClose}
        chatName={name}
        groupChatName={groupChatName}
        setGroupChatName={setGroupChatName}
        handleRename={handleRename}
        renameLoading={renameLoading}
        groupsTab={true}
      />

      <AddMembersModal isAddOpen={isAddOpen} onAddClose={onAddClose} handleSearch={handleSearch} search={search} searchResults={searchResults} loading={loading} handleAddUser={handleAddUser} fullScreen={fullScreen} />
    </Box>
  )
}

export default GroupCard