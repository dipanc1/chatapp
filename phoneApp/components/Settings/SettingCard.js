import React from 'react'
import { Avatar, Box, Button, Center, Divider, Flex, FormControl, HStack, Icon, IconButton, Image, Input, InputGroup, InputLeftAddon, Radio, ScrollView, Spacer, Switch, Text, VStack } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { backend_url } from '../../production';
import { TouchableOpacity } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';

const SettingCard = ({ name, user }) => {
    const [value, setValue] = React.useState('light');
    const [subscribeData, setSubscribeData] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const plans = [
        {
            name: 'Basic',
            price: '$99/month',
            channels: '2 Channels',
            activeUsers: '4 Users',
            screens: '6 On-Screen Guests',
        },
        {
            name: 'Premium',
            price: '$114/month',
            channels: '5 Channels',
            activeUsers: '4 Users',
            screens: '10 On-Screen Guests',
        },
        {
            name: 'Elite',
            price: '$127/month',
            channels: '8 Channels',
            activeUsers: '6 Users',
            screens: '12 On-Screen Guests',
        },
    ];

    const handlePlanSelection = (id, name, amount) => {
        const newSubscribeData = {
            id: id,
            name: name,
            amount: amount
        }
        setSubscribeData(newSubscribeData);
    };

    const fetchPaymentSheetParams = async () => {
        const response = await fetch(`${backend_url}/payment-sheet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { paymentIntent, ephemeralKey, customer } = await response.json();

        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: true,
            defaultBillingDetails: {
                name: 'Jane Doe',
            }
        });
        if (!error) {
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
        }
    };

    React.useEffect(() => {
        // initializePaymentSheet();
    }, []);

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
                            <ScrollView>
                                <VStack m={"16"} space="10">
                                    <Text fontSize={'xl'} fontWeight={'bold'} color={'amber.800'} my={'2'}>Current Active Plan</Text>
                                    <Center borderWidth={"1"} borderColor={"primary.300"} borderRadius={"4"} rounded="lg" w={"64"} h={"56"}>
                                        <Text fontSize={'xl'} fontWeight={'bold'} color={'primary.600'}>Basic</Text>
                                        <Text fontSize={'md'} fontWeight={'bold'} color={'primary.500'}>$0/mo</Text>
                                        <Divider bg="primary.500" thickness="0.5" orientation="horizontal" w={"56"} my={"4"} />
                                        <VStack alignItems={'flex-start'} space={'2'} m={'2'}>
                                            <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                                <Image source={{
                                                    uri: ('https://ik.imagekit.io/sahildhingra/check-mark.png')
                                                }} alt="Alternate Text" size="2xs" mx={"4"} />
                                                <Text fontSize={'md'} fontWeight={'bold'} color={'primary.500'}>2 Channels</Text>
                                            </HStack>
                                            <HStack justifyContent={'space-between'} alignItems={'center'}>
                                                <Image source={{
                                                    uri: ('https://ik.imagekit.io/sahildhingra/check-mark.png')
                                                }} alt="Alternate Text" mx={"4"} size="2xs" />
                                                <Text fontSize={'md'} fontWeight={'bold'} color={'primary.500'}>4 Users</Text>
                                            </HStack>
                                            <HStack justifyContent={'space-between'} alignItems={'center'}>
                                                <Image source={{
                                                    uri: ('https://ik.imagekit.io/sahildhingra/check-mark.png')
                                                }} alt="Alternate Text" mx={"4"} size="2xs" />
                                                <Text fontSize={'md'} fontWeight={'bold'} color={'primary.500'}>6 On-screen Guests</Text>
                                            </HStack>
                                        </VStack>
                                    </Center>
                                    <Divider bg="primary.400" thickness="1" orientation="horizontal" />
                                    <Text fontSize={'xl'} fontWeight={'bold'} color={'amber.800'}>Other Available Plans</Text>
                                    {plans.map((plan, index) => (
                                        <TouchableOpacity onPress={() => handlePlanSelection(index + 1, index === 0 ? "Basic Membership" : index === 1 ? "Premium Membership" : "Elite Membership", index === 0 ? 50 : index === 1 ? 100 : 150)} key={index}>
                                            <Center shadow={(subscribeData.id === 1 && index === 0) ? 1 : (subscribeData.id === 2 && index === 1) ? 1 : (subscribeData.id === 3 && index === 2) ? 1 : "none"} borderWidth={"1"} borderColor={"primary.300"} borderRadius={"4"} rounded="lg" w={"64"} h={"56"}>
                                                <Text fontSize={'xl'} fontWeight={'bold'} color={'primary.600'}>{plan.name}</Text>
                                                <Text fontSize={'md'} fontWeight={'bold'} color={'primary.500'}>{plan.price}</Text>
                                                <Divider bg="primary.500" thickness="0.5" orientation="horizontal" w={"56"} my={"4"} />
                                                <VStack alignItems={'flex-start'} space={'2'} m={'2'}>
                                                    <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
                                                        <Image source={{
                                                            uri: ('https://ik.imagekit.io/sahildhingra/check-mark.png')
                                                        }} alt="Alternate Text" size="2xs" mx={"4"} />
                                                        <Text fontSize={'md'} fontWeight={'bold'} color={'primary.500'}>{plan.channels}</Text>
                                                    </HStack>
                                                    <HStack justifyContent={'space-between'} alignItems={'center'}>
                                                        <Image source={{
                                                            uri: ('https://ik.imagekit.io/sahildhingra/check-mark.png')
                                                        }} alt="Alternate Text" mx={"4"} size="2xs" />
                                                        <Text fontSize={'md'} fontWeight={'bold'} color={'primary.500'}>{plan.activeUsers}</Text>
                                                    </HStack>
                                                    <HStack justifyContent={'space-between'} alignItems={'center'}>
                                                        <Image source={{
                                                            uri: ('https://ik.imagekit.io/sahildhingra/check-mark.png')
                                                        }} alt="Alternate Text" mx={"4"} size="2xs" />
                                                        <Text fontSize={'md'} fontWeight={'bold'} color={'primary.500'}>{plan.screens}</Text>
                                                    </HStack>
                                                </VStack>
                                            </Center>
                                        </TouchableOpacity>
                                    ))}
                                    <Button disabled={!loading} onPress={openPaymentSheet} bg={'primary.300'} color={'white'} _text={{ fontWeight: 'bold' }} my={'4'} mx={'auto'}>
                                        Change Plan
                                    </Button>

                                    <Text fontSize={'xl'} fontWeight={'bold'} color={'amber.800'}>You will be redirected to the payment page</Text>
                                </VStack>
                            </ScrollView>
                        )
                    case 'Billing':
                        return (
                            <ScrollView>
                                <Box width={"96"} p="5" rounded="lg">
                                    <VStack my={"10"} space="3" justifyContent={"center"} alignItems={"flex-start"}>
                                        <Text fontSize={'xl'} fontWeight={'bold'} color={'white'} my={'2'}>Payment Methods</Text>
                                        <Button bg={'primary.300'} color={'white'} _text={{ fontWeight: 'bold' }}>
                                            Add Payment Method
                                        </Button>
                                    </VStack>
                                    <Divider bg="primary.500" thickness="1" orientation="horizontal" />
                                    <VStack my={"10"} space="3" justifyContent={"center"} alignItems={"flex-start"}>
                                        <Text fontSize={'xl'} fontWeight={'bold'} color={'white'} my={'2'}>Invoices</Text>
                                        <Button bg={'primary.300'} color={'white'} _text={{ fontWeight: 'bold' }}>
                                            Download Invoices
                                        </Button>
                                    </VStack>
                                </Box>
                            </ScrollView>
                        )
                    default:
                        return (
                            <Text fontSize={'xl'} fontWeight={'bold'} color={'amber.400'} my={'2'}>Help</Text>
                        )
                }
            })()}

        </Flex >
    )
}

export default SettingCard