import React from 'react'
import { Icon, Input } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Searchbar = ({ placeholder, handleSearch, search, setSearch, setSearchbar }) => {
    return (
        <>
            <Input value={search} onChangeText={handleSearch} bgColor={'#fff'} placeholder={placeholder} width="100%" borderRadius="4" py="3" px="1" fontSize="14" InputLeftElement={<Icon m="2" ml="3" size="6" color="black" as={<MaterialIcons name="search" />} />} InputRightElement={<Icon m="2" mr="3" size="6" color="black" as={<MaterialIcons name="close" />} onPress={() => {
                setSearchbar(false)
                setSearch("")
            }} />} />
        </>
    )
}

export default Searchbar