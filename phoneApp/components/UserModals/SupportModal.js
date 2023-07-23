import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react'
import { Button, FormControl, Icon, Input, Modal, TextArea } from 'native-base';
import { emailjsServiceId, emailjsTemplateId, emailjsUserId } from '../../production';
import emailjs from '@emailjs/browser';

const SupportModal = () => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [firstName, setFirstName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const sendEmail = (e) => {
        setIsSubmitting(true);
        emailjs.sendForm(emailjsServiceId, emailjsTemplateId, {
            firstName,
            email,
            message
        }, emailjsUserId)
            .then((result) => {
                setFirstName('');
                setEmail('');
                setMessage('');
                alert('Email sent successfully!');
                setIsSubmitting(false);
                setModalVisible(false);
            }, (error) => {
                setFirstName('');
                setEmail('');
                setMessage('');
                alert('An error occurred, Please try again');
                setIsSubmitting(false);
            });
    };

    return (
        <>
            <Button bg={'primary.300'} color={'white'} _text={{ fontWeight: 'bold' }} leftIcon={<Icon as={MaterialIcons} name="add-circle-outline" size={5} />} onPress={() => setModalVisible(true)}>
                Raise a Ticket
            </Button>
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>📧 Send a Support Email</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <FormControl.Label>First name</FormControl.Label>
                            <Input isRequired placeholder="First name" value={firstName} onChangeText={(text) => setFirstName(text)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Email</FormControl.Label>
                            <Input isRequired placeholder="Email" value={email} onChangeText={(text) => setEmail(text)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Message</FormControl.Label>
                            <TextArea isRequired placeholder="Message" value={message} onChangeText={(text) => setMessage(text)} h={20} />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setModalVisible(false);
                            }}>
                                ❌ Cancel
                            </Button>
                            <Button isLoading={isSubmitting} isLoadingText='Sending...' isDisabled={isSubmitting} bgColor="primary.300" onPress={sendEmail}>
                                Send ➡️
                            </Button>
                        </Button.Group>
                    </Modal.Footer>

                </Modal.Content>
            </Modal>
        </>
    )
}

export default SupportModal