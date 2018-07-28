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

//user ID's need to be extracted here as well to make an API request for all users in the DM's
function extractMessageData(messages){
    const messagesData = [];
    messages.data.events.forEach(message => {
        const {created_timestamp, message_create:{message_data:{text}}, message_create:{ sender_id} } = message;
        const timeSent = moment(new Date(parseInt(created_timestamp))).fromNow();
        messagesData.push({timeSent, text, sender_id});
    });
    //filter out duplicate ID's to avoid uneccessary API calls
    const userIDs = [...new Set(messagesData.map(message => message.sender_id)) ];
    return [messagesData, userIDs];
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
    const [messagesData, userIDs] = extractMessageData(messages);
    //get info on the users in the DMs
    const dmSenderInfo = await T.get('users/lookup', {user_id: userIDs.join(',')} );
    //compare the ID's from messagesData and the dmSenderInfo response.
        //if they are equal attach the image and name to the respective message in messagesData
    messagesData.forEach(message => {
        dmSenderInfo.data.forEach(sender =>{
            if (message.sender_id === sender.id_str) {
                message.userName = sender.name;
                message.userPhoto = sender.profile_image_url_https;
            }
        });
    });
    messagesData.reverse(); //to show the more recent DM's at the bottom
    res.render('index', {title: 'Twitter Interface', tweetsData, friendsData, messagesData, userProfileData});
};

exports.updateStatus = async (req, res) => {
    const status = req.body.status; 
    const response = await T.post('statuses/update', {status});
    res.redirect('/');
};

