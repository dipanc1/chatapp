import { Box, Flex, Image, ListItem, Text, UnorderedList } from '@chakra-ui/react'
import React, {useState} from 'react'

const GroupCard = ({
    name,
    members,
    upcomingEvents,
    isAdmin
}) => {
const [toggleGroupMenu, setToggleGroupMenu] = useState(false)
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
            <Box position='relative'>
                <Image onClick={() => setToggleGroupMenu(!toggleGroupMenu)} px='10px' cursor="pointer" h="32px" src="https://ik.imagekit.io/sahildhingra/3dot-menu.png" />
                {
                toggleGroupMenu && (
                  <Box zIndex='1' overflow='hidden' className='lightHover' width='fit-content' position='absolute' borderRadius='10px' boxShadow='md' background='#fff' right='0' top='100%'>
                    <UnorderedList listStyleType='none' ms='0'>
                      <ListItem whiteSpace='pre' p='10px 50px 10px 20px' display='flex' alignItems='center'>
                        <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/user.png" /> 
                        <Text>Add Member</Text>
                      </ListItem>
                      <ListItem whiteSpace='pre' p='10px 50px 10px 20px' display='flex' alignItems='center'>
                        <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/events.png" /> 
                        <Text>Create Event</Text>
                      </ListItem>
                      <ListItem p='10px 50px 10px 20px' display='flex' alignItems='center'>
                        <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/settings.png" /> 
                        <Text>Settings</Text>
                      </ListItem>
                      <ListItem p='10px 50px 10px 20px' display='flex' alignItems='center'>
                        <Image h='22px' me='15px' src="https://ik.imagekit.io/sahildhingra/trash.png" /> 
                        <Text color='#FF0000'>Delete</Text>
                      </ListItem>
                    </UnorderedList>
                  </Box>
                )
              }
            </Box>
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
    </Box>
  )
}

export default GroupCard