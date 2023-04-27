import React from 'react'
import GroupCard from '../components/Groups/GroupCard';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { backend_url } from '../production';
import axios from 'axios';
import TabNavigatorStyled from '../components/Miscellaneous/TabNavigatorStyled';

const Tab = createMaterialTopTabNavigator();

const AllGroups = ({ user }) => {
    const [groupsList, setGroupsList] = React.useState([])
    const [groupConversations, setGroupConversations] = React.useState([]);

    React.useEffect(() => {
        // fetch all conversations
        const fetchChats = async () => {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(
                    `${backend_url}/conversation`,
                    config
                );
                setGroupConversations(
                    data.filter((friend) => friend.isGroupChat && friend.chatName)
                );
            } catch (error) {
                console.log(error)
                // toast({
                //     title: "Error Occured!",
                //     description: "Failed to Load the Conversations",
                //     status: "error",
                //     duration: 5000,
                //     isClosable: true,
                //     position: "bottom-left",
                // });
            }
        };

        const listGroups = async () => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            // 1 is page number, 10 is limit, use it for pagination
            await axios.get(`${backend_url}/conversation/all/1`, config).then(
                (response) => {
                    setGroupsList(response.data);
                }).catch((error) => {
                    console.log(error)
                })
        }

        fetchChats();
        listGroups();
    }, [user.token]);

    return (
        <TabNavigatorStyled>
            <Tab.Screen name="All Groups">
                {props => <GroupCard {...props} data={groupsList} user={user} />}
            </Tab.Screen>
            <Tab.Screen name="Joined Groups">
                {props => <GroupCard {...props} data={groupConversations} user={user} />}
            </Tab.Screen>
            <Tab.Screen name="My Groups">
                {props => <GroupCard {...props} data={groupConversations} />}
            </Tab.Screen>
        </TabNavigatorStyled>
    )
}

export default AllGroups