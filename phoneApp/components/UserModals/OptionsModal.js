import { Box, Button, Icon, IconButton, Popover, Text } from 'native-base';
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const OptionsModal = ({ group }) => {
  return (
    <Box alignItems="center">
      <Popover trigger={triggerProps => {
        return <IconButton {...triggerProps} icon={<MaterialIcons name="more-vert" size={40} />} />
      }}>
        <Popover.Content>
          <Popover.Body>
            <Button.Group space={1} display={'flex'} flexDirection={'column'}>
              {
                group ?
                  <>
                    <Button leftIcon={<Icon size={'lg'} as={<MaterialIcons name="group-add" size={40} />} />} colorScheme="coolGray" variant="ghost">
                      <Text fontSize={'md'}>Add Members</Text>
                    </Button>
                    <Button leftIcon={<Icon size={'lg'} as={<MaterialIcons name="event" size={40} />} />} colorScheme="coolGray" variant="ghost">
                      <Text fontSize={'md'}>Create Event</Text>
                    </Button>
                    <Button leftIcon={<Icon size={'lg'} as={<MaterialIcons name="settings" size={40} />} />} colorScheme="coolGray" variant="ghost">
                      <Text fontSize={'md'}>Settings</Text>
                    </Button>
                    <Button leftIcon={<Icon size={'lg'} color={'red.400'} as={<MaterialIcons name="delete" size={40} />} />} variant={'ghost'}>
                      <Text color={'red.400'} fontSize={'md'}>Delete</Text>
                    </Button>
                  </>
                  :
                  <>
                    <Button leftIcon={<Icon size={'lg'} as={<MaterialIcons name="edit" size={40} />} />} colorScheme="coolGray" variant="ghost">
                      <Text fontSize={'md'}>Edit</Text>
                    </Button>
                    <Button leftIcon={<Icon size={'lg'} color={'red.400'} as={<MaterialIcons name="delete" size={40} />} />} variant={'ghost'}>
                      <Text color={'red.400'} fontSize={'md'}>Delete</Text>
                    </Button>
                  </>
              }


            </Button.Group>
          </Popover.Body>
        </Popover.Content>
      </Popover>
    </Box>
  )
}

export default OptionsModal