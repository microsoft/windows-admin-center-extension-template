import { Injector, OnInit } from '@angular/core';
import { SmeInternalFormFieldComponent } from '../form-field.component';
export declare class TagsFormFieldComponent extends SmeInternalFormFieldComponent<string[]> implements OnInit {
    /**
     * The current value of the new tags to add to this controls value
     */
    newTags: string;
    /**
     * The suggestions property, but filtered to exclude existing tags.
     */
    displayedSuggestions: string[];
    /**
     * Indicates the character to use to split tags on.
     */
    tagSplitCharacter: string;
    /**
     * Suggestions for possible tags that the user could enter
     */
    suggestions: string[];
    /**
     * internal value holder for suggestions property
     */
    private internalSuggestions;
    /**
     * The aria label for this instance
     */
    readonly ariaLabel: string;
    /**
     * Initializes a new instance of the TagsInputComponent
     */
    constructor(injector: Injector);
    /**
     * Implementation of angular OnInit interface
     */
    ngOnInit(): void;
    /**
     * Removes a tag from the value of this input
     * @param index the index to remove
     */
    removeTag(event: MouseEvent, index: number): void;
    /**
     * Submits the current newTagsInput value as new tags for our controls value.
     */
    submitTags($event: KeyboardEvent): void;
    /**
     * Updates the displayed suggestions to exclude existing tags.
     */
    private updateDisplayedSuggestions();
    /**
     * Occurs every time the value of the control changes, in the UI or programmatically.
     * @param value the value of the form control
     */
    protected onValueChanged(value: string[]): void;
    /**
     * Creates the idBag used by this component to store unique element ids.
     * id values will be assigned be the @see BaseComponent super class.
     */
    protected createIdBag(): MsftSme.StringMap<string>;
}
