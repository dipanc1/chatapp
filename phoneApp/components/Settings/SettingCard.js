import React from 'react'
import { Avatar, Box, Button, Divider, Flex, FormControl, HStack, Icon, IconButton, Image, Input, InputGroup, InputLeftAddon, Radio, Switch, Text, VStack } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import queryString from 'query-string';
import axios from 'axios';
import { backend_url } from '../../production';

const SettingCard = ({ name, user }) => {
    const [value, setValue] = React.useState('light');
    const [subscribeData, setSubscribeData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [url, setUrl] = React.useState(null);

    const handleCheckout = async () => {
        console.log("<----")
        setLoading(true);
        const newSubscribeData = {
            id: 12, 
            name: "BASIC MEMBERSHIP",
            amount: 1500,
            currency: 'usd'
        }
        const response = await axios.post(`${backend_url}/checkout/create-checkout-session`, queryString.stringify({
            amount: 1000, // The amount to charge, in cents
            currency: 'usd', // The currency to charge in
            // Any additional parameters you need to pass to the Checkout API
          }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
          });
      
          const { url } = response.data;
          setUrl(url);
          setLoading(false);
    };

    return (
        <Flex flex={1} align={'center'} justify={'center'} position={'relative'} bg={"primary.200"}>
            {(function () {
                switch (name) {
                    case 'My Details':
                        return (
                            <VStack space={3}>
                                <Box display={'flex'} alignItems={'center'}>
                                    <Avatar bg="pink.600" alignSelf="center" size="xl" source={{
                                        uri: (user?.pic)
                                    }}>
                                        GG
                                    </Avatar>
                                    <IconButton variant={'ghost'} _icon={{
                                        as: MaterialIcons, name: "edit"
                                    }} size={'md'} />
                                </Box>
                                <FormControl>
                                    <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                                        Username
                                    </FormControl.Label>
                                    <Input
                                        placeholder={user.username}
                                        w={{
                                            base: '84%',
                                            md: '285px'
                                        }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                                        Phone Number
                                    </FormControl.Label>
                                    <Input
                                        placeholder={"+" + user.number}
                                        isDisabled={true}
                                        w={{
                                            base: '84%',
                                            md: '285px'
                                        }}
                                    />
                                </FormControl>
                                <Button _icon={{
                                    as: MaterialIcons, name: "edit"
                                }} size={'md'} mt="1" bgColor={'primary.300'}>
                                    Edit
                                </Button>
                            </VStack>
                        )
                    case 'Themes':
                        return (
                            <Radio.Group space={'10'} name='theme' value={value} onChange={(nextValue) => setValue(nextValue)}>
                                <Radio value="light">
                                    <Box p={10} my={5} borderColor={'primary.100'} borderWidth={'1'} rounded="lg">
                                        <Text fontSize={'lg'} fontWeight={'bold'} color={'primary.400'} my={'2'}>
                                            Light
                                        </Text>
                                        <Image source={{
                                            uri: ("https://ik.imagekit.io/sahildhingra/theme-default.png")
                                        }} alt="Alternate Text" size="lg" />
                                    </Box>
                                </Radio>
                                <Radio value="dark">
                                    <Box p={10} my={5} borderColor={'primary.100'} borderWidth={'1'} rounded="lg">
                                        <Text fontSize={'lg'} fontWeight={'bold'} color={'primary.400'} my={'2'}>
                                            Dark
                                        </Text>
                                        <Image source={{
                                            uri: ("https://ik.imagekit.io/sahildhingra/theme-dark.png")
                                        }} alt="Alternate Text" size="lg" />
                                    </Box>
                                </Radio>
                            </Radio.Group>
                        )
                    case 'Password':
                        return (
                            <VStack space={3}>
                                <Box>
                                    <Text fontSize={'md'} fontWeight={'bold'} color={'primary.400'} my={'2'}>
                                        Please enter your old password to change your password
                                    </Text>
                                </Box>
                                <FormControl>
                                    <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                                        Old Password
                                    </FormControl.Label>
                                    <Input
                                        placeholder='********'
                                        w={{
                                            base: '84%',
                                            md: '285px'
                                        }}
                                    />
                                </FormControl>
                                <Box my={'2'}>
                                    <Divider bg="primary.500" thickness="1" orientation="horizontal" />
                                </Box>
                                <FormControl>
                                    <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                                        New Password
                                    </FormControl.Label>
                                    <Input
                                        placeholder='********'
                                        w={{
                                            base: '84%',
                                            md: '285px'
                                        }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
                                        Confirm Password
                                    </FormControl.Label>
                                    <Input
                                        placeholder='********'
                                        w={{
                                            base: '84%',
                                            md: '285px'
                                        }}
                                    />
                                </FormControl>
                                <Button _icon={{
                                    as: MaterialIcons, name: "edit"
                                }} size={'md'} mt="1" bgColor={'primary.300'}>
                                    Update Password
                                </Button>
                            </VStack>
                        )
                    case 'Notification':
                        return (
                            <Box>
                                <Text fontSize={'xl'} fontWeight={'bold'} color={'amber.400'} my={'2'}>Choose your notification settings</Text>
                                <Box>
                                    <Divider bg="primary.500" thickness="1" orientation="horizontal" />
                                    <HStack justifyContent={'space-between'} alignItems={'center'}>
                                        <VStack textAlign={'left'} w={'1/3'}>
                                            <Text fontSize={'md'} fontWeight={'bold'} color={'amber.400'} my={'2'}>
                                                Messages
                                            </Text>
                                            <Text fontSize={'md'} color={'primary.600'} my={'2'} ml={'auto'}>
                                                These are notifications for messages that you receive
                                            </Text>
                                        </VStack>
                                        <HStack>
                                            <Switch size={'lg'} defaultIsChecked onTrackColor={'primary.300'} />
                                            <Text fontSize={'md'} color={'primary.600'} m={'2'}>
                                                Push
                                            </Text>
                                        </HStack>

                                    </HStack>
                                    <Divider bg="primary.500" thickness="1" orientation="horizontal" />
                                </Box>
                            </Box>
                        )
                    case 'Plans':
                        return (
                            <Box>
                                <Text fontSize={'xl'} fontWeight={'bold'} color={'amber.400'} my={'2'}>Choose your plan</Text>
                                <Box>
                                    <Divider bg="primary.500" thickness="1" orientation="horizontal" />
                                    <HStack justifyContent={'space-between'} alignItems={'center'}>
                                        <VStack textAlign={'left'} w={'1/3'}>
                                            <Text fontSize={'md'} fontWeight={'bold'} color={'amber.400'} my={'2'}>
                                                Basic
                                            </Text>
                                            <Text fontSize={'md'} color={'primary.600'} my={'2'} ml={'auto'}>
                                                This is the basic plan
                                            </Text>
                                        </VStack>
                                        <HStack>
                                            <Switch size={'lg'} defaultIsChecked onTrackColor={'primary.300'} />
                                            <Text fontSize={'md'} color={'primary.600'} m={'2'}>
                                                Active
                                            </Text>
                                        </HStack>
                                    </HStack>
                                    <Divider bg="primary.500" thickness="1" orientation="horizontal" />
                                </Box>

                                <View style={{ flex: 1 }}>
                                    {url ? (
                                        <WebView source={{ uri: url }} />
                                    ) : (
                                        <Button title="Checkout" onPress={handleCheckout} disabled={loading} />
                                    )}
                                </View>
                                
                                {
                                    loading && (
                                        <Text>Loading....</Text>
                                    )
                                }

                                <Box ps='10px' mt='40px' mb={['40px' ,'60px']}>
                                    <Box cursor='pointer' boxShadow={subscribeData.id === 1 && '0 0px 10px rgba(159,133,247,0.5)'} onClick={() => handlePlanSelection(1, "Basic Membership", 50)} p='20px' pb='30px' border='1px solid #EAE4FF' borderRadius='10px' textAlign='center'>
                                        <Text fontSize='24px' fontWeight='700'>
                                            Basic
                                        </Text>
                                        <Text mt='4px' fontWeight='700' mx='auto' color='#7B7A7A'>
                                            $99/mo
                                        </Text>
                                        <Box mt='25px' pt='25px' borderTop='1px solid #EAE4FF' textAlign='left'>
                                            <Flex flexDirection={"row"}>
                                                <Image flexShrink='0' me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                                <Text fontWeight='600' color='#7B7A7A'>
                                                    2 Channels
                                                </Text>
                                            </Flex>
                                            <Flex py='15px'>
                                                <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                                <Text fontWeight='600' color='#7B7A7A'>
                                                    4 Users
                                                </Text>
                                            </Flex>
                                            <Flex>
                                                <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                                <Text fontWeight='600' color='#7B7A7A'>
                                                    6 On-screen Guests
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Box>
                                    {/* <Box cursor='pointer' boxShadow={subscribeData.id === 2 && '0 0px 10px rgba(159,133,247,0.5)'} onClick={() => handlePlanSelection(2, "Preimum Membership", 100)} p='20px' pb='30px' border='1px solid #EAE4FF' borderRadius='10px' textAlign='center'>
                                        <Text fontSize='24px' fontWeight='700'>
                                            Premium
                                        </Text>
                                        <Text mt='4px' fontWeight='700' mx='auto' color='#7B7A7A'>
                                            $114/mo
                                        </Text>
                                        <Box mt='25px' pt='25px' borderTop='1px solid #EAE4FF' textAlign='left'>
                                            <Flex justifyContent='start'>
                                                <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                                <Text fontWeight='600' color='#7B7A7A'>
                                                    5 Channels
                                                </Text>
                                            </Flex>
                                            <Flex py='15px' justifyContent='start'>
                                                <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                                <Text fontWeight='600' color='#7B7A7A'>
                                                    4 Users
                                                </Text>
                                            </Flex>
                                            <Flex justifyContent='start'>
                                                <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                                <Text fontWeight='600' color='#7B7A7A'>
                                                    10 On-screen Guests
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Box>
                                    <Box cursor='pointer' boxShadow={subscribeData.id === 3 && '0 0px 10px rgba(159,133,247,0.5)'} onClick={() => handlePlanSelection(3, "Elite Membership", 150)} p='20px' pb='30px' border='1px solid #EAE4FF' borderRadius='10px' textAlign='center'>
                                        <Text fontSize='24px' fontWeight='700'>
                                            Elite
                                        </Text>
                                        <Text mt='4px' fontWeight='700' mx='auto' color='#7B7A7A'>
                                            $127/mo
                                        </Text>
                                        <Box mt='25px' pt='25px' borderTop='1px solid #EAE4FF' textAlign='left'>
                                            <Flex justifyContent='start'>
                                                <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                                <Text fontWeight='600' color='#7B7A7A'>
                                                    8 Channels
                                                </Text>
                                            </Flex>
                                            <Flex py='15px' justifyContent='start'>
                                                <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                                <Text fontWeight='600' color='#7B7A7A'>
                                                    6 Users
                                                </Text>
                                            </Flex>
                                            <Flex justifyContent='start'>
                                                <Image me='15px' h='20px' src='https://ik.imagekit.io/sahildhingra/check-mark.png' />
                                                <Text fontWeight='600' color='#7B7A7A'>
                                                    12 On-screen Guests
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Box> */}
                                </Box>

                            </Box>
                        )
                    case 'Billing':
                        return (
                            <Box>
                                <Text fontSize={'xl'} fontWeight={'bold'} color={'amber.400'} my={'2'}>Billing</Text>
                            </Box>
                        )
                    default:
                        return (
                            <Text fontSize={'xl'} fontWeight={'bold'} color={'amber.400'} my={'2'}>Help</Text>
                        )
                }
            })()}

        </Flex>
    )
}

export default SettingCard