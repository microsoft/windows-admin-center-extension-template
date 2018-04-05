export declare class Dom {
    /**
     * gets all body elements on the page
     */
    static getAllBodys(): HTMLElement[];
    /**
     * Gets a CSS property value
     * @param  {HTMLElement} element The Element
     * @param  {string} property - The CSS property name
     * @returns {any} - The value of the CSS property (type depends on property retrieved)
     */
    static getStyle(element: HTMLElement, property: string): any;
    /**
     * Gets the classes applied to an element
     * @param  {HTMLElement} element The Element
     * @returns {string[]} - The classes currently applied to the element
     */
    static getClasses(element: HTMLElement): any;
    /**
     * Determines is an element is disabled via the 'disabled' attribute
     * @param element The element to start from.
     */
    static isDisabled(element: HTMLElement): boolean;
    /**
     * Determines is an element is hidden via css with "display: none"
     * @param element The element to start from.
     */
    static isNotDisplayed(element: HTMLElement): boolean;
    /**
     * Determines is an element is hidden via css with "visibility: hidden"
     * @param element The element to start from.
     */
    static isHidden(element: HTMLElement): boolean;
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
    static isFocusable(element: HTMLElement, includeNegativeTabIndex?: boolean): boolean;
    /**
     * Returns the first element in the current elements ancestory that is focusable.
     * Will return the element itself if it is focusable
     * @param element The element to start from.
     * @return the first focusable ancestor of the element
     */
    static getFocusableAncestor(element: HTMLElement): HTMLElement;
    /**
     * find an element in a particular position with a specific condition relative to input element
     * Does a DFS for this element relative the ancestor zone of input element
     * @param element The current element
     * @param condition The function to check the kind of element we are looking for
     * @param position The ElementPosition of the desired element relative to input element
     */
    static findElementFromAncestorZoneDFS(element: HTMLElement, condition: (element: HTMLElement) => boolean, position: ElementPosition): HTMLElement;
    /**
     * find an element in a particular position with a specific condition relative to input element
     * Does a DFS for this element relative the ancestor trap of input element
     * @param element The current element
     * @param condition The function to check the kind of element we are looking for
     * @param position The ElementPosition of the desired element relative to input element
     */
    static findElementFromAncestorTrapDFS(element: HTMLElement, condition: (element: HTMLElement) => boolean, position: ElementPosition): HTMLElement;
    /**
     * find an element in a particular position with a specific condition relative to input element
     * Does a DFS for this element relative the root of the graph
     * @param element The current element
     * @param condition The function to check the kind of element we are looking for
     * @param position The ElementPosition of the desired element relative to input element
     */
    static findElementFromRootDFS(element: HTMLElement, condition: (element: HTMLElement) => boolean, position: ElementPosition): HTMLElement;
    /**
     * find an element in a particular position with a specific condition relative to input element
     * Does a DFS for this element relative the input element
     * @param element The current element
     * @param condition The function to check the kind of element we are looking for
     * @param position The ElementPosition of the desired element relative to input element
     */
    static findChildElementDFS(element: HTMLElement, condition: (element: HTMLElement) => boolean, position: ElementPosition): HTMLElement;
    /**
     * gets a element from a list of elements in the position relative to the current element
     * @param elements the list of elements
     * @param currentElement the current element
     * @param position the ElementPosition we want relative to the current element
     */
    static getElement(elements: HTMLElement[], currentElement: HTMLElement, position: ElementPosition): HTMLElement;
    /**
     * finds all elements starting at the input element that meet the given condition
     * @param element the element from which to start the depth first search
     * @param condition the function that determines whether the desired condition has been met
     */
    static getAllElements(element: HTMLElement, condition: (element: HTMLElement) => boolean): HTMLElement[];
    /**
     * returns the root of the DOM graph
     */
    static getRootElement(): HTMLElement;
    /**
     * Finds the next zone
     * @param element the current zone or an element in the current zone
     */
    static getNextZone(element: HTMLElement): HTMLElement;
    /**
     * gets the first focusable element in the next zone
     * if a zone has no focusable elements, it is skipped
     * @param element the current element
     */
    static getNextZoneElement(element: HTMLElement): HTMLElement;
    /**
     * Finds the previous zone
     * @param element the current zone or an element in the current zone
     */
    static getPreviousZone(element: HTMLElement): HTMLElement;
    /**
     * gets the first focusable element in the previous zone
     * if a zone has no focusable elements, it is skipped
     * @param element the current element
     * @param originalElement the element from which we begin the search. Set automatically if unset by user
     */
    static getPreviousZoneElement(element: HTMLElement, originalElement?: HTMLElement): HTMLElement;
    /**
     * gets the first ancestor that is disabled
     * @param element the element
     */
    static getAncestor(element: HTMLElement, condition: MsftSme.Func1<HTMLElement, boolean>): HTMLElement;
    /**
     * gets the zone that the current element is in
     * @param element the element
     */
    static getAncestorZone(element: HTMLElement): HTMLElement;
    /**
     * determine if an element is in a trap, if so return the trap element
     * @param element HTML element to check
     */
    static getAncestorTrap(element: HTMLElement): HTMLElement;
    /**
     * gets the ancestor form of an element
     * @param element the element
     */
    static getAncestorForm(element: HTMLElement): HTMLElement;
    /**
     * gets the first ancestor that is disabled
     * @param element the element
     */
    static getAncestorDisabled(element: HTMLElement): HTMLElement;
    /**
     * returns ancestor table of current element
     * @param element the current element
     */
    static getAncestorTable(element: HTMLElement): HTMLElement;
    /**
     * gets the next child zone of the current zone
     * @param element the current zone or an element in the current zone
     */
    static getDescendentZone(element: HTMLElement): HTMLElement;
    /**
     * gets the first focusable descendent of the current element
     * @param element the current element
     */
    static getFirstFocusableDescendent(element: HTMLElement): HTMLElement;
    static getLastElementInZone(element: HTMLElement): HTMLElement;
    static getFirstElementInZone(element: HTMLElement): HTMLElement;
    /**
     * gets the next focusable element in the current zone
     * @param element the current element
     */
    static getNextFocusableElement(element: HTMLElement): HTMLElement;
    /**
     * gets the previous focusable element in the current zone
     * @param element the current element
     */
    static getPreviousFocusableElement(element: HTMLElement): HTMLElement;
    /**
     * gets the ancestor of an element that meets the specified condition
     * @param element the current element
     * @param condition the function that will check if element meets the desired condition
     */
    static getSpecificAncestor(element: HTMLElement, condition: (element: HTMLElement) => boolean): HTMLElement;
    /**
     * gets the next focusable element in the current trap
     * @param element the current element
     */
    static getNextFocusableElementInTrap(element: HTMLElement): HTMLElement;
    /**
     * gets the previous focusable element in the current trap
     * @param element the current element
     */
    static getPreviousFocusableElementInTrap(element: HTMLElement): HTMLElement;
    /**
     * true if given element is a body element
     * @param element the element
     */
    static isBody(element: HTMLElement): boolean;
    /**
     * true if the given element is a zone
     * @param element the element
     */
    static isZone(element: HTMLElement): boolean;
    /**
     * true if the given element is a trap
     * @param element the element
     */
    static isTrap(element: HTMLElement): boolean;
    /**
     * return true if element is a form
     * @param element the element
     */
    static isForm(element: HTMLElement): boolean;
    /**
     * return true if we are inside a search box that has its own arrow key controls
     * @param element the element
     * @param isRightArrow the right arrow was clicked
     */
    static useArrowKeysWithinSearchbox(element: HTMLElement, isRightArrow: boolean): boolean;
    /**
     * true if given element is a search box
     * @param element the element
     */
    static isSearchBox(element: HTMLElement): boolean;
    /**
     * returns the next row in the current table
     * @param element the current element
     */
    static getNextRowInTable(element: HTMLElement): HTMLElement;
    /**
     * returns the previous row in the current table
     * @param element the current element
     */
    static getPreviousRowInTable(element: HTMLElement): HTMLElement;
    /**
     * returns true if the current element is a table row
     * @param element the current element
     */
    static isTableRow(element: HTMLElement): boolean;
    /**
     * returns true if the current element is a table cell
     * @param element the current element
     */
    static isTableCell(element: HTMLElement): boolean;
    /**
     * returns true if the current element is inside a table cell
     * @param element the current element
     */
    static isInTableCell(element: HTMLElement): boolean;
    /**
     * Gets the first action bar on the screen.
     * @param element The HTML element.
     * @returns The first action bar on the screen.
     */
    static getFirstActionBar(element: HTMLElement): HTMLElement;
    /**
     * Gets the next action bar on the screen.
     * @param element The HTML element.
     * @returns The first action bar on the screen.
     */
    static getNextActionBar(element: HTMLElement): HTMLElement;
    /**
     * Gets a specified action bar.
     * @param element The HTML element.
     * @param position The position of the desired action bar.
     * @returns The specified action bar, if possible.
     */
    static getActionBar(element: HTMLElement, position: ElementPosition): HTMLElement;
    /**
     * Determines if the HTML element is inside of an action bar.
     * @param element The HTML element.
     * @returns True if the HTML element is in an action bar and false if not.
     */
    static isInActionBar(element: HTMLElement): boolean;
    /**
     * Determines if the HTML element is an action bar.
     * @param element The HTML element.
     * @returns True if the element is an action bar and false if not.
     */
    static isActionBar(element: HTMLElement): boolean;
    /**
     * Determines if we should treat enter as click for a certain element
     * @param element The HTML element to check
     */
    static shouldTreatEnterAsClick(element: HTMLElement): boolean;
    /**
     * Check tab list aria-selected with active status
     */
    static checkActiveTab(): void;
    /**
     * Update tab aria-selected status
     * @param element The HTML element.
     * @param isActive The HTML element is active or inactive.
     */
    static updateAriaSelect(currentElement: HTMLElement, isActive: boolean): void;
}
/**
 * describes the position of the desired element in a list of elements
 */
export declare enum ElementPosition {
    First = 0,
    Previous = 1,
    Next = 2,
    Last = 3,
}
