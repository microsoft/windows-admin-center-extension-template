var Dom = /** @class */ (function () {
    function Dom() {
    }
    /**
     * gets all body elements on the page
     */
    Dom.getAllBodys = function () {
        var root = Dom.getRootElement();
        return Dom.getAllElements(root, Dom.isBody);
    };
    /**
     * Gets a CSS property value
     * @param  {HTMLElement} element The Element
     * @param  {string} property - The CSS property name
     * @returns {any} - The value of the CSS property (type depends on property retrieved)
     */
    Dom.getStyle = function (element, property) {
        if (!element) {
            return null;
        }
        // first try to get the value directly from the element
        var value = element.style[property];
        if (!MsftSme.isNullOrWhiteSpace(value)) {
            return value;
        }
        // otherwise get the computed style
        return getComputedStyle(element)[property];
    };
    /**
     * Gets the classes applied to an element
     * @param  {HTMLElement} element The Element
     * @returns {string[]} - The classes currently applied to the element
     */
    Dom.getClasses = function (element) {
        if (element) {
            var classes = element.className.trim();
            if (!MsftSme.isNullOrWhiteSpace(classes)) {
                return classes.split(' ');
            }
        }
        return [];
    };
    /**
     * Determines is an element is disabled via the 'disabled' attribute
     * @param element The element to start from.
     */
    Dom.isDisabled = function (element) {
        if (!element) {
            return false;
        }
        return !!element['disabled'];
    };
    /**
     * Determines is an element is hidden via css with "display: none"
     * @param element The element to start from.
     */
    Dom.isNotDisplayed = function (element) {
        if (!element) {
            return false;
        }
        return Dom.getStyle(element, 'display') === 'none';
    };
    /**
     * Determines is an element is hidden via css with "visibility: hidden"
     * @param element The element to start from.
     */
    Dom.isHidden = function (element) {
        if (!element) {
            return false;
        }
        return Dom.getStyle(element, 'visibility') === 'hidden';
    };
    /**
     * Returns the first element in the current elements ancestory that is focusable.
     *
     * 'Focusable' is defined as the following:
     *  - input, select, textarea, button, object
     *  - anchor with href
     *  - have a non-negative tab index
     *
     * An element is not focusable if any of the following is true (even if it meets a condition above)
     *  - negative tab index
     *  - disabled
     *  - display: none
     *  - visibility: hidden
     *
     * @param element The element to start from.
     * @return the first focusable ancestor of the element
     */
    Dom.isFocusable = function (element, includeNegativeTabIndex) {
        if (includeNegativeTabIndex === void 0) { includeNegativeTabIndex = false; }
        if (!element) {
            return false;
        }
        // if the element is disabled(or ancestor is disabled) or 'not displayed'/hidden, it is not focusable
        if (Dom.isDisabled(element) || !!Dom.getAncestorDisabled(element) || Dom.isNotDisplayed(element) || Dom.isHidden(element)) {
            return false;
        }
        // if the tab index is set, let it determine focusability
        // have to check has attribute because
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/4365703/
        if (element.hasAttribute('tabindex') && !MsftSme.isNullOrUndefined(element.tabIndex)) {
            return element.tabIndex >= 0 || (includeNegativeTabIndex && !element.classList.contains('sme-hidden-focus'));
        }
        // anchors with an href are also focusable
        if (element.tagName === 'A' && element.hasAttribute('href')) {
            return true;
        }
        // Otherwise only naturably focusable elements can recieve focus
        var focusableTags = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'OBJECT'];
        return focusableTags.some(function (tag) { return tag === element.tagName; });
    };
    /**
     * Returns the first element in the current elements ancestory that is focusable.
     * Will return the element itself if it is focusable
     * @param element The element to start from.
     * @return the first focusable ancestor of the element
     */
    Dom.getFocusableAncestor = function (element) {
        if (!element) {
            return null;
        }
        return Dom.isFocusable(element) ? element : Dom.getFocusableAncestor(element.parentElement);
    };
    /**
     * find an element in a particular position with a specific condition relative to input element
     * Does a DFS for this element relative the ancestor zone of input element
     * @param element The current element
     * @param condition The function to check the kind of element we are looking for
     * @param position The ElementPosition of the desired element relative to input element
     */
    Dom.findElementFromAncestorZoneDFS = function (element, condition, position) {
        var ancestor = Dom.getAncestorZone(element);
        var allElements = Dom.getAllElements(ancestor, condition);
        return Dom.getElement(allElements, element, position);
    };
    /**
     * find an element in a particular position with a specific condition relative to input element
     * Does a DFS for this element relative the ancestor trap of input element
     * @param element The current element
     * @param condition The function to check the kind of element we are looking for
     * @param position The ElementPosition of the desired element relative to input element
     */
    Dom.findElementFromAncestorTrapDFS = function (element, condition, position) {
        var ancestor = Dom.getAncestorTrap(element);
        var allElements = Dom.getAllElements(ancestor, condition);
        return Dom.getElement(allElements, element, position);
    };
    /**
     * find an element in a particular position with a specific condition relative to input element
     * Does a DFS for this element relative the root of the graph
     * @param element The current element
     * @param condition The function to check the kind of element we are looking for
     * @param position The ElementPosition of the desired element relative to input element
     */
    Dom.findElementFromRootDFS = function (element, condition, position) {
        var root = Dom.getRootElement();
        var allElements = Dom.getAllElements(root, condition);
        return Dom.getElement(allElements, element, position);
    };
    /**
     * find an element in a particular position with a specific condition relative to input element
     * Does a DFS for this element relative the input element
     * @param element The current element
     * @param condition The function to check the kind of element we are looking for
     * @param position The ElementPosition of the desired element relative to input element
     */
    Dom.findChildElementDFS = function (element, condition, position) {
        var allElements = Dom.getAllElements(element, condition);
        return Dom.getElement(allElements, element, position);
    };
    /**
     * gets a element from a list of elements in the position relative to the current element
     * @param elements the list of elements
     * @param currentElement the current element
     * @param position the ElementPosition we want relative to the current element
     */
    Dom.getElement = function (elements, currentElement, position) {
        if (elements && elements.length > 0) {
            var currentIndex = 0;
            switch (position) {
                case ElementPosition.Next:
                    currentIndex = elements.findIndex(function (x) { return x.isSameNode(currentElement); });
                    return currentIndex + 1 < elements.length ? elements[currentIndex + 1] : currentElement;
                case ElementPosition.Previous:
                    currentIndex = elements.findIndex(function (x) { return x.isSameNode(currentElement); });
                    return currentIndex - 1 >= 0 ? elements[currentIndex - 1] : currentElement;
                case ElementPosition.First:
                    return elements.first();
                case ElementPosition.Last:
                    return elements.last();
                default:
                    return currentElement;
            }
        }
        return null;
    };
    /**
     * finds all elements starting at the input element that meet the given condition
     * @param element the element from which to start the depth first search
     * @param condition the function that determines whether the desired condition has been met
     */
    Dom.getAllElements = function (element, condition) {
        if (!element) {
            return null;
        }
        // depth first search starting at element
        var allElements = [];
        var conditionalElements = [];
        allElements.push(element);
        while (allElements.length > 0) {
            var currentElement = allElements.pop();
            if (currentElement.tagName !== 'SVG') {
                if (condition(currentElement)) {
                    conditionalElements.push(currentElement);
                }
                for (var i = currentElement.childElementCount - 1; i >= 0; i--) {
                    var child = currentElement.children.item(i);
                    allElements.push(child);
                }
                // if the current element is an iframe, start traversing the iframe's body
                try {
                    if (currentElement.contentDocument && currentElement.contentDocument.body) {
                        allElements.push(currentElement.contentDocument.body);
                    }
                }
                catch (error) {
                    // if we can't grab the content document, then we are very likely sideloading a tool in chrome
                    // you can disable same origin security policy to test accessibility or try in edge
                    // if this happens, we want to just get as much information as we can about the available elements
                    // TODO: log this when this code is moved to different file
                }
            }
        }
        // we need to reverse to get the actual order of elements on the page
        return conditionalElements;
    };
    /**
     * returns the root of the DOM graph
     */
    Dom.getRootElement = function () {
        // we want to try to grab the document body from the window because document.body gives us the body of the current iframe only
        try {
            if (window.parent && window.parent.document && window.parent.document.body) {
                return window.parent.document.body;
            }
        }
        catch (error) {
            // if we can't grab the document from the window, then we are very likely sideloading a tool in chrome
            // you can disable same origin security policy to test accessibility or try in edge
            // if this happens, we want to just get as much information as we can about the available elements
            // TODO: log this when this code is moved to different file
        }
        return document.body;
    };
    /**
     * Finds the next zone
     * @param element the current zone or an element in the current zone
     */
    Dom.getNextZone = function (element) {
        return Dom.findElementFromRootDFS(Dom.getAncestorZone(element) || element, Dom.isZone, ElementPosition.Next);
    };
    /**
     * gets the first focusable element in the next zone
     * if a zone has no focusable elements, it is skipped
     * @param element the current element
     */
    Dom.getNextZoneElement = function (element) {
        if (!element) {
            return null;
        }
        // we are at the end of the page
        var nextZone = Dom.getNextZone(element);
        if (element.isSameNode(nextZone)) {
            return null;
        }
        var firstFocusableElement = Dom.getFirstFocusableDescendent(nextZone);
        return firstFocusableElement ? firstFocusableElement : Dom.getNextZoneElement(nextZone);
    };
    /**
     * Finds the previous zone
     * @param element the current zone or an element in the current zone
     */
    Dom.getPreviousZone = function (element) {
        return Dom.findElementFromRootDFS(Dom.getAncestorZone(element), Dom.isZone, ElementPosition.Previous);
    };
    /**
     * gets the first focusable element in the previous zone
     * if a zone has no focusable elements, it is skipped
     * @param element the current element
     * @param originalElement the element from which we begin the search. Set automatically if unset by user
     */
    Dom.getPreviousZoneElement = function (element, originalElement) {
        if (!element) {
            return null;
        }
        // save the first element we see so we can skip empty zones later on
        if (!originalElement) {
            return Dom.getPreviousZoneElement(element, element);
        }
        // we are at the beginning of the page
        var previousZone = Dom.getPreviousZone(element);
        if (previousZone.isSameNode(element)) {
            return null;
        }
        var firstFocusableElement = Dom.getFirstFocusableDescendent(previousZone);
        return firstFocusableElement && firstFocusableElement !== originalElement ?
            firstFocusableElement : Dom.getPreviousZoneElement(previousZone, originalElement);
    };
    /**
     * gets the first ancestor that is disabled
     * @param element the element
     */
    Dom.getAncestor = function (element, condition) {
        if (!element) {
            return null;
        }
        return condition(element) ? element : Dom.getAncestor(element.parentElement, condition);
    };
    /**
     * gets the zone that the current element is in
     * @param element the element
     */
    Dom.getAncestorZone = function (element) {
        return Dom.getAncestor(element, function (e) { return Dom.isZone(e); });
    };
    /**
     * determine if an element is in a trap, if so return the trap element
     * @param element HTML element to check
     */
    Dom.getAncestorTrap = function (element) {
        return Dom.getAncestor(element, function (e) { return Dom.isTrap(e); });
    };
    /**
     * gets the ancestor form of an element
     * @param element the element
     */
    Dom.getAncestorForm = function (element) {
        return Dom.getAncestor(element, function (e) { return Dom.isForm(e); });
    };
    /**
     * gets the first ancestor that is disabled
     * @param element the element
     */
    Dom.getAncestorDisabled = function (element) {
        return Dom.getAncestor(element, function (e) { return Dom.isDisabled(e); });
    };
    /**
     * returns ancestor table of current element
     * @param element the current element
     */
    Dom.getAncestorTable = function (element) {
        return Dom.getAncestor(element, function (e) { return e.tagName === 'TABLE'; });
    };
    /**
     * gets the next child zone of the current zone
     * @param element the current zone or an element in the current zone
     */
    Dom.getDescendentZone = function (element) {
        // if there is no parent zone, just look from the current element forward
        return Dom.findChildElementDFS(Dom.getAncestorZone(element) || element, Dom.isZone, ElementPosition.First);
    };
    /**
     * gets the first focusable descendent of the current element
     * @param element the current element
     */
    Dom.getFirstFocusableDescendent = function (element) {
        if (!element) {
            return null;
        }
        return Dom.isFocusable(element) ?
            element : Dom.getFirstFocusableDescendent(Dom.findChildElementDFS(element, Dom.isFocusable || Dom.isZone, ElementPosition.First));
    };
    Dom.getLastElementInZone = function (element) {
        return Dom.findElementFromAncestorZoneDFS(element, Dom.isFocusable, ElementPosition.Last);
    };
    Dom.getFirstElementInZone = function (element) {
        return Dom.findElementFromAncestorZoneDFS(element, Dom.isFocusable, ElementPosition.First);
    };
    /**
     * gets the next focusable element in the current zone
     * @param element the current element
     */
    Dom.getNextFocusableElement = function (element) {
        return Dom.findElementFromAncestorZoneDFS(element, Dom.isFocusable, ElementPosition.Next);
    };
    /**
     * gets the previous focusable element in the current zone
     * @param element the current element
     */
    Dom.getPreviousFocusableElement = function (element) {
        return Dom.findElementFromAncestorZoneDFS(element, Dom.isFocusable, ElementPosition.Previous);
    };
    /**
     * gets the ancestor of an element that meets the specified condition
     * @param element the current element
     * @param condition the function that will check if element meets the desired condition
     */
    Dom.getSpecificAncestor = function (element, condition) {
        if (!element) {
            return null;
        }
        return condition(element) ? element : Dom.getSpecificAncestor(element.parentElement, condition);
    };
    /**
     * gets the next focusable element in the current trap
     * @param element the current element
     */
    Dom.getNextFocusableElementInTrap = function (element) {
        return Dom.findElementFromAncestorTrapDFS(element, Dom.isFocusable, ElementPosition.Next);
    };
    /**
     * gets the previous focusable element in the current trap
     * @param element the current element
     */
    Dom.getPreviousFocusableElementInTrap = function (element) {
        return Dom.findElementFromAncestorTrapDFS(element, Dom.isFocusable, ElementPosition.Previous);
    };
    /**
     * true if given element is a body element
     * @param element the element
     */
    Dom.isBody = function (element) {
        return element.tagName === 'BODY';
    };
    /**
     * true if the given element is a zone
     * @param element the element
     */
    Dom.isZone = function (element) {
        if (!element) {
            return false;
        }
        var role = element.getAttribute('role');
        var zoneRoles = ['grid', 'tablist', 'table', 'menubar', 'navigation', 'dialog'];
        var tag = element.tagName;
        // TODO: utilities should not know about specific sme tags.
        // These tags should instead use the appropriete roles to identify them as focus zones.
        // 'form' is ok because it is a standard html5 element.
        var zoneTags = ['FORM', 'SME-ACTION-BAR', 'SME-BREADCRUMB-HEADER', 'SME-DETAILS', 'SME-SETTINGS-FOOTER'];
        return zoneRoles.some(function (zoneRole) { return zoneRole === role; })
            || element.classList.contains('sme-focus-zone')
            || zoneTags.some(function (zoneTag) { return zoneTag === tag; })
            || (element.classList.contains('growl') && element.childElementCount > 0);
    };
    /**
     * true if the given element is a trap
     * @param element the element
     */
    Dom.isTrap = function (element) {
        if (!element) {
            return false;
        }
        var role = element.getAttribute('role');
        var trapRoles = ['dialog', 'alertdialog'];
        return trapRoles.some(function (trapRole) { return trapRole === role; }) || element.classList.contains('sme-focus-trap');
    };
    /**
     * return true if element is a form
     * @param element the element
     */
    Dom.isForm = function (element) {
        if (!element) {
            return false;
        }
        return element.tagName === 'FORM';
    };
    /**
     * return true if we are inside a search box that has its own arrow key controls
     * @param element the element
     * @param isRightArrow the right arrow was clicked
     */
    Dom.useArrowKeysWithinSearchbox = function (element, isRightArrow) {
        if (!element) {
            return false;
        }
        if (Dom.isSearchBox(element)) {
            var inputElement = element;
            var innerTextLength = inputElement.value ? inputElement.value.length : 0;
            return (!isRightArrow && inputElement.selectionStart !== null && inputElement.selectionStart > 0)
                || (isRightArrow && inputElement.selectionEnd !== null && inputElement.selectionEnd < innerTextLength);
        }
        return false;
    };
    /**
     * true if given element is a search box
     * @param element the element
     */
    Dom.isSearchBox = function (element) {
        if (!element) {
            return false;
        }
        var inputElement = element;
        return element.tagName === 'INPUT' && inputElement && inputElement.type === 'search';
    };
    /**
     * returns the next row in the current table
     * @param element the current element
     */
    Dom.getNextRowInTable = function (element) {
        return Dom.findElementFromAncestorZoneDFS(element, Dom.isTableRow, ElementPosition.Next);
    };
    /**
     * returns the previous row in the current table
     * @param element the current element
     */
    Dom.getPreviousRowInTable = function (element) {
        return Dom.findElementFromAncestorZoneDFS(element, Dom.isTableRow, ElementPosition.Previous);
    };
    /**
     * returns true if the current element is a table row
     * @param element the current element
     */
    Dom.isTableRow = function (element) {
        return element.tagName === 'TR';
    };
    /**
     * returns true if the current element is a table cell
     * @param element the current element
     */
    Dom.isTableCell = function (element) {
        return element.tagName === 'TD';
    };
    /**
     * returns true if the current element is inside a table cell
     * @param element the current element
     */
    Dom.isInTableCell = function (element) {
        if (!element) {
            return false;
        }
        return Dom.isTableCell(element) ? true : Dom.isInTableCell(element.parentElement);
    };
    /**
     * Gets the first action bar on the screen.
     * @param element The HTML element.
     * @returns The first action bar on the screen.
     */
    Dom.getFirstActionBar = function (element) {
        return this.getActionBar(element, ElementPosition.First);
    };
    /**
     * Gets the next action bar on the screen.
     * @param element The HTML element.
     * @returns The first action bar on the screen.
     */
    Dom.getNextActionBar = function (element) {
        return this.getActionBar(element, ElementPosition.Next);
    };
    /**
     * Gets a specified action bar.
     * @param element The HTML element.
     * @param position The position of the desired action bar.
     * @returns The specified action bar, if possible.
     */
    Dom.getActionBar = function (element, position) {
        return Dom.getFirstFocusableDescendent(Dom.findElementFromRootDFS(Dom.getAncestorZone(element), function (x) { return Dom.isActionBar(x); }, position));
    };
    /**
     * Determines if the HTML element is inside of an action bar.
     * @param element The HTML element.
     * @returns True if the HTML element is in an action bar and false if not.
     */
    Dom.isInActionBar = function (element) {
        return MsftSme.isNullOrUndefined(Dom.getSpecificAncestor(element, function (x) { return Dom.isActionBar(x); })) ? false : true;
    };
    /**
     * Determines if the HTML element is an action bar.
     * @param element The HTML element.
     * @returns True if the element is an action bar and false if not.
     */
    Dom.isActionBar = function (element) {
        return MsftSme.isNullOrUndefined(element) ? false : element.tagName === 'SME-ACTION-BAR';
    };
    /**
     * Determines if we should treat enter as click for a certain element
     * @param element The HTML element to check
     */
    Dom.shouldTreatEnterAsClick = function (element) {
        if (!element) {
            return false;
        }
        var inputElement = element;
        // TODO: More types of elements may be added here
        return element.tagName === 'INPUT' && inputElement && inputElement.type === 'file';
    };
    /**
     * Check tab list aria-selected with active status
     */
    Dom.checkActiveTab = function () {
        var tablists = document.querySelectorAll("[role='tablist']");
        for (var _i = 0, _a = Array.from(tablists); _i < _a.length; _i++) {
            var tablist = _a[_i];
            // As all controls should, the <sme-pivot> handles accessibility internally.
            if (tablist.parentElement.tagName !== 'SME-PIVOT') {
                Dom.updateAriaSelect(tablist, false);
            }
        }
    };
    /**
     * Update tab aria-selected status
     * @param element The HTML element.
     * @param isActive The HTML element is active or inactive.
     */
    Dom.updateAriaSelect = function (currentElement, isActive) {
        if (!currentElement) {
            return;
        }
        if (currentElement.classList.contains('active') || currentElement.classList.contains('sme-active')) {
            isActive = true;
        }
        if (currentElement.getAttribute('aria-selected') && !isActive) {
            currentElement.setAttribute('aria-selected', 'false');
        }
        if (currentElement.getAttribute('role') === 'tab' && isActive) {
            currentElement.setAttribute('aria-selected', 'true');
        }
        for (var _i = 0, _a = Array.from(currentElement.children); _i < _a.length; _i++) {
            var childElement = _a[_i];
            Dom.updateAriaSelect(childElement, isActive);
        }
    };
    return Dom;
}());
export { Dom };
/**
 * describes the position of the desired element in a list of elements
 */
export var ElementPosition;
(function (ElementPosition) {
    ElementPosition[ElementPosition["First"] = 0] = "First";
    ElementPosition[ElementPosition["Previous"] = 1] = "Previous";
    ElementPosition[ElementPosition["Next"] = 2] = "Next";
    ElementPosition[ElementPosition["Last"] = 3] = "Last";
})(ElementPosition || (ElementPosition = {}));
//# sourceMappingURL=data:application/json;base64,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