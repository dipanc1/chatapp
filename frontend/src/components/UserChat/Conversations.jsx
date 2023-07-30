import axios from "axios";
import React from "react";
import { AppContext } from "../../context/AppContext";
import { backend_url } from "../../baseApi";
import Conversation from "../Miscellaneous/Conversation";
import GroupChat from "../Miscellaneous/GroupChat";
import GroupChatModal from "../UserModals/GroupChatModal";
import {
    Text,
    Spinner,
    Box,
    Button,
    Image,
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
} from "@chakra-ui/react";
import { AddIcon, RepeatIcon } from "@chakra-ui/icons";
import InfiniteScroll from "react-infinite-scroll-component";

export const DrawerConversations = ({ fetchAgain, setFetchAgain }) => {
    const { dispatch, chats, selectedChat, conversations, groupConversations, loading, userInfo } = React.useContext(AppContext);

    const [hasMoreGroupChats, setHasMoreGroupChats] = React.useState(true);
    const [groupChatsPage, setGroupChatsPage] = React.useState(2);

    const [hasMoreOneOnOneChats, setHasMoreOneOnOneChats] = React.useState(true);
    const [oneOnOneChatsPage, setOneOnOneChatsPage] = React.useState(2);

    const [read, setRead] = React.useState(true)


    const user = JSON.parse(localStorage.getItem("user"));

    const axiosJwt = axios.create({
        baseURL: backend_url,
    });

    const fetchOneOnOneChats = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axiosJwt.get(
                `/conversation/one-on-one/1`, config
            );

            dispatch({ type: "SET_CONVERSATIONS", payload: data.chats });
            setHasMoreOneOnOneChats(data.hasMore);

            if (
                !chats.find(
                    (chat) => chat._id === data.chats.map((datas) => datas._id)
                )
            ) {
                dispatch({ type: "SET_CHATS", payload: data });
            }

        } catch (error) {
            console.log(error)
        }
    };

    const fetchGroupChats = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axiosJwt.get(
                `/conversation/group-chats/1`, config
            );

            dispatch({ type: "SET_GROUP_CONVERSATIONS", payload: data.groups });
            setHasMoreGroupChats(data.hasMore);

            if (
                !chats.find(
                    (chat) => chat._id === data.groups.map((datas) => datas._id)
                )
            ) {
                dispatch({ type: "SET_CHATS", payload: data });
            }

        } catch (error) {
            console.log(error)
        }
    };

    const fetchMoreOneOnOneChats = async () => {
        setOneOnOneChatsPage(oneOnOneChatsPage + 1);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axiosJwt.get(
                `/conversation/one-on-one/${oneOnOneChatsPage}`, config
            );

            dispatch({
                type: "SET_CONVERSATIONS", payload:
                    [...conversations, ...data.chats]
            });
            setHasMoreOneOnOneChats(data.hasMore);


            if (
                !chats.find(
                    (chat) => chat._id === data.chats.map((datas) => datas._id)
                )
            ) {
                dispatch({ type: "SET_CHATS", payload: data });
            }
        } catch (error) {
            console.log(error)
        }
    };

    const fetchMoreGroupChats = async () => {
        setGroupChatsPage(groupChatsPage + 1);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axiosJwt.get(
                `/conversation/group-chats/${groupChatsPage}`, config
            );

            dispatch({
                type: "SET_GROUP_CONVERSATIONS", payload:
                    [...groupConversations, ...data.groups]
            });
            setHasMoreGroupChats(data.hasMore);


            if (
                !chats.find(
                    (chat) => chat._id === data.groups.map((datas) => datas._id)
                )
            ) {
                dispatch({ type: "SET_CHATS", payload: data });
            }
        } catch (error) {
            console.log(error)
        }
    };

    React.useEffect(() => {

        fetchGroupChats();
        fetchOneOnOneChats();
        setOneOnOneChatsPage(2);
        setGroupChatsPage(2);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAgain]);

    const variants1 = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };

    return (
        <>

            <Tabs>
                <TabList>
                    <Tab flex="1">Users</Tab>
                    <Tab flex="1">Groups</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel p="0">
                        {loading ? (
                            <Box
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                my={"2"}
                            >
                                <Spinner
                                    thickness="4px"
                                    speed="0.45s"
                                    emptyColor="gray.200"
                                    color="buttonPrimaryColor"
                                    size="xl"
                                />
                            </Box>
                        ) : (
                            <div id="scrollableDiv" style={{ height: 200 }}>
                                <InfiniteScroll
                                    dataLength={conversations.length}
                                    next={fetchMoreOneOnOneChats}
                                    hasMore={hasMoreOneOnOneChats}
                                    loader={<Box
                                        display={"flex"}
                                        alignItems={"center"}
                                        justifyContent={"center"}
                                        my={"2"}
                                    >
                                        <Spinner
                                            thickness="4px"
                                            speed="0.65s"
                                            emptyColor="gray.200"
                                            color="buttonPrimaryColor"
                                            size="xl"
                                        />
                                    </Box>}
                                    scrollThreshold={0.9}
                                    height={200}
                                    endMessage={
                                        <Box
                                            display={"flex"}
                                            alignItems={"center"}
                                            justifyContent={"center"}
                                        >
                                            <Text
                                                color={"buttonPrimaryColor"}
                                                fontSize={"lg"}
                                            >
                                                No More Chats
                                            </Text>
                                        </Box>
                                    }
                                    scrollableTarget="scrollableDiv"
                                >
                                    {conversations.map((c) => (
                                        <Box
                                            _hover={{
                                                background: "selectPrimaryColor",
                                            }}
                                            bg={
                                                selectedChat?._id === c._id
                                                    ? "selectPrimaryColor"
                                                    : ""
                                            }
                                            p={2}
                                            cursor={"pointer"}
                                            borderBottom="1px solid #EAE4Ff"
                                            mb="1px"
                                            key={c._id}
                                            _disabled={selectedChat?._id === c._id}
                                            onClick={() => {
                                                dispatch({
                                                    type: "SET_SELECTED_CHAT",
                                                    payload: c,
                                                })
                                                setRead(false)
                                            }}
                                        >
                                            <Conversation chat={c} read={read} />
                                        </Box>
                                    ))}
                                </InfiniteScroll>
                            </div>
                        )
                        }
                        {conversations.length === 0 &&
                            !loading ? (
                            <Box
                                initial="hidden"
                                animate="visible"
                                variants={variants1}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                flexDirection={"column"}
                                my={"2"}
                            >
                                <Image
                                    src="./images/noconvo.png"
                                    w={"28"}
                                />
                                <Text
                                    cursor={"default"}
                                    color={"buttonPrimaryColor"}
                                    fontSize={"3xl"}
                                >
                                    No Conversations
                                </Text>
                            </Box>
                        ) : null}
                        <Box mt='20px' textAlign='center'>
                            <Button
                                color={"#3CC4B7"}
                                _hover={{ scale: 1.05 }}
                                variant="outline"
                                size={"xs"}
                                cursor="pointer"
                                mr={"2"}
                                colorScheme='blue'
                                onClick={() => {
                                    setFetchAgain(!fetchAgain);
                                    dispatch({
                                        type: "SET_SELECTED_CHAT",
                                        payload: null,
                                    });
                                }}
                            >
                                <RepeatIcon />
                            </Button>
                        </Box>
                    </TabPanel>
                    <TabPanel p='0'>
                        {loading ? (
                            <Box
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                            >
                                <Spinner
                                    thickness="4px"
                                    speed="0.65s"
                                    emptyColor="gray.200"
                                    color="buttonPrimaryColor"
                                    size="xl"
                                />
                            </Box>
                        ) : (
                            <div id="scrollableDiv" style={{ height: 300 }}>
                                <InfiniteScroll
                                    dataLength={groupConversations.length}
                                    next={fetchMoreGroupChats}
                                    hasMore={hasMoreGroupChats}
                                    loader={<Box
                                        display={"flex"}
                                        alignItems={"center"}
                                        justifyContent={"center"}
                                        my={"2"}
                                    >
                                        <Spinner
                                            thickness="4px"
                                            speed="0.65s"
                                            emptyColor="gray.200"
                                            color="buttonPrimaryColor"
                                            size="xl"
                                        />
                                    </Box>}
                                    scrollThreshold={0.9}
                                    height={300}
                                    endMessage={
                                        <Box
                                            display={"flex"}
                                            alignItems={"center"}
                                            justifyContent={"center"}
                                        >
                                            <Text
                                                color={"buttonPrimaryColor"}
                                                fontSize={"lg"}
                                            >
                                                No More Groups
                                            </Text>
                                        </Box>
                                    }
                                    scrollableTarget="scrollableDiv"
                                >
                                    {groupConversations.map((c) => (
                                        <Box
                                            _hover={{
                                                background: "selectPrimaryColor",
                                            }}
                                            bg={
                                                selectedChat?._id === c._id
                                                    ? "selectPrimaryColor"
                                                    : ""
                                            }
                                            p={2}
                                            cursor={"pointer"}
                                            borderBottom="1px solid #EAE4Ff"
                                            mb="1px"
                                            key={c._id}
                                            _disabled={selectedChat?._id === c._id}
                                            onClick={() => {
                                                dispatch({
                                                    type: "SET_SELECTED_CHAT",
                                                    payload: c,
                                                })
                                                setRead(false)
                                            }}
                                        >
                                            <GroupChat chat={c} read={read} />
                                        </Box>
                                    ))}
                                </InfiniteScroll>
                            </div>
                        )}
                        {groupConversations.length === 0 &&
                            !loading ? (
                            <Box
                                initial="hidden"
                                animate="visible"
                                variants={variants1}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                flexDirection={"column"}
                            >
                                <Image
                                    src="./images/groupchat.png"
                                    w={"28"}
                                />
                                <Text
                                    cursor={"default"}
                                    color={"buttonPrimaryColor"}
                                    fontSize={"3xl"}
                                >
                                    No Groups
                                </Text>
                                <GroupChatModal
                                    user={userInfo}
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                >
                                    <Button
                                        backgroundColor={
                                            "buttonPrimaryColor"
                                        }
                                        color={"white"}
                                        size={"lg"}
                                        _hover={{
                                            bg: "backgroundColor",
                                            color: "text",
                                        }}
                                    >
                                        Create
                                    </Button>
                                </GroupChatModal>
                            </Box>
                        ) : null}
                        <Box mt='20px' textAlign='center'>
                            <GroupChatModal
                                user={userInfo}
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                            >
                                <Button
                                    color={"#3CC4B7"}
                                    _hover={{ scale: 1.05 }}
                                    variant="outline"
                                    size={"xs"}
                                    cursor="pointer"
                                    mr={"2"}
                                    colorScheme='blue'
                                >
                                    <AddIcon />
                                </Button>
                            </GroupChatModal>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs >
        </>
    );
};

const Conversations = ({ fetchAgain, setFetchAgain }) => {
    return (
        <>
            <Box
                bg={"whiteColor"}
                display={["block", "block", "block", "block"]}
            >
                <DrawerConversations
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                />
            </Box>
        </>
    );
};

export default Conversations;
