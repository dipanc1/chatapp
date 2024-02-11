import { ViewIcon } from '@chakra-ui/icons';
import {
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Image,
    Text,
    Avatar,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const ProfileModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { userInfo } = useContext(AppContext);

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    d={{ base: 'flex' }}
                    icon={<ViewIcon />}
                    onClick={onOpen}
                />
            )}
            <Modal
                size={['xs', 'md', 'md', 'md']}
                isCentered
                onClose={onClose}
                isOpen={isOpen}
                motionPreset='slideInBottom'
            >
                <ModalOverlay />
                <ModalContent
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    borderRadius={'lg'}
                    border={'1px solid #eaeaea'}
                    boxShadow={'lg'}
                >
                    <ModalHeader
                        fontSize='30px'
                        d='flex'
                        justifyContent='center'
                    >
                        {userInfo?.username}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        flexDirection={'column'}
                    >
                        {userInfo?.pic ? (
                            <Image
                                borderRadius='full'
                                boxSize='250px'
                                objectFit='cover'
                                src={userInfo?.pic}
                                alt={userInfo?.name}
                            />
                        ) : (
                            <Avatar
                                size='full'
                                name={userInfo?.name}
                                src={''}
                            />
                        )}
                        <Text fontSize={{ md: '20px' }} mt={4}>
                            Phone Number: +{userInfo?.number}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <NavLink
                            className='btn btn-primary btn-sm'
                            to='/settings'
                            color={'white'}
                            backgroundColor={'buttonPrimaryColor'}
                            mr={3}
                        >
                            Edit Profile
                        </NavLink>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfileModal;
