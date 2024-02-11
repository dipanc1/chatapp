import { Box, Flex, Grid, GridItem, Switch, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { BUTTONS, FORM_LABELS, TITLES } from '../../constants';
import { AppContext } from '../../context/AppContext';

const Notifications = () => {
    const { pushNotification, dispatch } = useContext(AppContext);

    return (
        <>
            <Text mt='40px' fontSize='18px' color='#6C4545' fontWeight='600'>
                {TITLES.KIND_OF_NOTIFICATIONS}
            </Text>
            <Box h='1px' background='#EAE4FF' my='30px'></Box>
            <Grid
                alignItems='center'
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
                gap={['1.5rem', '4.5rem']}
            >
                <GridItem>
                    <Text color='#6C4545' fontWeight='700'>
                        {FORM_LABELS.MESSAGES}
                    </Text>
                    <Text mt='10px' color='#7B7A7A' fontWeight='500'>
                        {TITLES.NOTIFICATIONS_FOR_YOUR_INBOX}
                    </Text>
                </GridItem>
                <GridItem>
                    <Flex pb='12px' alignItems='center'>
                        <Switch
                            isChecked={pushNotification}
                            onChange={() => {
                                dispatch({ type: 'SET_PUSH_NOTIFICATION' });
                            }}
                            pe='15px'
                            colorScheme={'twitter'}
                            size='lg'
                        />
                        <Text color='#6C4545' fontWeight='700'>
                            {BUTTONS.PUSH}
                        </Text>
                    </Flex>
                </GridItem>
            </Grid>
            <Box h='1px' background='#EAE4FF' my='30px'></Box>
        </>
    );
};

export default Notifications;
