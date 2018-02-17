console.log('This is working.');

require("./ampurpose.scss");

require("./main.scss");

require("./index.html");

// edit to add/remove new members to get information from twitch api
// however, html is not dynamically generated based on this list so it will
// need to be manually changed as well
const nlssMembers = ["northernlion", "rockleesmile", "jsmithoti", 
"cobaltstreak", "alpacapatrol", "last_grey_wolf", "baertaffy", 
"michaelalfox", "mathasgames", "dangheesling", "lovelymomo",
"sinvicta", "eluc", "draculafetus", "indeimaus"]

// twitch API urls - helix
const apiId = "https://api.twitch.tv/helix/users?"; //user info
const apiStream = "https://api.twitch.tv/helix/streams?"; //live users info
const apiGames = "https://api.twitch.tv/helix/games?id="; //game info
// twitch api v5 - kraken
// const apiID = "https://api.twitch.tv/kraken/users?login=";
// const apiStream = "https://api.twitch.tv/kraken/streams/";
// const apiChannel = "https://api.twitch.tv/kraken/channels/";

// get info from twitch API
function streamInfo(channel) {
    let channelInfo, liveInfo, streamOnline, streamGame, streamId, streamImage, 
    streamName, streamLink, liveTitle, liveGame, gameInfo, gameName;

    // header for all twitch api calls - used in conjuction with Request
    // see fetch function for usage
    let requestHeader = {
        method: 'GET',
        headers: new Headers({
            // 'Accept': 'application/vnd.twitchtv.v5+json', //for twitch v5
            'Client-ID': '4rpr4c1cbq9sx6utlr6qklej58yv7i'
        })
    };

    // get channel info
    // creates request URL with all of the members listed above,
    // done this way to reduce # of API calls - only done once
    // may not be completely necessary - can hardwrite information into HTML
    // most necessary information is the ID of each member because live info
    // references ID, not login name.
    let idUrl = apiId;
    nlssMembers.map((i) => {
        idUrl += '&login='+i;
    });
    // uses new es6 fetch function, rather than relying on XMLHTTPRequest;
    // much easier to parse
    fetch(new Request(idUrl, requestHeader)).then(function(response) {
        return response.json();
    }).then(function(streamData) {
        // manipulation of the json received from twitch
        channelInfo = streamData.data;
        console.log(channelInfo);
        // each member listed in an array
        channelInfo.map((i) => {
            streamId = i.id;
            streamName = i.login;
            streamDisplay = i.display_name;
            streamImage = i.profile_image_url;
            streamLink = 'https://www.twitch.tv/'+i.login;
            // document.getElementsByClassName('memberGrid')[0].innerHTML += 
            //     `<div class='memberContainer ${streamId}'>
            //     <img class='memberImage' src='${streamImage}'></img>
            //     <div class='memberName'>${streamName}</div>
            //     </div>`
            //     ;
        
            // add ID as class because live info does not have login names,
            // only ID; necessary for proper reference
            document.getElementsByClassName(streamName)[0].classList.add(streamId);
            let curMC = document.getElementsByClassName('mContent '+streamName)[0].getElementsByTagName('div');
            curMC[1].innerHTML = streamDisplay;
            curMC[1].innerHTML = `<img src=${streamImage} />`;

        });
        // get stream info
        // placed within the user information call because it relies on the IDs of
        // the members in order to place the information in the correct location
        // Same format as the call for the user information.
        let streamUrl = apiStream;
        nlssMembers.map((i)=>{
            streamUrl += '&user_login='+i;
        });
        fetch(new Request(streamUrl, requestHeader)).then(function(response) {
            return response.json();
        }).then(function(streamData) {
            liveInfo = streamData.data;
            console.log(liveInfo);
            liveInfo.map((i) => {
                id = ''+i.user_id;
                liveTitle = i.title;
                liveGame = i.game_id;
                // must call twitch API again to translate game_id into a game name
                let gameUrl = apiGames + liveGame;

                let idDiv = document.getElementsByClassName(id)[0]
                fetch(new Request(gameUrl, requestHeader)).then(function(response) {
                    return response.json();
                }).then(function(gameData) {
                    gameInfo = gameData.data[0];
                    gameName = gameInfo.name;

                    // add elements
                    console.log(idDiv.classList[1]);
                    document.getElementsByClassName('mContent '+idDiv.classList[1])[0]
                    .getElementsByTagName('div')[2].innerHTML = 
                    `Currently Playing: ${gameName}`;
                    
                })

               idDiv.classList.add('live');
                
            })
        })
    });
}

// controls functionality for when a member's portrait is clicked on
// displays modal window: dims the background and displays floating window
// with information about the member
function modalShow() {
    let modal = document.getElementsByClassName('modal')[0];
    let openM = document.getElementsByClassName('member');
    let closeM = document.getElementsByClassName('close')[0];
    let hideM = document.getElementsByClassName('mContent');
    // convert HTMLCollection into array - es6
    // conversion to array allows usage of map function to perform function
    // on all elements with class x
    let openMA = Array.from(openM);
    let hideMA = Array.from(hideM);
    // shows modal content on click of any of the members
    openMA.map((m) => {
        m.onclick = () => {
            modal.style.display = 'flex';
            console.log(m.classList[1]);
            // shows modal content of the member that was clicked on
            let curModal = document.getElementsByClassName('mContent '+m.classList[1])[0];
            curModal.style.display = 'flex';
        }
    })

    // hides modal window on exit: either through X button or by clicking
    // on the dimmed background by hiding the modal window
    closeM.onclick = () => {
        modal.style.display = 'none';
        // properly hides the modal content of the member that was clicked on
        // so that when a different member is clicked on, the previous information
        // is hidden.
        hideMA.map((m) => {
            m.style.display = 'none';
        })
    } 
    // see above
    window.onclick = (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
            hideMA.map((m) => {
                m.style.display = 'none';
            })
        }
    }
}

// waits for all DOM elements to be loaded before functions are executed
window.onload = () =>{
    streamInfo(nlssMembers);
    modalShow();
}