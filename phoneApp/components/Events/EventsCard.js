import React from 'react'
import { AspectRatio, Box, VStack, HStack, Heading, Image, Stack, Text, FlatList } from 'native-base'
import OptionsModal from '../UserModals/OptionsModal'

const EventsCard = () => {
  return (
    <FlatList data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} renderItem={() =>
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
          <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
              <Image source={{
                uri: "https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg"
              }} alt="image" />
            </AspectRatio>
          </Box>
          <Stack p="4" space={3}>
            <Stack space={2}>
              <HStack space={'24'} alignItems="center">
                <Heading size="md" ml="-1">
                  The Garden City
                </Heading>
                <OptionsModal group={false} />
              </HStack>
            </Stack>
            <HStack alignItems="center" space={4} justifyContent="space-between">
              <HStack alignItems="center">
                <Text color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }} fontWeight="400">
                  6 mins ago
                </Text>
              </HStack>
            </HStack>
          </Stack>
        </Box>
      </Box>
    } />
  )
}

export default EventsCard