import React from 'react'
import { Avatar, Box, Button, Divider, Flex, FormControl, HStack, Icon, IconButton, Image, Input, InputGroup, InputLeftAddon, Radio, Switch, Text, VStack } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SettingCard = ({ name }) => {
    const [value, setValue] = React.useState('light');

    return (
        <Flex flex={1} align={'center'} justify={'center'} position={'relative'} bg={"primary.200"}>
            {(function () {
                switch (name) {
                    case 'My Details':
                        return (
                            <VStack space={3}>
                                <Box display={'flex'} alignItems={'center'}>
                                    <Avatar bg="pink.600" alignSelf="center" size="xl" source={{
                                        uri: ("https://images.unsplash.com/photo-1601233749202-95d04d5b3c00?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2876&q=80")
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
                                        placeholder='dipan'
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
                                        placeholder='(+91) 1234567890'
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