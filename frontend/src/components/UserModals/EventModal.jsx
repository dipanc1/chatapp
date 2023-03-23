import { Box, Checkbox, Flex, FormControl, FormLabel, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, Textarea } from '@chakra-ui/react'
import React from 'react'
import { FiUpload } from 'react-icons/fi'

const EventModal = ({ type, createEventLoading, isOpenCreateEvent, onCloseCreateEvent, name, setEventName, description, setDescription, date, setDate, time, setTime, selectedImage, imageChange, handleSubmit, fileInputRef, imageUrl }) => {

    return (
        <Modal isOpen={isOpenCreateEvent} onClose={onCloseCreateEvent}>
            <ModalOverlay />
            <ModalContent borderRadius='10px' overflow='hidden' position='relative'>
                {
                    createEventLoading && (
                        <Box background='rgba(234,228,255,0.5)' zIndex='2' h='100%' display='flex' alignItems='center' justifyContent='center' w='100%' position='absolute' top='0' left='0'>
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='buttonPrimaryColor'
                                size='xl'
                            />
                        </Box>
                    )
                }
                <form onSubmit={handleSubmit}>

                    <ModalHeader>{type} Event</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className='form-wrapper'>
                        <FormControl className={"filled"}>
                            <Input type='text' value={name} onChange={(e) => setEventName(e.target.value)} />
                            <FormLabel>Event Name</FormLabel>
                        </FormControl>
                        <FormControl className={"filled"}>
                            <Textarea type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
                            <FormLabel>Description</FormLabel>
                        </FormControl>
                        <Flex gap='6'>
                            <FormControl className={"filled"}>
                                <Input type='date' value={date} onChange={(e) => setDate(e.target.value)} />
                            </FormControl>
                            <FormControl className={"filled"}>
                                <Input type='time' value={time} onChange={
                                    (e) => setTime(e.target.value)
                                } />
                            </FormControl>
                        </Flex>
                        <Box>
                            <FormControl className={"filled"}>
                                <Text>Upload Thumbnail</Text>
                                {
                                    selectedImage ? (
                                        <Image
                                            width={'100px'}
                                            height={'100px'}
                                            src={selectedImage ? URL.createObjectURL(selectedImage) : ''}
                                            alt={''}
                                            mt='3'
                                        />
                                    ) : (
                                       imageUrl && <Image
                                            width={'100px'}
                                            height={'100px'}
                                            src={imageUrl}
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
                                    ref={fileInputRef}
                                    onChange={imageChange}
                                    style={{ display: 'none' }}
                                />
                            </FormControl>
                        </Box>
                        <Box>
                            <Checkbox position='relative!important' defaultChecked pointerEvents='all!important' left='0!important' top='0!important' padding='0!important'>
                                Send Notification
                            </Checkbox>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <button type='submit' className='btn btn-primary'>{type}</button>
                    </ModalFooter>

                </form>
            </ModalContent>
        </Modal>
    )
}

export default EventModal