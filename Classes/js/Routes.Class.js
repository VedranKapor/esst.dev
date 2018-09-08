// Define the routes
function freshImport(name) {
    var normalized = System.normalizeSync(name);
    if (System.has(normalized))
      System.delete(normalized);
    return System.import(name);
  }

crossroads.addRoute('/', function() {
    localStorage.setItem("activePage",  JSON.stringify('Home'));
    $(".esst-content").load('Includes/home.html');
});

crossroads.addRoute('/Logout', function() {
    freshImport('Auth/login/logout.js');
});

crossroads.addRoute('/users', function() {
    crossroads.ignoreState;
    $(".esst-content").load('Auth/users/users.html');
    freshImport('Auth/users/users.js');
});

crossroads.addRoute('/ManageCases', function(userId) {
    $('#loadermain').show();
    localStorage.setItem("activePage",  JSON.stringify('ManageCases'));
    $(".esst-content").load('App/ManageCases/ManageCases.html');
    freshImport('App/ManageCases/ManageCases.js');
});

crossroads.addRoute('/CreateCase', function(userId) {
    crossroads.ignoreState = true;
    localStorage.setItem("activePage",  JSON.stringify('CreateCase'));
    $(".esst-content").load('App/AddCase/AddCase.html');
    freshImport('App/AddCase/AddCase.js');
});

crossroads.addRoute('/DataEntry', function(userId) {
    crossroads.ignoreState = true;
    localStorage.setItem("activePage",  JSON.stringify('DataEntry'));
    $(".esst-content").load('App/DataEntry/DataEntry.html');
    freshImport('App/DataEntry/DataEntry.js');
});

crossroads.bypassed.add(function(request) {
    console.error(request + ' seems to be a dead end...');
});

//Listen to hash changes
window.addEventListener("hashchange", function() {
    var route = '/';
    var hash = window.location.hash;
    if (hash.length > 0) {
        route = hash.split('#').pop();
    }
    crossroads.parse(route);
});

// trigger hashchange on first page load
window.dispatchEvent(new CustomEvent("hashchange"));
