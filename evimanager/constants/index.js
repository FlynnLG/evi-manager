import EncryptedStorage from 'react-native-encrypted-storage/lib/typescript/EncryptedStorage';
import assets from './assets';
import {SYSTEMLIGHT, SYSTEMDARK, NIGHTLY, getUserLessonTheme, FONTS} from './theme';
//import AsyncStorage from '@react-native-async-storage/async-storage'; NOT USED ANYMORE

let THEME;

async function getTheme(){
  const selectedTheme = await EncryptedStorage('localdata:settings/theme').toString()

  if(selectedTheme == 'SYSLIGHT'){
    THEME = SYSTEMLIGHT;
  }
  else if(selectedTheme == 'NIGHTLY'){
    THEME = NIGHTLY;
  }
  else{
    THEME = SYSTEMDARK;
  }
}

export {assets, THEME, FONTS, getUserLessonTheme};
