import React, { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom";

import Static from '../components/common/Static'
import {
    Box,
    Grid,
    GridItem,
    Text,
    Heading,
    Button,
    Container,
    Flex,
    Image,
    Input,
    FormControl,
    FormLabel,
    Radio,
    RadioGroup,
    Switch,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Td,
    Th,
    Accordion,
    AccordionIcon,
    AccordionItem,
    AccordionButton,
    AccordionPanel
} from '@chakra-ui/react';
import "./Settings.css"
import axios from 'axios';
import { backend_url } from '../baseApi';

const Settings = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [activeTab, setActiveTab] = useState(1);

    const [username, setUsername] = useState("");
    const [number, setNumber] = useState("");
    const [pic, setPic] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const currentUserDetails = async () => {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`${backend_url}/users/user-info`, config);
                // console.log(data);
                setUsername(data.username);
                setNumber(data.number);
                setPic(data.pic);
            } catch (error) {
                console.log(error)
            }
        }

        currentUserDetails();
    }, [user.token])


    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (currentPassword === newPassword) {
            alert("New password cannot be same as old password");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${backend_url}/users/change-password`, {
                oldPassword: currentPassword,
                newPassword,
                confirmPassword
            },
                config
            );

            console.log(data);
            alert("Password changed successfully");
            setConfirmPassword("");
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            console.log(error);
            setConfirmPassword("");
            setCurrentPassword("");
            setNewPassword("");
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${backend_url}/users/update-user-info`, {
                username,
                pic,
            },
                config
            );

            console.log(data);
            alert("Profile updated successfully");
            setUsername(data.username);
            setPic(data.pic);
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <>
            <Static>
                <Heading pb='30px' as='h1' size='lg' fontWeight='500'>Settings</Heading>
                <ul className="tab-nav">
                    <li onClick={() => setActiveTab(1)} className={activeTab === 1 ? "active" : ""}>
                        My Details
                    </li>
                    <li onClick={() => setActiveTab(2)} className={activeTab === 2 ? "active" : ""}>
                        Themes
                    </li>
                    <li onClick={() => setActiveTab(3)} className={activeTab === 3 ? "active" : ""}>
                        Password
                    </li>
                    <li onClick={() => setActiveTab(4)} className={activeTab === 4 ? "active" : ""}>
                        Notification
                    </li>
                    <li onClick={() => setActiveTab(5)} className={activeTab === 5 ? "active" : ""}>
                        Plans
                    </li>
                    <li onClick={() => setActiveTab(6)} className={activeTab === 6 ? "active" : ""}>
                        Billing
                    </li>
                    <li onClick={() => setActiveTab(7)} className={activeTab === 7 ? "active" : ""}>
                        Help
                    </li>
                </ul>
                <div className="tab-content">
                    <div className={"tab-content-item " + (activeTab === 1 ? "current" : "")}>
                        <form onSubmit={handleUpdateProfile}>
                            <Grid mt='70px' templateColumns='repeat(2, 1fr)' gap='5rem' rowGap='3rem' className='form-wrapper form-details'>
                                <GridItem w='100%'>
                                    <FormControl className="filled">
                                        <Input pt='25px' pb='20px' type='text' onChange={e => setUsername(e.target.value)} value={username} />
                                        <FormLabel>USERNAME</FormLabel>
                                    </FormControl>
                                </GridItem>
                                <GridItem w='100%'>
                                    <FormControl className="filled">
                                        <Input pt='25px' pb='20px' type='text' disabled value={number} />
                                        <FormLabel>NUMBER</FormLabel>
                                    </FormControl>
                                </GridItem>
                            </Grid>
                            <Grid mt='30px' templateColumns='repeat(2, 1fr)' gap='5rem' rowGap='3rem' className='form-wrapper form-details'>
                                <GridItem w='100%'>
                                    <FormControl className="filled">
                                        <Image src={pic} width="40" height="40" borderRadius="full" />
                                        <FormLabel>PROFILE IMAGE</FormLabel>
                                    </FormControl>
                                </GridItem>
                            </Grid>
                            <Flex pt='50px' alignItems='center' justifyContent='end'>
                                <Button type='submit' bg="buttonPrimaryColor" color={"white"}>
                                    <Image h='18px' pe='15px' src='https://ik.imagekit.io/sahildhingra/edit.png' />
                                    <Text>Edit Profile</Text>
                                </Button>
                            </Flex>
                        </form>
                    </div>
                    <div className={"tab-themes tab-content-item " + (activeTab === 2 ? "current" : "")}>
                        <RadioGroup>
                            <Grid ps='10px' mt='50px' templateColumns='repeat(3, 1fr)' gap='2rem' rowGap='3rem'>
                                <Radio value='1' alignItems='start' checked='checked'>
                                    <Box display='block'>
                                        <Text pb='15px' fontWeight='700'>
                                            Default
                                        </Text>
                                        <img src="https://ik.imagekit.io/sahildhingra/theme-default.png" alt="" />
                                    </Box>
                                </Radio>
                                <Radio value='2' alignItems='start'>
                                    <Box display='block'>
                                        <Text pb='15px' fontWeight='700'>
                                            Dark
                                        </Text>
                                        <img src="https://ik.imagekit.io/sahildhingra/theme-dark.png" alt="" />
                                    </Box>
                                </Radio>
                                <Radio value='3' alignItems='start'>
                                    <Box display='block'>
                                        <Text pb='15px' fontWeight='700'>
                                            Light
                                        </Text>
                                        <img src="https://ik.imagekit.io/sahildhingra/theme-light.png" alt="" />
                                    </Box>
                                </Radio>
                            </Grid>
                            <Flex pt='70px' alignItems='center' justifyContent='end'>
                                <NavLink className='btn btn-primary' to="#">
                                    <Text>Save Theme</Text>
                                </NavLink>
                            </Flex>
                        </RadioGroup>
                    </div>
                    <div className={"tab-content-item " + (activeTab === 3 ? "current" : "")}>
                        <form onSubmit={handleChangePassword}>
                            <Text mt='40px' fontSize='18px' color='#6C4545' fontWeight='600'>
                                Please enter your current password to change your password
                            </Text>
                            <Grid mt='20px' templateColumns='repeat(2, 1fr)' gap='5rem' rowGap='3rem' className='form-wrapper'>
                                <GridItem w='100%'>
                                    <FormControl className={"filled"}>
                                        <Input autoComplete='current-password' type='password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                        <FormLabel>Current Password</FormLabel>
                                    </FormControl>
                                </GridItem>
                            </Grid>
                            <Box h='1px' background='#EAE4FF' mt='20px' mb='50px'></Box>
                            <Grid mt='30px' templateColumns='repeat(2, 1fr)' gap='4.5rem' rowGap='3rem' className='form-wrapper'>
                                <GridItem w='100%'>
                                    <FormControl className={"filled"}>
                                        <Input autoComplete='new-password' type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                        <FormLabel>New Password</FormLabel>
                                    </FormControl>
                                </GridItem>
                                <GridItem w='100%'>
                                    <FormControl className={"filled"}>
                                        <Input autoComplete='confirm-password' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                        <FormLabel>Confirm Password</FormLabel>
                                    </FormControl>
                                </GridItem>
                            </Grid>
                            <Flex pt='40px' alignItems='center' justifyContent='end'>
                                <Button disabled={currentPassword === "" || newPassword === "" || confirmPassword === ""} type='submit'>
                                    <Text>Update Password</Text>
                                </Button>
                            </Flex>
                        </form>
                    </div>
                    <div className={"tab-content-item " + (activeTab === 4 ? "current" : "")}>
                        <Text mt='40px' fontSize='18px' color='#6C4545' fontWeight='600'>
                            Choose what kind of notifications you want to see in your app.
                        </Text>
                        <Box h='1px' background='#EAE4FF' my='30px'></Box>
                        <Grid alignItems='center' templateColumns='repeat(2, 1fr)' gap='4.5rem'>
                            <GridItem>
                                <Text color='#6C4545' fontWeight='700'>
                                    Messages
                                </Text>
                                <Text mt='10px' color='#7B7A7A' fontWeight='500'>
                                    These are notifications for the incoming messages to your inbox.
                                </Text>
                            </GridItem>
                            <GridItem>
                                <Flex pb='12px' alignItems='center'>
                                    <Switch pe='15px' defaultChecked colorScheme={'twitter'} size='md' />
                                    <Text color='#6C4545' fontWeight='700'>
                                        Push
                                    </Text>
                                </Flex>
                                <Flex alignItems='center'>
                                    <Switch pe='15px' colorScheme={'twitter'} size='md' />
                                    <Text color='#6C4545' fontWeight='700'>
                                        Email
                                    </Text>
                                </Flex>
                            </GridItem>
                        </Grid>
                        <Box h='1px' background='#EAE4FF' my='30px'></Box>
                        <Grid alignItems='center' templateColumns='repeat(2, 1fr)' gap='4.5rem'>
                            <GridItem>
                                <Text color='#6C4545' fontWeight='700'>
                                    Comment
                                </Text>
                                <Text mt='10px' color='#7B7A7A' fontWeight='500'>
                                    These are notifications for comments on your event and replies to your comment
                                </Text>
                            </GridItem>
                            <GridItem>
                                <Flex pb='12px' alignItems='center'>
                                    <Switch pe='15px' colorScheme={'twitter'} size='md' />
                                    <Text color='#6C4545' fontWeight='700'>
                                        Push
                                    </Text>
                                </Flex>
                                <Flex alignItems='center'>
                                    <Switch pe='15px' colorScheme={'twitter'} size='md' />
                                    <Text color='#6C4545' fontWeight='700'>
                                        Email
                                    </Text>
                                </Flex>
                            </GridItem>
                        </Grid>
                        <Box h='1px' background='#EAE4FF' my='30px'></Box>
                        <Grid alignItems='center' templateColumns='repeat(2, 1fr)' gap='4.5rem'>
                            <GridItem>
                                <Text color='#6C4545' fontWeight='700'>
                                    Tags
                                </Text>
                                <Text mt='10px' color='#7B7A7A' fontWeight='500'>
                                    These are notifications for the tags if someone mentions you in a group or comment
                                </Text>
                            </GridItem>
                            <GridItem>
                                <Flex pb='12px' alignItems='center'>
                                    <Switch pe='15px' defaultChecked colorScheme={'twitter'} size='md' />
                                    <Text color='#6C4545' fontWeight='700'>
                                        Push
                                    </Text>
                                </Flex>
                                <Flex alignItems='center'>
                                    <Switch pe='15px' colorScheme={'twitter'} size='md' />
                                    <Text color='#6C4545' fontWeight='700'>
                                        Email
                                    </Text>
                                </Flex>
                            </GridItem>
                        </Grid>
                        <Flex pt='40px' alignItems='center' justifyContent='end'>
                            <NavLink className='btn btn-primary' to="#">
                                <Text>Update</Text>
                            </NavLink>
                        </Flex>
                    </div>
                    <div className={"tab-content-item " + (activeTab === 5 ? "current" : "")}>
                        <Text mt='40px' mb='30px' fontSize='18px' color='#6C4545' fontWeight='600'>
                            Current Active Plan
                        </Text>
                        <Grid ps='10px' mt='40px' mb='60px' templateColumns='repeat(3, 1fr)' gap='2rem' rowGap='3rem'>
                            <GridItem p='20px' pb='30px' border='1px solid #EAE4FF' borderRadius='10px' textAlign='center'>
                                <Text fontSize='24px' fontWeight='700'>
                                    Basic
                                </Text>
                                <Text mt='4px' fontWeight='700' mx='auto' color='#7B7A7A'>
                                    $0/mo
                                </Text>
                                <Box mt='25px' pt='25px' borderTop='1px solid #EAE4FF' textAlign='left'>
                                    <Flex justifyContent='start'>
                                        <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                        <Text fontWeight='600' color='#7B7A7A'>
                                            2 Channels
                                        </Text>
                                    </Flex>
                                    <Flex py='15px' justifyContent='start'>
                                        <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                        <Text fontWeight='600' color='#7B7A7A'>
                                            4 Users
                                        </Text>
                                    </Flex>
                                    <Flex justifyContent='start'>
                                        <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                        <Text fontWeight='600' color='#7B7A7A'>
                                            6 On-screen Guests
                                        </Text>
                                    </Flex>
                                </Box>
                            </GridItem>
                        </Grid>
                        <Box h='1px' background='#EAE4FF' mb='30px'></Box>
                        <Text mt='40px' mb='30px' fontSize='18px' color='#6C4545' fontWeight='600'>
                            Other Available Plans
                        </Text>

                        <Grid ps='10px' mt='40px' mb='60px' templateColumns='repeat(3, 1fr)' gap='2rem' rowGap='3rem'>
                            <GridItem p='20px' pb='30px' border='1px solid #EAE4FF' borderRadius='10px' textAlign='center'>
                                <Text fontSize='24px' fontWeight='700'>
                                    Basic
                                </Text>
                                <Text mt='4px' fontWeight='700' mx='auto' color='#7B7A7A'>
                                    $0/mo
                                </Text>
                                <Box mt='25px' pt='25px' borderTop='1px solid #EAE4FF' textAlign='left'>
                                    <Flex justifyContent='start'>
                                        <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                        <Text fontWeight='600' color='#7B7A7A'>
                                            2 Channels
                                        </Text>
                                    </Flex>
                                    <Flex py='15px' justifyContent='start'>
                                        <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                        <Text fontWeight='600' color='#7B7A7A'>
                                            4 Users
                                        </Text>
                                    </Flex>
                                    <Flex justifyContent='start'>
                                        <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                        <Text fontWeight='600' color='#7B7A7A'>
                                            6 On-screen Guests
                                        </Text>
                                    </Flex>
                                </Box>
                            </GridItem>
                            <GridItem p='20px' pb='30px' border='1px solid #EAE4FF' borderRadius='10px' textAlign='center'>
                                <Text fontSize='24px' fontWeight='700'>
                                    Premium
                                </Text>
                                <Text mt='4px' fontWeight='700' mx='auto' color='#7B7A7A'>
                                    $114/mo
                                </Text>
                                <Box mt='25px' pt='25px' borderTop='1px solid #EAE4FF' textAlign='left'>
                                    <Flex justifyContent='start'>
                                        <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                        <Text fontWeight='600' color='#7B7A7A'>
                                            5 Channels
                                        </Text>
                                    </Flex>
                                    <Flex py='15px' justifyContent='start'>
                                        <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                        <Text fontWeight='600' color='#7B7A7A'>
                                            4 Users
                                        </Text>
                                    </Flex>
                                    <Flex justifyContent='start'>
                                        <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                        <Text fontWeight='600' color='#7B7A7A'>
                                            10 On-screen Guests
                                        </Text>
                                    </Flex>
                                </Box>
                            </GridItem>
                            <GridItem p='20px' pb='30px' border='1px solid #EAE4FF' borderRadius='10px' textAlign='center'>
                                <Text fontSize='24px' fontWeight='700'>
                                    Elite
                                </Text>
                                <Text mt='4px' fontWeight='700' mx='auto' color='#7B7A7A'>
                                    $127/mo
                                </Text>
                                <Box mt='25px' pt='25px' borderTop='1px solid #EAE4FF' textAlign='left'>
                                    <Flex justifyContent='start'>
                                        <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                        <Text fontWeight='600' color='#7B7A7A'>
                                            8 Channels
                                        </Text>
                                    </Flex>
                                    <Flex py='15px' justifyContent='start'>
                                        <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                        <Text fontWeight='600' color='#7B7A7A'>
                                            6 Users
                                        </Text>
                                    </Flex>
                                    <Flex justifyContent='start'>
                                        <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                        <Text fontWeight='600' color='#7B7A7A'>
                                            12 On-screen Guests
                                        </Text>
                                    </Flex>
                                </Box>
                            </GridItem>
                        </Grid>
                        <Flex alignItems='center' justifyContent='end'>
                            <NavLink className='btn btn-primary' to="#">
                                <Text>Change Plan</Text>
                            </NavLink>
                        </Flex>
                        <Flex pt='20px' alignItems='center' justifyContent='end'>
                            <Text fontWeight='500'>
                                You will be redirected to the payment screen
                            </Text>
                        </Flex>
                    </div>
                    <div className={"tab-content-item " + (activeTab === 6 ? "current" : "")}>
                        <Flex pt='40px' alignItems='center' justifyContent='space-between'>
                            <Text fontSize='18px' color='#6C4545' fontWeight='600'>
                                Payment Methods
                            </Text>
                            <NavLink className='btn btn-primary' to="#">
                                <Flex alignItems='center'>
                                    <Image h='18px' pe='15px' src='https://ik.imagekit.io/sahildhingra/add.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673025917620' />
                                    <Text>Add New</Text>
                                </Flex>
                            </NavLink>
                        </Flex>
                        <Box h='1px' background='#EAE4FF' my='30px'></Box>
                        <Text mt='40px' mb='30px' fontSize='18px' color='#6C4545' fontWeight='600'>
                            Invoices
                        </Text>
                        <TableContainer className='table table-striped'>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>#</Th>
                                        <Th>Plan Type</Th>
                                        <Th>Amount</Th>
                                        <Th>Purchased On</Th>
                                        <Th>Expired On</Th>
                                        <Th>Status</Th>
                                        <Th>Action</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Th>1</Th>
                                        <Td>Elite</Td>
                                        <Td>$127</Td>
                                        <Td>Nov 27, 2022</Td>
                                        <Td>Dec 26, 2022</Td>
                                        <Td>
                                            <span className='badge active'>Active</span>
                                        </Td>
                                        <Td>
                                            <Image height="22px" src="https://ik.imagekit.io/sahildhingra/download-icon.png" />
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Th>2</Th>
                                        <Td>Elite</Td>
                                        <Td>$127</Td>
                                        <Td>Nov 27, 2022</Td>
                                        <Td>Dec 26, 2022</Td>
                                        <Td>
                                            <span className='badge expired'>Expired</span>
                                        </Td>
                                        <Td>
                                            <Image height="22px" src="https://ik.imagekit.io/sahildhingra/download-icon.png" />
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Th>3</Th>
                                        <Td>Elite</Td>
                                        <Td>$127</Td>
                                        <Td>Nov 27, 2022</Td>
                                        <Td>Dec 26, 2022</Td>
                                        <Td>
                                            <span className='badge expired'>Expired</span>
                                        </Td>
                                        <Td>
                                            <Image height="22px" src="https://ik.imagekit.io/sahildhingra/download-icon.png" />
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Th>4</Th>
                                        <Td>Elite</Td>
                                        <Td>$127</Td>
                                        <Td>Nov 27, 2022</Td>
                                        <Td>Dec 26, 2022</Td>
                                        <Td>
                                            <span className='badge expired'>Expired</span>
                                        </Td>
                                        <Td>
                                            <Image height="22px" src="https://ik.imagekit.io/sahildhingra/download-icon.png" />
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Th>5</Th>
                                        <Td>Elite</Td>
                                        <Td>$127</Td>
                                        <Td>Nov 27, 2022</Td>
                                        <Td>Dec 26, 2022</Td>
                                        <Td>
                                            <span className='badge expired'>Expired</span>
                                        </Td>
                                        <Td>
                                            <Image height="22px" src="https://ik.imagekit.io/sahildhingra/download-icon.png" />
                                        </Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className={"tab-content-item " + (activeTab === 7 ? "current" : "")}>
                        <Flex pt='40px' alignItems='center' justifyContent='space-between'>
                            <Text fontSize='18px' color='#6C4545' fontWeight='600'>
                                Support Portal
                            </Text>
                            <NavLink className='btn btn-primary' to="#">
                                <Flex alignItems='center'>
                                    <Image h='18px' pe='15px' src='https://ik.imagekit.io/sahildhingra/add.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673025917620' />
                                    <Text>Raise Ticket</Text>
                                </Flex>
                            </NavLink>
                        </Flex>
                        <Grid ps='10px' mt='40px' mb='60px' templateColumns='repeat(3, 1fr)' gap='2rem' rowGap='3rem'>
                            <GridItem p='20px' border='1px solid #EAE4FF' borderRadius='10px' textAlign='center'>
                                <Text fontWeight='700'>
                                    Live Chat
                                </Text>
                                <Image mx='auto' my='25px' height='80px' src='https://ik.imagekit.io/sahildhingra/chat.png' />
                                <Text maxW='182px' mx='auto' color='#7B7A7A'>
                                    Chat with our top customer executive
                                </Text>
                            </GridItem>
                            <GridItem p='20px' border='1px solid #EAE4FF' borderRadius='10px' textAlign='center'>
                                <Text fontWeight='700'>
                                    Email Us
                                </Text>
                                <Image mx='auto' my='25px' height='80px' src='https://ik.imagekit.io/sahildhingra/mail.png' />
                                <Text maxW='182px' mx='auto' color='#7B7A7A'>
                                    Write us an email. We usually revert within 24hrs
                                </Text>
                            </GridItem>
                            <GridItem p='20px' border='1px solid #EAE4FF' borderRadius='10px' textAlign='center'>
                                <Text fontWeight='700'>
                                    Phone
                                </Text>
                                <Image mx='auto' my='25px' height='80px' src='https://ik.imagekit.io/sahildhingra/telephone.png' />
                                <Text maxW='182px' mx='auto' color='#7B7A7A'>
                                    Get on call with our experts
                                </Text>
                            </GridItem>
                        </Grid>
                        <Box h='1px' background='#EAE4FF' mb='30px'></Box>
                        <Text mt='40px' mb='30px' fontSize='18px' color='#6C4545' fontWeight='600'>
                            Frequently Asked Questions
                        </Text>
                        <Box className='faq-accordion'>
                            <Accordion allowToggle>
                                <AccordionItem>
                                    <h2>
                                        <AccordionButton>
                                            <Box as="span" flex='1' textAlign='left'>
                                                How to add new payment method
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                        commodo consequat.
                                    </AccordionPanel>
                                </AccordionItem>

                                <AccordionItem>
                                    <h2>
                                        <AccordionButton>
                                            <Box as="span" flex='1' textAlign='left'>
                                                How can I download invoice for my payment
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                        commodo consequat.
                                    </AccordionPanel>
                                </AccordionItem>

                                <AccordionItem>
                                    <h2>
                                        <AccordionButton>
                                            <Box as="span" flex='1' textAlign='left'>
                                                Need help with resetting the password
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                        commodo consequat.
                                    </AccordionPanel>
                                </AccordionItem>

                                <AccordionItem>
                                    <h2>
                                        <AccordionButton>
                                            <Box as="span" flex='1' textAlign='left'>
                                                How can I upgrade my existing plan
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                        commodo consequat.
                                    </AccordionPanel>
                                </AccordionItem>

                                <AccordionItem>
                                    <h2>
                                        <AccordionButton>
                                            <Box as="span" flex='1' textAlign='left'>
                                                Payment deducted but not reflecting onto my account
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                        commodo consequat.
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </Box>
                    </div>
                </div>
            </Static>
        </>
    )
}

export default Settings