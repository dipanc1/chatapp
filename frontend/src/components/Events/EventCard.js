import React, {
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

const EventCard = ({
  title,
  date,
  time,
  imageUrl
}) => {
 const [toggleEventMenu, setToggleEventMenu] = useState(false)

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
        </GridItem>
      </NavLink>
    </>
  )
}

export default EventCard;