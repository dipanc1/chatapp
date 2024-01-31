import { Box, Button, Flex, FormControl, FormLabel, Grid, GridItem, Input, Text, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import Cookies from 'universal-cookie';
import { backend_url } from '../../utils';
import { BUTTONS, FORM_LABELS, TITLES } from '../../constants';

const ChangePassword = ({ setLoading }) => {
    const cookies = new Cookies();
    const user = JSON.parse(localStorage.getItem('user')) || cookies.get("auth_token", { domain: ".fundsdome.com" });

    const toast = useToast();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async (e) => {
        setLoading(true);
        e.preventDefault();

        if (currentPassword === newPassword) {
            toast({
                title: "Error",
                description: "New password cannot be the same as old password",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(
                `${backend_url}/users/change-password`, {
                oldPassword: currentPassword,
                newPassword,
                confirmPassword
            },
                config
            );
            toast({
                title: "Success",
                description: "Password changed successfully",
                status: "success",
                duration: 4000,
                isClosable: true,
            });
            setConfirmPassword("");
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            toast({
                title: "Error",
                description: error.response.data,
                status: "error",
                duration: 4000,
                isClosable: true,
            });
            setConfirmPassword("");
            setCurrentPassword("");
            setNewPassword("");
        }
        setLoading(false);
    }



    return (
        <form onSubmit={handleChangePassword}>
            <Text mt='40px' fontSize='18px' color='#6C4545' fontWeight='600'>
                {TITLES.ENTER_CURRENT_PASSWORD}
            </Text>
            <Grid mt='20px' templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap='5rem' rowGap={['1rem', '3rem']} className='form-wrapper'>
                <GridItem w='100%'>
                    <FormControl className={"filled"}>
                        <Input autoComplete='current-password' type='password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        <FormLabel>{FORM_LABELS.CURRENT_PASSWORD}</FormLabel>
                    </FormControl>
                </GridItem>
            </Grid>
            <Box h='1px' background='#EAE4FF' mt='20px' mb='50px'></Box>
            <Grid mt='30px' templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap='4.5rem' rowGap={['1rem', '3rem']} className='form-wrapper'>
                <GridItem w='100%'>
                    <FormControl className={"filled"}>
                        <Input autoComplete='new-password' type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <FormLabel>{FORM_LABELS.NEW_PASSWORD}</FormLabel>
                    </FormControl>
                </GridItem>
                <GridItem w='100%'>
                    <FormControl className={"filled"}>
                        <Input autoComplete='confirm-password' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <FormLabel>{FORM_LABELS.CONFIRM_PASSWORD}</FormLabel>
                    </FormControl>
                </GridItem>
            </Grid>
            <Flex pt={['15px', '40px']} alignItems='center' justifyContent='end'>
                <Button isDisabled={currentPassword === "" || newPassword === "" || confirmPassword === ""} type='submit' bg="buttonPrimaryColor" color={"white"}>
                    <Text>{BUTTONS.UPDATE_PASSWORD}</Text>
                </Button>
            </Flex>
        </form>
    )
}

export default ChangePassword