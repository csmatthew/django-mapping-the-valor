// Set global JS variable for authentication status
window.isUserAuthenticated = {{ user.is_authenticated|yesno:"true,false" }};