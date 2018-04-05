/**
 * Cookie class.
 */
export declare class Cookie {
    /**
     * Gets cookie by name.
     *
     * @param cookieName the cookie name.
     * @return string the cookie value.
     */
    static get(cookieName: string): string;
    /**
     * Gets the cross site request forgery token.
     * @return string the token.
     */
    static getCrossSiteRequestForgeryToken(): string;
}
