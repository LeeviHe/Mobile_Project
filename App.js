import { BottomNavigation } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import Ingredients from './components/Ingredients';
import Cocktails from './components/Cocktails';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './components/Home';
import More from './components/More';
import Recipe from './components/Recipe';
import { colors } from './styles/style-constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPockettinis from './components/MyPockettinis';
import Favourites from './components/Favourites';
import Ingredient from './components/Ingredient';
import MyIngredients from './components/MyIngredients'
import MakeAPockettini from './components/MakeAPockettini';
import MyRecipe from './components/MyRecipe';
import GlobalProvider from './reusables/Functions';
import { PockettiniProvider } from './components/PockettiniContext';

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator();

const CocktailsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cocktails" component={Cocktails} />
      <Stack.Screen name="Recipe" component={Recipe} />
    </Stack.Navigator>
  );
};

const IngredientsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Ingredients" component={Ingredients} />
      <Stack.Screen name="Ingredient" component={Ingredient} />
      <Stack.Screen name="MyIngredients" component={MyIngredients} />
    </Stack.Navigator>
  );
};

const MoreNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="More" component={More} />
      <Stack.Screen name="Favourites" component={Favourites} />
      <Stack.Screen name="MyPockettinis" component={MyPockettinis} />
      <Stack.Screen name="MakeAPockettini" component={MakeAPockettini} />
      <Stack.Screen name="MyRecipe" component={MyRecipe} />
    </Stack.Navigator>
  )
}

const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <GlobalProvider>
      <PockettiniProvider>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
              headerShown: false
            }}
            tabBar={({ navigation, state, descriptors, insets }) => (
              <BottomNavigation.Bar
                navigationState={state}
                safeAreaInsets={insets}
                style={{ backgroundColor: colors.white }} // Set background color for the tab bar
                activeColor='#313131'
                inactiveColor='#c0c0c0'
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
                renderIcon={({ route, focused }) => {
                  const { options } = descriptors[route.key];
                  const iconColor = focused ? colors.secondaryFontColour : '#c0c0c0' // Set colors for active/inactive icons

                  if (options.tabBarIcon) {
                    return (
                      options.tabBarIcon({ focused, color: iconColor, size: 30, })
                    )
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
              name="HomeNavigator"
              component={HomeNavigator}
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => {
                  return <Icon name="home" size={size} color={color} />;
                },
              }}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                  // Prevent default action
                  e.preventDefault();
                  // Navigate to the initial route of CocktailsNavigator
                  navigation.navigate('HomeNavigator', { screen: 'Home' });
                },
              })} />
            <Tab.Screen
              name="CocktailsNavigator"
              component={CocktailsNavigator}
              options={{
                tabBarLabel: 'Cocktails',
                tabBarIcon: ({ color, size }) => {
                  return <Icon name="glass-cocktail" size={size} color={color} />;
                },
              }}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                  // Prevent default action
                  e.preventDefault();
                  // Navigate to the initial route of CocktailsNavigator
                  navigation.navigate('CocktailsNavigator', { screen: 'Cocktails' });
                },
              })} />
            <Tab.Screen
              name="IngredientsNavigator"
              component={IngredientsNavigator}
              options={{
                tabBarLabel: 'Ingredients',
                tabBarIcon: ({ color, size }) => {
                  return <Icon name="bottle-tonic" size={size} color={color} />;
                },
              }}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                  // Prevent default action
                  e.preventDefault();
                  // Navigate to the initial route of CocktailsNavigator
                  navigation.navigate('IngredientsNavigator', { screen: 'Ingredients' });
                },
              })} />
            <Tab.Screen
              name="MoreNavigator"
              component={MoreNavigator}
              options={{
                tabBarLabel: 'More',
                tabBarIcon: ({ color, size }) => {
                  return <Icon name="dots-horizontal" size={size} color={color} />;
                },
              }}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                  // Prevent default action
                  e.preventDefault();
                  // Navigate to the initial route of CocktailsNavigator
                  navigation.navigate('MoreNavigator', { screen: 'More' });
                },
              })} />
          </Tab.Navigator>
        </NavigationContainer>
      </PockettiniProvider>
    </GlobalProvider>
  );
}