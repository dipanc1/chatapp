import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button, HStack, Icon, IconButton, Text, VStack } from 'native-base'

const Accordian = ({ accordianIndex, index, accordianOpen, data, openAccordian, invoices }) => {
    return (
        <VStack alignItems={'flex-start'} space={'2'} m={'2'} rounded="lg" borderWidth={"1"} borderColor={"primary.300"} borderRadius={"5"} key={invoices ? data.id : data.title} p="5" py={"2"}>
            {invoices ?
                <HStack alignItems={"center"} justifyContent={"space-around"} w={"72"}>
                    <VStack space="5">
                        <Text fontSize={'lg'} fontWeight={'extrabold'} color={'primary.600'}>{data.expiringOn}</Text>
                        <Text fontSize={'md'} fontWeight={'extraBlack'} color={'primary.600'}>{data.purchasedOn}</Text>
                    </VStack>
                    <HStack alignItems="center" space={'3'}>
                        <Text fontSize={'sm'} fontWeight={'bold'} color={data.planType === 'Basic' ? 'plans.100' : data.planType === 'Elite' ? 'plans.200' : 'plans.300'}>{data.planType}</Text>
                        <Text fontSize={'xl'} fontWeight={'bold'} color={'primary.600'}>{data.amount}</Text>
                        <IconButton textAlign={"right"} onPress={() => openAccordian(index)} icon={<Icon as={MaterialIcons} name={(accordianOpen && index === accordianIndex) ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={5} />} />
                    </HStack>
                </HStack> :
                <HStack alignItems={"center"} justifyContent={"flex-end"} w={"80"}>
                    <Text w={"64"} textAlign={"left"} fontSize={'xl'} fontWeight={'bold'} color={'primary.600'}>{data.title}</Text>
                    <IconButton textAlign={"right"} onPress={() => openAccordian(index)} icon={<Icon as={MaterialIcons} name={(accordianOpen && index === accordianIndex) ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={5} />} />
                </HStack>
            }
            {
                accordianOpen && index === accordianIndex && (invoices ?
                    <Button color="primary.300" my={"3"} w={"72"} variant="subtle" onPress={() => alert('download')}><Text>Download</Text></Button> :
                    <Text fontSize={'md'} fontWeight={'bold'} color={'primary.500'}>{data.content}</Text>
                )
            }
        </VStack >
    )
}

export default Accordian