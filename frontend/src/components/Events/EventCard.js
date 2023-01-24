import React from 'react'
import { NavLink } from "react-router-dom";
import {
  GridItem,
  Image,
  Flex,
  Text,
  Button
} from '@chakra-ui/react';

const EventCard = ({
  title,
  imageUrl
}) => {
  return (
    <>
      <NavLink to="detail">
        <GridItem bg='#EAE4FF' w='100%' overflow='hidden' borderRadius='10px'>
          <Image src={imageUrl} w='100%' height='220px' objectFit='cover' />
          <Flex alignItems='center' px='20px' py='10px'>
            <Text flex='1'>
              {title}
            </Text>
            <Button bg='transparent'>
              <Image height='22px' src='https://ik.imagekit.io/sahildhingra/save.png?ik-sdk-version=javascript-1.4.3&updatedAt=1672933222542' />
            </Button>
          </Flex>
        </GridItem>
      </NavLink>
    </>
  )
}

export default EventCard;