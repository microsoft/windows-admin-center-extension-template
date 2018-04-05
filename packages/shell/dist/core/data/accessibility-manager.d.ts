/**
 * Class for accessibility manager
 */
export declare class AccessibilityManager {
    /**
     * Indicates that body focus class handlers have already been setup and should not be setup again
     */
    private hiddenFocusHandlersInitialized;
    /**
     * The set of events for element focusing.
     */
    private elementFocusingEvents;
    /**
     * The CSS class to disable the focus rectangle even in keyboard mode
     */
    hiddenFocusClass: string;
    /**
     * The CSS class to enable mouse specific accessibility styles
     */
    mouseNavigationModeClass: string;
    /**
     * The CSS class to enable keyboard specific accessibility styles
     */
    keyboardNavigationModeClass: string;
    /**
     * The set of elements that have had the hiddenFocusClass applied
     */
    hiddenFocusElements: HTMLElement[];
    constructor();
    /**
     * Registers the event handler for ElementFocusingEvent
     */
    registerElementFocusingEvent(handler: (event: ElementFocusingEvent) => void): () => void;
    /**
     * focus on given element and prevent the default of the event
     * @param element the element to focus on
     * @param event the event that triggered the focus
     * @param allowBrowserFocusHandling it indicates whether to allow browser to handle focus.
     */
    private focusOnElement(element, event, allowBrowserFocusHandling?);
    /**
     * Handlers the element focusing in either the default way or custom ways based on ElementFocusingEvent handler.
     */
    processElementFocusing(event: KeyboardEvent, elementToFocus: HTMLElement, sourceZone: HTMLElement, targetZone: HTMLElement, allowBrowserFocusHandling?: boolean): void;
    /**
     * click on given element and prevent the default of the event
     * @param element the element to click
     * @param event the event that triggered the click
     */
    private clickOnElement(element, event);
    /**
     * Changes the Accessibility Mode to mouse or keyboard
     * @param keyboardMode indicates that keyboard mode should be set
     */
    changeAccessibilityMode(keyboardMode: boolean): void;
    /**
     * Hooks up the global event handlers
     */
    private hookupGlobalHandlers();
}
/**
 * Interface for ElementFocusingEvent.
 */
export interface ElementFocusingEvent {
    /**
     * It indicates the source focus zone.
     */
    sourceZone: HTMLElement;
    /**
     * It indicates the target focus zone.
     */
    targetZone: HTMLElement;
    /**
     * It indicates the target focus element.
     */
    targetElement: HTMLElement;
    /**
     * If this function is called in the event handler, it cancels the default behavior of focusing
     */
    preventDefaultFocusBehavior: () => void;
    /**
     * If this function is called in the event handler, it cancels the default event of focusing
     */
    preventDefaultEvent: () => void;
    nativeEvent: KeyboardEvent;
}
export declare enum KeyCode {
    Backspace = 8,
    Tab = 9,
    Enter = 13,
    Shift = 16,
    Ctrl = 17,
    Alt = 18,
    Pause = 19,
    CapsLock = 20,
    Escape = 27,
    Space = 32,
    PageUp = 33,
    PageDown = 34,
    End = 35,
    Home = 36,
    LeftArrow = 37,
    UpArrow = 38,
    RightArrow = 39,
    DownArrow = 40,
    Insert = 45,
    Delete = 46,
    Num0 = 48,
    Num1 = 49,
    Num2 = 50,
    Num3 = 51,
    Num4 = 52,
    Num5 = 53,
    Num6 = 54,
    Num7 = 55,
    Num8 = 56,
    Num9 = 57,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,
    LeftWindows = 91,
    RightWindows = 92,
    Select = 93,
    Numpad0 = 96,
    Numpad1 = 97,
    Numpad2 = 98,
    Numpad3 = 99,
    Numpad4 = 100,
    Numpad5 = 101,
    Numpad6 = 102,
    Numpad7 = 103,
    Numpad8 = 104,
    Numpad9 = 105,
    Multiply = 106,
    Add = 107,
    Subtract = 109,
    DecimaPoint = 110,
    Divide = 111,
    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,
    NumLock = 144,
    ScrollLock = 145,
    SemiColon = 186,
    EqualSign = 187,
    Comma = 188,
    Dash = 189,
    Period = 190,
    ForwardSlash = 191,
    GraveAccent = 192,
    OpenBracket = 219,
    BackSlash = 220,
    CloseBraket = 221,
    SingleQuote = 222,
}
