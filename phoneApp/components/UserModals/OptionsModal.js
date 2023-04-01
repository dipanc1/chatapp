import { Box, Button, Icon, IconButton, Popover, Text } from 'native-base';
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const OptionsModal = () => {
  return (
    <Box alignItems="center">
      <Popover trigger={triggerProps => {
        return <IconButton {...triggerProps} icon={<MaterialIcons name="more-vert" size={24} />} />
      }}>
        <Popover.Content accessibilityLabel="Delete Customerd">
          <Popover.Body>
            <Button.Group space={2} display={'flex'} flexDirection={'column'}>
              <Button leftIcon={<Icon as={<MaterialIcons name="edit" size={40} />} />} colorScheme="coolGray" variant="ghost">Edit</Button>
              <Button leftIcon={<Icon color={'red.400'} as={<MaterialIcons name="delete" size={40} />} />} variant={'ghost'}>
                <Text color={'red.400'}>Delete</Text>
              </Button>
            </Button.Group>
          </Popover.Body>
        </Popover.Content>
      </Popover>
    </Box>
  )
}

export default OptionsModal