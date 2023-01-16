import React, {useState} from 'react'
import { 
	Box,
	Flex,
	Heading,
	Input,
	FormControl,
  	FormLabel,
	Textarea,
	Checkbox,
	Button
} from '@chakra-ui/react'

import Static from '../components/common/Static'

const CreateEvent = () => {
	const [eventName, setEventName] = useState("")
	const [description, setDescription] = useState("")

  return (
    <>
			<Static>
				<Heading as='h1' size='lg' textAlign='center' fontWeight='500'>
					Create Event
				</Heading>
				<Box maxW='450px' m='auto' pt='50px' className='form-wrapper'>
					<FormControl className={!eventName == "" ? "filled" : ""}>
						<Input type='text' value={eventName} onChange={(e) => setEventName(e.target.value)} />
						<FormLabel>Event Name</FormLabel>
					</FormControl>
					<FormControl className={!description == "" ? "filled" : ""}>
						<Textarea type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
						<FormLabel>Description</FormLabel>
					</FormControl>
					<Flex gap='6'>
						<FormControl className={!eventName == "" ? "filled" : ""}>
							<Input type='date' value={eventName} onChange={(e) => setEventName(e.target.value)} />
						</FormControl>
						<FormControl className={!eventName == "" ? "filled" : ""}>
							<Input type='time' value="00:00:AM" />
						</FormControl>
					</Flex>
					<Box>
					<Checkbox position='relative!important' defaultChecked pointerEvents='all!important' left='0!important' top='0!important' padding='0!important'>
						Send Notification
					</Checkbox>
					</Box>
					<Flex justifyContent='end' mt='40px'>
						<button className='btn btn-primary'>Create</button>
					</Flex>
				</Box>
			</Static>
    </>
  )
}

export default CreateEvent