import React from 'react'
import { Box, HStack, Heading, Text, VStack } from 'native-base';

const SearchGroupListItem = ({ group }) => {

    return (

        <Box borderBottomWidth="1" borderBottomColor={'primary.100'} p={'3'} mx={'4'}>
            <HStack justifyContent="space-between" alignItems={'center'}>
                <VStack mx={'3'} alignItems={'flex-start'}>
                    <Heading size={'sm'} _dark={{
                        color: "warmGray.50"
                    }} color="coolGray.800" bold>
                        {group && group.chatName}
                    </Heading>
                    <Text _dark={{
                        color: "warmGray.50"
                    }} color="coolGray.800">
                        {group && group.users.length} members
                    </Text>
                </VStack>
            </HStack>
        </Box>
    )
}

export default SearchGroupListItem