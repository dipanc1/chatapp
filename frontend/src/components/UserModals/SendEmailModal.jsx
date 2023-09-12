import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser';
import { emailjsServiceId, emailjsTemplateId, emailjsUserId } from '../../utils';

const SendEmailModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const form = useRef();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStateChange = (setState) => (event) => {
    setState(event.target.value);
  };


  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    emailjs.sendForm(emailjsServiceId, emailjsTemplateId, form.current, emailjsUserId)
      .then((result) => {
        setFirstName('');
        setEmail('');
        setMessage('');
        toast({
          title: 'Email sent successfully!',
          description: 'We will get back to you as soon as possible.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
        onClose();
      }, (error) => {
        setFirstName('');
        setEmail('');
        setMessage('');
        toast({
          title: 'Email failed to send!',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
      });
  };

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
          <form ref={form} onSubmit={sendEmail}>
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>First name</FormLabel>
                <Input required value={firstName} onChange={handleStateChange(setFirstName)} focusBorderColor='#9F85F7' placeholder='First name' type='text' name='firstName' />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <Input required value={email} onChange={handleStateChange(setEmail)} focusBorderColor='#9F85F7' placeholder='Email' type='email' name='email' />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Message</FormLabel>
                <Textarea required value={message} onChange={handleStateChange(setMessage)} focusBorderColor='#9F85F7' placeholder='Message' maxLength={500} maxHeight={200} type='text' name='message' />
              </FormControl>

            </ModalBody>

            <ModalFooter>
              <Button
                isLoading={isSubmitting}
                isLoadingText='Sending...'
                isDisabled={isSubmitting}
                type='submit' bg={'buttonPrimaryColor'}
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
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SendEmailModal