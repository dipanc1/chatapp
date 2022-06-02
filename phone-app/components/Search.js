import { View, TextInput } from 'react-native'
import React from 'react'

const Search = () => {

    const [search, setSearch] = React.useState('')

  return (
    <View>
      <TextInput
        style={{    
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            margin: 10,
            padding: 10,
            borderRadius: 5,
            backgroundColor: '#f8f8f8',
        }}
        placeholder="Search"
        value={search}
        onChangeText={text => setSearch(text)}
      />
    </View>
  )
}

export default Search