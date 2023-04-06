import React from 'react'
import { AspectRatio, Box, VStack, HStack, Heading, Image, Stack, Text, FlatList } from 'native-base'
import OptionsModal from '../UserModals/OptionsModal'
import JoinGroupModal from '../UserModals/JoinGroupModal'

const EventsCard = ({ data, screen }) => {

  return (
    <>
      <FlatList data={data} renderItem={({ item }) =>
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
            <AspectRatio w="100%" ratio={4 / 3}>
              <Image source={{
                uri: item?.thumbnail ?? "https://www.telemonks.com/wp-content/themes/appon/assets/images/no-image/No-Image-Found-400x264.png"
              }} alt="image" />
            </AspectRatio>
            <Stack p="4" space={2}>
              <HStack space={'24'} alignItems="center" justifyContent={'space-between'}>
                <Heading size="md">
                  {item?.name}
                </Heading>
                {screen && <OptionsModal group={false} />}
              </HStack>
              <Text color="coolGray.600" _dark={{
                color: "warmGray.200"
              }} fontWeight="400">
                {item?.time} AM
              </Text>
            </Stack>
          </Box>
        </Box>
      } />
      <JoinGroupModal />
    </>
  )
}

export default EventsCard