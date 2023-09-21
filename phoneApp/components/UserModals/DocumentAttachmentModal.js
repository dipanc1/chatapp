import { Box, Center, IconButton, Image, Modal, Text } from 'native-base';
import React from 'react'
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PhoneAppContext } from '../../context/PhoneAppContext';
import { FILE, IMAGE } from '../../constants';


const DocumentAttachmentModal = ({ showModal, setShowModal, selectedImage, setSelectedImage, selectedFile, setSelectedFile, fileUploadAndSend, type, loading }) => {
    const { getCloudinarySignature } = React.useContext(PhoneAppContext);
    const [source, setSource] = React.useState(null);

    const pickImage = async () => {
        const options = {
            mediaType: 'photo',
        };
        await getCloudinarySignature();
        await launchImageLibrary(options, (response) => {
            if (!response.didCancel) {
                const res = response.assets.map((item) => item);
                if (res.error) {
                    console.log('ImagePicker Error: ', res.error);
                } else {
                    if (res[0].fileSize > 10000000) {
                        alert('Image size too large. Please select an image less than 10MB');
                        return;
                    }
                    const uri = res[0].uri;
                    const type = res[0].type;
                    const name = res[0].fileName;
                    const src = {
                        uri,
                        type,
                        name,
                    }
                    setSource(src);
                    setSelectedImage(src.uri);
                }
            }
        });
    }

    const filePicker = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            if (res[0].size > 10000000) {
                alert('File size too large. Please select a file less than 10MB');
                return;
            }
            await getCloudinarySignature();
            const uri = res[0].uri;
            const type = res[0].type;
            const name = res[0].name;
            const src = {
                uri,
                type,
                name,
            }
            setSource(src);
            setSelectedFile(src.name);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled document picker');
            } else {
                console.log('DocumentPicker Error: ', err);
            }
        }
    }

    return (
        <Center>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>
                        <Text>
                            Send {type === IMAGE ? IMAGE : FILE}
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        {

                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                {
                                    (selectedImage && type === IMAGE) ? <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} alt={'selected image'} /> :
                                        <Text color={'primary.900'}>{selectedFile !== null ? selectedFile : 'No file selected'}</Text>

                                }
                            </Box>
                        }
                        <IconButton onPress={() => {
                            type === IMAGE ? pickImage() : filePicker();
                        }} variant={'ghost'} _icon={{
                            as: MaterialIcons, name: 'add', color: 'primary.300'
                        }} size={'md'} />
                    </Modal.Body>
                    <Modal.Footer>
                        <IconButton bg={'primary.300'} icon={<MaterialIcons name="send" size={24} color={'#fff'} />} isDisabled={(selectedImage === null && selectedFile === null) || loading} onPress={() => fileUploadAndSend(source)} />
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Center>
    )
}

export default DocumentAttachmentModal