const Twit = require('twit');
const moment = require('moment');
const config = require('../config');
const T = new Twit(config);

//this endpoint has useful info about the users profile as well
function extractTweetsData(tweets){
    const tweetsData = [];
    //get user profile info
    const {name, screen_name, friends_count, profile_image_url_https, profile_banner_url, id_str} = tweets.data[0].user;
    const userProfileData = {name, screen_name, friends_count, profile_image_url_https, profile_banner_url, id_str};
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

function extractMessageData(messages){
    const messagesData = [];
    messages.data.events.forEach(message => {
        const {created_timestamp, message_create:{message_data:{text}}, message_create:{ sender_id} } = message;
        const timeSent = moment(new Date(parseInt(created_timestamp))).fromNow();
        messagesData.push({timeSent, text, sender_id});
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

exports.updateStatus = async (req, res) => {
    const status = req.body.status; 
    const response = await T.post('statuses/update', {status});
    console.log(response.resp.statusCode);
    res.redirect('/');
};

//TODO finish getting the necessary user info to display it in the DMS and factor it in to the existing function
    //need to use the sender_id: to make additional requests in the DM's
    //need to compare the sender ID with my own to see if it matches -> will matter once we render the LI's
exports.viewDms = async (req, res) => {
    const idArr = []; //holds the ID's of the DM sender
    const dms = await T.get('direct_messages/events/list', {count: 5});
    dms.data.events.forEach(dm => {
        const {message_create:{ sender_id} } = dm;
        idArr.push(sender_id);
    });
    //filter duplicates out of the array so that we dont make uneccesary API calls
    const filteredIds = [...new Set(idArr)];
    //user_id can be a comma seperated list up to 100 values
    const dmSenderInfo = await  T.get('users/lookup', {user_id: filteredIds.join(',')} );
    res.json(dmSenderInfo);
}
