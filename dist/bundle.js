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

"use strict";


__webpack_require__(1);

console.log('This is working.');

/***/ }),
/* 1 */
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: Syntax Error \n\n(13:6) Undefined variable $mainRed\n\n \u001b[90m 11 | \u001b[39m \u001b[33m}\u001b[39m\n \u001b[90m 12 | \u001b[39m \u001b[33m.titleLive\u001b[39m \u001b[33m{\u001b[39m\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 13 | \u001b[39m     color\u001b[33m:\u001b[39m $mainRed\u001b[33m;\u001b[39m\n \u001b[90m    | \u001b[39m     \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 14 | \u001b[39m \u001b[33m}\u001b[39m\n \u001b[90m 15 | \u001b[39m\n\n    at runLoaders (/home/tyler/webDev/nlssLive/node_modules/webpack/lib/NormalModule.js:195:19)\n    at /home/tyler/webDev/nlssLive/node_modules/loader-runner/lib/LoaderRunner.js:364:11\n    at /home/tyler/webDev/nlssLive/node_modules/loader-runner/lib/LoaderRunner.js:230:18\n    at context.callback (/home/tyler/webDev/nlssLive/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at Promise.resolve.then.then.catch (/home/tyler/webDev/nlssLive/node_modules/postcss-loader/lib/index.js:189:44)\n    at <anonymous>");

/***/ })
/******/ ]);