import * as axios from 'axios';
import * as cheerio from 'cheerio';
import * as Keychain from 'react-native-keychain';
import appStorage from '../components/appStorage';
import PushNotification from "react-native-push-notification";

const ytm = async nav => {
    try {
      appStorage.set('crawler_data', '');
  
      const credentials = await Keychain.getGenericPassword();
      if (!credentials || !credentials.username || !credentials.password) {
        await Keychain.resetGenericPassword().then(async () => {
          console.error('Login-Daten konnten nicht geladen werden');
        });
        return;
      }
  
      axios.default
        .get(
          `https://gymnasium-neuruppin.de/index.php?startlog=1&user=${credentials.username}&pass=${credentials.password}`,
        )
        .then(
          async response => {
            if (response.status === 200) {
              let dashboard = response.data;
              let $ = cheerio.load(dashboard);
  
              // Check if login was successful
              if (
                $(
                  'body > div:nth-child(1) > div:nth-child(3) > table > tbody > tr > td > a > b',
                ).length
              ) {
                console.log('DEBUG | Login successful');
                //Here the magic happens ;)
                await axios.default
                .get(
                  'https://gymnasium-neuruppin.de/index.php?oid=18',
                )
                .then(async response => {
                  if (response.status === 200) {
                    let html = response.data;
                    let $ = cheerio.load(html);

                    console.log('Checking for new messages');
                    // Check if user has new messages
                    let newMessagesCounter = parseInt(
                      $(
                        'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > span:nth-child(5)',
                      )
                        .text()
                        .match(/\d+/)[0],
                    );
                    // When more than 1 message is sent before the script runs again, only the newest sender will be shown in push notification
                    let newMessageSender = $(
                      'body > table:nth-child(3) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > span:nth-child(3) > b:nth-child(3)',
                    ).text();
                    // TODO: If this script runs every 10 minutes in the background: Save newMessagesCounter, check if num is higher than before, when so send push notification to user, when num
                    // smaller set newMessagesCounter to new newMessagesCounter and send no push notification
                    if (appStorage.getString('crawler_data')) {
                      let newMessages = JSON.parse(
                        appStorage.getString('crawler_data'),
                      );
                      if (
                        newMessages.userInformation.name.toString() ===
                        name
                      ) {
                        let jsonNewMessages = parseInt(
                          newMessages.homepageMessages.newMessagesCounter.toString(),
                        );
                        // TODO: Send push notification to user with the following => "Du hast (newMessagesCounter-jsonNewMessages) neue Nachricht/en erhalten. Die letzte Nachricht wurde von
                        // newMessageSender gesendet.
                        const messageCountDiff =
                          newMessagesCounter - jsonNewMessages;
                        const messageText = `Du hast ${
                          messageCountDiff > 1
                            ? messageCountDiff
                            : 1
                        } neue Nachricht${
                          messageCountDiff !== 1 ? 'en' : ''
                        } erhalten. Die letzte Nachricht wurde von ${newMessageSender} gesendet.`;

                        console.log(messageText);
                        PushNotification.localNotification({
                            channelId: "evimanager",
                            bigText: messageText,
                            title: newMessageSender,
                            message: messageText,
                        })
                      }
                    }
              } else {
                console.log('Wrong username or password');
                appStorage.set('crawler_data', '');
              }
            }
                )
    }}})
    } catch (e) {
      console.log(e);
    }
  };

export default {ytm}