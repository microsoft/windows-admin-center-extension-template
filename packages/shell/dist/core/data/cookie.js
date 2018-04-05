/**
 * Cookie class.
 */
var Cookie = /** @class */ (function () {
    function Cookie() {
    }
    /**
     * Gets cookie by name.
     *
     * @param cookieName the cookie name.
     * @return string the cookie value.
     */
    Cookie.get = function (cookieName) {
        var name = cookieName + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    };
    /**
     * Gets the cross site request forgery token.
     * @return string the token.
     */
    Cookie.getCrossSiteRequestForgeryToken = function () {
        return Cookie.get('XSRF-TOKEN');
    };
    return Cookie;
}());
export { Cookie };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9jb29raWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSDtJQUFBO0lBK0JBLENBQUM7SUE3Qkc7Ozs7O09BS0c7SUFDVyxVQUFHLEdBQWpCLFVBQWtCLFVBQWtCO1FBQ2hDLElBQUksSUFBSSxHQUFHLFVBQVUsR0FBRyxHQUFHLENBQUM7UUFDNUIsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2QsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUN6QixDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QyxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7T0FHRztJQUNXLHNDQUErQixHQUE3QztRQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDTCxhQUFDO0FBQUQsQ0EvQkEsQUErQkMsSUFBQSIsImZpbGUiOiJjb29raWUuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9