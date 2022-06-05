import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, useWindowDimensions, Animated } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { PhoneAppContextProvider } from './context/PhoneAppContext';
import Chat from './screens/Chat';
import Login from './screens/Login';
import Register from './screens/Register';


const renderScene = SceneMap({
  first: Login,
  second: Register,
});


export default function App() {
  const layout = useWindowDimensions();
  const [user, setUser] = React.useState(null);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Login' },
    { key: 'second', title: 'Register' },
  ]);

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });

          return (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => this.setState({ index: i })}
              key={route.key}
            >
              <Animated.Text style={{ opacity }}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log(e)
    }
  }

  React.useEffect(() => {
    getData().then(res => {
      if (res) {
        // console.log("res", res)
        setUser(res)
      }
    })
  }, [])


  return (
    <PhoneAppContextProvider>
      {user ? <Chat user={user} /> :
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      }
    </PhoneAppContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    // paddingTop: layout.statusBarHeight,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});
