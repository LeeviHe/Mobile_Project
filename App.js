import { Text, View } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import Ingredients from './components/Ingredients';
import Cocktails from './components/Cocktails';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './components/Home';

const Tab = createBottomTabNavigator()

export default function App() {
  return (
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={({ navigation, state, descriptors, insets }) => (
          <BottomNavigation.Bar
          navigationState={state}
           safeAreaInsets={insets}
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
  
              if (event.defaultPrevented) {
                preventDefault();
              } else {
               navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({ route, focused, color }) => {
              const { options } = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({ focused, color, size: 24 });
              }
  
              return null;
            }}
            getLabelText={({ route }) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.title;
  
              return label;
            }}
          />
        )}>
          <Tab.Screen 
            name="Home" 
            component={Home}
            options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => {
              return <Icon name="home-flood" size={size} color={color} />;
            },
          }}/>
          <Tab.Screen 
            name="Cocktails" 
            component={Cocktails}
            options={{
            tabBarLabel: 'Cocktails',
            tabBarIcon: ({ color, size }) => {
              return <Icon name="glass-cocktail" size={size} color={color} />;
            },
          }}/>
          <Tab.Screen 
            name="Ingredients" 
            component={Ingredients}
            options={{
            tabBarLabel: 'Ingredients',
            tabBarIcon: ({ color, size }) => {
              return <Icon name="bottle-tonic" size={size} color={color} />;
            },
          }}/>
        </Tab.Navigator>
      </NavigationContainer>
  );
}