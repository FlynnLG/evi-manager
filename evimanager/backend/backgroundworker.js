import BackgroundTask from 'react-native-background-task';
import {newMessageNotification} from './notification';

BackgroundTask.define(() => {
  console.log('Backgroundworker starting');
  BackgroundTask.finish();
});
