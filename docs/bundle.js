/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

// console.log('This is working.');

__webpack_require__(1);

__webpack_require__(2);

__webpack_require__(3);

// edit to add/remove new members to get information from twitch api
// however, html is not dynamically generated based on this list so it will
// need to be manually changed as well
const nlssMembers = ["northernlion", "rockleesmile", "jsmithoti", "cobaltstreak", "alpacapatrol", "last_grey_wolf", "baertaffy", "michaelalfox", "mathasgames", "dangheesling", "lovelymomo", "sinvicta", "eluc", "draculafetus", "indeimaus"];

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
    let channelInfo, liveInfo, streamOnline, streamGame, streamId, streamImage, streamName, streamLink, liveTitle, liveGame, gameInfo, gameName;

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
    nlssMembers.map(i => {
        idUrl += '&login=' + i;
    });
    // uses new es6 fetch function, rather than relying on XMLHTTPRequest;
    // much easier to parse
    fetch(new Request(idUrl, requestHeader)).then(function (response) {
        return response.json();
    }).then(function (streamData) {
        // manipulation of the json received from twitch
        channelInfo = streamData.data;
        // console.log(channelInfo);
        // each member listed in an array
        channelInfo.map(i => {
            streamId = i.id;
            streamName = i.login;
            streamDisplay = i.display_name.replace(/_/g, " "); //regex replaces _ with spaces
            streamImage = i.profile_image_url;
            streamLink = 'https://www.twitch.tv/' + i.login;
            // document.getElementsByClassName('memberGrid')[0].innerHTML += 
            //     `<div class='memberContainer ${streamId}'>
            //     <img class='memberImage' src='${streamImage}'></img>
            //     <div class='memberName'>${streamName}</div>
            //     </div>`
            //     ;

            // add ID as class because live info does not have login names,
            // only ID; necessary for proper reference
            document.getElementsByClassName(streamName)[0].classList.add(streamId);
            let curMC = document.getElementsByClassName('mContent ' + streamName)[0].getElementsByTagName('div');
            curMC[0].innerHTML = streamDisplay;
            curMC[1].innerHTML = `<a href='${streamLink}' target='_blank'>
            <img src=${streamImage} /></a>`;
        });
        // get stream info
        // placed within the user information call because it relies on the IDs of
        // the members in order to place the information in the correct location
        // Same format as the call for the user information.
        let streamUrl = apiStream;
        nlssMembers.map(i => {
            streamUrl += '&user_login=' + i;
        });
        fetch(new Request(streamUrl, requestHeader)).then(function (response) {
            return response.json();
        }).then(function (streamData) {
            liveInfo = streamData.data;
            // console.log(liveInfo);
            liveInfo.map(i => {
                id = '' + i.user_id;
                liveTitle = i.title;
                liveGame = i.game_id;
                // must call twitch API again to translate game_id into a game name
                let gameUrl = apiGames + liveGame;

                let idDiv = document.getElementsByClassName(id)[0];
                fetch(new Request(gameUrl, requestHeader)).then(function (response) {
                    return response.json();
                }).then(function (gameData) {
                    gameInfo = gameData.data[0];
                    gameName = gameInfo.name;

                    // add elements
                    // console.log(idDiv.classList[1]);
                    document.getElementsByClassName('mContent ' + idDiv.classList[1])[0].getElementsByTagName('div')[2].innerHTML = `Currently Playing: ${gameName}`;
                });

                idDiv.classList.add('live');
            });
        });
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
    openMA.map(m => {
        m.onclick = () => {
            modal.style.display = 'flex';
            // console.log(m.classList[1]);
            // shows modal content of the member that was clicked on
            let curModal = document.getElementsByClassName('mContent ' + m.classList[1])[0];
            curModal.style.display = 'flex';
        };
    });

    // hides modal window on exit: either through X button or by clicking
    // on the dimmed background by hiding the modal window
    closeM.onclick = () => {
        modal.style.display = 'none';
        // properly hides the modal content of the member that was clicked on
        // so that when a different member is clicked on, the previous information
        // is hidden.
        hideMA.map(m => {
            m.style.display = 'none';
        });
    };
    // see above
    window.onclick = e => {
        if (e.target == modal) {
            modal.style.display = 'none';
            hideMA.map(m => {
                m.style.display = 'none';
            });
        }
    };
}

// waits for all DOM elements to be loaded before functions are executed
window.onload = () => {
    streamInfo(nlssMembers);
    modalShow();
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = "./index.html";

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGVkMjdkYTZmMjZkMTc3MGM5NjgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hbXB1cnBvc2Uuc2NzcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi5zY3NzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5odG1sIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJubHNzTWVtYmVycyIsImFwaUlkIiwiYXBpU3RyZWFtIiwiYXBpR2FtZXMiLCJzdHJlYW1JbmZvIiwiY2hhbm5lbCIsImNoYW5uZWxJbmZvIiwibGl2ZUluZm8iLCJzdHJlYW1PbmxpbmUiLCJzdHJlYW1HYW1lIiwic3RyZWFtSWQiLCJzdHJlYW1JbWFnZSIsInN0cmVhbU5hbWUiLCJzdHJlYW1MaW5rIiwibGl2ZVRpdGxlIiwibGl2ZUdhbWUiLCJnYW1lSW5mbyIsImdhbWVOYW1lIiwicmVxdWVzdEhlYWRlciIsIm1ldGhvZCIsImhlYWRlcnMiLCJIZWFkZXJzIiwiaWRVcmwiLCJtYXAiLCJpIiwiZmV0Y2giLCJSZXF1ZXN0IiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsInN0cmVhbURhdGEiLCJkYXRhIiwiaWQiLCJsb2dpbiIsInN0cmVhbURpc3BsYXkiLCJkaXNwbGF5X25hbWUiLCJyZXBsYWNlIiwicHJvZmlsZV9pbWFnZV91cmwiLCJkb2N1bWVudCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJjbGFzc0xpc3QiLCJhZGQiLCJjdXJNQyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiaW5uZXJIVE1MIiwic3RyZWFtVXJsIiwidXNlcl9pZCIsInRpdGxlIiwiZ2FtZV9pZCIsImdhbWVVcmwiLCJpZERpdiIsImdhbWVEYXRhIiwibmFtZSIsIm1vZGFsU2hvdyIsIm1vZGFsIiwib3Blbk0iLCJjbG9zZU0iLCJoaWRlTSIsIm9wZW5NQSIsIkFycmF5IiwiZnJvbSIsImhpZGVNQSIsIm0iLCJvbmNsaWNrIiwi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QUFULENBQWVDLE9BQWYsR0FBeUIsTUFBekI7QUFDSCxTQU5EO0FBT0gsS0FSRDs7QUFVQTtBQUNBO0FBQ0FULFdBQU9PLE9BQVAsR0FBaUIsTUFBTTtBQUNuQlQsY0FBTVUsS0FBTixDQUFZQyxPQUFaLEdBQXNCLE1BQXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0FKLGVBQU90QyxHQUFQLENBQVl1QyxDQUFELElBQU87QUFDZEEsY0FBRUUsS0FBRixDQUFRQyxPQUFSLEdBQWtCLE1BQWxCO0FBQ0gsU0FGRDtBQUdILEtBUkQ7QUFTQTtBQUNBRSxXQUFPSixPQUFQLEdBQWtCSyxDQUFELElBQU87QUFDcEIsWUFBSUEsRUFBRUMsTUFBRixJQUFZZixLQUFoQixFQUF1QjtBQUNuQkEsa0JBQU1VLEtBQU4sQ0FBWUMsT0FBWixHQUFzQixNQUF0QjtBQUNBSixtQkFBT3RDLEdBQVAsQ0FBWXVDLENBQUQsSUFBTztBQUNkQSxrQkFBRUUsS0FBRixDQUFRQyxPQUFSLEdBQWtCLE1BQWxCO0FBQ0gsYUFGRDtBQUdIO0FBQ0osS0FQRDtBQVFIOztBQUVEO0FBQ0FFLE9BQU9HLE1BQVAsR0FBZ0IsTUFBSztBQUNqQmxFLGVBQVdKLFdBQVg7QUFDQXFEO0FBQ0gsQ0FIRCxDOzs7Ozs7QUMxS0EseUM7Ozs7OztBQ0FBLHlDOzs7Ozs7QUNBQSxnQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJkaXN0L1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDhlZDI3ZGE2ZjI2ZDE3NzBjOTY4IiwiLy8gY29uc29sZS5sb2coJ1RoaXMgaXMgd29ya2luZy4nKTtcblxucmVxdWlyZShcIi4vYW1wdXJwb3NlLnNjc3NcIik7XG5cbnJlcXVpcmUoXCIuL21haW4uc2Nzc1wiKTtcblxucmVxdWlyZShcIi4vaW5kZXguaHRtbFwiKTtcblxuLy8gZWRpdCB0byBhZGQvcmVtb3ZlIG5ldyBtZW1iZXJzIHRvIGdldCBpbmZvcm1hdGlvbiBmcm9tIHR3aXRjaCBhcGlcbi8vIGhvd2V2ZXIsIGh0bWwgaXMgbm90IGR5bmFtaWNhbGx5IGdlbmVyYXRlZCBiYXNlZCBvbiB0aGlzIGxpc3Qgc28gaXQgd2lsbFxuLy8gbmVlZCB0byBiZSBtYW51YWxseSBjaGFuZ2VkIGFzIHdlbGxcbmNvbnN0IG5sc3NNZW1iZXJzID0gW1wibm9ydGhlcm5saW9uXCIsIFwicm9ja2xlZXNtaWxlXCIsIFwianNtaXRob3RpXCIsIFxuXCJjb2JhbHRzdHJlYWtcIiwgXCJhbHBhY2FwYXRyb2xcIiwgXCJsYXN0X2dyZXlfd29sZlwiLCBcImJhZXJ0YWZmeVwiLCBcblwibWljaGFlbGFsZm94XCIsIFwibWF0aGFzZ2FtZXNcIiwgXCJkYW5naGVlc2xpbmdcIiwgXCJsb3ZlbHltb21vXCIsXG5cInNpbnZpY3RhXCIsIFwiZWx1Y1wiLCBcImRyYWN1bGFmZXR1c1wiLCBcImluZGVpbWF1c1wiXVxuXG4vLyB0d2l0Y2ggQVBJIHVybHMgLSBoZWxpeFxuY29uc3QgYXBpSWQgPSBcImh0dHBzOi8vYXBpLnR3aXRjaC50di9oZWxpeC91c2Vycz9cIjsgLy91c2VyIGluZm9cbmNvbnN0IGFwaVN0cmVhbSA9IFwiaHR0cHM6Ly9hcGkudHdpdGNoLnR2L2hlbGl4L3N0cmVhbXM/XCI7IC8vbGl2ZSB1c2VycyBpbmZvXG5jb25zdCBhcGlHYW1lcyA9IFwiaHR0cHM6Ly9hcGkudHdpdGNoLnR2L2hlbGl4L2dhbWVzP2lkPVwiOyAvL2dhbWUgaW5mb1xuLy8gdHdpdGNoIGFwaSB2NSAtIGtyYWtlblxuLy8gY29uc3QgYXBpSUQgPSBcImh0dHBzOi8vYXBpLnR3aXRjaC50di9rcmFrZW4vdXNlcnM/bG9naW49XCI7XG4vLyBjb25zdCBhcGlTdHJlYW0gPSBcImh0dHBzOi8vYXBpLnR3aXRjaC50di9rcmFrZW4vc3RyZWFtcy9cIjtcbi8vIGNvbnN0IGFwaUNoYW5uZWwgPSBcImh0dHBzOi8vYXBpLnR3aXRjaC50di9rcmFrZW4vY2hhbm5lbHMvXCI7XG5cbi8vIGdldCBpbmZvIGZyb20gdHdpdGNoIEFQSVxuZnVuY3Rpb24gc3RyZWFtSW5mbyhjaGFubmVsKSB7XG4gICAgbGV0IGNoYW5uZWxJbmZvLCBsaXZlSW5mbywgc3RyZWFtT25saW5lLCBzdHJlYW1HYW1lLCBzdHJlYW1JZCwgc3RyZWFtSW1hZ2UsIFxuICAgIHN0cmVhbU5hbWUsIHN0cmVhbUxpbmssIGxpdmVUaXRsZSwgbGl2ZUdhbWUsIGdhbWVJbmZvLCBnYW1lTmFtZTtcblxuICAgIC8vIGhlYWRlciBmb3IgYWxsIHR3aXRjaCBhcGkgY2FsbHMgLSB1c2VkIGluIGNvbmp1Y3Rpb24gd2l0aCBSZXF1ZXN0XG4gICAgLy8gc2VlIGZldGNoIGZ1bmN0aW9uIGZvciB1c2FnZVxuICAgIGxldCByZXF1ZXN0SGVhZGVyID0ge1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICAvLyAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL3ZuZC50d2l0Y2h0di52NStqc29uJywgLy9mb3IgdHdpdGNoIHY1XG4gICAgICAgICAgICAnQ2xpZW50LUlEJzogJzRycHI0YzFjYnE5c3g2dXRscjZxa2xlajU4eXY3aSdcbiAgICAgICAgfSlcbiAgICB9O1xuXG4gICAgLy8gZ2V0IGNoYW5uZWwgaW5mb1xuICAgIC8vIGNyZWF0ZXMgcmVxdWVzdCBVUkwgd2l0aCBhbGwgb2YgdGhlIG1lbWJlcnMgbGlzdGVkIGFib3ZlLFxuICAgIC8vIGRvbmUgdGhpcyB3YXkgdG8gcmVkdWNlICMgb2YgQVBJIGNhbGxzIC0gb25seSBkb25lIG9uY2VcbiAgICAvLyBtYXkgbm90IGJlIGNvbXBsZXRlbHkgbmVjZXNzYXJ5IC0gY2FuIGhhcmR3cml0ZSBpbmZvcm1hdGlvbiBpbnRvIEhUTUxcbiAgICAvLyBtb3N0IG5lY2Vzc2FyeSBpbmZvcm1hdGlvbiBpcyB0aGUgSUQgb2YgZWFjaCBtZW1iZXIgYmVjYXVzZSBsaXZlIGluZm9cbiAgICAvLyByZWZlcmVuY2VzIElELCBub3QgbG9naW4gbmFtZS5cbiAgICBsZXQgaWRVcmwgPSBhcGlJZDtcbiAgICBubHNzTWVtYmVycy5tYXAoKGkpID0+IHtcbiAgICAgICAgaWRVcmwgKz0gJyZsb2dpbj0nK2k7XG4gICAgfSk7XG4gICAgLy8gdXNlcyBuZXcgZXM2IGZldGNoIGZ1bmN0aW9uLCByYXRoZXIgdGhhbiByZWx5aW5nIG9uIFhNTEhUVFBSZXF1ZXN0O1xuICAgIC8vIG11Y2ggZWFzaWVyIHRvIHBhcnNlXG4gICAgZmV0Y2gobmV3IFJlcXVlc3QoaWRVcmwsIHJlcXVlc3RIZWFkZXIpKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgfSkudGhlbihmdW5jdGlvbihzdHJlYW1EYXRhKSB7XG4gICAgICAgIC8vIG1hbmlwdWxhdGlvbiBvZiB0aGUganNvbiByZWNlaXZlZCBmcm9tIHR3aXRjaFxuICAgICAgICBjaGFubmVsSW5mbyA9IHN0cmVhbURhdGEuZGF0YTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coY2hhbm5lbEluZm8pO1xuICAgICAgICAvLyBlYWNoIG1lbWJlciBsaXN0ZWQgaW4gYW4gYXJyYXlcbiAgICAgICAgY2hhbm5lbEluZm8ubWFwKChpKSA9PiB7XG4gICAgICAgICAgICBzdHJlYW1JZCA9IGkuaWQ7XG4gICAgICAgICAgICBzdHJlYW1OYW1lID0gaS5sb2dpbjtcbiAgICAgICAgICAgIHN0cmVhbURpc3BsYXkgPSBpLmRpc3BsYXlfbmFtZS5yZXBsYWNlKC9fL2csXCIgXCIpOyAvL3JlZ2V4IHJlcGxhY2VzIF8gd2l0aCBzcGFjZXNcbiAgICAgICAgICAgIHN0cmVhbUltYWdlID0gaS5wcm9maWxlX2ltYWdlX3VybDtcbiAgICAgICAgICAgIHN0cmVhbUxpbmsgPSAnaHR0cHM6Ly93d3cudHdpdGNoLnR2LycraS5sb2dpbjtcbiAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21lbWJlckdyaWQnKVswXS5pbm5lckhUTUwgKz0gXG4gICAgICAgICAgICAvLyAgICAgYDxkaXYgY2xhc3M9J21lbWJlckNvbnRhaW5lciAke3N0cmVhbUlkfSc+XG4gICAgICAgICAgICAvLyAgICAgPGltZyBjbGFzcz0nbWVtYmVySW1hZ2UnIHNyYz0nJHtzdHJlYW1JbWFnZX0nPjwvaW1nPlxuICAgICAgICAgICAgLy8gICAgIDxkaXYgY2xhc3M9J21lbWJlck5hbWUnPiR7c3RyZWFtTmFtZX08L2Rpdj5cbiAgICAgICAgICAgIC8vICAgICA8L2Rpdj5gXG4gICAgICAgICAgICAvLyAgICAgO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGFkZCBJRCBhcyBjbGFzcyBiZWNhdXNlIGxpdmUgaW5mbyBkb2VzIG5vdCBoYXZlIGxvZ2luIG5hbWVzLFxuICAgICAgICAgICAgLy8gb25seSBJRDsgbmVjZXNzYXJ5IGZvciBwcm9wZXIgcmVmZXJlbmNlXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHN0cmVhbU5hbWUpWzBdLmNsYXNzTGlzdC5hZGQoc3RyZWFtSWQpO1xuICAgICAgICAgICAgbGV0IGN1ck1DID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbUNvbnRlbnQgJytzdHJlYW1OYW1lKVswXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2Jyk7XG4gICAgICAgICAgICBjdXJNQ1swXS5pbm5lckhUTUwgPSBzdHJlYW1EaXNwbGF5O1xuICAgICAgICAgICAgY3VyTUNbMV0uaW5uZXJIVE1MID0gYDxhIGhyZWY9JyR7c3RyZWFtTGlua30nIHRhcmdldD0nX2JsYW5rJz5cbiAgICAgICAgICAgIDxpbWcgc3JjPSR7c3RyZWFtSW1hZ2V9IC8+PC9hPmA7XG5cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGdldCBzdHJlYW0gaW5mb1xuICAgICAgICAvLyBwbGFjZWQgd2l0aGluIHRoZSB1c2VyIGluZm9ybWF0aW9uIGNhbGwgYmVjYXVzZSBpdCByZWxpZXMgb24gdGhlIElEcyBvZlxuICAgICAgICAvLyB0aGUgbWVtYmVycyBpbiBvcmRlciB0byBwbGFjZSB0aGUgaW5mb3JtYXRpb24gaW4gdGhlIGNvcnJlY3QgbG9jYXRpb25cbiAgICAgICAgLy8gU2FtZSBmb3JtYXQgYXMgdGhlIGNhbGwgZm9yIHRoZSB1c2VyIGluZm9ybWF0aW9uLlxuICAgICAgICBsZXQgc3RyZWFtVXJsID0gYXBpU3RyZWFtO1xuICAgICAgICBubHNzTWVtYmVycy5tYXAoKGkpPT57XG4gICAgICAgICAgICBzdHJlYW1VcmwgKz0gJyZ1c2VyX2xvZ2luPScraTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZldGNoKG5ldyBSZXF1ZXN0KHN0cmVhbVVybCwgcmVxdWVzdEhlYWRlcikpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oc3RyZWFtRGF0YSkge1xuICAgICAgICAgICAgbGl2ZUluZm8gPSBzdHJlYW1EYXRhLmRhdGE7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsaXZlSW5mbyk7XG4gICAgICAgICAgICBsaXZlSW5mby5tYXAoKGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZCA9ICcnK2kudXNlcl9pZDtcbiAgICAgICAgICAgICAgICBsaXZlVGl0bGUgPSBpLnRpdGxlO1xuICAgICAgICAgICAgICAgIGxpdmVHYW1lID0gaS5nYW1lX2lkO1xuICAgICAgICAgICAgICAgIC8vIG11c3QgY2FsbCB0d2l0Y2ggQVBJIGFnYWluIHRvIHRyYW5zbGF0ZSBnYW1lX2lkIGludG8gYSBnYW1lIG5hbWVcbiAgICAgICAgICAgICAgICBsZXQgZ2FtZVVybCA9IGFwaUdhbWVzICsgbGl2ZUdhbWU7XG5cbiAgICAgICAgICAgICAgICBsZXQgaWREaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGlkKVswXVxuICAgICAgICAgICAgICAgIGZldGNoKG5ldyBSZXF1ZXN0KGdhbWVVcmwsIHJlcXVlc3RIZWFkZXIpKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihnYW1lRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBnYW1lSW5mbyA9IGdhbWVEYXRhLmRhdGFbMF07XG4gICAgICAgICAgICAgICAgICAgIGdhbWVOYW1lID0gZ2FtZUluZm8ubmFtZTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgZWxlbWVudHNcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaWREaXYuY2xhc3NMaXN0WzFdKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbUNvbnRlbnQgJytpZERpdi5jbGFzc0xpc3RbMV0pWzBdXG4gICAgICAgICAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JylbMl0uaW5uZXJIVE1MID0gXG4gICAgICAgICAgICAgICAgICAgIGBDdXJyZW50bHkgUGxheWluZzogJHtnYW1lTmFtZX1gO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICBpZERpdi5jbGFzc0xpc3QuYWRkKCdsaXZlJyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0pO1xufVxuXG4vLyBjb250cm9scyBmdW5jdGlvbmFsaXR5IGZvciB3aGVuIGEgbWVtYmVyJ3MgcG9ydHJhaXQgaXMgY2xpY2tlZCBvblxuLy8gZGlzcGxheXMgbW9kYWwgd2luZG93OiBkaW1zIHRoZSBiYWNrZ3JvdW5kIGFuZCBkaXNwbGF5cyBmbG9hdGluZyB3aW5kb3dcbi8vIHdpdGggaW5mb3JtYXRpb24gYWJvdXQgdGhlIG1lbWJlclxuZnVuY3Rpb24gbW9kYWxTaG93KCkge1xuICAgIGxldCBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vZGFsJylbMF07XG4gICAgbGV0IG9wZW5NID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWVtYmVyJyk7XG4gICAgbGV0IGNsb3NlTSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Nsb3NlJylbMF07XG4gICAgbGV0IGhpZGVNID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbUNvbnRlbnQnKTtcbiAgICAvLyBjb252ZXJ0IEhUTUxDb2xsZWN0aW9uIGludG8gYXJyYXkgLSBlczZcbiAgICAvLyBjb252ZXJzaW9uIHRvIGFycmF5IGFsbG93cyB1c2FnZSBvZiBtYXAgZnVuY3Rpb24gdG8gcGVyZm9ybSBmdW5jdGlvblxuICAgIC8vIG9uIGFsbCBlbGVtZW50cyB3aXRoIGNsYXNzIHhcbiAgICBsZXQgb3Blbk1BID0gQXJyYXkuZnJvbShvcGVuTSk7XG4gICAgbGV0IGhpZGVNQSA9IEFycmF5LmZyb20oaGlkZU0pO1xuICAgIC8vIHNob3dzIG1vZGFsIGNvbnRlbnQgb24gY2xpY2sgb2YgYW55IG9mIHRoZSBtZW1iZXJzXG4gICAgb3Blbk1BLm1hcCgobSkgPT4ge1xuICAgICAgICBtLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobS5jbGFzc0xpc3RbMV0pO1xuICAgICAgICAgICAgLy8gc2hvd3MgbW9kYWwgY29udGVudCBvZiB0aGUgbWVtYmVyIHRoYXQgd2FzIGNsaWNrZWQgb25cbiAgICAgICAgICAgIGxldCBjdXJNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21Db250ZW50ICcrbS5jbGFzc0xpc3RbMV0pWzBdO1xuICAgICAgICAgICAgY3VyTW9kYWwuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBoaWRlcyBtb2RhbCB3aW5kb3cgb24gZXhpdDogZWl0aGVyIHRocm91Z2ggWCBidXR0b24gb3IgYnkgY2xpY2tpbmdcbiAgICAvLyBvbiB0aGUgZGltbWVkIGJhY2tncm91bmQgYnkgaGlkaW5nIHRoZSBtb2RhbCB3aW5kb3dcbiAgICBjbG9zZU0ub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgLy8gcHJvcGVybHkgaGlkZXMgdGhlIG1vZGFsIGNvbnRlbnQgb2YgdGhlIG1lbWJlciB0aGF0IHdhcyBjbGlja2VkIG9uXG4gICAgICAgIC8vIHNvIHRoYXQgd2hlbiBhIGRpZmZlcmVudCBtZW1iZXIgaXMgY2xpY2tlZCBvbiwgdGhlIHByZXZpb3VzIGluZm9ybWF0aW9uXG4gICAgICAgIC8vIGlzIGhpZGRlbi5cbiAgICAgICAgaGlkZU1BLm1hcCgobSkgPT4ge1xuICAgICAgICAgICAgbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9KVxuICAgIH0gXG4gICAgLy8gc2VlIGFib3ZlXG4gICAgd2luZG93Lm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICBpZiAoZS50YXJnZXQgPT0gbW9kYWwpIHtcbiAgICAgICAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBoaWRlTUEubWFwKChtKSA9PiB7XG4gICAgICAgICAgICAgICAgbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gd2FpdHMgZm9yIGFsbCBET00gZWxlbWVudHMgdG8gYmUgbG9hZGVkIGJlZm9yZSBmdW5jdGlvbnMgYXJlIGV4ZWN1dGVkXG53aW5kb3cub25sb2FkID0gKCkgPT57XG4gICAgc3RyZWFtSW5mbyhubHNzTWVtYmVycyk7XG4gICAgbW9kYWxTaG93KCk7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hbXB1cnBvc2Uuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21haW4uc2Nzc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLi9pbmRleC5odG1sXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguaHRtbFxuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9