import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import AppStart from './screens/AppStart';
import Login from './screens/Login';
import Loading from './screens/Loading';
import CustomColor from './screens/CustomColor';

import {MessagesTabs, HomeTabs, SettingTabs} from './components/tabs';
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

const Stack = createStackNavigator();

const App = () => {
  console.log('App wird geladen');
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="AppStart">
        <Stack.Screen name="AppStart" component={AppStart} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="HomeNav" component={HomeTabs} />
        <Stack.Screen name="SettingNav" component={SettingTabs} />
        <Stack.Screen name="MessagesNav" component={MessagesTabs} />
        <Stack.Screen name="CustomColor" component={CustomColor} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
