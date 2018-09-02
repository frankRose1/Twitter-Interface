# Twitter Interface
This app uses Node, Express, and Twitter's REST API to display activity from a twitter account in the browser. Users can post tweets, view recent DM's and friend activity. 

## How To Use
* Download or clone this repo
* run ```npm install``` to install the dependencies
* Create a file named 'config.js' on the root directory of the project
* The config.js should have the following format:
```javascript
const config = {
    consumer_key: "YOUR KEY",
    consumer_secret: "YOUR SECRET",
    access_token: "YOUR TOKEN",
    access_token_secret: "YOUR TOKEN SECRET"
};

module.exports = config;
```
* To get the values for the config you'll need to create a [twitter app](https://apps.twitter.com/)
* run ```npm start``` in the console
* Visit http://localhost:3000/ in the browser and you'll be good to go

## App Features
* A user is authenticated and able to interact with the Twitter API via [twit](https://www.npmjs.com/package/twit)
* 5 most recent DM's, tweets, and friend activity
    * To change the number of results from the API response that count option must be changed:
        ```javascript
            T.get('statuses/user_timeline', {count: 10})
        ```
* Users can post a new tweet from the interface
    * ```javascript
        T.post('statuses/update', {status: 'Hello World!'})
    ```
* Users can see the number of likes and retweets on their posts
* If a user has a banner image on their twitter profile, it's displayed at the top of the page
* Error page for undefined routes

## Dependencies
* [twit](https://www.npmjs.com/package/twit) - twitter API client for node
* [body-parser](https://www.npmjs.com/package/body-parser)
* [express](https://www.npmjs.com/package/express)
* [moment](https://www.npmjs.com/package/moment)
* [pug](https://www.npmjs.com/package/pug)

## Author
Frank Rosendorf