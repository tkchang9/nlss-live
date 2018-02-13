console.log('This is working.');

require("./ampurpose.scss");

require("./main.scss");

const nlssMembers = ["northernlion", "rockleesmile", "jsmithoti", 
"cobaltstreak", "alpacapatrol", "last_grey_wolf", "baertaffy", 
"michaelalfox", "mathasgames", "dangheesling", "lovelymomo",
"sinvicta"]

const apiId = "https://api.twitch.tv/helix/users?";
const apiStream = "https://api.twitch.tv/helix/streams?";
// twitch api v5
// const apiID = "https://api.twitch.tv/kraken/users?login=";
// const apiStream = "https://api.twitch.tv/kraken/streams/";
// const apiChannel = "https://api.twitch.tv/kraken/channels/";


function streamInfo(channel) {
    let channelInfo, liveInfo, streamOnline, streamGame, streamId, streamImage, streamName, streamLink;

    // header for all twitch api calls - used with Request
    let requestHeader = {
        method: 'GET',
        headers: new Headers({
            // 'Accept': 'application/vnd.twitchtv.v5+json', for twitch v5
            'Client-ID': '4rpr4c1cbq9sx6utlr6qklej58yv7i'
        })
    };

    // get channel info
    let idUrl = apiId;
    nlssMembers.map((i) => {
        idUrl += '&login='+i;
    });
    fetch(new Request(idUrl, requestHeader)).then(function(response) {
        return response.json();
    }).then(function(streamData) {
        channelInfo = streamData.data;
        console.log(channelInfo);
        channelInfo.map((i) => {
            streamId = i.id;
            streamName = i.login;
            streamImage = i.profile_image_url;
            streamLink = 'https://www.twitch.tv/'+i.login;
            // document.getElementsByClassName('memberGrid')[0].innerHTML += 
            //     `<div class='memberContainer ${streamId}'>
            //     <img class='memberImage' src='${streamImage}'></img>
            //     <div class='memberName'>${streamName}</div>
            //     </div>`
            //     ;
            // add id as class because live info does not have login names, only id
            document.getElementsByClassName(streamName)[0].classList.add(streamId);
        });
        // get stream info
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
                document.getElementsByClassName(id)[0].classList.add('live');
    
            })
        })
    });
}

function modalShow() {
    let modal = document.getElementsByClassName('modal')[0];
    let openM = document.getElementsByClassName('member');
    let closeM = document.getElementsByClassName('close')[0];
    // convert HTMLCollection into array - es6
    let openMA = Array.from(openM);
    openMA.map((m) => {
        m.onclick = () => {
            modal.style.display = 'block';
        }
    })
    closeM.onclick = () => {
        modal.style.display = 'none';
    } 
    window.onclick = (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    }
}


window.onload = () =>{
    streamInfo(nlssMembers);
    modalShow();
}