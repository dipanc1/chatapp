import React from 'react'
import GroupCard from '../components/Groups/GroupCard';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { backend_url } from '../utils';
import axios from 'axios';
import TabNavigatorStyled from '../components/Miscellaneous/TabNavigatorStyled';
import { PhoneAppContext } from '../context/PhoneAppContext';
import { useState } from 'react';

const Tab = createMaterialTopTabNavigator();

const AllGroups = ({ user, navigation }) => {
    const [groupsList, setGroupsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    const [groupConversationsAdmin, setGroupConversationsAdmin] = useState([]);
    const [loadingMyChatsAdmin, setLoadingMyChatsAdmin] = useState(false);
    const [totalCountMyChatsAdmin, setTotalCountMyChatsAdmin] = useState(0);
    const [currentPageMyChatsAdmin, setCurrentPageMyChatsAdmin] = useState(1);
    const [totalPagesMyChatsAdmin, setTotalPagesMyChatsAdmin] = useState(0);
    const [currentCountMyChatsAdmin, setCurrentCountMyChatsAdmin] = useState(0);
    const [hasNextPageMyChatsAdmin, setHasNextPageMyChatsAdmin] = useState(false);
    const [hasPrevPageMyChatsAdmin, setHasPrevPageMyChatsAdmin] = useState(false);

    const [groupConversations, setGroupConversations] = React.useState([]);
    const [loadingMyChats, setLoadingMyChats] = useState(false);
    const [totalCountMyChats, setTotalCountMyChats] = useState(0);
    const [currentPageMyChats, setCurrentPageMyChats] = useState(1);
    const [totalPagesMyChats, setTotalPagesMyChats] = useState(0);
    const [currentCountMyChats, setCurrentCountMyChats] = useState(0);
    const [hasNextPageMyChats, setHasNextPageMyChats] = useState(false);
    const [hasPrevPageMyChats, setHasPrevPageMyChats] = useState(false);

    const [fetchAgain, setFetchAgain] = React.useState(false);

    React.useEffect(() => {
        // fetch all conversations
        const fetchChats = async () => {
            setLoadingMyChats(true);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(
                    `${backend_url}/conversation/my/1`,
                    config
                );
                setGroupConversations(
                    data.chats.filter((friend) => friend.isGroupChat && friend.chatName)
                );
                setTotalCountMyChats(data.totalCount);
                setCurrentPageMyChats(data.currentPage);
                setTotalPagesMyChats(data.totalPages);
                setCurrentCountMyChats(data.currentCount);
                setHasNextPageMyChats(data.hasNextPage);
                setHasPrevPageMyChats(data.hasPrevPage);
                setLoadingMyChats(false);
            } catch (error) {
                console.log(error)
                setLoadingMyChats(false);
                alert('Failed to Load the Conversations')
            }
        };

        // fetch all conversations as admin
        const fetchChatsAdmin = async () => {
            setLoadingMyChatsAdmin(true);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(
                    `${backend_url}/conversation/admin/1`,
                    config
                );
                setGroupConversationsAdmin(data.chats);
                setTotalCountMyChatsAdmin(data.totalCount);
                setCurrentPageMyChatsAdmin(data.currentPage);
                setTotalPagesMyChatsAdmin(data.totalPages);
                setCurrentCountMyChatsAdmin(data.currentCount);
                setHasNextPageMyChatsAdmin(data.hasNextPage);
                setHasPrevPageMyChatsAdmin(data.hasPrevPage);
                setLoadingMyChatsAdmin(false);
            } catch (error) {
                console.log(error)
                setLoadingMyChats(false);
                alert('Failed to Load the Conversations')
            }
        };

        const listGroups = async () => {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            // 1 is page number, 10 is limit, use it for pagination
            await axios.get(`${backend_url}/conversation/all/1`, config).then(
                (response) => {
                    setGroupsList(response.data.groups);
                    setTotalCount(response.data.totalCount);
                    setCurrentPage(response.data.currentPage);
                    setTotalPages(response.data.totalPages);
                    setCurrentCount(response.data.currentCount);
                    setHasNextPage(response.data.hasNextPage);
                    setHasPrevPage(response.data.hasPrevPage);
                    setLoading(false);
                }).catch((error) => {
                    console.log(error);
                    setLoading(false);
                })
        }

        fetchChats();
        listGroups();
        fetchChatsAdmin();
    }, [user.token, fetchAgain]);

    const listMoreGroups = async (page) => {
        setLoading(true);
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        };
        // 1 is page number, 10 is limit, use it for pagination
        await axios.get(`${backend_url}/conversation/all/${page}`, config).then(
            (response) => {
                setGroupsList(response.data.groups);
                setTotalCount(response.data.totalCount);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
                setCurrentCount(response.data.currentCount);
                setHasNextPage(response.data.hasNextPage);
                setHasPrevPage(response.data.hasPrevPage);
                setLoading(false);
            }).catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }

    const fetchMoreChats = async (page) => {
        setLoadingMyChats(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                `${backend_url}/conversation/my/${page}`,
                config
            );
            setGroupConversations(
                data.chats.filter((friend) => friend.isGroupChat && friend.chatName)
            );
            setTotalCountMyChats(data.totalCount);
            setCurrentPageMyChats(data.currentPage);
            setTotalPagesMyChats(data.totalPages);
            setCurrentCountMyChats(data.currentCount);
            setHasNextPageMyChats(data.hasNextPage);
            setHasPrevPageMyChats(data.hasPrevPage);
            setLoadingMyChats(false);
        } catch (error) {
            // console.log(error)
            setLoadingMyChats(false);
            alert('Failed to Load the Conversations')
        }
    };

    const fetchMoreChatsAdmin = async (page) => {
        setLoadingMyChatsAdmin(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                `${backend_url}/conversation/admin/${page}`,
                config
            );
            setGroupConversationsAdmin(data.chats);
            setTotalCountMyChatsAdmin(data.totalCount);
            setCurrentPageMyChatsAdmin(data.currentPage);
            setTotalPagesMyChatsAdmin(data.totalPages);
            setCurrentCountMyChatsAdmin(data.currentCount);
            setHasNextPageMyChatsAdmin(data.hasNextPage);
            setHasPrevPageMyChatsAdmin(data.hasPrevPage);
            setLoadingMyChatsAdmin(false);
        } catch (error) {
            console.log(error)
            setLoadingMyChats(false);
            alert('Failed to Load the Conversations')
        }
    };

    return (
        <TabNavigatorStyled>
            <Tab.Screen name="All Groups">
                {props => <GroupCard {...props} loading={loading} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} navigation={navigation} data={groupsList} user={user} paginateFunction={listMoreGroups} currentPage={currentPage} totalPages={totalPages} totalCount={totalCount} currentCount={currentCount} hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} />}
            </Tab.Screen>
            <Tab.Screen name="Joined Groups">
                {props => <GroupCard {...props} loading={loadingMyChats} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} navigation={navigation} data={groupConversations} user={user} paginateFunction={fetchMoreChats} currentPage={currentPageMyChats} totalPages={totalPagesMyChats} totalCount={totalCountMyChats} currentCount={currentCountMyChats} hasNextPage={hasNextPageMyChats} hasPrevPage={hasPrevPageMyChats} />}
            </Tab.Screen>
            <Tab.Screen name="My Groups">
                {props => <GroupCard {...props} loading={loadingMyChatsAdmin} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} navigation={navigation} data={groupConversationsAdmin} user={user} paginateFunction={fetchMoreChatsAdmin} currentPage={currentPageMyChatsAdmin} totalPages={totalPagesMyChatsAdmin} totalCount={totalCountMyChatsAdmin} currentCount={currentCountMyChatsAdmin} hasNextPage={hasNextPageMyChatsAdmin} hasPrevPage={hasPrevPageMyChatsAdmin} />}
            </Tab.Screen>
        </TabNavigatorStyled>
    )
}

export default AllGroups