//Working with https://notifee.app/react-native/docs/ or https://wix.github.io/react-native-notifications/docs

//import * as Notifications from "expo-notifications";

function newMessageNotification() {
  //Titel: Du hast eine neue Nachricht
}

function newSubstitutionSchedule() {
  //Titel: Du hast heute Vertretung
}

export default function Notification() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return null;
}
