import BackgroundTask from 'react-native-background-task';

BackgroundTask.define(() => {
  console.log('Background worker starting');
  BackgroundTask.finish();
});
