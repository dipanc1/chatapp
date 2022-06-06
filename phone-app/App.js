import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { PhoneAppContextProvider } from './context/PhoneAppContext';
import Chat from './screens/Chat';
import Tabs from './screens/Tabs';


export default function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        // error reading value
        console.log(e)
      }
    }

    getData().then(res => {
      setUser(res);
    });
  }, [user])



  return (
    <PhoneAppContextProvider>
      <View style={styles.container}>
        {user ?
          <Chat user={user} /> :
          <Tabs setUser={setUser} />
        }
      </View>
    </PhoneAppContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
});
