const Twit = require('twit');
const moment = require('moment');
const config = require('../config');
const T = new Twit(config);

//this endpoint has useful info about the users profile as well
function extractTweetsData(tweets){
    const tweetsData = [];
    //get user profile info
    const {name, screen_name, friends_count, profile_image_url_https, profile_banner_url} = tweets.data[0].user;
    const userProfileData = {name, screen_name, friends_count, profile_image_url_https, profile_banner_url};
    //push data about each tweet to an array
    tweets.data.forEach( tweet => {
        const {text, retweet_count, favorite_count, created_at} = tweet;
        const formattedDate = moment(new Date(created_at)).fromNow();
        tweetsData.push( {text, retweet_count, favorite_count, formattedDate} );
    });
    return [tweetsData, userProfileData];
}

function extractFriendsData(friends){
    const friendsData = [];
    friends.data.users.forEach(friend => {
        const {name, screen_name, profile_image_url} = friend;
        friendsData.push({name, screen_name, profile_image_url});
    });
    return friendsData;
}

//TODO if there are no DM's in the last 30 days, tell the user somehow
//TODO in the PUG file, "conversation with ..."
function extractMessageData(messages){
    const messagesData = [];
    messages.data.events.forEach(message => {
        const {created_timestamp, message_create:{message_data:{text}} } = message;
        const timeSent = moment(new Date(parseInt(created_timestamp))).fromNow();
        messagesData.push({timeSent, text});
    });
    //reverse messages to show the more recent at the bottom
    const reversedMessages = messagesData.reverse();
    return reversedMessages;
}

exports.getTwitterData = async (req, res) => {
    const twitterData = await Promise.all([
        T.get('statuses/user_timeline', {count: 5}),
        T.get('friends/list', {count: 5}),
        T.get('direct_messages/events/list', {count: 5})
    ]);
    //deconstruct the response
    const [tweets, friends, messages] = twitterData;
    //extract the data needed
    const [tweetsData, userProfileData] = extractTweetsData(tweets);
    const friendsData = extractFriendsData(friends);
    const messagesData = extractMessageData(messages);
    console.log(res.statusCode);
    //pass it all to the PUG
    res.render('index', {title: 'Twitter Interface', tweetsData, friendsData, messagesData, userProfileData});
};

// For each update attempt, the update text is compared with the authenticating user’s recent Tweets. 
// Any attempt that would result in duplication will be blocked, resulting in a 403 error. A user cannot submit the same status twice in a row.
exports.updateStatus = async (req, res) => {
    const status = req.body.status; 
    const response = await T.post('statuses/update', {status});
    console.log(response.resp.statusCode);
    res.redirect('/');
};