import React, { useState } from 'react'

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
    Image
  } from '@chakra-ui/react'
import { FiPlus, FiSend } from 'react-icons/fi'

const ImageAttachmentModal = ({
    isOpenImageAttachment,
    onCloseImageAttachment
}) => {
  const fileInputRef = React.createRef();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
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
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
    </>
  )

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
            <ModalHeader>Attach Image</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {
                selectedImage ? (
                  <Box h='300px'>
                    <Image h='100%' w='100%' objectFit='cover' mx='auto' src={selectedImage} alt="Selected" />
                  </Box>
                ) : (
                  <Flex py='50px' border='1px dashed grey' justifyContent='center'>
                    {
                      uploadImgBtn
                    }
                  </Flex>
                )
              }
              {
                selectedImage && (
                  <Flex pt='20px' justifyContent='center'>
                    {
                      uploadImgBtn
                    }
                  </Flex>
                )
              }
            </ModalBody>
            <ModalFooter>
              <Button
                bg='buttonPrimaryColor'>                
                <FiSend color="#fff" />
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default ImageAttachmentModal