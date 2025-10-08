/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/utils.js":
/*!****************************!*\
  !*** ./assets/js/utils.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   digiriskApiGet: () => (/* binding */ digiriskApiGet),
/* harmony export */   findBlockRecursively: () => (/* binding */ findBlockRecursively)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Utils JS functions
 *
 */

/**
 * WordPress dependencies
 */


/**
 * Clean URL
 *
 * @param url
 * @returns {*}
 */
const cleanUrl = url => {
  let cleanedUrl = url.replace(/:\//g, '://');
  cleanedUrl = cleanedUrl.replace(/([^:]\/)\/+/g, '$1');
  cleanedUrl = cleanedUrl.replace(/^\/+|\/+$/g, '');
  return cleanedUrl;
};

/**
 * Get datas from DigiRisk module on Dolibarr
 *
 * @param route
 * @param params
 * @returns {{data: unknown, error: unknown}}
 */
const digiriskApiGet = (route, params) => {
  const [data, setData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const fetchData = async () => {
      if (!params) {
        return;
      }
      const {
        eoblocks_dolibarr_url: baseUrlApi,
        eoblocks_dolibarr_api_key: apiKey
      } = params;
      if (!baseUrlApi || !apiKey || !route) {
        setError('Missing API key or base URL or route');
        return;
      }
      let digiriskUrlApi = `${baseUrlApi}/api/index.php/${route}?DOLAPIKEY=${apiKey}`;
      digiriskUrlApi = cleanUrl(digiriskUrlApi);
      try {
        const response = await fetch(digiriskUrlApi);
        if (!response.ok) {
          if (response.status === 401) {
            setError('Unauthorized: Wrong API Key or Unauthorized');
          } else if (response.status === 404) {
            setError('Not Found: Wrong Dolibarr URL');
          } else {
            setError(`Error: ${response.status}`);
          }
          return;
        }
        const data = await response.json();
        if (data.error) {
          setError('Error in API response');
          return;
        }
        setData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [route, params]);
  return {
    data,
    error
  };
};
const findBlockRecursively = (blocks, blockName) => {
  for (const block of blocks) {
    if (block.name === blockName) {
      return block;
    }
    if (block.innerBlocks && block.innerBlocks.length) {
      const found = findBlockRecursively(block.innerBlocks, blockName);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

/***/ }),

/***/ "./blocks/src/eo-tabs/context.js":
/*!***************************************!*\
  !*** ./blocks/src/eo-tabs/context.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TabContext: () => (/* binding */ TabContext)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

const globalContext = window.EO_TABS_CONTEXT || (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)({
  activeTab: 0,
  setActiveTab: () => console.error('setActiveTab not yet available in TabContext'),
  removeTab: () => console.error('removeTab not yet available in TabContext')
});
window.EO_TABS_CONTEXT = globalContext;
const TabContext = globalContext;

/***/ }),

/***/ "./blocks/src/eo-tabs/edit.js":
/*!************************************!*\
  !*** ./blocks/src/eo-tabs/edit.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _scss_editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scss/editor.scss */ "./blocks/src/eo-tabs/scss/editor.scss");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./context */ "./blocks/src/eo-tabs/context.js");
/* harmony import */ var _assets_js_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../assets/js/utils */ "./assets/js/utils.js");

// src/edit.js








function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(attributes.activeTabIndex || 0);
  const handleSetActiveTab = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(index => {
    setActiveTab(index);
    setAttributes({
      activeTabIndex: index
    });
  }, [setAttributes]);
  const {
    getBlock,
    getBlocks,
    buttonContainerId,
    contentContainerId
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useSelect)(select => {
    const {
      getBlock,
      getBlocks
    } = select('core/block-editor');
    const parentBlock = getBlock(clientId);
    const btnContainer = (0,_assets_js_utils__WEBPACK_IMPORTED_MODULE_7__.findBlockRecursively)(parentBlock?.innerBlocks || [], 'eo/tabs-buttons');
    const contentContainer = (0,_assets_js_utils__WEBPACK_IMPORTED_MODULE_7__.findBlockRecursively)(parentBlock?.innerBlocks || [], 'eo/tabs-contents');
    return {
      getBlock,
      getBlocks,
      buttonContainerId: btnContainer?.clientId,
      contentContainerId: contentContainer?.clientId
    };
  }, [clientId]); // Dépend de clientId pour la re-sélection en cas de changement de structure

  // ... (contextValue - inchangé)
  const contextValue = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({
    activeTab: activeTab,
    setActiveTab: handleSetActiveTab
  }), [activeTab, handleSetActiveTab, handleRemoveTabSync]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)({
    'data-active-tab-index': activeTab
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_context__WEBPACK_IMPORTED_MODULE_6__.TabContext.Provider, {
    value: contextValue
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks, {
    template: [['eo/tabs-buttons', {}], ['eo/tabs-contents', {}]]
  })));
}

/***/ }),

/***/ "./blocks/src/eo-tabs/index.js":
/*!*************************************!*\
  !*** ./blocks/src/eo-tabs/index.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scss/style.scss */ "./blocks/src/eo-tabs/scss/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./blocks/src/eo-tabs/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./blocks/src/eo-tabs/block.json");

/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */



/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Internal dependencies
 */


const blockIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  version: "1.1",
  viewBox: "0 0 250 250"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M240,23.7h-100.3c-5.5,0-10,4.5-10,10v14.5l-9.7-15.1c-1.8-2.8-4.4-5.1-7.4-6.6-4.2-2-8.9-3.1-13.6-3.1H31.2C14,23.4,0,37.4,0,54.7v140.6c0,17.3,14,31.2,31.2,31.2h187.5c17.3,0,31.2-14,31.2-31.2V33.7c0-5.5-4.5-10-10-10ZM230,61.3h-28.3v-17.5h28.3v17.5ZM149.7,43.8h31.9v17.5h-31.9v-17.5ZM226.6,195.3c0,4.3-3.5,7.8-7.8,7.8H31.2c-4.3,0-7.8-3.5-7.8-7.8V54.7c0-4.3,3.5-7.8,7.8-7.8h67.7c1.7,0,3.3.5,4.7,1.6l15.6,24.1c2.6,4,6.1,7.3,10.4,9.2,5.1,2.3,10.6,3.5,16.2,3.5h72.9c4.3,0,7.8,3.5,7.8,7.8v102.2Z",
  fill: "#0066FF"
}));

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: props => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  },
  icon: blockIcon
});

/***/ }),

/***/ "./blocks/src/eo-tabs/scss/editor.scss":
/*!*********************************************!*\
  !*** ./blocks/src/eo-tabs/scss/editor.scss ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/src/eo-tabs/scss/style.scss":
/*!********************************************!*\
  !*** ./blocks/src/eo-tabs/scss/style.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./blocks/src/eo-tabs/block.json":
/*!***************************************!*\
  !*** ./blocks/src/eo-tabs/block.json ***!
  \***************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"eo/tabs","version":"1.0.0","title":"Tabs","category":"eo-blocks","icon":"smiley","description":"Display tabs block","example":{},"attributes":{"activeTabIndex":{"type":"integer","default":0}},"providesContext":{"eo/activeTab":"activeTabIndex","eo/setActiveTab":"setActiveTabFunction"},"supports":{},"textdomain":"tabs","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","render":"file:./render.php","viewScript":"file:./view.js"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"eo-tabs/index": 0,
/******/ 			"eo-tabs/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkeo_blocks"] = globalThis["webpackChunkeo_blocks"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["eo-tabs/style-index"], () => (__webpack_require__("./blocks/src/eo-tabs/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map