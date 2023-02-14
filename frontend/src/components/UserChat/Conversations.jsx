import axios from "axios";
import React from "react";
import { AppContext } from "../../context/AppContext";
import { backend_url } from "../../baseApi";
import Conversation from "../Miscellaneous/Conversation";
import GroupChat from "../Miscellaneous/GroupChat";
import GroupChatModal from "../UserModals/GroupChatModal";
import GroupListItem from "../UserItems/GroupListItem";
import UserListItem from "../UserItems/UserListItem";
import {
    Input,
    Text,
    Divider,
    Spinner,
    Box,
    Button,
    Image,
    useToast,
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

export const DrawerConversations = ({ fetchAgain, setFetchAgain }) => {
    const { dispatch, chats, selectedChat } = React.useContext(AppContext);
    const [dropdown, setDropdown] = React.useState(true);
    const [dropdownGroup, setDropdownGroup] = React.useState(true);
    const [conversations, setConversations] = React.useState([]);
    const [groupConversations, setGroupConversations] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [searchResultsUsers, setSearchResultsUsers] = React.useState([]);
    const [searchResultsGroups, setSearchResultsGroups] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const toast = useToast();

    // search bar to search for users
    const handleSearch = async (e) => {
        setSearch(e.target.value);
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                `${backend_url}/users?search=${search}`,
                config
            );
            // console.warn("gorups,,,", data);
            setLoading(false);
            setSearchResultsUsers(data.users);
            setSearchResultsGroups(data.groups);
        } catch (error) {
            // console.log(error)
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    // add user to conversation
    const accessChat = async (userId) => {
        // console.log(userId);
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `${backend_url}/conversation`,
                { userId },
                config
            );

            dispatch({ type: "SET_SELECTED_CHAT", payload: data });
            // console.log(data);
            setLoading(false);
            setSearch("");
            setFetchAgain(!fetchAgain);
        } catch (error) {
            // console.log(error)
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

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

            setConversations(data.filter((friend) => !friend.isGroupChat));
            setGroupConversations(
                data.filter((friend) => friend.isGroupChat && friend.chatName)
            );

            if (
                !chats.find(
                    (chat) => chat._id === data.map((datas) => datas._id)
                )
            ) {
                dispatch({ type: "SET_CHATS", payload: data });
            }
        } catch (error) {
            // console.log(error)
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Conversations",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const handleAddUser = async (user1, groupId) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${backend_url}/conversation/groupadd`,
                {
                    chatId: groupId,
                    userId: user1,
                },
                config
            );

            dispatch({ type: "SET_SELECTED_CHAT", payload: data });
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            // console.log(error);
            toast({
                title: "Error Occured!",
                description: "User already exists in the group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setFetchAgain(!fetchAgain);
            setLoading(false);
        }
        setSearch("");
    };

    React.useEffect(() => {
        fetchChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAgain, selectedChat]);

    const variants = {
        open: { opacity: 1, y: 1 },
        closed: { opacity: 0, y: "-100%" },
    };

    const variants1 = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };

    return (
        <>
            <Box whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Input
                    width={"calc(100% - 50px)"}
                    py={"0.8rem"}
                    fontWeight={"bold"}
                    m='20px auto 20px'
                    placeholder="Start a new chat"
                    value={search}
                    onChange={handleSearch}
                    focusBorderColor="#9F85F7"
                    display='block'
                    borderColor='#9F85F7'
                />
            </Box>

            <Tabs>
                <TabList>
                    <Tab flex="1">Users</Tab>
                    <Tab flex="1">Groups</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel px="0">
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            maxHeight={"100%"}
                            overflow={"auto"}
                            overflowX={"hidden"}
                            animate={dropdown ? "open" : "closed"}
                            variants={variants}
                        >
                            {loading ? (
                                <Box
                                    display={"flex"}
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                >
                                    <Spinner
                                        thickness="4px"
                                        speed="0.45s"
                                        emptyColor="gray.200"
                                        color="buttonPrimaryColor"
                                        size="xl"
                                    />
                                </Box>
                            ) : search.length > 0 ? (
                                searchResultsUsers?.map((user) => (
                                    <Box
                                        _hover={{
                                            background: "selectPrimaryColor",
                                            fontWeight: "bold",
                                        }}
                                        bg={"selectSecondaryColor"}
                                        p={2}
                                        cursor={"pointer"}
                                        my={"0.2rem"}
                                        mx={"2rem"}
                                        borderRadius="lg"
                                        key={user._id}
                                        onClick={() => accessChat(user._id)}
                                    >
                                        <UserListItem user={user} />
                                    </Box>
                                ))
                            ) : !dropdown ? null : (
                                conversations.map((c) => (
                                    <Box
                                        _hover={{
                                            background: "selectPrimaryColor",
                                        }}
                                        bg={
                                            selectedChat?._id === c._id
                                                ? "selectPrimaryColor"
                                                : "selectSecondaryColor"
                                        }
                                        p={2}
                                        cursor={"pointer"}
                                        my={"0.2rem"}
                                        borderRadius="lg"
                                        key={c._id}
                                        onClick={() => {
                                            dispatch({
                                                type: "SET_SELECTED_CHAT",
                                                payload: c,
                                            });
                                            dispatch({ type: "SET_MOBILE" });
                                        }}
                                    >
                                        <Conversation chat={c} />
                                    </Box>
                                ))
                            )}
                            {conversations.length === 0 &&
                            !loading &&
                            search.length === 0 ? (
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
                        </Box>
                    </TabPanel>
                    <TabPanel px='0'>


                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            maxHeight={"100%"}
                            overflow={"auto"}
                            overflowX={"hidden"}
                            animate={dropdownGroup ? "open" : "closed"}
                            variants={variants}
                        >
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
                            ) : search.length > 0 ? (
                                searchResultsGroups?.map((group) => (
                                    <Box
                                        _hover={{
                                            background: "selectPrimaryColor",
                                            fontWeight: "bold",
                                        }}
                                        bg={"selectSecondaryColor"}
                                        p={2}
                                        cursor={"pointer"}
                                        my={"0.2rem"}
                                        mx={"2rem"}
                                        borderRadius="lg"
                                        key={group._id}
                                        onClick={() =>
                                            handleAddUser(user._id, group._id)
                                        }
                                    >
                                        <GroupListItem group={group} />
                                    </Box>
                                ))
                            ) : !dropdownGroup ? null : (
                                groupConversations.map((c) => (
                                    <Box
                                        _hover={{
                                            background: "selectPrimaryColor",
                                        }}
                                        bg={
                                            selectedChat?._id === c._id
                                                ? "selectPrimaryColor"
                                                : "selectSecondaryColor"
                                        }
                                        p={2}
                                        cursor={"pointer"}
                                        my={"0.2rem"}
                                        borderRadius="lg"
                                        key={c._id}
                                        onClick={() => {
                                            dispatch({
                                                type: "SET_SELECTED_CHAT",
                                                payload: c,
                                            });
                                            dispatch({ type: "SET_MOBILE" });
                                        }}
                                    >
                                        <GroupChat chat={c} />
                                    </Box>
                                ))
                            )}
                            {groupConversations.length === 0 &&
                            !loading &&
                            search.length === 0 ? (
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
                                        user={user}
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
                        </Box>
                        <Box mt='20px' textAlign='center'>
                            <GroupChatModal
                                user={user}
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
            </Tabs>
        </>
    );
};

const Conversations = ({ fetchAgain, setFetchAgain }) => {
    return (
        <>
            <Box
                bg={"whiteColor"}
                display={["none", "none", "none", "block"]}
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
