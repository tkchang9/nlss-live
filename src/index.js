console.log('This is working.');

require("./ampurpose.scss");

require("./main.scss");

const nlssMembers = ["northernlion", "rockleesmile", "jsmithoti", 
"cobaltstreak", "alpacapatrol", "last_grey_wolf", "baertaffy", 
"roundtablepodcast"]
const apiID = "https://api.twitch.tv/kraken/users?login=";
const apiStream = "https://api.twitch.tv/kraken/streams/";
const apiChannel = "https://api.twitch.tv/kraken/channels/";

function streamInfo(channel) {
    let streamID, offlineData, streamOnline, streamGame, streamName, streamURL;
    // streamID = ajaxGet(apiID + channel).then(function(results){console.log(results)});
    // console.log(streamID);
    // streamData = ajaxGet(apiStream + streamID);
    // switch (streamData.stream) {
    //     case null: //stream is offline
    //         streamOnline = false;
    //         streamGame = 'Offline';
    //         offlineData = ajaxGet(apiChannel + streamID);
    //         streamName = offlineData.display_name;
    //         streamURL = offlineData.url;
    //         break;
    //     case undefined: //stream closed
    //         streamOnline = false;
    //         streamGame = 'Account closed';
    //         break;
    //     default: //stream online
    //         streamOnline = true;
    //         streamGame = streamData.stream.game;
    //         streamName = streamData.channel.display_name;
    //         streamURL = streamData.channel.url;
    //         break;
    // }

    let streamRequest = new Request(apiID + channel, {
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': '4rpr4c1cbq9sx6utlr6qklej58yv7i'
            })
        });

    fetch(streamRequest).then(function(response){
        return response.json();
    }).then(function(streamData) {
        console.log(streamData);
        
    });

    // $.ajax({
    //     url: apiID + channel,
    //     type: "GET",
    //     headers: {
    //         'Client-ID': '4rpr4c1cbq9sx6utlr6qklej58yv7i',
    //         'Accept': 'application/vnd.twitchtv.v5+json'
    //     },
    //     success: function(data) {
    //         console.log(data);
    //     }
        
    // });
}


streamInfo('northernlion');