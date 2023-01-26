import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';




export default function App() {
  const onLoginButtonPress = () => {
    console.log("Logging in!")
    console.log(inputUser)
    console.log(inputPass)
    //Save the data in .localdata.json and try the password
  }

  const [inputUser, setUser] = useState('');
  const [inputPass, setPass] = useState('');
  return (
    <View style={{position: 'absolute', justifyContent: 'center',}}>
    <Text style={{position: 'absolute', marginTop: 250, marginLeft: 30, fontSize: 22, fontWeight: 'bold'}}>Evi Login</Text>
      <View style={styles.container}>
        <TextInput 
        placeholder="Username" 
        onChangeText={inputPass => setPass(inputPass)}
        defaultValue={inputPass} 
        style={styles.usernameInput}
        />
        <View style={{height: 30}}></View>
        <TextInput 
        placeholder="Password" 
        onChangeText={inputUser => setUser(inputUser)}
        defaultValue={inputUser} 
        style={styles.usernameInput}
        />
        <Text style={{fontSize: 9, marginTop: 8}}>Mit dem fortfaren des Logins akzeptiere ich die AGB's</Text>
        <Button
          onPress={onLoginButtonPress}
          title="Login"
          color="#3C8AFE"
        />
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 320,
    marginLeft: 30
  },
  usernameInput: {
    backgroundColor : '#D9D9D9',
    Colors : '707070',
    height: 50,
    width: 340,
    borderRadius: 12,
    paddingLeft: 15,
    //Change font to Poppins! and mad Font weight here to 500
  }
});
