const Twit = require('twit');
const config = require('../config');
const T = new Twit(config);

// information needed from the tweets Tweets
    // message content
    // # of retweets
    // # of likes
    // date tweeted

//** this response also has a lot of information about the user profile */
exports.getTweets = async (req, res) => {
    const allTweetsData = [];
    //get 5 most recent tweets
    const tweets = await T.get('statuses/user_timeline', {count: 5});
    //will have to pass these tweets to the PUG file
    tweets.data.forEach( tweet => {
        const {text, retweet_count, favorite_count, created_at} = tweet;
        allTweetsData.push( {text, retweet_count, favorite_count, created_at} );
    });
    
    res.json({allTweetsData});
};