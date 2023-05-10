import { Box, Flex, Image, ListItem, Text, UnorderedList, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import GroupSettingsModal from '../UserModals/GroupSettingsModal';
import axios from 'axios';
import { backend_url } from '../../baseApi';

const GroupCard = ({
  chatId,
  name,
  members,
  upcomingEvents,
  isAdmin,
  fetchAgain,
  setFetchAgain
}) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [toggleGroupMenu, setToggleGroupMenu] = useState(false);
  const [groupChatName, setGroupChatName] = React.useState('');
  const [renameLoading, setRenameLoading] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
                    <ListItem cursor={"pointer"} whiteSpace='pre' p='10px 50px 10px 20px' display='flex' alignItems='center'>
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
          <Text color="#737373">{members}</Text>
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
    </Box>
  )
}

export default GroupCard