import { CONSTANTS } from "./constants.js";

import { WidgetContainer } from "./widget-container.js";

const Widget = (function() {

    const TAB_HEIGHT = 28;
    const TAB_HOLDER_HEIGHT = 32;

    const TAB_OVERLAP = 5;
    const TAB_HORIZONTAL_SIDE_LENGTH = 8;

    const CONTENT_BORDER_TOP_WIDTH = 5;
    const CONTENT_BORDER_BOTTOM_WIDTH = 2;
    const CONTENT_BORDER_RIGHT_WIDTH = 2;
    const CONTENT_BORDER_LEFT_WIDTH = 2;

    const DIRECTION_TOP = "DIRECTION_TOP";
    const DIRECTION_RIGHT = "DIRECTION_RIGHT";
    const DIRECTION_BOTTOM = "DIRECTION_BOTTOM";
    const DIRECTION_LEFT = "DIRECTION_LEFT";

    function Widget(id, tabs, widgetContainer, left, top, width, height, tabsBaseXOffset) {
        this.id = id;
        this.top = top;
        this.left = left
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

    Widget.prototype.render = function(parentNode) {

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
        this.tabsSVG.style.setProperty("top", (TAB_HOLDER_HEIGHT - TAB_HEIGHT) + "px");
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

        for (let i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].onRenderCallback) {
                this.tabs[i].onRenderCallback(this);
            }
        }

    };

    Widget.prototype.validateRendering = function(renderingValues) {
        const minPossibleWidth = this.getMinPossibleWidth();

        if (renderingValues.width < minPossibleWidth) {
            console.log(`rendering width: ${renderingValues.width} cannot be less than widget min width : ${minPossibleWidth}`);
            return false;
        }

        const minPossibleHeight = this.getMinPossibleHeight();

        if (renderingValues.height < minPossibleHeight) {
            console.log(`rendering height: ${renderingValues.height} cannot be less than minPossibleHeight : ${minPossibleHeight}`);
            return false;
        }

        return true;
    }

    Widget.prototype.remove = function(parent) {

        while (this.contentDiv.firstChild) {
            this.contentDiv.removeChild(this.contentDiv.firstChild);
        }
        this.contentDiv.remove();

        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }
        this.node.remove();
    };

    Widget.prototype.addMouseUpOnWidgetHandler = function(callback) {
        this.eventHandlers.mouseUpOnWidgetHandlers.push(callback);
        this.node.addEventListener("mouseup", (event) => {
            callback(event, this);
        }, true);
    };

    Widget.prototype.addMouseMoveOnContentHandler = function(callback) {
        this.eventHandlers.mouseMoveOnContentHandlers.push(callback);
        this.contentDiv.addEventListener("mousemove", (event) => {
            callback(event, this);
        }, true);
    };

    Widget.prototype.addMouseMoveOnTabsHandler = function(callback) {
        this.eventHandlers.mouseMoveOnTabsHandlers.push(callback);
        this.tabsDiv.addEventListener("mousemove", (event) => {
            callback(event, this);
        }, true);
    };

    Widget.prototype.addMouseDownOnTabsHandler = function(callback) {
        this.eventHandlers.mouseDownOnTabsHandlers.push(callback);
        for (let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].tabNode.addEventListener("mousedown", (event) => {
                callback(event, this, i);
            }, true);
        }
    };

    Widget.prototype.insertWidget = function(widgetToInsert, x, y) {

        const targetWidget = this;
        if (targetWidget === null) {
            return;
        }

        const direction = targetWidget.determineDirectonToInsert(x, y);

        let childIndex, containerNode, targetWidgetContainer;

        childIndex = findMyChildIndex(targetWidget);
        targetWidgetContainer = targetWidget.widgetContainer;

        switch (direction) {

            case DIRECTION_TOP:
                containerNode = new WidgetContainer([widgetToInsert, targetWidget], CONSTANTS.TOP_TO_BOTTOM, targetWidget.widgetContainer, targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height);
                widgetToInsert.height = targetWidget.height;
                break;
            case DIRECTION_RIGHT:
                containerNode = new WidgetContainer([targetWidget, widgetToInsert], CONSTANTS.LEFT_TO_RIGHT, targetWidget.widgetContainer, targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height);
                widgetToInsert.width = targetWidget.width;
                break;
            case DIRECTION_BOTTOM:
                containerNode = new WidgetContainer([targetWidget, widgetToInsert], CONSTANTS.TOP_TO_BOTTOM, targetWidget.widgetContainer, targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height);
                widgetToInsert.height = targetWidget.height;
                break;
            case DIRECTION_LEFT:
                containerNode = new WidgetContainer([widgetToInsert, targetWidget], CONSTANTS.LEFT_TO_RIGHT, targetWidget.widgetContainer, targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height);
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

    Widget.prototype.removeTab = function(tabIndex) {

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

    Widget.prototype.createWidgetFromTab = function(tabIndex) {

        const widgetOfTab = new Widget(this.id + "_tab_" + tabIndex, [{
                title: this.tabs[tabIndex].title,
            }],
            null,
            this.left,
            this.top,
            this.width,
            this.height,
            this.tabs[tabIndex].startX
        );

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

    Widget.prototype.addOverlay = function(overlayType) {

        const height = this.height - TAB_HOLDER_HEIGHT;
        const width = this.width;
        const left = 0;
        const top = TAB_HOLDER_HEIGHT;

        switch (overlayType) {
            case (DIRECTION_TOP):
                addOverlayTop(this);
                break;
            case (DIRECTION_RIGHT):
                addOverlayRight(this);
                break;
            case (DIRECTION_BOTTOM):
                addOverlayBottom(this);
                break;
            case (DIRECTION_LEFT):
                addOverlayLeft(this);
                break;
            case (CONSTANTS.FULL_OVERLAY):
                addOverlayFull(this);
                break;
        }

        this.overlayDiv.setAttribute("class", "drag-target-widget-overlay");
        this.contentDiv.parentNode.appendChild(this.overlayDiv);

        function addOverlayTop(widget) {
            widget.overlayDiv = document.createElement("div");
            widget.overlayDiv.style.setProperty("width", width + "px");
            widget.overlayDiv.style.setProperty("height", (height / 2) + "px");
            widget.overlayDiv.style.setProperty("left", left + "px");
            widget.overlayDiv.style.setProperty("top", top + "px");
        }

        function addOverlayRight(widget) {
            widget.overlayDiv = document.createElement("div");
            widget.overlayDiv.style.setProperty("width", (width / 2) + "px");
            widget.overlayDiv.style.setProperty("height", height + "px");
            widget.overlayDiv.style.setProperty("left", (left + (width / 2)) + "px");
            widget.overlayDiv.style.setProperty("top", top + "px");
        }

        function addOverlayBottom(widget) {
            widget.overlayDiv = document.createElement("div");
            widget.overlayDiv.style.setProperty("width", width + "px");
            widget.overlayDiv.style.setProperty("height", (height / 2) + "px");
            widget.overlayDiv.style.setProperty("left", left + "px");
            widget.overlayDiv.style.setProperty("top", top + (height / 2) + "px");
        }

        function addOverlayLeft(widget) {
            widget.overlayDiv = document.createElement("div");
            widget.overlayDiv.style.setProperty("width", (width / 2) + "px");
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

    Widget.prototype.removeOverlay = function() {
        if (this.overlayDiv) {
            this.overlayDiv.remove();
            this.overlayDiv = undefined;
        }
    };

    Widget.prototype.determineDirectonToInsert = function(x, y) {

        const distToLeft = Math.abs(x) / this.width;
        const distToRight = Math.abs(this.width - x) / this.width;
        const distToTop = Math.abs(y) / this.height;
        const distToBottom = Math.abs(this.height - y) / this.height;

        const distances = [distToLeft, distToRight, distToTop, distToBottom];

        const min = Math.min.apply(Math, distances);

        switch (min) {
            case (distToTop):
                return DIRECTION_TOP;
            case (distToRight):
                return DIRECTION_RIGHT;
            case (distToBottom):
                return DIRECTION_BOTTOM;
            case (distToLeft):
                return DIRECTION_LEFT;
            default:
                return null;
        }
    };

    Widget.prototype.insertTab = function(tab, dropX) {

        const location = findNewTabLocation(this, dropX);
        const tabIndex = location.tabIndex;
        const newTabStartX = location.newTabStartX;

        this.tabs.splice(tabIndex, 0, tab);

        // shift tabs to the right to open space for new tab
        const tabSize = getDynamicTabSize(this);
        for (let i = tabIndex + 1; i < this.tabs.length; i++) {
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

    Widget.prototype.isDraggingTabFullyInsideWidget = function() {
        if (this.draggingTabIndex !== undefined && this.tabs[this.draggingTabIndex].startX >= 0 && this.tabs[this.draggingTabIndex].startX <= this.width) {
            return true;
        }

        return false;
    };

    Widget.prototype.isMouseOverWidgetTabs = function(mouseEvent) {

        const widgetTabsBoundingRectangle = this.tabsDiv.getBoundingClientRect();

        if (mouseEvent.clientX <= widgetTabsBoundingRectangle.right && mouseEvent.clientX >= widgetTabsBoundingRectangle.left &&
            mouseEvent.clientY >= widgetTabsBoundingRectangle.top && mouseEvent.clientY <= widgetTabsBoundingRectangle.bottom) {
            return true;
        }

        return false;
    }

    Widget.prototype.getParent = function() {
        return this.widgetContainer;
    };

    Widget.prototype.getMinPossibleWidth = function() {
        return this.tabs.length * getDynamicTabSize(this);
    };

    Widget.prototype.getMinPossibleHeight = function() {
        const minHeight = 50;
        return minHeight;
    };

    Widget.prototype.setOpacity = function(opacity) {
        this.opacity = opacity;
        this.node.style.setProperty("opacity", opacity);
    };

    Widget.prototype.getTabSize = function() {
        return getDynamicTabSize(this);
    };

    function findNewTabLocation(widget, dropX) {

        const tabWidth = getDynamicTabSize(widget);

        let tabIndex = 0;
        let newTabStartX = 0;
        if (widget.tabs.length > 0) {
            let i = 0;
            let x = widget.tabs[i].startX;
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
        }
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

        const children = widget.widgetContainer.children;

        if (Array.isArray(children)) {
            for (let i = 0; i < children.length; i++) {
                if (children[i] === widget) {
                    return i;
                }
            }
        }

        return null;
    }


    function drawNotSelectedTab(widget, tabIndex, startX) {

        const tab = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const tabSize = getDynamicTabSize(widget);

        const p1 = [startX, TAB_HEIGHT];
        const p2 = [startX + TAB_HORIZONTAL_SIDE_LENGTH, 0];
        const p3 = [startX + tabSize - TAB_HORIZONTAL_SIDE_LENGTH, 0];
        const p4 = [startX + tabSize, TAB_HEIGHT];

        let tabData =
            'M ' + p1[0] + ' ' + p1[1] +
            ' L ' + p2[0] + ' ' + p2[1] +
            ' L ' + p3[0] + ' ' + p3[1] +
            ' L ' + p4[0] + ' ' + p4[1];

        tab.setAttribute('d', tabData);

        const leftPadding = 5;
        const tabText = createTabText(widget, tabIndex, p2[0] + leftPadding, (p2[1] + p4[1]) / 2);

        const tabNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
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

        const tab = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        const tabSize = getDynamicTabSize(widget);

        const p1 = [0, TAB_HEIGHT];
        const p2 = [startX, TAB_HEIGHT];
        const p3 = [startX + TAB_HORIZONTAL_SIDE_LENGTH, 0];
        const p4 = [startX + tabSize - TAB_HORIZONTAL_SIDE_LENGTH, 0];
        const p5 = [startX + tabSize, TAB_HEIGHT];
        const p6 = [widget.width, TAB_HEIGHT];

        const tabData =
            'M ' + p1[0] + ' ' + p1[1] +
            ' L ' + p2[0] + ' ' + p2[1] +
            ' L ' + p3[0] + ' ' + p3[1] +
            ' L ' + p4[0] + ' ' + p4[1] +
            ' L ' + p5[0] + ' ' + p5[1] +
            ' L ' + p6[0] + ' ' + p6[1];

        tab.setAttribute('d', tabData);

        const leftPadding = 5;
        const tabText = createTabText(widget, tabIndex, p3[0] + leftPadding, (p3[1] + p5[1]) / 2)

        const tabNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
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

        const maxTabSize = 180;
        const minTabSize = 120;

        const tabSize = widget.width / widget.tabs.length;

        if (tabSize > maxTabSize) {
            return maxTabSize
        } else if (tabSize < minTabSize) {
            return minTabSize
        } else {
            return tabSize;
        }
    }

    function createTabText(widget, tabIndex, x, y) {
        const tabText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
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
        widget.tabs[tabIndex].tabNode.addEventListener("mousedown", function(event) {
            widget.draggingTabIndex = tabIndex;

            const widgetBoundingRectangle = widget.node.getBoundingClientRect();
            widget.draggingStartPositionRelativeToWidget = {
                x: event.clientX - widgetBoundingRectangle.left,
                y: event.clientY - widgetBoundingRectangle.top
            };

            widget.tabs[tabIndex].drag = {
                mouseX: event.clientX,
                mouseY: event.clientY
            }
        }, true);

        // passed in handlers
        widget.tabs[tabIndex].tabNode.addEventListener("mousedown", (event) => {
            for (let i = 0; i < widget.eventHandlers.mouseDownOnTabsHandlers.length; i++) {
                let callback = widget.eventHandlers.mouseDownOnTabsHandlers[i];
                callback(event, widget, tabIndex);
            }
        }, true);
    }

    function attachMouseMoveOnContentEventHandlers(widget) {
        widget.contentDiv.addEventListener("mousemove", (event) => {
            for (let i = 0; i < widget.eventHandlers.mouseMoveOnContentHandlers.length; i++) {
                let callback = widget.eventHandlers.mouseMoveOnContentHandlers[i];
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
        const widgetBoundingRectangle = widget.node.getBoundingClientRect();
        widget.draggingStartPositionRelativeToWidget.x = event.clientX - widgetBoundingRectangle.left;

        // apply new position
        widget.tabs[widget.draggingTabIndex].startX += (event.clientX - widget.tabs[widget.draggingTabIndex].drag.mouseX);
        widget.tabs[widget.draggingTabIndex].drag.mouseX = event.clientX;
        widget.tabs[widget.draggingTabIndex].startY += (event.clientY - widget.tabs[widget.draggingTabIndex].drag.mouseY);
        widget.tabs[widget.draggingTabIndex].drag.mouseY = event.clientY;

        // update dom
        widget.tabs[widget.draggingTabIndex].tabNode.remove();
        if (widget.draggingTabIndex === widget.selectedTabIndex) {
            drawSelectedTab(widget, widget.draggingTabIndex, widget.tabs[widget.draggingTabIndex].startX, widget.tabs[widget.draggingTabIndex].startY);
        } else {
            drawNotSelectedTab(widget, widget.draggingTabIndex, widget.tabs[widget.draggingTabIndex].startX);
        }

        // swap if necessary
        let tabIndexToSwap = getTabIndexToSwap(widget);
        if (tabIndexToSwap !== undefined) {
            swapTabs(widget, tabIndexToSwap);
        }
    }

    function mouseUpEventHandler(event, widget) {

        if (widget.draggingTabIndex !== undefined) {

            widget.tabs[widget.draggingTabIndex].tabNode.remove();
            const startX = getTabDefaultStartXPosition(widget, widget.draggingTabIndex);
            drawSelectedTab(widget, widget.draggingTabIndex, startX, 0);

            updateSelectedTabTo(widget, widget.draggingTabIndex);
            widget.draggingTabIndex = undefined;
            widget.draggingStartPositionRelativeToWidget = null;
        }
    }

    function swapTabs(widget, tabIndexToSwap) {

        const temp = widget.tabs[tabIndexToSwap];
        widget.tabs[tabIndexToSwap] = widget.tabs[widget.draggingTabIndex];
        widget.tabs[widget.draggingTabIndex] = temp;

        const tempIndex = tabIndexToSwap;
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
        const startX = getTabDefaultStartXPosition(widget, tabIndexToSwap);

        if (tabIndexToSwap === widget.selectedTabIndex) {
            drawSelectedTab(widget, tabIndexToSwap, startX, 0);
        } else {
            drawNotSelectedTab(widget, tabIndexToSwap, startX);
        }
    }

    function getTabDefaultStartXPosition(widget, tabIndex) {
        const tabSize = getDynamicTabSize(widget);
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

        const tabSize = getDynamicTabSize(widget);

        for (let tabIndex = 0; tabIndex < widget.tabs.length; tabIndex++) {
            if (tabIndex !== widget.selectedTabIndex) {
                var startX = tabIndex * (tabSize - TAB_OVERLAP) + widget.tabsBaseXOffset;
                drawNotSelectedTab(widget, tabIndex, startX);
            }
        }

        var startX = widget.selectedTabIndex * (tabSize - TAB_OVERLAP) + widget.tabsBaseXOffset;
        drawSelectedTab(widget, widget.selectedTabIndex, startX, 0);
    }

    function getTabIndexToSwap(widget) {

        const preTabIndex = widget.draggingTabIndex - 1;
        const nextTabIndex = widget.draggingTabIndex + 1;

        const tabSize = getDynamicTabSize(widget);

        if (isValidTabIndex(widget, preTabIndex) && widget.tabs[widget.draggingTabIndex].startX < getMiddleXOfTab(widget, preTabIndex)) {
            return preTabIndex;
        } else if (isValidTabIndex(widget, nextTabIndex) && widget.tabs[widget.draggingTabIndex].startX + tabSize > getMiddleXOfTab(widget, nextTabIndex)) {
            return nextTabIndex
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
        return (widget.tabs[tabIndex].startX + getDynamicTabSize(widget) / 2);
    }

    return Widget;
}());

export { Widget };
require("./widget.css")