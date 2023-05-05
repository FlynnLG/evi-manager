//TODO: That the Background worker works: https://github.com/Rapsssito/react-native-background-actions/blob/master/INSTALL.md

import BackgroundTask from 'react-native-background-actions';

BackgroundTask.define(() => {
  console.log('Background worker starting');
  BackgroundTask.finish();
});
