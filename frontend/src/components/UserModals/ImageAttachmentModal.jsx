import React from 'react';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Flex,
    Box,
    Image,
    useToast,
} from '@chakra-ui/react';
import { FiPlus, FiSend } from 'react-icons/fi';
import { AppContext } from '../../context/AppContext';

const ImageAttachmentModal = ({
    isOpenImageAttachment,
    onCloseImageAttachment,
    selectedImage,
    setSelectedImage,
    uploadImageAndSend,
    loadingWhileSendingImage,
}) => {
    const fileInputRef = React.createRef();

    const { getCloudinarySignature } = React.useContext(AppContext);

    const toast = useToast();

    const handleImageChange = (e) => {
        if (
            e.target.files[0].type === 'image/jpeg' ||
            e.target.files[0].type === 'image/png'
        ) {
            if (e.target.files[0].size > 10000000) {
                toast({
                    title: 'Error',
                    description: 'Image size should be less than 10MB',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
            getCloudinarySignature();
            setSelectedImage(e.target.files[0]);
        } else {
            toast({
                title: 'Error',
                description: 'Only jpeg and png images are allowed',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const uploadImgBtn = (
        <>
            <Button
                onClick={() => fileInputRef.current.click()}
                borderRadius='100%'
            >
                <FiPlus />
            </Button>
            <input
                type='file'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
            />
        </>
    );

    return (
        <>
            <Modal
                isCentered
                onClose={onCloseImageAttachment}
                isOpen={isOpenImageAttachment}
                motionPreset='slideInBottom'
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Send Image</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedImage ? (
                            <Box h='300px'>
                                <Image
                                    h='100%'
                                    w='100%'
                                    objectFit='cover'
                                    mx='auto'
                                    src={URL.createObjectURL(selectedImage)}
                                    alt='image'
                                />
                            </Box>
                        ) : (
                            <Flex
                                py='50px'
                                border='1px dashed grey'
                                justifyContent='center'
                            >
                                {uploadImgBtn}
                            </Flex>
                        )}
                        {selectedImage && (
                            <Flex pt='20px' justifyContent='center'>
                                {uploadImgBtn}
                            </Flex>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            bg='buttonPrimaryColor'
                            onClick={uploadImageAndSend}
                            isDisabled={
                                selectedImage === null ||
                                loadingWhileSendingImage
                            }
                        >
                            <FiSend color='#fff' />
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ImageAttachmentModal;
