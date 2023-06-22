import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const SendEmailModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()


  return (
    <>
      <p onClick={onOpen}>{children}</p>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>📧 Send a Support Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>First name</FormLabel>
              <Input focusBorderColor='#9F85F7' placeholder='First name' />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input focusBorderColor='#9F85F7' placeholder='Email' />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Message</FormLabel>
              <Textarea focusBorderColor='#9F85F7' placeholder='Message' maxLength={500} maxHeight={200} />
            </FormControl>

          </ModalBody>

          <ModalFooter>
            <Button bg={'buttonPrimaryColor'}
              color={'white'}
              _hover={{
                bg: 'backgroundColor',
                color: 'text'
              }} mr={3}>Send ➡️
            </Button>
            <Button onClick={onClose}>
              <span role='img' aria-label='cross emoji'>❌</span>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SendEmailModal