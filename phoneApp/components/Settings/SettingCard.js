import React from 'react'
import { Accordion, Avatar, Box, Button, Center, Divider, Flex, FormControl, HStack, Icon, IconButton, Image, Input, InputGroup, InputLeftAddon, Radio, ScrollView, Spacer, Switch, Text, VStack } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { backend_url } from '../../production';
import { TouchableOpacity } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import Accordian from '../Miscellaneous/Accordian';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PhoneAppContext } from '../../context/PhoneAppContext';
import SupportModal from '../UserModals/SupportModal';

const SettingCard = ({ name, user }) => {

    const [userInfo, setUser] = React.useState(null);
    const [value, setValue] = React.useState('light');
    const [subscribeData, setSubscribeData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [accordianOpen, setAccordianOpen] = React.useState(false);
    const [accordianIndex, setAccordianIndex] = React.useState(0);
    const [username, setUsername] = React.useState("");
    const [pic, setPic] = React.useState(user?.pic);
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const { dispatch } = React.useContext(PhoneAppContext);
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

    const helpData = [
        {
            name: 'Live Chat',
            icon: 'https://ik.imagekit.io/sahildhingra/chat.png',
            description: 'Chat with our top customer support executives',
        },
        {
            name: 'Email Us',
            icon: 'https://ik.imagekit.io/sahildhingra/mail.png',
            description: 'Write us an email. We usually revert within 24hrs',
        },
        {
            name: 'Phone',
            icon: 'https://ik.imagekit.io/sahildhingra/telephone.png',
            description: 'Get on call with our experts',
        }
    ];

    const faqData = [
        { title: "How to add new payment method?", content: "Lorem ipsum dolor sit amet" },
        { title: "Show can I download invoice for my payment?", content: "Lorem ipsum dolor fjrwejk jnfglwrntfgio uhfowrnfgio uiofhilwer sit amet" },
        { title: "Need help with resetting the password?", content: "Lorem ipsum dolor jfgoerg jkgnfjowr gjk jnfjlwnfio jknfjwsnofj wjkkbnfjklwn jkf mkjnfgnwejor jobnjowefow jkn fjkownfio wejk jofniowrenfgj werjo uj iouru sit amet" },
        { title: "How can I upgrade my existing plan?", content: "Lorem ipsum dolonfuwrenof uinfuinwejf wuien uiehfbuiewn fjo ewuibnfie uinfjiwenfuinewj uin ujewnuifn weojinrfiufnjwern jf jifnuiwenfji wefjibfji rfji rweji fjwrbfjewnrfjwerujfbewuiobfguiqwerbfguiqui rtuiweg uifu  hfhuherwui h8hf uioewhfuioh uifguo ehuif uerh eui houieh r sit amet" },
        { title: "How can I cancel my subscription?", content: "Lorem ipsum dolor sit amet jfheui ufuewui egdf iouy ioe uiofhioh iohf if hoof hujf hojf hjkf khjf  fhuie" },
        { title: "How can I delete my account?", content: "Lorem ipsum dolor sit amet" }
    ];

    const invoices = [
        { id: 6, planType: "Elite", purchasedOn: "12th June, 2021", expiringOn: "12th July, 2021", amount: "$127" },
        { id: 1, planType: "Premium", purchasedOn: "12th May, 2021", expiringOn: "12th June, 2021", amount: "$114" },
        { id: 2, planType: "Basic", purchasedOn: "12th April, 2021", expiringOn: "12th May, 2021", amount: "$99" },
        { id: 3, planType: "Basic", purchasedOn: "12th March, 2021", expiringOn: "12th April, 2021", amount: "$99" },
        { id: 4, planType: "Basic", purchasedOn: "12th February, 2021", expiringOn: "12th March, 2021", amount: "$99" },
        { id: 5, planType: "Basic", purchasedOn: "12th January, 2021", expiringOn: "12th February, 2021", amount: "$99" },
    ];

    const openAccordian = (index) => {
        setAccordianOpen(!accordianOpen);
        setAccordianIndex(index);
    }

    const handlePlanSelection = (id, name, amount) => {
        const newSubscribeData = {
            id: id,
            name: name,
            amount: amount
        }
        setSubscribeData(newSubscribeData);
    };

    const initializePaymentSheet = async () => {
        const response = await axios.post(`${backend_url}/checkout/payment-sheet`, {
            amount: subscribeData["amount"] / 100,
        }).catch((err) => console.log(err))

        const { paymentIntent } = response.data;

        const { error } = await initPaymentSheet({
            merchantDisplayName: "ChatApp, Inc.",
            paymentIntentClientSecret: paymentIntent,
            defaultBillingDetails: {
                name: 'John Wick',
            }
        });
        if (!error) {
            setLoading(true);
        }

    }

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            alert(`Error code: ${error.code}`, error.message);
        } else {
            alert('Success', 'Your are now a premium user!');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (currentPassword === newPassword) {
            alert("New password cannot be same as old password");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.put(
                `${backend_url}/users/change-password`, {
                oldPassword: currentPassword,
                newPassword,
                confirmPassword
            },
                config
            );

            alert("Password changed successfully");
            setConfirmPassword("");
            setCurrentPassword("");
            setNewPassword("");
            setLoading(false);
        } catch (error) {
            alert("Something went wrong");
            setConfirmPassword("");
            setCurrentPassword("");
            setNewPassword("");
            setLoading(false);
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!username) {
            alert("Username cannot be empty");
            setLoading(false);
            return;
        }

        if (username.length < 3) {
            alert("Username should be atleast 3 characters long");
            setLoading(false);
            return;
        }

        if (username.length > 20) {
            alert("Username should be less than 20 characters long");
            setLoading(false);
            return;
        }


        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userInfo.token}`,
                },
            };


            const { data } = await axios.put(
                `${backend_url}/users/update-user-info`, {
                username,
                pic,
            },
                config
            );
            alert(data.message);
            setUsername(data.username);
            setPic(data.pic);
            dispatch({ type: "SET_USER_INFO", payload: data });
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            alert("Something went wrong");
        }
    }

    React.useEffect(() => {
        const getUserDetails = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('user')
                setUser(jsonValue != null ? JSON.parse(jsonValue) : null)
            } catch (e) {
                // read error
                console.log(e)
            }
        }

        getUserDetails()
    }, []);

    React.useEffect(() => {
        if (subscribeData["amount"] < 0 || subscribeData["amount"] === undefined || subscribeData === {}) {
            return;
        }
        initializePaymentSheet();
    }, [subscribeData]);

    return (
        <Flex flex={1} align={'center'} justify={'center'} position={'relative'} bg={"primary.200"}>
            {(function () {
                switch (name) {
                    case 'My Details':
                        return (
                            <VStack space={3}>
                                <Box display={'flex'} alignItems={'center'}>
                                    <Avatar bg="pink.600" alignSelf="center" size="xl" source={{
                                        uri: pic
                                    }}>
                                        {user.username}
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
                                        value={username}
                                        onChangeText={(e) => setUsername(e)}
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
                                }} size={'md'} mt="1" bgColor={'primary.300'} onPressIn={handleUpdateProfile} isLoading={loading} isLoadingText="Updating Profile">
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
                                        type="password"
                                        value={currentPassword}
                                        onChangeText={(e) => setCurrentPassword(e)}
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
                                        type="password"
                                        value={newPassword}
                                        onChangeText={(e) => setNewPassword(e)}
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
                                        type="password"
                                        value={confirmPassword}
                                        onChangeText={(e) => setConfirmPassword(e)}
                                    />
                                </FormControl>
                                <Button isLoading={loading}
                                    isLoadingText="Changing Password"
                                    _disabled={{
                                        opacity: 0.5
                                    }} isDisabled={currentPassword === "" || newPassword === "" || confirmPassword === ""} _icon={{
                                        as: MaterialIcons, name: "edit"
                                    }} size={'md'} mt="1" bgColor={'primary.300'} onPressIn={handleChangePassword}>
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
                                            <Switch onto size={'lg'} onTrackColor={'primary.300'} />
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
                                    <Button _disabled={{
                                        bg: 'primary.500',
                                    }} isDisabled={!loading} bg={'primary.300'} color={'primary.600'} _text={{ fontWeight: 'bold' }} my={'4'} mx={'auto'} onPress={openPaymentSheet}>
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
                                        <Text fontSize={'xl'} fontWeight={'bold'} color={'primary.600'} my={'2'}>Payment Methods</Text>
                                        <Button bg={'primary.300'} color={'primary.600'} _text={{ fontWeight: 'bold' }}>
                                            Add Payment Method
                                        </Button>
                                    </VStack>
                                    <Divider bg="primary.500" thickness="1" orientation="horizontal" />
                                    <VStack my={"10"} space="3" justifyContent={"center"} alignItems={"flex-start"}>
                                        <Text fontSize={'xl'} fontWeight={'bold'} color={'primary.600'} my={'2'}>Invoices</Text>
                                        <VStack my={"8"} space="3" justifyContent={"center"} alignItems={"center"}>
                                            {invoices.map((invoice, index) => (
                                                <Accordian data={invoice} index={index} openAccordian={openAccordian} accordianOpen={accordianOpen} accordianIndex={accordianIndex} invoices={true} />
                                            ))
                                            }
                                        </VStack>
                                    </VStack>
                                </Box>
                            </ScrollView>
                        )
                    default:
                        return (
                            <ScrollView>
                                <Box width={"96"} p="5" rounded="lg">
                                    <VStack my={"10"} space="3" justifyContent={"center"} alignItems={"flex-start"}>
                                        <Text fontSize={'xl'} fontWeight={'bold'} color={'primary.600'} my={'2'}>Support Portal</Text>
                                        <SupportModal />
                                    </VStack>
                                    {/* <VStack my={"3"} space="3" justifyContent={"center"} alignItems={"center"}>
                                        {helpData.map((help, index) => (
                                            <Center key={help.name} borderWidth={"1"} borderColor={"primary.300"} borderRadius={"4"} rounded="lg" w={"64"} h={"56"} justifyContent={"space-between"} py={"3"}>
                                                <Text fontSize={'xl'} fontWeight={'bold'} color={'primary.600'}>{help.name}</Text>
                                                <Image source={{ uri: (help.icon) }} alt="Alternate Text" size="lg" />
                                                <Text fontSize={'md'} fontWeight={'bold'} color={'primary.500'} textAlign={"center"}>
                                                    {help.description}
                                                </Text>
                                            </Center>
                                        ))}
                                    </VStack>
                                    <Divider bg="primary.500" thickness="1" orientation="horizontal" mt={"4"} />
                                    <Box my={"8"}>
                                        <Text fontSize={'xl'} fontWeight={'bold'} color={'primary.600'} my={'2'}>Frequency Asked Questions</Text>
                                        <VStack my={"8"} space="3" justifyContent={"center"} alignItems={"center"}>
                                            {faqData.map((data, index) => (
                                                <Accordian data={data} index={index} openAccordian={openAccordian} accordianOpen={accordianOpen} accordianIndex={accordianIndex} invoices={false} />
                                            ))}
                                        </VStack>
                                    </Box> */}
                                </Box>
                            </ScrollView>
                        )
                }
            })()}

        </Flex >
    )
}

export default SettingCard