import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Text, Flex, List, ListItem, Image } from "@chakra-ui/react";
import "./style.css";
import { AppContext } from "../../context/AppContext";

const SideBar = () => {
  const { dispatch, stream } = useContext(AppContext);
  const navigate = useNavigate();
  const CDN_IMAGES = "https://ik.imagekit.io/sahildhingra";
  const NavMenu = [
    // {
    // 	'title': 'Dashboard',
    // 	'icon': 'dashboard'
    // },
    {
      title: "Live Stream",
      url: "video-chat",
      icon: "explore",
    },
    {
      title: "Events",
      url: "event",
      icon: "events",
    },
    {
      title: "Groups",
      url: "groups",
      icon: "groups",
    },
    // {
    // 	'title': 'Messages',
    // 	'icon': 'messages',
    // },
    // {
    // 	'title': 'Subscription',
    // 	'icon': 'subscription',
    // },
    {
      title: "Settings",
      url: "settings",
      icon: "settings",
    },
  ];

  // TODO: Disable the events if the user is streaming

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch({ type: "SET_USER", payload: null });
    navigate('/');
    window.location.reload();
  }

  return (
    <>
      <Box
        className="sidebar"
        position="fixed"
        boxShadow={"Base"}
        bg={"white"}
        p={["7px 20px", "20px"]}
        height={["fit-content", "calc(100vh - 40px)"]}
        width={["100%", "240px"]}
        borderRadius={["0", "10px"]}
        bottom={["0", "auto"]}
        zIndex='1'
      >
        <Flex
          className="sidebar-nav"
          height={"100%"}
          flexDirection={["row", "column"]}
        >
          <Box display={["none", "block"]} className="logo-sidebar" pt="7px" pb="40px">
            <Image
              height="35px"
              mx="auto"
              src={CDN_IMAGES + "/chatapp-logo.png"}
              alt="ChatApp"
            />
          </Box>
          <List flex={["1", "unset"]} display={["flex", "block"]}>
            {NavMenu.map((navitem) => {
              return (
                <ListItem flex={["1", "unset"]} py={"4px"} fontWeight={"600"}>
                  <NavLink to={"/" + navitem.url}>
                    <Image
                      src={
                        CDN_IMAGES +
                        "/" +
                        navitem.icon +
                        ".png"
                      }
                      alt={navitem.title}
                    />
                    <Text>{navitem.title}</Text>
                  </NavLink>
                </ListItem>
              );
            })}
          </List>
          <Box mt={["0", "auto"]} py={["4px", "auto"]}>
            <List>
              <ListItem onClick={handleLogout}>
                <NavLink to={"/"}>
                  <Image
                    src={CDN_IMAGES + "/logout.png"}
                    alt="Dan Abramov"
                  />
                  <Text>Logout</Text>
                </NavLink>
              </ListItem>
            </List>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default SideBar;
