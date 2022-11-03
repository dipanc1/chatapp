import {
    ViewIcon
} from '@chakra-ui/icons'
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
    Button,
    Image,
    Text,
    Avatar
} from '@chakra-ui/react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
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
                        fontSize="30px"
                        d="flex"
                        justifyContent="center"
                    >
                        {user.username}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        flexDirection={'column'}
                    >
                        {user.pic ? (
                            <Image
                                borderRadius="full"
                                boxSize="250px"
                                src={user.pic}
                                alt={user.name}
                            />
                        ) : (
                            <Avatar
                                size='full'
                                name={user.name}
                                src={''}
                            />
                        )}
                        <Text
                            fontSize={{ md: "20px" }}
                            my={4}
                        >
                            Phone Number: +{user.number}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button color={'white'} backgroundColor={'buttonPrimaryColor'} mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default ProfileModal