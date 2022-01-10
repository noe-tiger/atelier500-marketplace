-    Authenticate the user i.e. verify if the user/password is correct.
-   Once user is authenticated, send that user an “accessToken” (valid for 15 mins), and a “refreshToken” (valid for 20 mins).
    Add the “refreshToken” to a list of “valid” tokens on authentication server.
-    User can now use the “accessToken” and make authorized API calls to any server that uses the same ACCESS_TOKEN_SECRET.
-    After 15 mins the “accessToken” will expire, and the user will get a “401” message.
-    When that happens that user will need to call to the “/refreshToken” API on the authentication server, and pass it the (valid) “refreshToken”.
    The authentication server will
    (a) remove the (old) “refreshToken from the refreshToken list
    (b) generate a new “accessToken” and “refreshToken” and pass it to the user
    (c) add the (new) “refreshToken” to the valid “refreshToken” list on the server side.
-    Now the user can continue with step 3, and call API on any server using the new “accessToken” for the next 15 mins.
-    In case the user logs out, remove the “refreshToken” from the refreshToken list.