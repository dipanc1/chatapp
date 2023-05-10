import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Text, Flex, List, ListItem, Image } from "@chakra-ui/react";
import "./style.css";
import { AppContext } from "../../context/AppContext";

const SideBar = ({
  toggleSidebar
}) => {
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
      disable: stream,
    },
    {
      title: "Groups",
      url: "groups",
      icon: "groups",
      disable: stream,
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
      disable: stream,
    },
  ];


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
        transform={[toggleSidebar ? 'unset' : 'translateX(-100%)', toggleSidebar ? 'unset' : 'translateX(-100%)', 'unset']}
        boxShadow={[toggleSidebar ? '-50px 0 250px rgba(0,0,0,0.5)' : 'unset', toggleSidebar ? '100px 0 250px rgba(0,0,0,0.5)' : 'unset', 'Base']}
        bg={"white"}
        p={["7px 15px", "7px 15px", "20px"]}
        height={["100%", "100%", "calc(100vh - 40px)"]}
        width={["240px"]}
        borderRadius={["0", "0", "10px"]}
        bottom={["auto"]}
        zIndex='1'
        transition='all 0.3s ease-in-out'
      >
        <Flex
          className="sidebar-nav"
          height={"100%"}
          flexDirection={["column"]}
        >
          <Box display={["block"]} className="logo-sidebar" pt="7px" pb="40px">
            <Image
              height="35px"
              mx="auto"
              src={CDN_IMAGES + "/chatapp-logo.png"}
              alt="ChatApp"
            />
          </Box>
          <List flex={["unset"]} display={["block"]}>
            {NavMenu.map((navitem) => {
              return (
                !navitem?.disable && (
                  <ListItem key={navitem.title} flex={["unset"]} py={"4px"} fontWeight={"600"}>
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
                )
              );
            })}
          </List>
          <Box mt={["auto"]} py={["auto"]}>
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
