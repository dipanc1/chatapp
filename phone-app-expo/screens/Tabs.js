import { View, TouchableOpacity, useWindowDimensions, Animated, StyleSheet } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import React from 'react'
import Login from './Login';
import Register from './Register';


const Tabs = ({ setUser }) => {
    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return <Login setUser={setUser}/>;
            case 'second':
                return <Register />;
            default:
                return null;
        }
    };
    const layout = useWindowDimensions();
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
                            onPress={() => setIndex(i)}
                            key={route.key}
                        >
                            <Animated.Text style={{ opacity }}>{route.title}</Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    //TODO: send user to Login
    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
        />
    )
}

const styles = StyleSheet.create({
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

export default Tabs