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

exports.getFriends = async (req, res) => {
    //need profile image, real name, screen name
    const friendsData = [];
    const friends = await T.get('friends/list', {count: 5});
    friends.data.users.forEach(friend => {
        const {name, screen_name, profile_image_url} = friend;
        friendsData.push({name, screen_name, profile_image_url});
    });

    console.log(friends.resp.statusCode);
    // res.json(friendsData);
    res.render('index', {title: 'Twitter Interface', friendsData});
};

//this endpoint returns all Direct Message events (both sent and received) within the last 30 days
//** will be i nreverse chronological order */
    // message body
    // date the message was sent
    // time the message was sent
exports.getDirectMessages = async (req, res) => {
    const messagesData = [];
    const directMessages = await T.get('direct_messages/events/list', {count: 5});
    directMessages.data.events.forEach(message => {
        const {created_timestamp, message_create:{message_data:{text}} } = message;
        const timeSent = moment(new Date(parseInt(created_timestamp))).fromNow();
        messagesData.push({timeSent, text});
    });
    // res.json(messagesData);
    res.render('index', {title: "Twitter Client", messagesData});
};