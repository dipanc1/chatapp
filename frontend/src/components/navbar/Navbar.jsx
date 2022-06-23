import React, { useEffect } from 'react'
import ProfileModal from '../ProfileModal/ProfileModal';
import "./navbar.scss"
import { useHistory } from "react-router-dom";
import { PhoneNumberContext } from '../../context/phoneNumberContext';
import { motion } from 'framer-motion';
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Portal
} from '@chakra-ui/react';
import { BellIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}>
    {children}
  </Link>
);

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const user = JSON.parse(localStorage.getItem('user'));

  const { notification, dispatch } = React.useContext(PhoneNumberContext);
  // console.log(notification);

  let history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('user');
    history.push('/');
  }

  return (
    <> 
      <Box px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>ChatApp</Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button bg={colorMode === 'light' ? 'white' : 'blackAlpha.600'} onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Menu>
                <MenuButton>
                  <BellIcon fontSize={'xl'} />
                </MenuButton>
                <Portal>
                  <MenuList>
                    {!notification.length
                      ? <MenuItem>No new notifications</MenuItem>
                      :
                      notification.map((notifications) =>
                        <MenuItem
                          key={notifications._id}
                          onClick={() => {
                            console.log(notifications);
                            dispatch({
                              type: 'SET_SELECTED_CHAT',
                              payload: notifications.chat
                            })
                            dispatch({
                              type: 'SET_NOTIFICATION',
                              payload: notifications.filter(notifications._id !== notification._id)
                            })
                            //check this feature
                          }
                          }>
                          {notifications.chat.isGroupChat ? `New Message in ${notifications.chat.chatName}` : `New Message from ${notifications.sender.username}`}
                        </MenuItem>
                      )}
                  </MenuList>
                </Portal>
              </Menu>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={user.pic}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={user.pic}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{user.username}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <ProfileModal user={user}>
                    <MenuItem>My Profile</MenuItem>
                  </ProfileModal>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}

export default Navbar;