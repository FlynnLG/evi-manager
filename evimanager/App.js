import {createStackNavigator} from '@react-navigation/stack';
import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
} from '@react-navigation/native';

//Import all the Screens for the App getItemSynas Components
import AppStart from './screens/AppStart';
import Home from './screens/Home';
import Login from './screens/Login';
import Loading from './screens/Loading';
import SettingsScreen from './screens/SettingsScreen';

import {CreditsTabs, HomeTabs, SettingsTabs} from './components/tabs';
import CreditsScreen from './screens/Credits';
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, //min 23
    background: 'transparent',
  },
};

const Stack = createStackNavigator();

const App = () => {
  console.log('App wird geladen');
  //loading all the needed Fonts into the App
  /*
  const [loaded] = useFonts({
    Poppins: require('./assets/fonts/Poppins-Medium.ttf'),
    PoppinsSemiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
  });
  //when the fonts dont load
  if (!loaded) {
    return null;
  }
   */

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="AppStart">
        <Stack.Screen name="AppStart" component={AppStart} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="HomeNav" component={HomeTabs} />
        <Stack.Screen name="SettingsNav" component={SettingsTabs} />
        <Stack.Screen name="CreditsNav" component={CreditsTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
