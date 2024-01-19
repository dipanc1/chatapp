import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Text, Flex, List, ListItem, Image, Button, useColorMode } from "@chakra-ui/react";
import "./style.css";
import { AppContext } from "../../context/AppContext";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import Cookies from 'universal-cookie';

const SideBar = ({
  toggleSidebar
}) => {
  const { dispatch, stream, selectedChat, userInfo } = useContext(AppContext);
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const cookies = new Cookies();

  const CDN_IMAGES = "https://ik.imagekit.io/sahildhingra";
  const userMenu = [
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
      disable: stream || selectedChat === null,
    },
    {
      title: "Groups",
      url: "groups",
      icon: "groups",
      disable: stream,
    },
    {
      title: 'Posts',
      url: "posts",
      icon: 'messages',
    },
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

  const adminMenu = [
    // {
    // 	title: 'Dashboard',
    //   url: "dashboard",
    // 	icon: 'dashboard'
    // },
    {
      title: "Users",
      url: "user-listing",
      icon: "groups",
    },
    {
      title: "Groups",
      url: "groups-listing",
      icon: "groups",
    },
    {
      title: "Events",
      url: "events-listing",
      icon: "events",
    }
  ]


  const handleLogout = () => {
    cookies.remove("auth_token", { domain: ".fundsdome.com" || "localhost" });
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
        bg={colorMode === 'light' ? "white" : "#2b2929"}
        p={["7px 15px", "7px 15px", "20px"]}
        height={["100%", "100%", "calc(100vh - 40px)"]}
        width={["240px"]}
        borderRadius={["0", "0", "10px"]}
        bottom={["auto"]}
        zIndex='1'
        transition='all 0.3s ease-in-out'
      >
        <Flex
          className={`sidebar-nav ${colorMode === 'light' ? '' : 'dark-theme'}`}
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
            {
              userInfo?.isSuperAdmin ? (
                adminMenu.map((navitem) => (
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
                ))
              ) : (
                userMenu.map((navitem) => {
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
                          <Text fontWeight={"500"}>{navitem.title}</Text>
                        </NavLink>
                      </ListItem>
                    )
                  );
                })
              )

            }
          </List>
          <Box mt={["auto"]} py={["auto"]}>
            <List>
              <ListItem>
                <Flex alignItems="center">
                  <Button w="100%" justifyContent="flex-start"
                    //  bg={colorMode === 'dark' ? '#805AD5' : '#FAF5FF'} 
                    bg="transparent"
                    onClick={toggleColorMode}
                  >
                    {colorMode === 'light' ? <MoonIcon w="22px" /> : <SunIcon w="22px" color="red.500" />}
                    <Text ms="15px">{colorMode === 'light' ? "Dark" : "Light"} Mode</Text>
                  </Button>
                </Flex>
              </ListItem>
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
