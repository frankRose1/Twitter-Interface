# Twitter Interface
This app uses Node, Express, and Twitter's REST API to display activity from a twitter account in the browser.

## How To Use

* Download or clone this repo
* run ```npm install``` to install the dependencies
* Create a file named 'config.js' on the same level as package.json and app.js
* The config.js should have the following format:
```javascript
module.exports = {
    consumer_key: "YOUR KEY",
    consumer_secret: "YOUR SECRET",
    access_token: "YOUR TOKEN",
    access_token_secret: "YOUR TOKEN SECRET"
};
```
* To get the values for the config you'll need to create a [twitter app](https://apps.twitter.com/)
* run ```npm start``` in the console
* Visit http://localhost:7777/ in the browser and you'll be good to go

