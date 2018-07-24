const Twit = require('twit');
const moment = require('moment');
const config = require('../config');
const T = new Twit(config);

// information needed from the tweets Tweets
    // message content
    // # of retweets
    // # of likes
    // date tweeted

//** this endpoint also has a lot of information about the user profile that wil be needed */
exports.getTweets = async (req, res) => {
    const tweetsData = [];
    const tweets = await T.get('statuses/user_timeline', {count: 5});
    //get profile info
    const {name, screen_name, followers_count, profile_image_url} = tweets.data[0].user;
    const userProfileData = {name, screen_name, followers_count, profile_image_url};

    tweets.data.forEach( tweet => {
        const {text, retweet_count, favorite_count, created_at} = tweet;
        const formattedDate = moment(new Date(created_at)).fromNow();
        tweetsData.push( {text, retweet_count, favorite_count, formattedDate} );
    });
    
    // res.json(tweets);
    res.render("index", {title: "Twitter Interface", tweetsData, userProfileData});
};