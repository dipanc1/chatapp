import React, { useEffect, useState } from 'react'
import {
    Box,
    Heading,
    Spinner
} from '@chakra-ui/react';

import axios from 'axios';
import Cookies from "universal-cookie";

import Static from '../components/common/Static'
import "./Settings.css"

import { backend_url } from '../utils';
import { SETTINGS_TABS } from '../constants';

import MyDetails from '../components/Settings/MyDetails';
import ChangePassword from '../components/Settings/ChangePassword';
import Notifications from '../components/Settings/Notifications';
import Help from '../components/Settings/Help';


const Settings = () => {
    const cookies = new Cookies();
    const user = JSON.parse(localStorage.getItem('user')) || cookies.get("auth_token", { domain: ".fundsdome.com" });


    const [activeTab, setActiveTab] = useState(1);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [number, setNumber] = useState("");
    const [pic, setPic] = useState("");

    // Removing unused code can be found in commit -

    useEffect(() => {
        const currentUserDetails = async () => {
            setLoading(true);
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
            setLoading(false);
        }

        currentUserDetails();
    }, [user?.token])


    return (
        <>
            <Static>
                <Heading pb={['10px', '30px']} as='h1' size='lg' fontWeight='500'>Settings</Heading>
                <ul className="tab-nav">
                    <li onClick={() => setActiveTab(1)} className={activeTab === 1 ? "active" : ""}>
                        {SETTINGS_TABS.MY_DETAILS}
                    </li>
                    <li onClick={() => setActiveTab(2)} className={activeTab === 2 ? "active" : ""}>
                        {SETTINGS_TABS.PASSWORD}
                    </li>
                    <li onClick={() => setActiveTab(3)} className={activeTab === 3 ? "active" : ""}>
                        {SETTINGS_TABS.NOTIFICATIONS}
                    </li>
                    <li onClick={() => setActiveTab(4)} className={activeTab === 4 ? "active" : ""}>
                        {SETTINGS_TABS.HELP}
                    </li>
                </ul>
                <Box pb={['20px', '0']} className="tab-content">
                    {loading ?
                        <Box py='100px' background='transparent' textAlign='center'>
                            <Spinner
                                thickness='4px'
                                speed='0.2s'
                                emptyColor='gray.200'
                                color='buttonPrimaryColor'
                                size='xl'
                            />
                        </Box>
                        :
                        <>
                            <div className={"tab-content-item " + (activeTab === 1 ? "current" : "")}>
                                <MyDetails username={username} number={number} pic={pic} setPic={setPic} setUsername={setUsername} setLoading={setLoading} />
                            </div>
                            <div className={"tab-content-item " + (activeTab === 2 ? "current" : "")}>
                                <ChangePassword setLoading={setLoading} />
                            </div>
                            <div className={"tab-content-item " + (activeTab === 3 ? "current" : "")}>
                                <Notifications />
                            </div>
                            <div className={"tab-content-item " + (activeTab === 4 ? "current" : "")}>
                                <Help />
                            </div>
                        </>}
                </Box>
            </Static>
        </>
    )
}

export default Settings