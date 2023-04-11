import React, { useState } from "react";
import Cookies from "universal-cookie";

import { Box, Flex } from "@chakra-ui/react";
import SideBar from "./SideBar";
import Header from "./Header";

const Static = ({ noSmPadding, noPadding, children, fetchAgain, setFetchAgain }) => {
  const cookies = new Cookies();
  let cookieVal = cookies.get("maximized");

  const [maximizedValue, setMaximizedValue] = useState(cookieVal);
  const [toggleSidebar, setToggleSidebar] = useState(false)

  const handleExpand = () => {
    if (cookies.get("maximized") == "true") {
      cookies.set("maximized", "false", { path: "/" });
      setMaximizedValue("false");
    } else {
      cookies.set("maximized", "true", { path: "/" });
      setMaximizedValue("true");
    }
  };

  return (
    <>
      <div className={maximizedValue === "true" ? "maximized-view" : "s"}>
        <Box 
          minH="100vh"
          py={["0", "0", "20px"]}
          px={["0", "0", "30px"]} 
          bg="backgroundColor"
        >
          <Flex height="100%">
            <Box height="100%">
              <SideBar 
                toggleSidebar={toggleSidebar}
              />
            </Box>
            <Box ps="260px" flex="1">
              <Header
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                toggleSidebar={toggleSidebar}
                setToggleSidebar={setToggleSidebar}
              />
              <Box
                className="main-content-section"
                position="fixed"
                h={["calc(100vh - 57px)", "calc(100vh - 57px)", "calc(100vh - 140px)"]}
                right={["0", "0", "30px"]}
                left={["0", "0", "290px"]}
                mt={["56px", "56px", "100px"]}
                bg="#fff"
                borderRadius={["0", "0", "10px"]}
              >
                <button
                  onClick={handleExpand}
                  className="expand-btn"
                >
                  <img
                    src="https://ik.imagekit.io/sahildhingra/maximize.png"
                    alt=""
                  />
                </button>
                <Box
                  overflowY="auto"
                  h="100%"
                  p={[noSmPadding ? '0' : '10px 20px', noPadding ? "0px" : "40px"]}
                >
                  {children}
                </Box>
              </Box>
            </Box>
          </Flex>
        </Box>
      </div>
    </>
  );
};

export default Static;
