import BackgroundTimer from 'react-native-background-timer';
import ytm from './ytm';

export default function ytmBackground(){
  const myDate = new Date()
  let temp = 60000 * 99
  
  if(6 <= myDate.getHours() && myDate.getHours() <= 16){
    temp = 60000 * 20
  }

  BackgroundTimer.runBackgroundTimer(() => { 
      ytm()
    }, 
    temp);
}