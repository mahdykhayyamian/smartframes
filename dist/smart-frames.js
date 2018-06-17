(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["smartframes"] = factory();
	else
		root["smartframes"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var CONSTANTS = {
    LEFT_TO_RIGHT: "LEFT_TO_RIGHT",
    TOP_TO_BOTTOM: "TOP_TO_BOTTOM",
    FULL_OVERLAY: "FULL_OVERLAY",
    BORDER_DETECTION_JITTER_IN_PIXELS: 4,
    HORIZONTAL_RESIZING: "HORIZONTAL_RESIZING",
    VERTICAL_RESIZING: "VERTICAL_RESIZING"
};

exports.CONSTANTS = CONSTANTS;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Widget = undefined;

var _constants = __webpack_require__(0);

var _widgetContainer = __webpack_require__(2);

var Widget = function () {

    var TAB_HEIGHT = 28;
    var TAB_HOLDER_HEIGHT = 32;

    var TAB_OVERLAP = 5;
    var TAB_HORIZONTAL_SIDE_LENGTH = 8;

    var CONTENT_BORDER_TOP_WIDTH = 5;
    var CONTENT_BORDER_BOTTOM_WIDTH = 2;
    var CONTENT_BORDER_RIGHT_WIDTH = 2;
    var CONTENT_BORDER_LEFT_WIDTH = 2;

    var DIRECTION_TOP = "DIRECTION_TOP";
    var DIRECTION_RIGHT = "DIRECTION_RIGHT";
    var DIRECTION_BOTTOM = "DIRECTION_BOTTOM";
    var DIRECTION_LEFT = "DIRECTION_LEFT";

    function Widget(id, tabs, widgetContainer, left, top, width, height, tabsBaseXOffset) {
        this.id = id;
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.contentHeight = this.height - TAB_HOLDER_HEIGHT - CONTENT_BORDER_TOP_WIDTH - CONTENT_BORDER_BOTTOM_WIDTH;
        this.tabs = tabs;
        this.selectedTabIndex = 0;
        this.widgetContainer = widgetContainer;

        this.tabsBaseXOffset = tabsBaseXOffset !== undefined ? tabsBaseXOffset : 0;

        this.node = document.createElement("div");
        this.contentDiv = document.createElement("div");

        this.eventHandlers = {
            mouseDownOnContentHandlers: [],
            mouseUpOnWidgetHandlers: [],
            mouseMoveOnContentHandlers: [],
            mouseMoveOnTabsHandlers: [],
            mouseDownOnTabsHandlers: []
        };
    };

    Widget.prototype.render = function (parentNode) {

        if (parentNode) {
            this.parentNode = parentNode;
        }

        if (!this.parentNode) {
            return;
        }

        // first clean up from dom to start fresh
        this.remove();

        this.node.setAttribute("id", this.id);
        this.node.setAttribute("class", "widget");

        this.node.style.setProperty("top", this.top + "px");
        this.node.style.setProperty("left", this.left + "px");
        this.node.style.setProperty("width", this.width + "px");
        this.node.style.setProperty("height", this.height + "px");

        this.contentHeight = this.height - TAB_HOLDER_HEIGHT - CONTENT_BORDER_TOP_WIDTH - CONTENT_BORDER_BOTTOM_WIDTH;

        this.tabsDiv = document.createElement("div");
        this.tabsDiv.setAttribute("class", "widget-tabs");
        this.tabsDiv.style.setProperty("width", this.width + "px");
        this.tabsDiv.style.setProperty("height", TAB_HOLDER_HEIGHT + "px");

        this.tabsSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.tabsSVG.style.setProperty("position", "absolute");
        this.tabsSVG.style.setProperty("top", TAB_HOLDER_HEIGHT - TAB_HEIGHT + "px");
        this.tabsSVG.style.setProperty("width", this.width + "px");
        this.tabsSVG.style.setProperty("height", TAB_HOLDER_HEIGHT + "px");

        this.tabsDiv.appendChild(this.tabsSVG);
        this.node.appendChild(this.tabsDiv);

        this.contentDiv.setAttribute("class", "widget-content");

        this.contentDiv.style.setProperty("width", this.width + "px");
        this.contentDiv.style.setProperty("height", this.contentHeight + "px");
        this.node.appendChild(this.contentDiv);

        this.contentBorderDiv = document.createElement("div");
        setContentBorderStyle(this);

        this.contentDiv.appendChild(this.contentBorderDiv);

        // event handlers
        this.addMouseUpOnWidgetHandler(mouseUpEventHandler);
        this.addMouseMoveOnTabsHandler(mouseMoveOnTabsEventHandler);
        attachMouseMoveOnContentEventHandlers(this);

        drawTabs(this);

        this.parentNode.appendChild(this.node);

        for (var i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].onRenderCallback) {
                this.tabs[i].onRenderCallback(this);
            }
        }
    };

    Widget.prototype.validateRendering = function (renderingValues) {
        var minPossibleWidth = this.getMinPossibleWidth();

        if (renderingValues.width < minPossibleWidth) {
            console.log("rendering width: " + renderingValues.width + " cannot be less than widget min width : " + minPossibleWidth);
            return false;
        }

        var minPossibleHeight = this.getMinPossibleHeight();

        if (renderingValues.height < minPossibleHeight) {
            console.log("rendering height: " + renderingValues.height + " cannot be less than minPossibleHeight : " + minPossibleHeight);
            return false;
        }

        return true;
    };

    Widget.prototype.remove = function (parent) {

        while (this.contentDiv.firstChild) {
            this.contentDiv.removeChild(this.contentDiv.firstChild);
        }
        this.contentDiv.remove();

        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }
        this.node.remove();
    };

    Widget.prototype.addMouseUpOnWidgetHandler = function (callback) {
        var _this = this;

        this.eventHandlers.mouseUpOnWidgetHandlers.push(callback);
        this.node.addEventListener("mouseup", function (event) {
            callback(event, _this);
        }, true);
    };

    Widget.prototype.addMouseMoveOnContentHandler = function (callback) {
        var _this2 = this;

        this.eventHandlers.mouseMoveOnContentHandlers.push(callback);
        this.contentDiv.addEventListener("mousemove", function (event) {
            callback(event, _this2);
        }, true);
    };

    Widget.prototype.addMouseMoveOnTabsHandler = function (callback) {
        var _this3 = this;

        this.eventHandlers.mouseMoveOnTabsHandlers.push(callback);
        this.tabsDiv.addEventListener("mousemove", function (event) {
            callback(event, _this3);
        }, true);
    };

    Widget.prototype.addMouseDownOnTabsHandler = function (callback) {
        var _this4 = this;

        this.eventHandlers.mouseDownOnTabsHandlers.push(callback);

        var _loop = function _loop(i) {
            _this4.tabs[i].tabNode.addEventListener("mousedown", function (event) {
                callback(event, _this4, i);
            }, true);
        };

        for (var i = 0; i < this.tabs.length; i++) {
            _loop(i);
        }
    };

    Widget.prototype.insertWidget = function (widgetToInsert, x, y) {

        var targetWidget = this;
        if (targetWidget === null) {
            return;
        }

        var direction = targetWidget.determineDirectonToInsert(x, y);

        var childIndex = void 0,
            containerNode = void 0,
            targetWidgetContainer = void 0;

        childIndex = findMyChildIndex(targetWidget);
        targetWidgetContainer = targetWidget.widgetContainer;

        switch (direction) {

            case DIRECTION_TOP:
                containerNode = new _widgetContainer.WidgetContainer([widgetToInsert, targetWidget], _constants.CONSTANTS.TOP_TO_BOTTOM, targetWidget.widgetContainer, targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height);
                widgetToInsert.height = targetWidget.height;
                break;
            case DIRECTION_RIGHT:
                containerNode = new _widgetContainer.WidgetContainer([targetWidget, widgetToInsert], _constants.CONSTANTS.LEFT_TO_RIGHT, targetWidget.widgetContainer, targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height);
                widgetToInsert.width = targetWidget.width;
                break;
            case DIRECTION_BOTTOM:
                containerNode = new _widgetContainer.WidgetContainer([targetWidget, widgetToInsert], _constants.CONSTANTS.TOP_TO_BOTTOM, targetWidget.widgetContainer, targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height);
                widgetToInsert.height = targetWidget.height;
                break;
            case DIRECTION_LEFT:
                containerNode = new _widgetContainer.WidgetContainer([widgetToInsert, targetWidget], _constants.CONSTANTS.LEFT_TO_RIGHT, targetWidget.widgetContainer, targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height);
                widgetToInsert.width = targetWidget.width;
                break;
            default:
                return;
        }

        targetWidget.remove();
        targetWidget.widgetContainer = containerNode;
        widgetToInsert.widgetContainer = containerNode;
        widgetToInsert.tabsBaseXOffset = 0;
        targetWidgetContainer.children[childIndex] = containerNode;
        containerNode.render(targetWidgetContainer.rootDiv);
    };

    Widget.prototype.removeTab = function (tabIndex) {

        if (this.selectedTabIndex === this.tabs.length - 1) {
            this.selectedTabIndex = this.selectedTabIndex - 1;
        }

        this.tabs.splice(tabIndex, 1);

        while (this.tabsSVG.firstChild) {
            this.tabsSVG.removeChild(this.tabsSVG.firstChild);
        }

        while (this.contentBorderDiv.firstChild) {
            this.contentBorderDiv.removeChild(this.contentBorderDiv.firstChild);
        }

        if (this.tabs.length > 0) {
            drawTabs(this);
        }
    };

    Widget.prototype.createWidgetFromTab = function (tabIndex) {

        var widgetOfTab = new Widget(this.id + "_tab_" + tabIndex, [{
            title: this.tabs[tabIndex].title
        }], null, this.left, this.top, this.width, this.height, this.tabs[tabIndex].startX);

        // making sure moving widget is on top
        widgetOfTab.node.style.setProperty("z-index", "1");

        // set content
        if (this.tabs[tabIndex].contentNode) {
            widgetOfTab.tabs[0].contentNode = this.tabs[tabIndex].contentNode;
        }

        // set onRenderCallback
        if (this.tabs[tabIndex].onRenderCallback) {
            widgetOfTab.tabs[0].onRenderCallback = this.tabs[tabIndex].onRenderCallback;
        }

        widgetOfTab.eventHandlers = this.eventHandlers;

        return widgetOfTab;
    };

    Widget.prototype.addOverlay = function (overlayType) {

        var height = this.height - TAB_HOLDER_HEIGHT;
        var width = this.width;
        var left = 0;
        var top = TAB_HOLDER_HEIGHT;

        switch (overlayType) {
            case DIRECTION_TOP:
                addOverlayTop(this);
                break;
            case DIRECTION_RIGHT:
                addOverlayRight(this);
                break;
            case DIRECTION_BOTTOM:
                addOverlayBottom(this);
                break;
            case DIRECTION_LEFT:
                addOverlayLeft(this);
                break;
            case _constants.CONSTANTS.FULL_OVERLAY:
                addOverlayFull(this);
                break;
        }

        this.overlayDiv.setAttribute("class", "drag-target-widget-overlay");
        this.contentDiv.parentNode.appendChild(this.overlayDiv);

        function addOverlayTop(widget) {
            widget.overlayDiv = document.createElement("div");
            widget.overlayDiv.style.setProperty("width", width + "px");
            widget.overlayDiv.style.setProperty("height", height / 2 + "px");
            widget.overlayDiv.style.setProperty("left", left + "px");
            widget.overlayDiv.style.setProperty("top", top + "px");
        }

        function addOverlayRight(widget) {
            widget.overlayDiv = document.createElement("div");
            widget.overlayDiv.style.setProperty("width", width / 2 + "px");
            widget.overlayDiv.style.setProperty("height", height + "px");
            widget.overlayDiv.style.setProperty("left", left + width / 2 + "px");
            widget.overlayDiv.style.setProperty("top", top + "px");
        }

        function addOverlayBottom(widget) {
            widget.overlayDiv = document.createElement("div");
            widget.overlayDiv.style.setProperty("width", width + "px");
            widget.overlayDiv.style.setProperty("height", height / 2 + "px");
            widget.overlayDiv.style.setProperty("left", left + "px");
            widget.overlayDiv.style.setProperty("top", top + height / 2 + "px");
        }

        function addOverlayLeft(widget) {
            widget.overlayDiv = document.createElement("div");
            widget.overlayDiv.style.setProperty("width", width / 2 + "px");
            widget.overlayDiv.style.setProperty("height", height + "px");
            widget.overlayDiv.style.setProperty("left", left + "px");
            widget.overlayDiv.style.setProperty("top", top + "px");
        }

        function addOverlayFull(widget) {
            widget.overlayDiv = document.createElement("div");
            widget.overlayDiv.style.setProperty("width", width + "px");
            widget.overlayDiv.style.setProperty("height", height + "px");
            widget.overlayDiv.style.setProperty("left", left + "px");
            widget.overlayDiv.style.setProperty("top", top + "px");
        }
    };

    Widget.prototype.removeOverlay = function () {
        if (this.overlayDiv) {
            this.overlayDiv.remove();
            this.overlayDiv = undefined;
        }
    };

    Widget.prototype.determineDirectonToInsert = function (x, y) {

        var distToLeft = Math.abs(x) / this.width;
        var distToRight = Math.abs(this.width - x) / this.width;
        var distToTop = Math.abs(y) / this.height;
        var distToBottom = Math.abs(this.height - y) / this.height;

        var distances = [distToLeft, distToRight, distToTop, distToBottom];

        var min = Math.min.apply(Math, distances);

        switch (min) {
            case distToTop:
                return DIRECTION_TOP;
            case distToRight:
                return DIRECTION_RIGHT;
            case distToBottom:
                return DIRECTION_BOTTOM;
            case distToLeft:
                return DIRECTION_LEFT;
            default:
                return null;
        }
    };

    Widget.prototype.insertTab = function (tab, dropX) {

        var location = findNewTabLocation(this, dropX);
        var tabIndex = location.tabIndex;
        var newTabStartX = location.newTabStartX;

        this.tabs.splice(tabIndex, 0, tab);

        // shift tabs to the right to open space for new tab
        var tabSize = getDynamicTabSize(this);
        for (var i = tabIndex + 1; i < this.tabs.length; i++) {
            this.tabs[i].tabNode.remove();
            this.tabs[i].startX += tabSize;
            drawNotSelectedTab(this, i, this.tabs[i].startX);
        }

        // remove content
        while (this.contentBorderDiv.firstChild) {
            this.contentBorderDiv.removeChild(this.contentBorderDiv.firstChild);
        }

        // draw new tab and make it selected
        drawSelectedTab(this, tabIndex, newTabStartX);
        updateSelectedTabTo(this, tabIndex);

        this.render();
    };

    Widget.prototype.isDraggingTabFullyInsideWidget = function () {
        if (this.draggingTabIndex !== undefined && this.tabs[this.draggingTabIndex].startX >= 0 && this.tabs[this.draggingTabIndex].startX <= this.width) {
            return true;
        }

        return false;
    };

    Widget.prototype.isMouseOverWidgetTabs = function (mouseEvent) {

        var widgetTabsBoundingRectangle = this.tabsDiv.getBoundingClientRect();

        if (mouseEvent.clientX <= widgetTabsBoundingRectangle.right && mouseEvent.clientX >= widgetTabsBoundingRectangle.left && mouseEvent.clientY >= widgetTabsBoundingRectangle.top && mouseEvent.clientY <= widgetTabsBoundingRectangle.bottom) {
            return true;
        }

        return false;
    };

    Widget.prototype.getParent = function () {
        return this.widgetContainer;
    };

    Widget.prototype.getMinPossibleWidth = function () {
        return this.tabs.length * getDynamicTabSize(this);
    };

    Widget.prototype.getMinPossibleHeight = function () {
        var minHeight = 50;
        return minHeight;
    };

    Widget.prototype.setOpacity = function (opacity) {
        this.opacity = opacity;
        this.node.style.setProperty("opacity", opacity);
    };

    Widget.prototype.getTabSize = function () {
        return getDynamicTabSize(this);
    };

    function findNewTabLocation(widget, dropX) {

        var tabWidth = getDynamicTabSize(widget);

        var tabIndex = 0;
        var newTabStartX = 0;
        if (widget.tabs.length > 0) {
            var i = 0;
            var x = widget.tabs[i].startX;
            while (x < dropX && i < widget.tabs.length - 1) {
                i++;
                x = widget.tabs[i].startX;
            }

            if (x >= dropX) {
                tabIndex = i - 1;
            } else if (i === widget.tabs.length - 1 && dropX <= widget.tabs.length * tabWidth) {
                tabIndex = i;
            } else {
                tabIndex = i + 1;
            }

            newTabStartX = tabIndex * tabWidth;
        }

        return {
            tabIndex: tabIndex,
            newTabStartX: newTabStartX
        };
    }

    function setContentBorderStyle(widget) {
        widget.contentBorderDiv.setAttribute("class", "widget-content-border");
        widget.contentBorderDiv.style.setProperty("width", widget.width - CONTENT_BORDER_RIGHT_WIDTH - CONTENT_BORDER_LEFT_WIDTH + "px");
        widget.contentBorderDiv.style.setProperty("height", widget.height - TAB_HOLDER_HEIGHT - CONTENT_BORDER_TOP_WIDTH - CONTENT_BORDER_BOTTOM_WIDTH + "px");

        widget.contentBorderDiv.style.setProperty("border", "solid");
        widget.contentBorderDiv.style.setProperty("border-color", "#efefef");
        widget.contentBorderDiv.style.setProperty("border-top-width", CONTENT_BORDER_TOP_WIDTH + "px");
        widget.contentBorderDiv.style.setProperty("border-right-width", CONTENT_BORDER_RIGHT_WIDTH + "px");
        widget.contentBorderDiv.style.setProperty("border-bottom-width", CONTENT_BORDER_BOTTOM_WIDTH + "px");
        widget.contentBorderDiv.style.setProperty("border-left-width", CONTENT_BORDER_LEFT_WIDTH + "px");
    }

    function findMyChildIndex(widget) {

        if (!widget.widgetContainer) {
            return null;
        }

        var children = widget.widgetContainer.children;

        if (Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
                if (children[i] === widget) {
                    return i;
                }
            }
        }

        return null;
    }

    function drawNotSelectedTab(widget, tabIndex, startX) {

        var tab = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        var tabSize = getDynamicTabSize(widget);

        var p1 = [startX, TAB_HEIGHT];
        var p2 = [startX + TAB_HORIZONTAL_SIDE_LENGTH, 0];
        var p3 = [startX + tabSize - TAB_HORIZONTAL_SIDE_LENGTH, 0];
        var p4 = [startX + tabSize, TAB_HEIGHT];

        var tabData = 'M ' + p1[0] + ' ' + p1[1] + ' L ' + p2[0] + ' ' + p2[1] + ' L ' + p3[0] + ' ' + p3[1] + ' L ' + p4[0] + ' ' + p4[1];

        tab.setAttribute('d', tabData);

        var leftPadding = 5;
        var tabText = createTabText(widget, tabIndex, p2[0] + leftPadding, (p2[1] + p4[1]) / 2);

        var tabNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tabNode.setAttribute('class', 'tabs-outline not-selected');

        tabNode.appendChild(tab);
        tabNode.appendChild(tabText);
        widget.tabsSVG.appendChild(tabNode);
        widget.tabs[tabIndex].tabNode = tabNode;
        widget.tabs[tabIndex].startX = startX;
        widget.tabs[tabIndex].startY = 0;

        addEventHandlers(widget, tabIndex);
    }

    function drawSelectedTab(widget, tabIndex, startX) {

        var tab = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        var tabSize = getDynamicTabSize(widget);

        var p1 = [0, TAB_HEIGHT];
        var p2 = [startX, TAB_HEIGHT];
        var p3 = [startX + TAB_HORIZONTAL_SIDE_LENGTH, 0];
        var p4 = [startX + tabSize - TAB_HORIZONTAL_SIDE_LENGTH, 0];
        var p5 = [startX + tabSize, TAB_HEIGHT];
        var p6 = [widget.width, TAB_HEIGHT];

        var tabData = 'M ' + p1[0] + ' ' + p1[1] + ' L ' + p2[0] + ' ' + p2[1] + ' L ' + p3[0] + ' ' + p3[1] + ' L ' + p4[0] + ' ' + p4[1] + ' L ' + p5[0] + ' ' + p5[1] + ' L ' + p6[0] + ' ' + p6[1];

        tab.setAttribute('d', tabData);

        var leftPadding = 5;
        var tabText = createTabText(widget, tabIndex, p3[0] + leftPadding, (p3[1] + p5[1]) / 2);

        var tabNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tabNode.setAttribute('class', 'tabs-outline selected');

        tabNode.appendChild(tab);
        tabNode.appendChild(tabText);
        widget.tabsSVG.appendChild(tabNode);
        widget.tabs[tabIndex].tabNode = tabNode;
        widget.tabs[tabIndex].startX = startX;
        widget.tabs[tabIndex].startY = 0;

        // show content if available
        if (widget.tabs[tabIndex].contentNode) {
            widget.contentBorderDiv.appendChild(widget.tabs[tabIndex].contentNode);
        }

        addEventHandlers(widget, tabIndex);
    }

    function getDynamicTabSize(widget) {

        var maxTabSize = 180;
        var minTabSize = 120;

        var tabSize = widget.width / widget.tabs.length;

        if (tabSize > maxTabSize) {
            return maxTabSize;
        } else if (tabSize < minTabSize) {
            return minTabSize;
        } else {
            return tabSize;
        }
    }

    function createTabText(widget, tabIndex, x, y) {
        var tabText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tabText.setAttribute("class", "noselect");
        tabText.setAttribute('x', x);
        tabText.setAttribute('y', y);
        var textNode = document.createTextNode(widget.tabs[tabIndex].title);
        tabText.appendChild(textNode);
        return tabText;
    }

    function addEventHandlers(widget, tabIndex) {
        attachOnTabsMouseDownEventHandlers(widget, tabIndex);
    }

    function attachOnTabsMouseDownEventHandlers(widget, tabIndex) {

        // internal handers
        widget.tabs[tabIndex].tabNode.addEventListener("mousedown", function (event) {
            widget.draggingTabIndex = tabIndex;

            var widgetBoundingRectangle = widget.node.getBoundingClientRect();
            widget.draggingStartPositionRelativeToWidget = {
                x: event.clientX - widgetBoundingRectangle.left,
                y: event.clientY - widgetBoundingRectangle.top
            };

            widget.tabs[tabIndex].drag = {
                mouseX: event.clientX,
                mouseY: event.clientY
            };
        }, true);

        // passed in handlers
        widget.tabs[tabIndex].tabNode.addEventListener("mousedown", function (event) {
            for (var i = 0; i < widget.eventHandlers.mouseDownOnTabsHandlers.length; i++) {
                var callback = widget.eventHandlers.mouseDownOnTabsHandlers[i];
                callback(event, widget, tabIndex);
            }
        }, true);
    }

    function attachMouseMoveOnContentEventHandlers(widget) {
        widget.contentDiv.addEventListener("mousemove", function (event) {
            for (var i = 0; i < widget.eventHandlers.mouseMoveOnContentHandlers.length; i++) {
                var callback = widget.eventHandlers.mouseMoveOnContentHandlers[i];
                callback(event, widget);
            }
        }, true);
    }

    function mouseMoveOnTabsEventHandler(event, widget) {

        // return if mouse move is not relevant
        if (widget.draggingTabIndex === undefined || !widget.isMouseOverWidgetTabs(event) || !widget.isDraggingTabFullyInsideWidget()) {
            return;
        }

        // update x start position of dragging if the tab is still being dragged on the tabs area
        var widgetBoundingRectangle = widget.node.getBoundingClientRect();
        widget.draggingStartPositionRelativeToWidget.x = event.clientX - widgetBoundingRectangle.left;

        // apply new position
        widget.tabs[widget.draggingTabIndex].startX += event.clientX - widget.tabs[widget.draggingTabIndex].drag.mouseX;
        widget.tabs[widget.draggingTabIndex].drag.mouseX = event.clientX;
        widget.tabs[widget.draggingTabIndex].startY += event.clientY - widget.tabs[widget.draggingTabIndex].drag.mouseY;
        widget.tabs[widget.draggingTabIndex].drag.mouseY = event.clientY;

        // update dom
        widget.tabs[widget.draggingTabIndex].tabNode.remove();
        if (widget.draggingTabIndex === widget.selectedTabIndex) {
            drawSelectedTab(widget, widget.draggingTabIndex, widget.tabs[widget.draggingTabIndex].startX, widget.tabs[widget.draggingTabIndex].startY);
        } else {
            drawNotSelectedTab(widget, widget.draggingTabIndex, widget.tabs[widget.draggingTabIndex].startX);
        }

        // swap if necessary
        var tabIndexToSwap = getTabIndexToSwap(widget);
        if (tabIndexToSwap !== undefined) {
            swapTabs(widget, tabIndexToSwap);
        }
    }

    function mouseUpEventHandler(event, widget) {

        if (widget.draggingTabIndex !== undefined) {

            widget.tabs[widget.draggingTabIndex].tabNode.remove();
            var startX = getTabDefaultStartXPosition(widget, widget.draggingTabIndex);
            drawSelectedTab(widget, widget.draggingTabIndex, startX, 0);

            updateSelectedTabTo(widget, widget.draggingTabIndex);
            widget.draggingTabIndex = undefined;
            widget.draggingStartPositionRelativeToWidget = null;
        }
    }

    function swapTabs(widget, tabIndexToSwap) {

        var temp = widget.tabs[tabIndexToSwap];
        widget.tabs[tabIndexToSwap] = widget.tabs[widget.draggingTabIndex];
        widget.tabs[widget.draggingTabIndex] = temp;

        var tempIndex = tabIndexToSwap;
        tabIndexToSwap = widget.draggingTabIndex;
        widget.draggingTabIndex = tempIndex;

        // update selected tab index if needed
        if (widget.selectedTabIndex === widget.draggingTabIndex) {
            widget.selectedTabIndex = tabIndexToSwap;
        } else if (widget.selectedTabIndex == tabIndexToSwap) {
            widget.selectedTabIndex = widget.draggingTabIndex;
        }

        // draw the swapped tab
        widget.tabs[tabIndexToSwap].tabNode.remove();
        var startX = getTabDefaultStartXPosition(widget, tabIndexToSwap);

        if (tabIndexToSwap === widget.selectedTabIndex) {
            drawSelectedTab(widget, tabIndexToSwap, startX, 0);
        } else {
            drawNotSelectedTab(widget, tabIndexToSwap, startX);
        }
    }

    function getTabDefaultStartXPosition(widget, tabIndex) {
        var tabSize = getDynamicTabSize(widget);
        return tabIndex * (tabSize - TAB_OVERLAP);
    }

    function updateSelectedTabTo(widget, tabIndex) {

        if (tabIndex === widget.selectedTabIndex) {
            return;
        }

        widget.tabs[widget.selectedTabIndex].tabNode.remove();
        widget.tabs[tabIndex].tabNode.remove();

        while (widget.contentBorderDiv.firstChild) {
            widget.contentBorderDiv.removeChild(widget.contentBorderDiv.firstChild);
        }

        drawNotSelectedTab(widget, widget.selectedTabIndex, widget.tabs[widget.selectedTabIndex].startX);

        widget.selectedTabIndex = tabIndex;
        drawSelectedTab(widget, widget.selectedTabIndex, widget.tabs[widget.selectedTabIndex].startX, widget.tabs[widget.selectedTabIndex].startY);

        widget.render();
    }

    function drawTabs(widget) {

        var tabSize = getDynamicTabSize(widget);

        for (var tabIndex = 0; tabIndex < widget.tabs.length; tabIndex++) {
            if (tabIndex !== widget.selectedTabIndex) {
                var startX = tabIndex * (tabSize - TAB_OVERLAP) + widget.tabsBaseXOffset;
                drawNotSelectedTab(widget, tabIndex, startX);
            }
        }

        var startX = widget.selectedTabIndex * (tabSize - TAB_OVERLAP) + widget.tabsBaseXOffset;
        drawSelectedTab(widget, widget.selectedTabIndex, startX, 0);
    }

    function getTabIndexToSwap(widget) {

        var preTabIndex = widget.draggingTabIndex - 1;
        var nextTabIndex = widget.draggingTabIndex + 1;

        var tabSize = getDynamicTabSize(widget);

        if (isValidTabIndex(widget, preTabIndex) && widget.tabs[widget.draggingTabIndex].startX < getMiddleXOfTab(widget, preTabIndex)) {
            return preTabIndex;
        } else if (isValidTabIndex(widget, nextTabIndex) && widget.tabs[widget.draggingTabIndex].startX + tabSize > getMiddleXOfTab(widget, nextTabIndex)) {
            return nextTabIndex;
        }

        return undefined;
    }

    function isValidTabIndex(widget, tabIndex) {
        if (tabIndex >= 0 && tabIndex < widget.tabs.length) {
            return true;
        } else {
            return false;
        }
    }

    function getMiddleXOfTab(widget, tabIndex) {
        return widget.tabs[tabIndex].startX + getDynamicTabSize(widget) / 2;
    }

    return Widget;
}();

exports.Widget = Widget;

__webpack_require__(9);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WidgetContainer = undefined;

var _widget = __webpack_require__(1);

var _constants = __webpack_require__(0);

function WidgetContainer(children, direction, parentWidgetContainer, left, top, width, height) {

    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.children = children;
    this.childrenRatios = null;
    this.parentWidgetContainer = parentWidgetContainer;
    this.direction = direction;
    this.rootDiv = document.createElement("div");
}

WidgetContainer.prototype.validateRendering = function (renderingValues) {

    var widgetContainer = this;
    var childrenRenderingValues = getChildrenRenderingValues(widgetContainer, renderingValues);

    for (var i = 0; i < widgetContainer.children.length; i++) {
        var child = widgetContainer.children[i];
        var result = child.validateRendering(childrenRenderingValues[i]);
        if (!result) {
            return false;
        }
    }

    return true;
};

WidgetContainer.prototype.render = function (parentNode) {

    // check parent node
    if (parentNode) {
        this.parentNode = parentNode;
    }

    if (!this.parentNode) {
        console.log("no parent node, returning");
        return false;
    }

    // render
    renderWidgetContainer(this, this.parentNode);
};

WidgetContainer.prototype.remove = function () {
    this.rootDiv.remove();
};

WidgetContainer.prototype.onMouseDown = function (callback) {
    this.rootDiv.addEventListener("mousedown", callback, true);
};

WidgetContainer.prototype.toWidgetArray = function () {
    var widgets = [];
    if (!this.children) {
        return widgets;
    }

    for (var i = 0; i < this.children.length; i++) {

        if (_widget.Widget.prototype.isPrototypeOf(this.children[i])) {
            widgets = widgets.concat(this.children[i]);
        } else {
            widgets = widgets.concat(this.children[i].toWidgetArray());
        }
    }

    return widgets;
};

WidgetContainer.prototype.getWidgetFromPoint = function (clientX, clientY) {

    var widgets = this.toWidgetArray();
    for (var i = 0; i < widgets.length; i++) {
        var widget = widgets[i];
        var widgetBoundingRectangle = widget.node.getBoundingClientRect();

        if (clientX >= widgetBoundingRectangle.left && clientX <= widgetBoundingRectangle.right && clientY >= widgetBoundingRectangle.top && clientY <= widgetBoundingRectangle.bottom) {
            return widget;
        }
    }

    return null;
};

WidgetContainer.prototype.makeNonSelectable = function () {
    this.rootDiv.classList.add("noselect");
};

WidgetContainer.prototype.makeSelectable = function () {
    this.rootDiv.classList.remove("noselect");
};

WidgetContainer.prototype.getParent = function () {
    return this.parentWidgetContainer;
};

function renderWidgetContainer(widgetContainer, parentNode) {

    widgetContainer.parentNode = parentNode;
    parentNode.appendChild(widgetContainer.rootDiv);

    widgetContainer.rootDiv.setAttribute("class", "widget");
    widgetContainer.rootDiv.style.setProperty("top", widgetContainer.top + "px");
    widgetContainer.rootDiv.style.setProperty("left", widgetContainer.left + "px");
    widgetContainer.rootDiv.style.setProperty("width", widgetContainer.width + "px");
    widgetContainer.rootDiv.style.setProperty("height", widgetContainer.height + "px");
    widgetContainer.rootDiv.setAttribute("class", "widget-container");

    sizeAndPositionChildren(widgetContainer);
    for (var i = 0; i < widgetContainer.children.length; i++) {
        var child = widgetContainer.children[i];

        if (child instanceof _widget.Widget) {
            child.render(widgetContainer.rootDiv);
        } else if (child instanceof WidgetContainer) {
            renderWidgetContainer(child, widgetContainer.rootDiv);
        }
    }
}

function sizeAndPositionChildren(widgetContainer) {

    var renderingValues = {
        width: widgetContainer.width,
        height: widgetContainer.height,
        left: widgetContainer.left,
        top: widgetContainer.top
    };

    var childrenRenderingValues = getChildrenRenderingValues(widgetContainer, renderingValues);

    for (var i = 0; i < widgetContainer.children.length; i++) {
        widgetContainer.children[i].left = childrenRenderingValues[i].left;
        widgetContainer.children[i].top = childrenRenderingValues[i].top;
        widgetContainer.children[i].width = childrenRenderingValues[i].width;
        widgetContainer.children[i].height = childrenRenderingValues[i].height;
    }
}

function getChildrenRenderingValues(widgetContainer, renderingValues) {

    var childrenRenderingValues = [];

    var childRatios = getChildrenRatios(widgetContainer);

    if (widgetContainer.direction === _constants.CONSTANTS.LEFT_TO_RIGHT) {

        var childHeight = renderingValues.height;
        var sumWidth = 0;

        for (var i = 0; i < widgetContainer.children.length; i++) {

            childrenRenderingValues.push({
                left: sumWidth,
                top: 0,
                width: renderingValues.width * childRatios[i],
                height: childHeight
            });

            sumWidth += childrenRenderingValues[i].width;
        }
    } else if (widgetContainer.direction === _constants.CONSTANTS.TOP_TO_BOTTOM) {

        var childWidth = renderingValues.width;
        var sumHeight = 0;

        for (var _i = 0; _i < widgetContainer.children.length; _i++) {
            childrenRenderingValues.push({
                left: 0,
                top: sumHeight,
                width: childWidth,
                height: renderingValues.height * childRatios[_i]
            });

            sumHeight += childrenRenderingValues[_i].height;
        }
    }

    return childrenRenderingValues;
}

function getChildrenRatios(widgetContainer) {

    var childrenRatios = [];
    var sum = 0;
    for (var i = 0; i < widgetContainer.children.length; i++) {
        var widthOrHeight = widgetContainer.direction === _constants.CONSTANTS.LEFT_TO_RIGHT ? widgetContainer.children[i].width : widgetContainer.children[i].height;
        if (widthOrHeight) {
            sum += widthOrHeight;
        }
    }

    if (sum !== 0) {
        for (var _i2 = 0; _i2 < widgetContainer.children.length; _i2++) {
            var _widthOrHeight = widgetContainer.direction === _constants.CONSTANTS.LEFT_TO_RIGHT ? widgetContainer.children[_i2].width : widgetContainer.children[_i2].height;
            childrenRatios.push(_widthOrHeight / sum);
        }
    } else {
        if (widgetContainer.childrenRatios !== null) {
            return widgetContainer.childrenRatios;
        } else {
            for (var _i3 = 0; _i3 < widgetContainer.children.length; _i3++) {
                childrenRatios.push(1 / widgetContainer.children.length);
            }
        }
    }

    return childrenRatios;
}

exports.WidgetContainer = WidgetContainer;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WidgetResizeController = undefined;

var _widget = __webpack_require__(1);

var _constants = __webpack_require__(0);

function WidgetResizeController(widgetContainer) {
    var controller = this;
    controller.widgetContainer = widgetContainer;

    controller.isResizing = false;
    controller.direction = null;
    controller.resizingSibling1 = null;
    controller.resizingSibling2 = null;
    controller.previousMouseEvent = null;

    handleMouseMove();
    handleMouseDown();
    handleMouseUp();

    function handleMouseMove() {
        controller.widgetContainer.rootDiv.addEventListener("mousemove", function (mouseEvent) {

            if (controller.isResizing === true) {

                var deltaX = mouseEvent.clientX - controller.previousMouseEvent.clientX;
                var deltaY = mouseEvent.clientY - controller.previousMouseEvent.clientY;

                controller.previousMouseEvent = mouseEvent;

                if (validateRendering(deltaX, deltaY)) {

                    if (controller.direction === _constants.CONSTANTS.HORIZONTAL_RESIZING) {
                        controller.resizingSibling1.width += deltaX;
                        controller.resizingSibling2.width -= deltaX;
                        controller.resizingSibling2.left += deltaX;
                    } else if (controller.direction === _constants.CONSTANTS.VERTICAL_RESIZING) {
                        controller.resizingSibling1.height += deltaY;
                        controller.resizingSibling2.height -= deltaY;
                        controller.resizingSibling2.top += deltaY;
                    }

                    controller.resizingSibling1.render(controller.resizingSibling1.getParent().rootDiv);
                    controller.resizingSibling2.render(controller.resizingSibling2.getParent().rootDiv);
                } else {
                    controller.isResizing = false;
                    updateCursorStyleIfResizing(mouseEvent);
                }
            } else {
                updateCursorStyleIfResizing(mouseEvent);
            }
        });
    }

    function validateRendering(deltaX, deltaY) {

        var renderingValues1 = {
            width: controller.resizingSibling1.width,
            height: controller.resizingSibling1.height,
            left: controller.resizingSibling1.left,
            top: controller.resizingSibling1.top
        };

        var renderingValues2 = {
            width: controller.resizingSibling2.width,
            height: controller.resizingSibling2.height,
            left: controller.resizingSibling2.left,
            top: controller.resizingSibling2.top
        };

        if (controller.direction === _constants.CONSTANTS.HORIZONTAL_RESIZING) {
            renderingValues1.width += deltaX;
            renderingValues2.width -= deltaX;
            renderingValues2.left += deltaX;
        } else if (controller.direction === _constants.CONSTANTS.VERTICAL_RESIZING) {
            renderingValues1.height += deltaY;
            renderingValues2.height -= deltaY;
            renderingValues2.top += deltaY;
        }

        var validRendering1 = controller.resizingSibling1.validateRendering(renderingValues1);
        var validRendering2 = controller.resizingSibling2.validateRendering(renderingValues2);

        return validRendering1 && validRendering2;
    }

    function updateCursorStyleIfResizing(mouseEvent) {
        var resizeInfo = getResizingInfo(mouseEvent);
        if (resizeInfo != null) {
            if (resizeInfo.direction === _constants.CONSTANTS.HORIZONTAL_RESIZING) {
                controller.direction = _constants.CONSTANTS.HORIZONTAL_RESIZING;
                controller.widgetContainer.rootDiv.style.cursor = "col-resize";
            } else if (resizeInfo.direction === _constants.CONSTANTS.VERTICAL_RESIZING) {
                controller.direction = _constants.CONSTANTS.VERTICAL_RESIZING;
                controller.widgetContainer.rootDiv.style.cursor = "row-resize";
            }
        } else {
            controller.direction = null;
            controller.widgetContainer.rootDiv.style.cursor = "default";
        }
    }

    function handleMouseDown() {
        controller.widgetContainer.rootDiv.addEventListener("mousedown", function (mouseEvent) {
            var resizeInfo = getResizingInfo(mouseEvent);

            if (resizeInfo != null) {

                controller.isResizing = true;
                controller.previousMouseEvent = mouseEvent;
                var firstSiblingAncestors = getSiblingAncestors(resizeInfo.widget1, resizeInfo.widget2);

                controller.resizingSibling1 = firstSiblingAncestors.parent1;
                controller.resizingSibling2 = firstSiblingAncestors.parent2;

                if (resizeInfo.direction === _constants.CONSTANTS.HORIZONTAL_RESIZING) {
                    controller.direction = _constants.CONSTANTS.HORIZONTAL_RESIZING;
                    controller.widgetContainer.rootDiv.style.cursor = "col-resize";
                } else if (resizeInfo.direction === _constants.CONSTANTS.VERTICAL_RESIZING) {
                    controller.direction = _constants.CONSTANTS.VERTICAL_RESIZING;
                    controller.widgetContainer.rootDiv.style.cursor = "row-resize";
                }
            }
        });
    }

    function handleMouseUp() {
        controller.widgetContainer.rootDiv.addEventListener("mouseup", function (mouseEvent) {
            controller.isResizing = false;
        });
    }

    function getResizingInfo(mouseEvent) {

        // check for horizontal resizing
        var widgetToTheRight = controller.widgetContainer.getWidgetFromPoint(mouseEvent.clientX + _constants.CONSTANTS.BORDER_DETECTION_JITTER_IN_PIXELS, mouseEvent.clientY);
        var widgetToTheLeft = controller.widgetContainer.getWidgetFromPoint(mouseEvent.clientX - _constants.CONSTANTS.BORDER_DETECTION_JITTER_IN_PIXELS, mouseEvent.clientY);

        if (widgetToTheRight !== null && widgetToTheLeft !== null && widgetToTheRight !== widgetToTheLeft) {
            return {
                widget1: widgetToTheLeft,
                widget2: widgetToTheRight,
                direction: _constants.CONSTANTS.HORIZONTAL_RESIZING
            };
        }

        // check for vertical resizing
        var widgetToTheTop = controller.widgetContainer.getWidgetFromPoint(mouseEvent.clientX, mouseEvent.clientY - _constants.CONSTANTS.BORDER_DETECTION_JITTER_IN_PIXELS);
        var widgetBelow = controller.widgetContainer.getWidgetFromPoint(mouseEvent.clientX, mouseEvent.clientY + _constants.CONSTANTS.BORDER_DETECTION_JITTER_IN_PIXELS);

        if (widgetToTheTop !== null && widgetBelow !== null && widgetToTheTop !== widgetBelow) {
            return {
                widget1: widgetToTheTop,
                widget2: widgetBelow,
                direction: _constants.CONSTANTS.VERTICAL_RESIZING
            };
        }

        return null;
    }

    function getSiblingAncestors(widget1, widget2) {

        var parentList1 = [];
        var pointer = widget1;
        while (pointer !== null) {
            parentList1.push(pointer);
            pointer = pointer.getParent();
        }

        var parentList2 = [];
        pointer = widget2;
        while (pointer !== null) {
            parentList2.push(pointer);
            pointer = pointer.getParent();
        }

        var i = parentList1.length - 1;
        var j = parentList2.length - 1;

        while (parentList1[i] === parentList2[j]) {
            i--;
            j--;
        }

        return {
            parent1: parentList1[i],
            parent2: parentList2[j]
        };
    }
}

exports.WidgetResizeController = WidgetResizeController;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WidgetTabDragController = undefined;

var _widget = __webpack_require__(1);

var _constants = __webpack_require__(0);

function WidgetTabDragController(widgetContainer) {

    var controller = this;

    controller.widgetContainer = widgetContainer;
    registerWidgetsMouseEventHandlers();
    registerWidgetContainerMouseMoveHandler();
    registerWidgetContainerMouseUpHandler();

    function onMouseUpHandler(mouseEvent, widget) {
        controller.selectedWidget = undefined;
    }

    function getDraggingTabInfo() {

        var widgets = controller.widgetContainer.toWidgetArray();

        for (var i = 0; i < widgets.length; i++) {
            var widget = widgets[i];

            if (widget.draggingTabIndex !== undefined) {
                return {
                    "widget": widget,
                    "tabIndex": widget.draggingTabIndex
                };
            }
        }

        return null;
    }

    function registerWidgetsMouseEventHandlers() {

        var widgets = controller.widgetContainer.toWidgetArray();

        for (var i = 0; i < widgets.length; i++) {
            var widget = widgets[i];
            registerWidgetMouseEventHandlers(widget);
        }
    }

    function registerWidgetMouseEventHandlers(widget) {
        widget.addMouseUpOnWidgetHandler(onMouseUpHandler);
    }

    function registerWidgetContainerMouseMoveHandler() {
        controller.widgetContainer.rootDiv.addEventListener("mousemove", function (event) {

            // if there is already a dragging widget for the dragged tab
            if (controller.clonedWidgetForTab) {
                var widgetContainerBoundingRectangle = controller.widgetContainer.rootDiv.getBoundingClientRect();
                var x = event.clientX - widgetContainerBoundingRectangle.left - controller.draggingStartPositionRelativeToWidget.x;
                var y = event.clientY - widgetContainerBoundingRectangle.top - controller.draggingStartPositionRelativeToWidget.y;

                controller.clonedWidgetForTab.node.style.setProperty("left", x + "px");
                controller.clonedWidgetForTab.node.style.setProperty("top", y + "px");

                // add overlay to potential dragging target position
                addOverLayToWidgetForPotentialDroppingPosition(event);
            } else {
                var draggingTabInfo = getDraggingTabInfo();

                if (draggingTabInfo == null) {
                    return;
                }

                controller.draggingTabSourceWidget = draggingTabInfo.widget;
                if (controller.draggingTabSourceWidget.isMouseOverWidgetTabs(event) && controller.draggingTabSourceWidget.isDraggingTabFullyInsideWidget()) {
                    return;
                }

                controller.draggingStartPositionRelativeToWidget = draggingTabInfo.widget.draggingStartPositionRelativeToWidget;
                controller.clonedWidgetForTab = controller.draggingTabSourceWidget.createWidgetFromTab(draggingTabInfo.tabIndex);
                controller.clonedWidgetForTab.setOpacity(0.75);

                controller.clonedWidgetForTab.render(controller.widgetContainer.rootDiv);
                controller.draggingTabSourceWidget.removeTab(draggingTabInfo.tabIndex);

                // if dragged tab is the only remainig tab, remove the whole widget and re-render parent
                if (controller.draggingTabSourceWidget.tabs.length == 0) {
                    removeSourceWidget();
                }

                // make content unselectable during dragging
                controller.widgetContainer.makeNonSelectable();
            }
        }, true);
    }

    function addOverLayToWidgetForPotentialDroppingPosition(event) {

        var x = event.clientX;
        var y = event.clientY;

        var targetWidget = controller.widgetContainer.getWidgetFromPoint(event.clientX, event.clientY);

        removeAllWidgetsOverlays();

        if (targetWidget) {

            var targetWidgetBoundingRectangle = targetWidget.contentDiv.getBoundingClientRect();
            var _x = event.clientX - targetWidgetBoundingRectangle.left;
            var _y = event.clientY - targetWidgetBoundingRectangle.top;

            var overlayType = void 0;
            if (targetWidget.isMouseOverWidgetTabs(event)) {
                overlayType = _constants.CONSTANTS.FULL_OVERLAY;
            } else {
                overlayType = targetWidget.determineDirectonToInsert(_x, _y);
            }

            targetWidget.addOverlay(overlayType);
        }

        function removeAllWidgetsOverlays() {
            var widgets = controller.widgetContainer.toWidgetArray();
            for (var i = 0; i < widgets.length; i++) {
                var widget = widgets[i];
                widget.removeOverlay();
            }
        }
    }

    function removeSourceWidget() {
        var currentNode = controller.draggingTabSourceWidget;

        while (currentNode) {

            var parentNode = currentNode.getParent();

            currentNode.remove();

            if (parentNode) {
                for (var i = 0; i < parentNode.children.length; i++) {
                    if (parentNode.children[i] === currentNode) {
                        parentNode.children.splice(i, 1);
                        break;
                    }
                }

                if (currentNode.widgetContainer) {
                    currentNode.widgetContainer = undefined;
                }

                if (currentNode.parentWidgetContainer) {
                    currentNode.parentWidgetContainer = undefined;
                }

                if (parentNode.children.length === 0) {
                    currentNode = parentNode;
                } else {
                    parentNode.render();
                    currentNode = undefined;
                }
            }
        }

        controller.draggingTabSourceWidget = undefined;
    }

    function registerWidgetContainerMouseUpHandler() {
        controller.widgetContainer.rootDiv.addEventListener("mouseup", function (event) {

            if (!controller.clonedWidgetForTab) {
                return;
            }

            var targetWidget = controller.widgetContainer.getWidgetFromPoint(event.clientX, event.clientY);

            if (targetWidget) {

                var targetWidgetBoundingRectangle = targetWidget.contentDiv.getBoundingClientRect();
                var x = event.clientX - targetWidgetBoundingRectangle.left;
                var y = event.clientY - targetWidgetBoundingRectangle.top;

                controller.clonedWidgetForTab.setOpacity(1);
                controller.clonedWidgetForTab.remove();

                if (targetWidget.isMouseOverWidgetTabs(event)) {
                    targetWidget.removeOverlay();
                    targetWidget.insertTab(controller.clonedWidgetForTab.tabs[0], x);
                } else {
                    targetWidget.insertWidget(controller.clonedWidgetForTab, x, y);
                }

                registerWidgetMouseEventHandlers(targetWidget);

                // changing back the z-index to auto after widget is inserted.
                controller.clonedWidgetForTab.node.style.setProperty("z-index", "auto");

                controller.clonedWidgetForTab = null;

                if (controller.draggingTabSourceWidget) {
                    controller.draggingTabSourceWidget.draggingTabIndex = undefined;
                    controller.draggingTabSourceWidget.render();
                }

                // make content selectable again
                controller.widgetContainer.makeSelectable();
            }
        }, true);
    }
}

exports.WidgetTabDragController = WidgetTabDragController;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function () {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for (var i = 0; i < this.length; i++) {
			var item = this[i];
			if (item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _widget = __webpack_require__(1);

Object.keys(_widget).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _widget[key];
    }
  });
});

var _widgetContainer = __webpack_require__(2);

Object.keys(_widgetContainer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _widgetContainer[key];
    }
  });
});

var _widgetTabDragController = __webpack_require__(4);

Object.keys(_widgetTabDragController).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _widgetTabDragController[key];
    }
  });
});

var _widgetResizeController = __webpack_require__(3);

Object.keys(_widgetResizeController).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _widgetResizeController[key];
    }
  });
});

var _constants = __webpack_require__(0);

Object.keys(_constants).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _constants[key];
    }
  });
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)();
// imports


// module
exports.push([module.i, ".widget {\n    position: absolute;\n}\n\n.widget-container {\n    position: absolute;\n}\n\n.widget-content {\n    position: absolute;\n    display: table;\n}\n\n.widget-content-border {\n    display: table-cell;\n}\n\n.tabs-outline path {\n    stroke: black;\n    stroke-width: 0.2px;\n    fill: lightgrey;\n    stroke-width: 0.15px;\n    shape-rendering: geometricprecision;\n}\n\n.tabs-outline.selected path {\n    fill: #efefef;\n    stroke-width: 0.15px;\n    shape-rendering: geometricprecision;\n}\n\n.widget-tabs {\n    cursor: default;\n    background-color: #f2f4f5 ;\n}\n\n.widget-tabs text {\n    font-size: 14px;\n    font-family: monospace;\n}\n\n.drag-target-widget-overlay {\n    background-color: green;\n    opacity: 0.4;\n    position: absolute;\n    display: table;\n    border-style: dashed;\n    border-width: 2px;\n    border-color: black;\n}\n\n.noselect {\n    -webkit-touch-callout: none;\n    /* iOS Safari */\n    -webkit-user-select: none;\n    /* Safari */\n    -khtml-user-select: none;\n    /* Konqueror HTML */\n    -moz-user-select: none;\n    /* Firefox */\n    -ms-user-select: none;\n    /* Internet Explorer/Edge */\n    user-select: none;\n    /* Non-prefixed version, currently\n    supported by Chrome and Opera */\n}\n\n.emphasize {\n    font-size: 28px;\n    font-weight: bold;\n}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(8)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./widget.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./widget.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ })
/******/ ]);
});