console.log('This is working.');

require("./ampurpose.scss");

require("./main.scss");

import { ajaxGet } from "./js/ajaxget.js";

const nlssMembers = ["northernlion", "rockleesmile", "jsmithoti", 
"cobaltstreak", "alpacapatrol", "last_grey_wolf", "baertaffy", 
"roundtablepodcast"]
const apiStream = "https://api.twitch.tv/kraken/streams/";
const apiChannel = "https://api.twitch.tv/kraken/channels/";

function streamInfo(channel) {
    let streamData, offlineData, streamOnline, streamGame, streamName, streamURL;
    streamData = ajaxGet(apiStream + channel);
    switch (streamData.stream) {
        case null: //stream is offline
            streamOnline = false;
            streamGame = 'Offline';
            offlineData = ajaxGet(apiChannel + channel);
            streamName = offlineData.display_name;
            streamURL = offlineData.url;
            break;
        case undefined: //stream closed
            streamOnline = false;
            streamGame = 'Account closed';
            break;
        default: //stream online
            streamOnline = true;
            streamGame = streamData.stream.game;
            streamName = streamData.channel.display_name;
            streamURL = streamData.channel.url;
            break;
    }
    console.log(streamOnline, streamGame, streamName, streamURL);
}

streamInfo('northernlion');