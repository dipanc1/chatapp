import React from 'react'

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
  useToast,
} from '@chakra-ui/react'
import { FiPlus, FiSend } from 'react-icons/fi'
import { AppContext } from '../../context/AppContext';

const DocumentAttachmentModal = ({
  isOpenDocumentAttachment,
  onCloseDocumentAttachment,
  selectedFile,
  setSelectedFile,
  uploadFileAndSend,
  loadingWhileSendingFile
}) => {
  const fileInputRef = React.createRef();
  const { getCloudinarySignature } = React.useContext(AppContext);
  const toast = useToast();

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    // if file size is greater than 10MB
    if (file.size > 10000000) {
      toast({
        title: 'Error',
        description: 'File size should be less than 10MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return;
    }

    if (file) {
      getCloudinarySignature();
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
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
          <ModalHeader>Send Any File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex py='50px' flexDirection='column' alignItems='center' gap='10px' border='1px dashed grey' justifyContent='center'>
              {
                selectedFile !== null && selectedFile.name
              }
              {
                uploadImgBtn
              }
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              bg='buttonPrimaryColor' onClick={uploadFileAndSend} isDisabled={selectedFile === null || loadingWhileSendingFile}>
              <FiSend color="#fff" />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DocumentAttachmentModal