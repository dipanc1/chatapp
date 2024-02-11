import React from 'react';
import {
    Box,
    Button,
    HStack,
    Input,
    InputGroup,
    InputLeftAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
} from '@chakra-ui/react';
import UserListItem from '../UserItems/UserListItem';

const AddMembersModal = ({
    isAddOpen,
    onAddClose,
    handleSearch,
    handleAddUser,
    loading,
    search,
    searchResults,
    fullScreen,
    chatIdValue,
}) => {
    const [hasCopied, setHasCopied] = React.useState(false);
    React.useEffect(() => {
        setHasCopied(false);
    }, [chatIdValue]);

    const copyLink = () => {
        setHasCopied(true);
        navigator.clipboard.writeText(chatIdValue);
    };

    return (
        <Modal
            size={['xs', 'xs', 'xl', 'lg']}
            isOpen={isAddOpen}
            onClose={onAddClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Member</ModalHeader>
                <ModalCloseButton />
                <ModalBody maxHeight={'lg'} overflow={'hidden'}>
                    <HStack mb={2}>
                        <InputGroup>
                            <InputLeftAddon children='Invite Link' />
                            <Input
                                placeholder={'Copy Link'}
                                value={chatIdValue}
                                disabled
                                mr={2}
                                focusBorderColor='#9F85F7'
                            />
                            <Button onClick={copyLink}>
                                {hasCopied ? 'Copied!' : 'Copy'}
                            </Button>
                        </InputGroup>
                    </HStack>
                    <Input
                        value={search}
                        placeholder='Search Member'
                        onChange={handleSearch}
                        focusBorderColor='#9F85F7'
                    />
                    {loading ? (
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            height={fullScreen ? '48' : '8'}
                        >
                            <Spinner
                                thickness='4px'
                                speed='0.6s'
                                emptyColor='gray.200'
                                color='buttonPrimaryColor'
                                size='xl'
                            />
                        </Box>
                    ) : (
                        <Box
                            height={fullScreen ? '48' : '8'}
                            overflowY={'scroll'}
                        >
                            {search.length > 0 ? (
                                searchResults?.map((user) => (
                                    <Box
                                        my={'2'}
                                        _hover={{
                                            background: '#b5cbfe',
                                            color: 'white',
                                        }}
                                        bg={'#E8E8E8'}
                                        p={2}
                                        cursor={'pointer'}
                                        mx={'2rem'}
                                        borderRadius='lg'
                                        key={user._id}
                                        onClick={() => handleAddUser(user._id)}
                                    >
                                        <UserListItem user={user} />
                                    </Box>
                                ))
                            ) : (
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    height={'100%'}
                                >
                                    <Text
                                        fontSize={'x-large'}
                                        fontWeight={'bold'}
                                        color={'#9F85F7'}
                                    >
                                        Search for a user
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button
                        backgroundColor={'buttonPrimaryColor'}
                        color={'white'}
                        mr={3}
                        onClick={onAddClose}
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddMembersModal;
