import {createStackNavigator} from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { useFonts } from "expo-font"

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, //min 23
    background: "transparent"
  }
}

if(user.settings.theme = "light"){
  //use lightColor Palette
}
else{
  //Use darkColor Palette
}

const App = () => {
  return (
    <NavigationContainer>
      <StackNavigator>
        <Stack.Screen />
        <Stack.Screen />
      </StackNavigator>
    </NavigationContainer>
  );
}


export default App;