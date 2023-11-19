import { FormControl, FormLabel, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import React from 'react'
import { FiUpload } from 'react-icons/fi'

const PostPictureModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = React.useRef(null)
    const fileInputRef = React.createRef();
    const toast = useToast();

    const [selectedImage, setSelectedImage] = React.useState(null);

    const imageChange = async (e) => {
        // await getCloudinarySignature();
        if (e.target.files && e.target.files.length > 0 && (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png')) {
            setSelectedImage(e.target.files[0]);
        } else {
            toast({
                title: "Error",
                description: "Please select a valid image",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    }


    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input required focusBorderColor='#9F85F7' ref={initialRef} placeholder='Title' />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea required focusBorderColor='#9F85F7' placeholder='Description' />
                        </FormControl>

                        <FormControl mt={4}>
                            <Text>Image</Text>
                            {
                                selectedImage && (
                                    <Image
                                        width={'100px'}
                                        height={'100px'}
                                        src={selectedImage ? URL.createObjectURL(selectedImage) : ''}
                                        alt={''}
                                        mt='3'
                                    />
                                )

                            }
                            <IconButton
                                aria-label="upload picture"
                                icon={<FiUpload />}
                                onClick={() => fileInputRef.current.click()}
                                size="xxl"
                                colorScheme="teal"
                                variant="outline"
                                h='50px'
                                w='50px'
                                mt={'3'}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                alt="Select an image"
                                ref={fileInputRef}
                                onChange={imageChange}
                                style={{ display: 'none' }}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <button type='submit' className='btn btn-primary'>
                            Create
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default PostPictureModal