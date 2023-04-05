import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EventsCard from '../components/Events/EventsCard';
import { backend_url } from '../production';
import axios from 'axios';
import { PhoneAppContext } from '../context/PhoneAppContext';

const Tab = createMaterialTopTabNavigator();

const Events = ({ user }) => {
    const { dispatch } = React.useContext(PhoneAppContext);

    const [eventsList, setEventsList] = React.useState([]);
    const [upcomingEventsList, setUpcomingEventsList] = React.useState([]);
    const [previousEventsList, setPreviousEventsList] = React.useState([]);
    const [chatId, setChatId] = React.useState();
    const [chatName, setChatName] = React.useState("");
    const [fetchAgain, setFetchAgain] = React.useState(false);

    React.useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                };
                const { data } = await axios.get(
                    `${backend_url}/conversation/event/all/1`,
                    config
                );
                setEventsList(data);
                setUpcomingEventsList(data.filter((event) => {
                    const eventDate = new Date(`${event.date.slice(0, 10)}T${event.time}:00.000Z`);
                    eventDate.setHours(eventDate.getHours() - 5.5);
                    const currentDate = new Date();
                    return eventDate > currentDate;
                }
                ));
                setPreviousEventsList(data.filter((event) => {
                    const eventDate = new Date(`${event.date.slice(0, 10)}T${event.time}:00.000Z`);
                    eventDate.setHours(eventDate.getHours() - 5.5);
                    const currentDate = new Date();
                    return eventDate < currentDate;
                }
                ));
            } catch (error) {
                console.log(error)
                // toast({
                //     title: "Error Occured!",
                //     description: "Failed to Load the Events",
                //     status: "error",
                //     duration: 5000,
                //     isClosable: true,
                //     position: "bottom-left",
                // });
            }
        };

        fetchAllEvents();
    }, [user.token, fetchAgain]);

    const selectEvent = async (chatId) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                `${backend_url}/conversation/${chatId}`,
                config
            );
            setChatId(data._id);
            setChatName(data.chatName);

            if (!data.users.map((u) => u._id === user._id).includes(true)) {
                onOpenJoinEvent();
            } else {
                dispatch({ type: "SET_SELECTED_CHAT", payload: data });
                navigate(`/video-chat`);
            }

        } catch (error) {
            // console.log(error)
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Events",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    return (
        <Tab.Navigator screenOptions={{
            tabBarScrollEnabled: true,
            tabBarItemStyle: { width: 150 },
        }}>
            <Tab.Screen name="Group Events">
                {props => <EventsCard {...props} data={eventsList} />}
            </Tab.Screen>
            <Tab.Screen name="Upcoming Events">
                {props => <EventsCard {...props} data={upcomingEventsList} />}
            </Tab.Screen>
            <Tab.Screen name="Previous Events">
                {props => <EventsCard {...props} data={previousEventsList} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

export default Events