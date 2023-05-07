import React, { useContext, useState } from 'react'
import {
	Box,
	Flex,
	Heading,
	Input,
	FormControl,
	FormLabel,
	Textarea,
	Checkbox,
	Button,
	Image,
	IconButton
} from '@chakra-ui/react'

import Static from '../components/common/Static'
import axios from 'axios';
import { backend_url, pictureUpload } from '../baseApi';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';

const CreateEvent = () => {
	const { selectedChat, userInfo } = useContext(AppContext);
	const user = JSON.parse(localStorage.getItem("user"));
	const [name, setEventName] = useState("");
	const [description, setDescription] = useState("");
	const [date, setDate] = useState(new Date());
	const [time, setTime] = useState("");
	const [selectedImage, setSelectedImage] = React.useState(null);

	const fileInputRef = React.createRef();

	let navigate = useNavigate();

	const imageChange = (e) => {
		if (e.target.files && e.target.files.length > 0 && (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png')) {
			setSelectedImage(e.target.files[0]);
		} else {
			alert('Please select a valid image file');
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (selectedChat.groupAdmin._id !== userInfo._id) return alert("You are not the admin of this group");

		if (name === "" || description === "" || date === "" || time === "") return alert("Feilds cannot be empty");

		const config = {
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		};

		if (selectedImage === null) {
			await axios.put(`${backend_url}/conversation/event/${selectedChat._id}`, {
				name,
				description,
				date,
				time
			}, config)
				.then((res) => {
					// console.log(selectedChat)
					navigate(`/video-chat`);
					alert(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			const formData = new FormData();
			formData.append('api_key', '835688546376544')
			formData.append('file', selectedImage);
			formData.append('upload_preset', 'chat-app');

			await axios.post(pictureUpload, formData)
				.then(async (res) => {
					await axios.put(`${backend_url}/conversation/event/${selectedChat._id}`, {
						name,
						description,
						date,
						time,
						thumbnail: res.data.url
					}, config)
						.then((res) => {
							navigate(`/video-chat`);
							alert(res.data);
						})
						.catch((err) => {
							console.log(err);
						});
				})
				.catch((err) => {
					console.log(err);
				});
		}

	}

	return (
		<>
			<Static>
				<Heading as='h1' size='lg' textAlign='center' fontWeight='500'>
					Create Event
				</Heading>
				<Box maxW='450px' m='auto' pt='50px' className='form-wrapper'>
					<form onSubmit={handleSubmit}>
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
							<FormControl className={"filled"}>
								<FormLabel>Upload Thumbnail</FormLabel>
								<Image
									width={'100px'}
									height={'100px'}
									src={selectedImage ? URL.createObjectURL(selectedImage) : ''}
									alt={''}
								/>
								<IconButton
									aria-label="upload picture"
									icon={<FiUpload />}
									onClick={() => fileInputRef.current.click()}
									size="xs"
									colorScheme="teal"
									variant="outline"
									mt={'3'}
								/>
								<input
									type="file"
									ref={fileInputRef}
									onChange={imageChange}
									style={{ display: 'none' }}
								/>
							</FormControl>
						</Flex>
						<Box>
							<Checkbox position='relative!important' defaultChecked pointerEvents='all!important' left='0!important' top='0!important' padding='0!important'>
								Send Notification
							</Checkbox>
						</Box>
						<Flex justifyContent='end' mt='40px'>
							<button type='submit' className='btn btn-primary'>Create</button>
						</Flex>
					</form>
				</Box>
			</Static>
		</>
	)
}

export default CreateEvent