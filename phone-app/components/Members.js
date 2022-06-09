import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import ChatOnline from './ChatOnline'
import { AntDesign } from '@expo/vector-icons';
import { PhoneAppContext } from '../context/PhoneAppContext';

const Members = ({ setMembers, user }) => {

    const { selectedChat } = React.useContext(PhoneAppContext);

    return (
        <View style={styles.groupContainer}>
            {/* Top  */}
            <View style={styles.groupHeader}>
                <AntDesign
                    name="back"
                    size={24}
                    color="black"
                    onPress={() => setMembers(false)}
                />
                <Text style={styles.groupHeaderText}>
                    {selectedChat?.users.length} Group members
                </Text>
            </View>

            {/* Middle  */}
            <ScrollView>
                {selectedChat.isGroupChat && selectedChat?.users.map(u =>
                    <View key={u._id}>
                        <ChatOnline user1={u} user={user} />
                    </View>
                )}
            </ScrollView>

            {/* Bottom */}
            <View style={styles.groupFooter}>
                <TouchableOpacity style={styles.footerButton}>
                    <Text style={styles.footerText}>
                      +{' '}  Add new member
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    groupContainer: {
        flex: 1
    },
    groupHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    groupHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    groupFooter: {
        margin: 20,
    },
    footerButton:{
        padding: 15,
        borderRadius: 30,
        backgroundColor: '#161216',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText:{
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
})

export default Members