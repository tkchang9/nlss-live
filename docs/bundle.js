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

__webpack_require__(4);

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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./austin.png": 5,
	"./baer.png": 6,
	"./cobalt.png": 7,
	"./dan.png": 8,
	"./draculafetus.png": 9,
	"./eluc.png": 10,
	"./harambe.png": 11,
	"./indeimaus.png": 12,
	"./isaac.png": 13,
	"./josh.png": 14,
	"./kate.png": 15,
	"./malf.png": 16,
	"./mathas.png": 17,
	"./nick.png": 18,
	"./nl.png": 19,
	"./rob.png": 20,
	"./ryukatomo.png": 21,
	"./sinvicta.png": 22
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 4;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "./img/austin.png";

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "./img/baer.png";

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "./img/cobalt.png";

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "./img/dan.png";

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "./img/draculafetus.png";

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "./img/eluc.png";

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "./img/harambe.png";

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "./img/indeimaus.png";

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "./img/isaac.png";

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "./img/josh.png";

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "./img/kate.png";

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "./img/malf.png";

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "./img/mathas.png";

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = "./img/nick.png";

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "./img/nl.png";

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "./img/rob.png";

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "./img/ryukatomo.png";

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "./img/sinvicta.png";

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDE2YWJjOGM2OWRiYzFjYjBlODAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hbXB1cnBvc2Uuc2NzcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi5zY3NzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5odG1sIiwid2VicGFjazovLy8uL3NyYy9pbWcgXFwucG5nJCIsIndlYnBhY2s6Ly8vLi9zcmMvaW1nL2F1c3Rpbi5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltZy9iYWVyLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1nL2NvYmFsdC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltZy9kYW4ucG5nIiwid2VicGFjazovLy8uL3NyYy9pbWcvZHJhY3VsYWZldHVzLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1nL2VsdWMucG5nIiwid2VicGFjazovLy8uL3NyYy9pbWcvaGFyYW1iZS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltZy9pbmRlaW1hdXMucG5nIiwid2VicGFjazovLy8uL3NyYy9pbWcvaXNhYWMucG5nIiwid2VicGFjazovLy8uL3NyYy9pbWcvam9zaC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltZy9rYXRlLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1nL21hbGYucG5nIiwid2VicGFjazovLy8uL3NyYy9pbWcvbWF0aGFzLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1nL25pY2sucG5nIiwid2VicGFjazovLy8uL3NyYy9pbWcvbmwucG5nIiwid2VicGFjazovLy8uL3NyYy9pbWcvcm9iLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1nL3J5dWthdG9tby5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltZy9zaW52aWN0YS5wbmciXSwibmFtZXMiOlsicmVxdWlyZSIsIm5sc3NNZW1iZXJzIiwiYXBpSWQiLCJhcGlTdHJlYW0iLCJhcGlHYW1lcyIsInN0cmVhbUluZm8iLCJjaGFubmVsIiwiY2hhbm5lbEluZm8iLCJsaXZlSW5mbyIsInN0cmVhbU9ubGluZSIsInN0cmVhbUdhbWUiLCJzdHJlYW1JZCIsInN0cmVhbUltYWdlIiwic3RyZWFtTmFtZSIsInN0cmVhbUxpbmsiLCJsaXZlVGl0bGUiLCJsaXZlR2FtZSIsImdhbWVJbmZvIiwiZ2FtZU5hbWUiLCJyZXF1ZXN0SGVhZGVyIiwibWV0aG9kIiwiaGVhZGVycyIsIkhlYWRlcnMiLCJpZFVybCIsIm1hcCIsImkiLCJmZXRjaCIsIlJlcXVlc3QiLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwic3RyZWFtRGF0YSIsImRhdGEiLCJpZCIsImxvZ2luIiwic3RyZWFtRGlzcGxheSIsImRpc3BsYXlfbmFtZSIsInJlcGxhY2UiLCJwcm9maWxlX2ltYWdlX3VybCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImNsYXNzTGlzdCIsImFkZCIsImN1ck1DIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJpbm5lckhUTUwiLCJzdHJlYW1VcmwiLCJ1c2VyX2lkIiwidGl0bGUiLCJnYW1lX2lkIiwiZ2FtZVVybCIsImlkRGl2IiwiZ2FtZURhdGEiLCJuYW1lIiwibW9kYWxTaG93IiwibW9kYWwiLCJvcGVuTSIsImNsb3NlTSIsImhpZGVNIiwib3Blbk1BIiwiQXJyYXkiLCJmcm9tIiwiaGlkZU1BIiwibSIsIm9uY2xpY2siLCJzdHlsZSIsImRpc3BsYXkiLCJjdXJNb2RhbCIsIndpbmRvdyIsImUiLCJ0YXJnZXQiLCJvbmxvYWQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FB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QUFrQkssQ0FBRCxJQUFPO0FBQ3BCLFlBQUlBLEVBQUVDLE1BQUYsSUFBWWYsS0FBaEIsRUFBdUI7QUFDbkJBLGtCQUFNVSxLQUFOLENBQVlDLE9BQVosR0FBc0IsTUFBdEI7QUFDQUosbUJBQU90QyxHQUFQLENBQVl1QyxDQUFELElBQU87QUFDZEEsa0JBQUVFLEtBQUYsQ0FBUUMsT0FBUixHQUFrQixNQUFsQjtBQUNILGFBRkQ7QUFHSDtBQUNKLEtBUEQ7QUFRSDs7QUFFRDtBQUNBRSxPQUFPRyxNQUFQLEdBQWdCLE1BQUs7QUFDakJsRSxlQUFXSixXQUFYO0FBQ0FxRDtBQUNILENBSEQsQzs7Ozs7O0FDM0tBLHlDOzs7Ozs7QUNBQSx5Qzs7Ozs7O0FDQUEsZ0M7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0I7Ozs7OztBQ2xDQSxvQzs7Ozs7O0FDQUEsa0M7Ozs7OztBQ0FBLG9DOzs7Ozs7QUNBQSxpQzs7Ozs7O0FDQUEsMEM7Ozs7OztBQ0FBLGtDOzs7Ozs7QUNBQSxxQzs7Ozs7O0FDQUEsdUM7Ozs7OztBQ0FBLG1DOzs7Ozs7QUNBQSxrQzs7Ozs7O0FDQUEsa0M7Ozs7OztBQ0FBLGtDOzs7Ozs7QUNBQSxvQzs7Ozs7O0FDQUEsa0M7Ozs7OztBQ0FBLGdDOzs7Ozs7QUNBQSxpQzs7Ozs7O0FDQUEsdUM7Ozs7OztBQ0FBLHNDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcImRpc3QvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMDE2YWJjOGM2OWRiYzFjYjBlODAiLCIvLyBjb25zb2xlLmxvZygnVGhpcyBpcyB3b3JraW5nLicpO1xuXG5yZXF1aXJlKFwiLi9hbXB1cnBvc2Uuc2Nzc1wiKTtcblxucmVxdWlyZShcIi4vbWFpbi5zY3NzXCIpO1xucmVxdWlyZShcIi4vaW5kZXguaHRtbFwiKTtcblxucmVxdWlyZS5jb250ZXh0KFwiLi9pbWcvXCIsIHRydWUsIC9cXC5wbmckLyk7XG5cbi8vIGVkaXQgdG8gYWRkL3JlbW92ZSBuZXcgbWVtYmVycyB0byBnZXQgaW5mb3JtYXRpb24gZnJvbSB0d2l0Y2ggYXBpXG4vLyBob3dldmVyLCBodG1sIGlzIG5vdCBkeW5hbWljYWxseSBnZW5lcmF0ZWQgYmFzZWQgb24gdGhpcyBsaXN0IHNvIGl0IHdpbGxcbi8vIG5lZWQgdG8gYmUgbWFudWFsbHkgY2hhbmdlZCBhcyB3ZWxsXG5jb25zdCBubHNzTWVtYmVycyA9IFtcIm5vcnRoZXJubGlvblwiLCBcInJvY2tsZWVzbWlsZVwiLCBcImpzbWl0aG90aVwiLCBcblwiY29iYWx0c3RyZWFrXCIsIFwiYWxwYWNhcGF0cm9sXCIsIFwibGFzdF9ncmV5X3dvbGZcIiwgXCJiYWVydGFmZnlcIiwgXG5cIm1pY2hhZWxhbGZveFwiLCBcIm1hdGhhc2dhbWVzXCIsIFwiZGFuZ2hlZXNsaW5nXCIsIFwibG92ZWx5bW9tb1wiLFxuXCJzaW52aWN0YVwiLCBcImVsdWNcIiwgXCJkcmFjdWxhZmV0dXNcIiwgXCJpbmRlaW1hdXNcIl1cblxuLy8gdHdpdGNoIEFQSSB1cmxzIC0gaGVsaXhcbmNvbnN0IGFwaUlkID0gXCJodHRwczovL2FwaS50d2l0Y2gudHYvaGVsaXgvdXNlcnM/XCI7IC8vdXNlciBpbmZvXG5jb25zdCBhcGlTdHJlYW0gPSBcImh0dHBzOi8vYXBpLnR3aXRjaC50di9oZWxpeC9zdHJlYW1zP1wiOyAvL2xpdmUgdXNlcnMgaW5mb1xuY29uc3QgYXBpR2FtZXMgPSBcImh0dHBzOi8vYXBpLnR3aXRjaC50di9oZWxpeC9nYW1lcz9pZD1cIjsgLy9nYW1lIGluZm9cbi8vIHR3aXRjaCBhcGkgdjUgLSBrcmFrZW5cbi8vIGNvbnN0IGFwaUlEID0gXCJodHRwczovL2FwaS50d2l0Y2gudHYva3Jha2VuL3VzZXJzP2xvZ2luPVwiO1xuLy8gY29uc3QgYXBpU3RyZWFtID0gXCJodHRwczovL2FwaS50d2l0Y2gudHYva3Jha2VuL3N0cmVhbXMvXCI7XG4vLyBjb25zdCBhcGlDaGFubmVsID0gXCJodHRwczovL2FwaS50d2l0Y2gudHYva3Jha2VuL2NoYW5uZWxzL1wiO1xuXG4vLyBnZXQgaW5mbyBmcm9tIHR3aXRjaCBBUElcbmZ1bmN0aW9uIHN0cmVhbUluZm8oY2hhbm5lbCkge1xuICAgIGxldCBjaGFubmVsSW5mbywgbGl2ZUluZm8sIHN0cmVhbU9ubGluZSwgc3RyZWFtR2FtZSwgc3RyZWFtSWQsIHN0cmVhbUltYWdlLCBcbiAgICBzdHJlYW1OYW1lLCBzdHJlYW1MaW5rLCBsaXZlVGl0bGUsIGxpdmVHYW1lLCBnYW1lSW5mbywgZ2FtZU5hbWU7XG5cbiAgICAvLyBoZWFkZXIgZm9yIGFsbCB0d2l0Y2ggYXBpIGNhbGxzIC0gdXNlZCBpbiBjb25qdWN0aW9uIHdpdGggUmVxdWVzdFxuICAgIC8vIHNlZSBmZXRjaCBmdW5jdGlvbiBmb3IgdXNhZ2VcbiAgICBsZXQgcmVxdWVzdEhlYWRlciA9IHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgLy8gJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi92bmQudHdpdGNodHYudjUranNvbicsIC8vZm9yIHR3aXRjaCB2NVxuICAgICAgICAgICAgJ0NsaWVudC1JRCc6ICc0cnByNGMxY2JxOXN4NnV0bHI2cWtsZWo1OHl2N2knXG4gICAgICAgIH0pXG4gICAgfTtcblxuICAgIC8vIGdldCBjaGFubmVsIGluZm9cbiAgICAvLyBjcmVhdGVzIHJlcXVlc3QgVVJMIHdpdGggYWxsIG9mIHRoZSBtZW1iZXJzIGxpc3RlZCBhYm92ZSxcbiAgICAvLyBkb25lIHRoaXMgd2F5IHRvIHJlZHVjZSAjIG9mIEFQSSBjYWxscyAtIG9ubHkgZG9uZSBvbmNlXG4gICAgLy8gbWF5IG5vdCBiZSBjb21wbGV0ZWx5IG5lY2Vzc2FyeSAtIGNhbiBoYXJkd3JpdGUgaW5mb3JtYXRpb24gaW50byBIVE1MXG4gICAgLy8gbW9zdCBuZWNlc3NhcnkgaW5mb3JtYXRpb24gaXMgdGhlIElEIG9mIGVhY2ggbWVtYmVyIGJlY2F1c2UgbGl2ZSBpbmZvXG4gICAgLy8gcmVmZXJlbmNlcyBJRCwgbm90IGxvZ2luIG5hbWUuXG4gICAgbGV0IGlkVXJsID0gYXBpSWQ7XG4gICAgbmxzc01lbWJlcnMubWFwKChpKSA9PiB7XG4gICAgICAgIGlkVXJsICs9ICcmbG9naW49JytpO1xuICAgIH0pO1xuICAgIC8vIHVzZXMgbmV3IGVzNiBmZXRjaCBmdW5jdGlvbiwgcmF0aGVyIHRoYW4gcmVseWluZyBvbiBYTUxIVFRQUmVxdWVzdDtcbiAgICAvLyBtdWNoIGVhc2llciB0byBwYXJzZVxuICAgIGZldGNoKG5ldyBSZXF1ZXN0KGlkVXJsLCByZXF1ZXN0SGVhZGVyKSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oc3RyZWFtRGF0YSkge1xuICAgICAgICAvLyBtYW5pcHVsYXRpb24gb2YgdGhlIGpzb24gcmVjZWl2ZWQgZnJvbSB0d2l0Y2hcbiAgICAgICAgY2hhbm5lbEluZm8gPSBzdHJlYW1EYXRhLmRhdGE7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGNoYW5uZWxJbmZvKTtcbiAgICAgICAgLy8gZWFjaCBtZW1iZXIgbGlzdGVkIGluIGFuIGFycmF5XG4gICAgICAgIGNoYW5uZWxJbmZvLm1hcCgoaSkgPT4ge1xuICAgICAgICAgICAgc3RyZWFtSWQgPSBpLmlkO1xuICAgICAgICAgICAgc3RyZWFtTmFtZSA9IGkubG9naW47XG4gICAgICAgICAgICBzdHJlYW1EaXNwbGF5ID0gaS5kaXNwbGF5X25hbWUucmVwbGFjZSgvXy9nLFwiIFwiKTsgLy9yZWdleCByZXBsYWNlcyBfIHdpdGggc3BhY2VzXG4gICAgICAgICAgICBzdHJlYW1JbWFnZSA9IGkucHJvZmlsZV9pbWFnZV91cmw7XG4gICAgICAgICAgICBzdHJlYW1MaW5rID0gJ2h0dHBzOi8vd3d3LnR3aXRjaC50di8nK2kubG9naW47XG4gICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZW1iZXJHcmlkJylbMF0uaW5uZXJIVE1MICs9IFxuICAgICAgICAgICAgLy8gICAgIGA8ZGl2IGNsYXNzPSdtZW1iZXJDb250YWluZXIgJHtzdHJlYW1JZH0nPlxuICAgICAgICAgICAgLy8gICAgIDxpbWcgY2xhc3M9J21lbWJlckltYWdlJyBzcmM9JyR7c3RyZWFtSW1hZ2V9Jz48L2ltZz5cbiAgICAgICAgICAgIC8vICAgICA8ZGl2IGNsYXNzPSdtZW1iZXJOYW1lJz4ke3N0cmVhbU5hbWV9PC9kaXY+XG4gICAgICAgICAgICAvLyAgICAgPC9kaXY+YFxuICAgICAgICAgICAgLy8gICAgIDtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBhZGQgSUQgYXMgY2xhc3MgYmVjYXVzZSBsaXZlIGluZm8gZG9lcyBub3QgaGF2ZSBsb2dpbiBuYW1lcyxcbiAgICAgICAgICAgIC8vIG9ubHkgSUQ7IG5lY2Vzc2FyeSBmb3IgcHJvcGVyIHJlZmVyZW5jZVxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShzdHJlYW1OYW1lKVswXS5jbGFzc0xpc3QuYWRkKHN0cmVhbUlkKTtcbiAgICAgICAgICAgIGxldCBjdXJNQyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21Db250ZW50ICcrc3RyZWFtTmFtZSlbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpO1xuICAgICAgICAgICAgY3VyTUNbMF0uaW5uZXJIVE1MID0gc3RyZWFtRGlzcGxheTtcbiAgICAgICAgICAgIGN1ck1DWzFdLmlubmVySFRNTCA9IGA8YSBocmVmPScke3N0cmVhbUxpbmt9JyB0YXJnZXQ9J19ibGFuayc+XG4gICAgICAgICAgICA8aW1nIHNyYz0ke3N0cmVhbUltYWdlfSAvPjwvYT5gO1xuXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBnZXQgc3RyZWFtIGluZm9cbiAgICAgICAgLy8gcGxhY2VkIHdpdGhpbiB0aGUgdXNlciBpbmZvcm1hdGlvbiBjYWxsIGJlY2F1c2UgaXQgcmVsaWVzIG9uIHRoZSBJRHMgb2ZcbiAgICAgICAgLy8gdGhlIG1lbWJlcnMgaW4gb3JkZXIgdG8gcGxhY2UgdGhlIGluZm9ybWF0aW9uIGluIHRoZSBjb3JyZWN0IGxvY2F0aW9uXG4gICAgICAgIC8vIFNhbWUgZm9ybWF0IGFzIHRoZSBjYWxsIGZvciB0aGUgdXNlciBpbmZvcm1hdGlvbi5cbiAgICAgICAgbGV0IHN0cmVhbVVybCA9IGFwaVN0cmVhbTtcbiAgICAgICAgbmxzc01lbWJlcnMubWFwKChpKT0+e1xuICAgICAgICAgICAgc3RyZWFtVXJsICs9ICcmdXNlcl9sb2dpbj0nK2k7XG4gICAgICAgIH0pO1xuICAgICAgICBmZXRjaChuZXcgUmVxdWVzdChzdHJlYW1VcmwsIHJlcXVlc3RIZWFkZXIpKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHN0cmVhbURhdGEpIHtcbiAgICAgICAgICAgIGxpdmVJbmZvID0gc3RyZWFtRGF0YS5kYXRhO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobGl2ZUluZm8pO1xuICAgICAgICAgICAgbGl2ZUluZm8ubWFwKChpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWQgPSAnJytpLnVzZXJfaWQ7XG4gICAgICAgICAgICAgICAgbGl2ZVRpdGxlID0gaS50aXRsZTtcbiAgICAgICAgICAgICAgICBsaXZlR2FtZSA9IGkuZ2FtZV9pZDtcbiAgICAgICAgICAgICAgICAvLyBtdXN0IGNhbGwgdHdpdGNoIEFQSSBhZ2FpbiB0byB0cmFuc2xhdGUgZ2FtZV9pZCBpbnRvIGEgZ2FtZSBuYW1lXG4gICAgICAgICAgICAgICAgbGV0IGdhbWVVcmwgPSBhcGlHYW1lcyArIGxpdmVHYW1lO1xuXG4gICAgICAgICAgICAgICAgbGV0IGlkRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShpZClbMF1cbiAgICAgICAgICAgICAgICBmZXRjaChuZXcgUmVxdWVzdChnYW1lVXJsLCByZXF1ZXN0SGVhZGVyKSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oZ2FtZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2FtZUluZm8gPSBnYW1lRGF0YS5kYXRhWzBdO1xuICAgICAgICAgICAgICAgICAgICBnYW1lTmFtZSA9IGdhbWVJbmZvLm5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGlkRGl2LmNsYXNzTGlzdFsxXSk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21Db250ZW50ICcraWREaXYuY2xhc3NMaXN0WzFdKVswXVxuICAgICAgICAgICAgICAgICAgICAuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpWzJdLmlubmVySFRNTCA9IFxuICAgICAgICAgICAgICAgICAgICBgQ3VycmVudGx5IFBsYXlpbmc6ICR7Z2FtZU5hbWV9YDtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgaWREaXYuY2xhc3NMaXN0LmFkZCgnbGl2ZScpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9KTtcbn1cblxuLy8gY29udHJvbHMgZnVuY3Rpb25hbGl0eSBmb3Igd2hlbiBhIG1lbWJlcidzIHBvcnRyYWl0IGlzIGNsaWNrZWQgb25cbi8vIGRpc3BsYXlzIG1vZGFsIHdpbmRvdzogZGltcyB0aGUgYmFja2dyb3VuZCBhbmQgZGlzcGxheXMgZmxvYXRpbmcgd2luZG93XG4vLyB3aXRoIGluZm9ybWF0aW9uIGFib3V0IHRoZSBtZW1iZXJcbmZ1bmN0aW9uIG1vZGFsU2hvdygpIHtcbiAgICBsZXQgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtb2RhbCcpWzBdO1xuICAgIGxldCBvcGVuTSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21lbWJlcicpO1xuICAgIGxldCBjbG9zZU0gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjbG9zZScpWzBdO1xuICAgIGxldCBoaWRlTSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21Db250ZW50Jyk7XG4gICAgLy8gY29udmVydCBIVE1MQ29sbGVjdGlvbiBpbnRvIGFycmF5IC0gZXM2XG4gICAgLy8gY29udmVyc2lvbiB0byBhcnJheSBhbGxvd3MgdXNhZ2Ugb2YgbWFwIGZ1bmN0aW9uIHRvIHBlcmZvcm0gZnVuY3Rpb25cbiAgICAvLyBvbiBhbGwgZWxlbWVudHMgd2l0aCBjbGFzcyB4XG4gICAgbGV0IG9wZW5NQSA9IEFycmF5LmZyb20ob3Blbk0pO1xuICAgIGxldCBoaWRlTUEgPSBBcnJheS5mcm9tKGhpZGVNKTtcbiAgICAvLyBzaG93cyBtb2RhbCBjb250ZW50IG9uIGNsaWNrIG9mIGFueSBvZiB0aGUgbWVtYmVyc1xuICAgIG9wZW5NQS5tYXAoKG0pID0+IHtcbiAgICAgICAgbS5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG0uY2xhc3NMaXN0WzFdKTtcbiAgICAgICAgICAgIC8vIHNob3dzIG1vZGFsIGNvbnRlbnQgb2YgdGhlIG1lbWJlciB0aGF0IHdhcyBjbGlja2VkIG9uXG4gICAgICAgICAgICBsZXQgY3VyTW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtQ29udGVudCAnK20uY2xhc3NMaXN0WzFdKVswXTtcbiAgICAgICAgICAgIGN1ck1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLy8gaGlkZXMgbW9kYWwgd2luZG93IG9uIGV4aXQ6IGVpdGhlciB0aHJvdWdoIFggYnV0dG9uIG9yIGJ5IGNsaWNraW5nXG4gICAgLy8gb24gdGhlIGRpbW1lZCBiYWNrZ3JvdW5kIGJ5IGhpZGluZyB0aGUgbW9kYWwgd2luZG93XG4gICAgY2xvc2VNLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIC8vIHByb3Blcmx5IGhpZGVzIHRoZSBtb2RhbCBjb250ZW50IG9mIHRoZSBtZW1iZXIgdGhhdCB3YXMgY2xpY2tlZCBvblxuICAgICAgICAvLyBzbyB0aGF0IHdoZW4gYSBkaWZmZXJlbnQgbWVtYmVyIGlzIGNsaWNrZWQgb24sIHRoZSBwcmV2aW91cyBpbmZvcm1hdGlvblxuICAgICAgICAvLyBpcyBoaWRkZW4uXG4gICAgICAgIGhpZGVNQS5tYXAoKG0pID0+IHtcbiAgICAgICAgICAgIG0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfSlcbiAgICB9IFxuICAgIC8vIHNlZSBhYm92ZVxuICAgIHdpbmRvdy5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09IG1vZGFsKSB7XG4gICAgICAgICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgaGlkZU1BLm1hcCgobSkgPT4ge1xuICAgICAgICAgICAgICAgIG0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIHdhaXRzIGZvciBhbGwgRE9NIGVsZW1lbnRzIHRvIGJlIGxvYWRlZCBiZWZvcmUgZnVuY3Rpb25zIGFyZSBleGVjdXRlZFxud2luZG93Lm9ubG9hZCA9ICgpID0+e1xuICAgIHN0cmVhbUluZm8obmxzc01lbWJlcnMpO1xuICAgIG1vZGFsU2hvdygpO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYW1wdXJwb3NlLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tYWluLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIi4vaW5kZXguaHRtbFwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2luZGV4Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIG1hcCA9IHtcblx0XCIuL2F1c3Rpbi5wbmdcIjogNSxcblx0XCIuL2JhZXIucG5nXCI6IDYsXG5cdFwiLi9jb2JhbHQucG5nXCI6IDcsXG5cdFwiLi9kYW4ucG5nXCI6IDgsXG5cdFwiLi9kcmFjdWxhZmV0dXMucG5nXCI6IDksXG5cdFwiLi9lbHVjLnBuZ1wiOiAxMCxcblx0XCIuL2hhcmFtYmUucG5nXCI6IDExLFxuXHRcIi4vaW5kZWltYXVzLnBuZ1wiOiAxMixcblx0XCIuL2lzYWFjLnBuZ1wiOiAxMyxcblx0XCIuL2pvc2gucG5nXCI6IDE0LFxuXHRcIi4va2F0ZS5wbmdcIjogMTUsXG5cdFwiLi9tYWxmLnBuZ1wiOiAxNixcblx0XCIuL21hdGhhcy5wbmdcIjogMTcsXG5cdFwiLi9uaWNrLnBuZ1wiOiAxOCxcblx0XCIuL25sLnBuZ1wiOiAxOSxcblx0XCIuL3JvYi5wbmdcIjogMjAsXG5cdFwiLi9yeXVrYXRvbW8ucG5nXCI6IDIxLFxuXHRcIi4vc2ludmljdGEucG5nXCI6IDIyXG59O1xuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpKTtcbn07XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdHZhciBpZCA9IG1hcFtyZXFdO1xuXHRpZighKGlkICsgMSkpIC8vIGNoZWNrIGZvciBudW1iZXIgb3Igc3RyaW5nXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJy5cIik7XG5cdHJldHVybiBpZDtcbn07XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gNDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcgXFwucG5nJFxuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLi9pbWcvYXVzdGluLnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltZy9hdXN0aW4ucG5nXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCIuL2ltZy9iYWVyLnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltZy9iYWVyLnBuZ1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLi9pbWcvY29iYWx0LnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltZy9jb2JhbHQucG5nXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCIuL2ltZy9kYW4ucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW1nL2Rhbi5wbmdcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIi4vaW1nL2RyYWN1bGFmZXR1cy5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcvZHJhY3VsYWZldHVzLnBuZ1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLi9pbWcvZWx1Yy5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcvZWx1Yy5wbmdcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCIuL2ltZy9oYXJhbWJlLnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltZy9oYXJhbWJlLnBuZ1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIi4vaW1nL2luZGVpbWF1cy5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcvaW5kZWltYXVzLnBuZ1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIi4vaW1nL2lzYWFjLnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltZy9pc2FhYy5wbmdcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCIuL2ltZy9qb3NoLnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltZy9qb3NoLnBuZ1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIi4vaW1nL2thdGUucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW1nL2thdGUucG5nXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiLi9pbWcvbWFsZi5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcvbWFsZi5wbmdcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCIuL2ltZy9tYXRoYXMucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW1nL21hdGhhcy5wbmdcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCIuL2ltZy9uaWNrLnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltZy9uaWNrLnBuZ1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIi4vaW1nL25sLnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltZy9ubC5wbmdcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCIuL2ltZy9yb2IucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW1nL3JvYi5wbmdcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCIuL2ltZy9yeXVrYXRvbW8ucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW1nL3J5dWthdG9tby5wbmdcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCIuL2ltZy9zaW52aWN0YS5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbWcvc2ludmljdGEucG5nXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9