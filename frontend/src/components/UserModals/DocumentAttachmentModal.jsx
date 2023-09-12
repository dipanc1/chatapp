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

const DocumentAttachmentModal = ({
    isOpenDocumentAttachment,
    onCloseDocumentAttachment
}) => {
  const fileInputRef = React.createRef();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file.name);
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
          onClose={onCloseDocumentAttachment}
          isOpen={isOpenDocumentAttachment}
          motionPreset='slideInBottom'
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Attach Document</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex py='50px' flexDirection='column' alignItems='center' gap='10px' border='1px dashed grey' justifyContent='center'>
                {
                  selectedFile
                } 
                {
                  uploadImgBtn
                }
              </Flex>
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

export default DocumentAttachmentModal