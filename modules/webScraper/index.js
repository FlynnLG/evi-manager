const puppeteer = require('puppeteer');
const localData = require('./local.json')
const url = "https://gymnasium-neuruppin.de/"

const username = localData.username;
const password = localData.password;


(async () => {
    /* Initiate the Puppeteer browser */
    const browser = await puppeteer.launch({headless: true}); //Set to false when you want to see the browser
    const page = await browser.newPage();
    /* Go to the IMDB Movie page and wait for it to load */
    await page.goto(url, { waitUntil: 'networkidle0' });
    /* Run javascript inside of the page */
    

    /*let data = await page.evaluate(() => {
      /* Returning an object filled with the scraped data 
      const userInput = document.getElementsByName("user");
      const passInput = document.getElementsByName("pass")
      const submitButton = document.getElementsByTagName("input")[2];
      return {
        userInput,
        passInput,
        submitButton
      }
    });*/
    
    const userInput = await page.$x('xpath/html/body/div[2]/div[3]/center/table/tbody/tr[2]/td/form/table/tbody/tr[1]/td[1]/input[2]');
    const passInput = await page.$x('xpath/html/body/div[2]/div[3]/center/table/tbody/tr[2]/td/form/table/tbody/tr[2]/td[1]/input');
    const submitButton = await page.$x('xpath/html/body/div[2]/div[3]/center/table/tbody/tr[2]/td/form/table/tbody/tr[2]/td[2]/input');

    await page.type(userInput, username)
    await page.type(passInput, password)
    await page.loginButton(submitButton)
    
    //After that he should be in the System (when te error isn't there anymore)
    //scrape first Stundenplan
    //scrape then Vertretungsplan
    //anad at least how many messages you got and the real name of the user

    

    await browser.close();
  })();