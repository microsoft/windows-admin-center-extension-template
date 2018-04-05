import { Dom } from '../dom/dom';
/**
 * Class for accessibility manager
 */
var AccessibilityManager = /** @class */ (function () {
    function AccessibilityManager() {
        /**
         * Indicates that body focus class handlers have already been setup and should not be setup again
         */
        this.hiddenFocusHandlersInitialized = false;
        /**
         * The set of events for element focusing.
         */
        this.elementFocusingEvents = [];
        /**
         * The CSS class to disable the focus rectangle even in keyboard mode
         */
        this.hiddenFocusClass = 'sme-hidden-focus';
        /**
         * The CSS class to enable mouse specific accessibility styles
         */
        this.mouseNavigationModeClass = 'sme-accessibility-mode-mouse';
        /**
         * The CSS class to enable keyboard specific accessibility styles
         */
        this.keyboardNavigationModeClass = 'sme-accessibility-mode-keyboard';
        /**
         * The set of elements that have had the hiddenFocusClass applied
         */
        this.hiddenFocusElements = [];
        // hookup global handlers
        this.hookupGlobalHandlers();
    }
    /**
     * Registers the event handler for ElementFocusingEvent
     */
    AccessibilityManager.prototype.registerElementFocusingEvent = function (handler) {
        var _this = this;
        var unregisterEventFunction = function () {
            var index = _this.elementFocusingEvents.indexOf(handler);
            if (index !== -1) {
                _this.elementFocusingEvents.splice(index, 1);
            }
        };
        this.elementFocusingEvents.push(handler);
        return unregisterEventFunction;
    };
    /**
     * focus on given element and prevent the default of the event
     * @param element the element to focus on
     * @param event the event that triggered the focus
     * @param allowBrowserFocusHandling it indicates whether to allow browser to handle focus.
     */
    AccessibilityManager.prototype.focusOnElement = function (element, event, allowBrowserFocusHandling) {
        if (element) {
            element.focus();
            if (!allowBrowserFocusHandling) {
                event.preventDefault();
            }
        }
    };
    /**
     * Handlers the element focusing in either the default way or custom ways based on ElementFocusingEvent handler.
     */
    AccessibilityManager.prototype.processElementFocusing = function (event, elementToFocus, sourceZone, targetZone, allowBrowserFocusHandling) {
        var useCustomFocusHandling = false;
        var preventDefaultEvent = false;
        this.elementFocusingEvents.forEach(function (focusEvent) {
            focusEvent({
                nativeEvent: event,
                sourceZone: sourceZone,
                targetZone: targetZone,
                targetElement: elementToFocus,
                preventDefaultFocusBehavior: function () {
                    useCustomFocusHandling = true;
                },
                preventDefaultEvent: function () {
                    preventDefaultEvent = true;
                }
            });
        });
        if (useCustomFocusHandling) {
            if (preventDefaultEvent) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
        else {
            this.focusOnElement(elementToFocus, event, allowBrowserFocusHandling);
        }
    };
    /**
     * click on given element and prevent the default of the event
     * @param element the element to click
     * @param event the event that triggered the click
     */
    AccessibilityManager.prototype.clickOnElement = function (element, event) {
        if (element) {
            element.click();
            event.preventDefault();
        }
    };
    /**
     * Changes the Accessibility Mode to mouse or keyboard
     * @param keyboardMode indicates that keyboard mode should be set
     */
    AccessibilityManager.prototype.changeAccessibilityMode = function (keyboardMode) {
        // toggle accessibility mode across all iframes in the document
        // only works for same origin iframes
        // TODO: support cross origin iframes and replace this with RPC broadcasting to all iframes
        var allBodys = Dom.getAllBodys();
        for (var i = 0; i < allBodys.length; i++) {
            var currentBody = allBodys[i];
            currentBody.classList.toggle(this.mouseNavigationModeClass, !keyboardMode);
            currentBody.classList.toggle(this.keyboardNavigationModeClass, keyboardMode);
        }
        // register accessibility mode with self so RPC can use it
        var self = MsftSme.self();
        self.Resources.accessibilityMode = keyboardMode;
    };
    /**
     * Hooks up the global event handlers
     */
    AccessibilityManager.prototype.hookupGlobalHandlers = function () {
        var _this = this;
        // hookup body focus class handlers.
        // We do not need to unhook these as they last the entire applications lifecycle.
        if (!this.hiddenFocusHandlersInitialized) {
            // ensure this is only called once
            this.hiddenFocusHandlersInitialized = true;
            // apply the mouse navigation class to the body of the document as default
            this.changeAccessibilityMode(false);
            // when the user clicks on the page, we need to exit keyboard mode and enter mouse mode again
            document.body.addEventListener('mousedown', function (event) {
                _this.changeAccessibilityMode(false);
                setTimeout(function () { return Dom.checkActiveTab(); }, 0);
            });
            document.body.addEventListener('keydown', function (event) {
                var isKeyboardMode = MsftSme.self().Resources.accessibilityMode;
                var currentElement = event.target;
                var currentTrap = Dom.getAncestorTrap(currentElement);
                var currentForm = Dom.getAncestorForm(currentElement);
                var keyCode = event.keyCode;
                setTimeout(function () { return Dom.checkActiveTab(); }, 0);
                if (event.shiftKey && keyCode === KeyCode.Tab) {
                    // current element in a trap, shift-tab should go to previous focusable element
                    if (currentTrap) {
                        _this.focusOnElement(Dom.getPreviousFocusableElementInTrap(currentElement), event);
                    }
                    else {
                        var focusOn = Dom.getPreviousFocusableElement(currentElement);
                        // if we are in a form, use shift tab to navigate through form
                        // unless we are at the beginning of the form
                        if (currentForm && focusOn !== currentElement) {
                            _this.focusOnElement(focusOn, event);
                        }
                        else {
                            // shift tab - go back to previous zone
                            focusOn = Dom.getPreviousZoneElement(currentElement);
                            var currentZone = Dom.getAncestorZone(currentElement);
                            var targetZone = Dom.getAncestorZone(focusOn);
                            if (focusOn !== currentElement) {
                                _this.processElementFocusing(event, focusOn, currentZone, targetZone);
                            }
                            // else we are at the beginning of the page and want shift tab to perform its default action
                        }
                    }
                }
                else if (keyCode === KeyCode.Tab) {
                    // when the user presses 'tab' we will enter keyboard mode
                    _this.changeAccessibilityMode(true);
                    // current element in a trap, tab should go to next focusable element
                    if (currentTrap) {
                        _this.focusOnElement(Dom.getNextFocusableElementInTrap(currentElement), event);
                    }
                    else {
                        var focusOn = Dom.getNextFocusableElement(currentElement);
                        // if we are in a form, use tab to navigate through form
                        // unless we are at the end of the form
                        if (currentForm && focusOn !== currentElement) {
                            _this.focusOnElement(focusOn, event);
                        }
                        else {
                            var currentZone = Dom.getAncestorZone(currentElement);
                            var nextElement = Dom.getNextFocusableElement(currentElement);
                            focusOn = Dom.getNextZoneElement(currentElement);
                            var targetZone = Dom.getAncestorZone(focusOn);
                            // Check and move to next element
                            if (currentZone && currentZone.tagName === 'FORM' && currentElement !== nextElement) {
                                _this.focusOnElement(nextElement, event);
                            }
                            else if (focusOn && targetZone !== currentZone) {
                                // go to next zone
                                _this.processElementFocusing(event, focusOn, currentZone, targetZone);
                            }
                            else {
                                // else we are at the end of the page and want tab to perform its default action
                                var lastElement = Dom.getLastElementInZone(currentElement);
                                if (lastElement) {
                                    _this.processElementFocusing(event, lastElement, currentZone, targetZone, true);
                                }
                            }
                        }
                    }
                }
                else if (keyCode === KeyCode.RightArrow && !currentTrap && !currentForm) {
                    // use default if the cursor is in the middle of search box text
                    var useArrowKeys = Dom.useArrowKeysWithinSearchbox(currentElement, true);
                    if (!useArrowKeys && isKeyboardMode) {
                        // go to next focusable element within current zone
                        _this.focusOnElement(Dom.getNextFocusableElement(currentElement), event);
                    }
                }
                else if (keyCode === KeyCode.DownArrow && !currentTrap && !currentForm) {
                    // go to next focusable element within current zone
                    _this.focusOnElement(Dom.getNextFocusableElement(currentElement), event);
                }
                else if (keyCode === KeyCode.UpArrow && !currentTrap && !currentForm) {
                    // go to previous focusable element within current zone
                    _this.focusOnElement(Dom.getPreviousFocusableElement(currentElement), event);
                }
                else if (event.keyCode === KeyCode.LeftArrow && !currentTrap && !currentForm) {
                    // use default if the cursor is in the middle of search box text
                    var useArrowKeys = Dom.useArrowKeysWithinSearchbox(currentElement, false);
                    if (!useArrowKeys && isKeyboardMode) {
                        // go to previous focusable element within current zone
                        _this.focusOnElement(Dom.getPreviousFocusableElement(currentElement), event);
                    }
                }
                else if (event.keyCode === KeyCode.Enter) {
                    if (document.body.classList.contains(_this.keyboardNavigationModeClass)) {
                        var ancestorZone = Dom.getAncestorZone(currentElement);
                        if (ancestorZone && (ancestorZone.tagName !== 'FORM' || Dom.shouldTreatEnterAsClick(currentElement))) {
                            _this.clickOnElement(currentElement, event);
                        }
                    }
                }
                else if (event.keyCode === KeyCode.End && !Dom.isSearchBox(currentElement) && !currentForm) {
                    _this.focusOnElement(Dom.getLastElementInZone(currentElement), event);
                }
                else if (event.keyCode === KeyCode.Home && !Dom.isSearchBox(currentElement) && !currentForm) {
                    _this.focusOnElement(Dom.getFirstElementInZone(currentElement), event);
                }
                else if (event.keyCode === KeyCode.A && event.ctrlKey && event.altKey) {
                    var targetElement = void 0;
                    if (Dom.isInActionBar(currentElement)) {
                        targetElement = Dom.getNextActionBar(currentElement);
                    }
                    else {
                        targetElement = Dom.getFirstActionBar(currentElement);
                    }
                    if (!MsftSme.isNullOrUndefined(targetElement)) {
                        _this.changeAccessibilityMode(true);
                        _this.focusOnElement(targetElement, event, false);
                    }
                }
            });
        }
    };
    return AccessibilityManager;
}());
export { AccessibilityManager };
// Keyboard codes
export var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["Backspace"] = 8] = "Backspace";
    KeyCode[KeyCode["Tab"] = 9] = "Tab";
    KeyCode[KeyCode["Enter"] = 13] = "Enter";
    KeyCode[KeyCode["Shift"] = 16] = "Shift";
    KeyCode[KeyCode["Ctrl"] = 17] = "Ctrl";
    KeyCode[KeyCode["Alt"] = 18] = "Alt";
    KeyCode[KeyCode["Pause"] = 19] = "Pause";
    KeyCode[KeyCode["CapsLock"] = 20] = "CapsLock";
    KeyCode[KeyCode["Escape"] = 27] = "Escape";
    KeyCode[KeyCode["Space"] = 32] = "Space";
    KeyCode[KeyCode["PageUp"] = 33] = "PageUp";
    KeyCode[KeyCode["PageDown"] = 34] = "PageDown";
    KeyCode[KeyCode["End"] = 35] = "End";
    KeyCode[KeyCode["Home"] = 36] = "Home";
    KeyCode[KeyCode["LeftArrow"] = 37] = "LeftArrow";
    KeyCode[KeyCode["UpArrow"] = 38] = "UpArrow";
    KeyCode[KeyCode["RightArrow"] = 39] = "RightArrow";
    KeyCode[KeyCode["DownArrow"] = 40] = "DownArrow";
    KeyCode[KeyCode["Insert"] = 45] = "Insert";
    KeyCode[KeyCode["Delete"] = 46] = "Delete";
    KeyCode[KeyCode["Num0"] = 48] = "Num0";
    KeyCode[KeyCode["Num1"] = 49] = "Num1";
    KeyCode[KeyCode["Num2"] = 50] = "Num2";
    KeyCode[KeyCode["Num3"] = 51] = "Num3";
    KeyCode[KeyCode["Num4"] = 52] = "Num4";
    KeyCode[KeyCode["Num5"] = 53] = "Num5";
    KeyCode[KeyCode["Num6"] = 54] = "Num6";
    KeyCode[KeyCode["Num7"] = 55] = "Num7";
    KeyCode[KeyCode["Num8"] = 56] = "Num8";
    KeyCode[KeyCode["Num9"] = 57] = "Num9";
    KeyCode[KeyCode["A"] = 65] = "A";
    KeyCode[KeyCode["B"] = 66] = "B";
    KeyCode[KeyCode["C"] = 67] = "C";
    KeyCode[KeyCode["D"] = 68] = "D";
    KeyCode[KeyCode["E"] = 69] = "E";
    KeyCode[KeyCode["F"] = 70] = "F";
    KeyCode[KeyCode["G"] = 71] = "G";
    KeyCode[KeyCode["H"] = 72] = "H";
    KeyCode[KeyCode["I"] = 73] = "I";
    KeyCode[KeyCode["J"] = 74] = "J";
    KeyCode[KeyCode["K"] = 75] = "K";
    KeyCode[KeyCode["L"] = 76] = "L";
    KeyCode[KeyCode["M"] = 77] = "M";
    KeyCode[KeyCode["N"] = 78] = "N";
    KeyCode[KeyCode["O"] = 79] = "O";
    KeyCode[KeyCode["P"] = 80] = "P";
    KeyCode[KeyCode["Q"] = 81] = "Q";
    KeyCode[KeyCode["R"] = 82] = "R";
    KeyCode[KeyCode["S"] = 83] = "S";
    KeyCode[KeyCode["T"] = 84] = "T";
    KeyCode[KeyCode["U"] = 85] = "U";
    KeyCode[KeyCode["V"] = 86] = "V";
    KeyCode[KeyCode["W"] = 87] = "W";
    KeyCode[KeyCode["X"] = 88] = "X";
    KeyCode[KeyCode["Y"] = 89] = "Y";
    KeyCode[KeyCode["Z"] = 90] = "Z";
    KeyCode[KeyCode["LeftWindows"] = 91] = "LeftWindows";
    KeyCode[KeyCode["RightWindows"] = 92] = "RightWindows";
    KeyCode[KeyCode["Select"] = 93] = "Select";
    KeyCode[KeyCode["Numpad0"] = 96] = "Numpad0";
    KeyCode[KeyCode["Numpad1"] = 97] = "Numpad1";
    KeyCode[KeyCode["Numpad2"] = 98] = "Numpad2";
    KeyCode[KeyCode["Numpad3"] = 99] = "Numpad3";
    KeyCode[KeyCode["Numpad4"] = 100] = "Numpad4";
    KeyCode[KeyCode["Numpad5"] = 101] = "Numpad5";
    KeyCode[KeyCode["Numpad6"] = 102] = "Numpad6";
    KeyCode[KeyCode["Numpad7"] = 103] = "Numpad7";
    KeyCode[KeyCode["Numpad8"] = 104] = "Numpad8";
    KeyCode[KeyCode["Numpad9"] = 105] = "Numpad9";
    KeyCode[KeyCode["Multiply"] = 106] = "Multiply";
    KeyCode[KeyCode["Add"] = 107] = "Add";
    KeyCode[KeyCode["Subtract"] = 109] = "Subtract";
    KeyCode[KeyCode["DecimaPoint"] = 110] = "DecimaPoint";
    KeyCode[KeyCode["Divide"] = 111] = "Divide";
    KeyCode[KeyCode["F1"] = 112] = "F1";
    KeyCode[KeyCode["F2"] = 113] = "F2";
    KeyCode[KeyCode["F3"] = 114] = "F3";
    KeyCode[KeyCode["F4"] = 115] = "F4";
    KeyCode[KeyCode["F5"] = 116] = "F5";
    KeyCode[KeyCode["F6"] = 117] = "F6";
    KeyCode[KeyCode["F7"] = 118] = "F7";
    KeyCode[KeyCode["F8"] = 119] = "F8";
    KeyCode[KeyCode["F9"] = 120] = "F9";
    KeyCode[KeyCode["F10"] = 121] = "F10";
    KeyCode[KeyCode["F11"] = 122] = "F11";
    KeyCode[KeyCode["F12"] = 123] = "F12";
    KeyCode[KeyCode["NumLock"] = 144] = "NumLock";
    KeyCode[KeyCode["ScrollLock"] = 145] = "ScrollLock";
    KeyCode[KeyCode["SemiColon"] = 186] = "SemiColon";
    KeyCode[KeyCode["EqualSign"] = 187] = "EqualSign";
    KeyCode[KeyCode["Comma"] = 188] = "Comma";
    KeyCode[KeyCode["Dash"] = 189] = "Dash";
    KeyCode[KeyCode["Period"] = 190] = "Period";
    KeyCode[KeyCode["ForwardSlash"] = 191] = "ForwardSlash";
    KeyCode[KeyCode["GraveAccent"] = 192] = "GraveAccent";
    KeyCode[KeyCode["OpenBracket"] = 219] = "OpenBracket";
    KeyCode[KeyCode["BackSlash"] = 220] = "BackSlash";
    KeyCode[KeyCode["CloseBraket"] = 221] = "CloseBraket";
    KeyCode[KeyCode["SingleQuote"] = 222] = "SingleQuote";
})(KeyCode || (KeyCode = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9hY2Nlc3NpYmlsaXR5LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUVqQzs7R0FFRztBQUNIO0lBK0JJO1FBOUJBOztXQUVHO1FBQ0ssbUNBQThCLEdBQUcsS0FBSyxDQUFDO1FBRS9DOztXQUVHO1FBQ0ssMEJBQXFCLEdBQThDLEVBQUUsQ0FBQztRQUU5RTs7V0FFRztRQUNJLHFCQUFnQixHQUFHLGtCQUFrQixDQUFDO1FBRTdDOztXQUVHO1FBQ0ksNkJBQXdCLEdBQUcsOEJBQThCLENBQUM7UUFFakU7O1dBRUc7UUFDSSxnQ0FBMkIsR0FBRyxpQ0FBaUMsQ0FBQztRQUV2RTs7V0FFRztRQUNJLHdCQUFtQixHQUFrQixFQUFFLENBQUM7UUFHM0MseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7T0FFRztJQUNJLDJEQUE0QixHQUFuQyxVQUFvQyxPQUE4QztRQUFsRixpQkFVQztRQVRHLElBQUksdUJBQXVCLEdBQUc7WUFDMUIsSUFBSSxLQUFLLEdBQUcsS0FBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4RCxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNmLEtBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2hELENBQUM7UUFDTCxDQUFDLENBQUM7UUFDRixJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXpDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyw2Q0FBYyxHQUF0QixVQUF1QixPQUFvQixFQUFFLEtBQW9CLEVBQUUseUJBQW1DO1FBQ2xHLEVB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