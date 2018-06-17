import { Widget } from "./widget.js";
import { CONSTANTS } from "./constants.js";

function WidgetTabDragController(widgetContainer) {

    const controller = this;

    controller.widgetContainer = widgetContainer;
    registerWidgetsMouseEventHandlers();
    registerWidgetContainerMouseMoveHandler();
    registerWidgetContainerMouseUpHandler();

    function onMouseUpHandler(mouseEvent, widget) {
        controller.selectedWidget = undefined;
    }

    function getDraggingTabInfo() {

        const widgets = controller.widgetContainer.toWidgetArray();

        for (let i = 0; i < widgets.length; i++) {
            const widget = widgets[i];

            if (widget.draggingTabIndex !== undefined) {
                return {
                    "widget": widget,
                    "tabIndex": widget.draggingTabIndex
                }
            }
        }

        return null;
    }

    function registerWidgetsMouseEventHandlers() {

        const widgets = controller.widgetContainer.toWidgetArray();

        for (let i = 0; i < widgets.length; i++) {
            const widget = widgets[i];
            registerWidgetMouseEventHandlers(widget);
        }
    }

    function registerWidgetMouseEventHandlers(widget) {
        widget.addMouseUpOnWidgetHandler(onMouseUpHandler);
    }

    function registerWidgetContainerMouseMoveHandler() {
        controller.widgetContainer.rootDiv.addEventListener("mousemove", (event) => {

            // if there is already a dragging widget for the dragged tab
            if (controller.clonedWidgetForTab) {
                const widgetContainerBoundingRectangle = controller.widgetContainer.rootDiv.getBoundingClientRect();
                const x = (event.clientX - widgetContainerBoundingRectangle.left) - controller.draggingStartPositionRelativeToWidget.x;
                const y = (event.clientY - widgetContainerBoundingRectangle.top) - controller.draggingStartPositionRelativeToWidget.y;

                controller.clonedWidgetForTab.node.style.setProperty("left", x + "px");
                controller.clonedWidgetForTab.node.style.setProperty("top", y + "px");

                // add overlay to potential dragging target position
                addOverLayToWidgetForPotentialDroppingPosition(event);
            } else {
                const draggingTabInfo = getDraggingTabInfo();

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

        const x = event.clientX;
        const y = event.clientY;

        const targetWidget = controller.widgetContainer.getWidgetFromPoint(event.clientX, event.clientY);

        removeAllWidgetsOverlays();

        if (targetWidget) {

            const targetWidgetBoundingRectangle = targetWidget.contentDiv.getBoundingClientRect();
            const x = event.clientX - targetWidgetBoundingRectangle.left;
            const y = event.clientY - targetWidgetBoundingRectangle.top;

            let overlayType;
            if (targetWidget.isMouseOverWidgetTabs(event)) {
                overlayType = CONSTANTS.FULL_OVERLAY;
            } else {
                overlayType = targetWidget.determineDirectonToInsert(x, y);
            }

            targetWidget.addOverlay(overlayType);
        }

        function removeAllWidgetsOverlays() {
            const widgets = controller.widgetContainer.toWidgetArray();
            for (let i = 0; i < widgets.length; i++) {
                const widget = widgets[i];
                widget.removeOverlay();
            }
        }
    }


    function removeSourceWidget() {
        let currentNode = controller.draggingTabSourceWidget;

        while (currentNode) {

            let parentNode = currentNode.getParent();

            currentNode.remove();

            if (parentNode) {
                for (let i = 0; i < parentNode.children.length; i++) {
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
        controller.widgetContainer.rootDiv.addEventListener("mouseup", (event) => {

            if (!controller.clonedWidgetForTab) {
                return;
            }

            const targetWidget = controller.widgetContainer.getWidgetFromPoint(event.clientX, event.clientY);

            if (targetWidget) {

                const targetWidgetBoundingRectangle = targetWidget.contentDiv.getBoundingClientRect();
                const x = event.clientX - targetWidgetBoundingRectangle.left;
                const y = event.clientY - targetWidgetBoundingRectangle.top;

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

export { WidgetTabDragController };