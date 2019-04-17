const puppeteer = require('puppeteer');
const chromePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
const fs = require('fs');

runBot();

function runBot () {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ executablePath: chromePath, headless: false });

      const page = await browser.newPage();
      
      await page.goto("https://www.britannica.com/topic/list-of-countries-1993160", {
        timeout: 0,
        waitUntil: 'load'
      });

      await page.waitForSelector('.with-dots li');
      const lis = await page.$$('.with-dots li');
      
      console.log(lis.length);
      let countries = [];
      for (let i = 0; i < lis.length; i++) {
        countries.push(await page.evaluate(em => em.innerText, lis[i]))
      }
      
      fs.writeFileSync('countries.json', JSON.stringify(countries));
      resolve('done');
    } catch (error) {
      reject(error);
    }
  });
}