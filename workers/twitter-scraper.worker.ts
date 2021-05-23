import puppeteer from 'puppeteer'
import PythonService from '../services/pythonService';

const TWITTER_BASE_URL = "https://twitter.com/search?q=%23";

const PUPPETEER_CONFIG = {
  headless: false,
  ignoreHTTPSErrors: true,
  userDataDir: './tmp',
  slowMo: 10,
  args : [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
    '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
  ]
};

export default class TwitterScraperWorker {
  public static async scrapHashTagAndTreatTweets(hashTag: string): Promise<void> {
    const tweets = await this._scrapHashTag(hashTag);
    const nlpTreatedTweets = await this._applyNlp(tweets);
    await this._storeData(nlpTreatedTweets);
  }

  private static async _scrapHashTag(hashTag: string): Promise<string[]> {
    const page = await this._launchSearchPageForHashTag(hashTag);
    await page.waitForSelector('article');
    return page.evaluate(() => Array.from( document.querySelectorAll( 'article' ), element => element.textContent));
  }

  private static async _launchSearchPageForHashTag(hashTag: string): Promise<puppeteer.Page> {
    const browser = await puppeteer.launch(PUPPETEER_CONFIG);
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    await page.goto(`${TWITTER_BASE_URL}${hashTag}`);
    return page;
  }

  private static async _applyNlp(tweets: any): Promise<any> {
    const pasrsedTweets = this._parseTweets(tweets);
    const tweetsWithNlp = await PythonService.nlp(pasrsedTweets);
    return JSON.parse(tweetsWithNlp.toString());
  }

  private static async _storeData(data: any): Promise<any> {
    // TODO
    console.log('Stored Tweets', data)
  }

  private static _parseTweets(tweets: string[]): string[] {
    return tweets.map((tweet) => tweet.replace(/(\r\n|\n|\r)/gm, ""));
  }
}