import assets from './assets';
import {SYSTEMLIGHT, SYSTEMDARK, FONTS} from './theme';
import appStorage from '../components/appStorage';

let THEME = SYSTEMDARK;

async function getStorage() {
  console.info('Searching for Themes');
  if (appStorage.getString('@localdata:settings/theme') === 'SYSTEMLIGHT') {
    THEME = SYSTEMLIGHT;
  } else {
    THEME = SYSTEMDARK;
  }
  //console.info(AsyncStorage.getItem('@localdata:settings/theme').toString())
}

getStorage();

export {assets, THEME, FONTS, getStorage};
