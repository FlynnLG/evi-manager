import notifee, { AuthorizationStatus } from '@notifee/react-native';
import {Platform} from 'react-native';

async function sendNotification(title, body){
        notifee.displayNotification({
            title: title,
            body: body,
            android: {
                //autoCancel: false, // Defaults to true
                //ongoing: true,
                smallIcon: 'ic_launcher',
            },
            ios: {
                interruptionLevel: 'timeSensitive',
            }
          });
}

async function getPermission(){
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        console.log('Permission settings:', settings);
      } else {
        console.log('User declined permissions');
      }
}

export default{sendNotification, getPermission}