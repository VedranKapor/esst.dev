// Define the routes
function freshImport(name) {
    var normalized = System.normalizeSync(name);
    if (System.has(normalized))
      System.delete(normalized);
    return System.import(name);
  }

crossroads.addRoute('/', function() {
    $("#l1").css("visibility", "hidden");
    $("#l2").css("visibility", "hidden");
    $("#l3").css("visibility", "hidden");
    $("#l1").css("visibility", "visible");
    $("#l1").html('<i class="ace-icon fa fa-home home-icon"></i><span lang="en">Home</span>');
    $("#l1").addClass('active');

    localStorage.setItem("activePage",  JSON.stringify('Home'));
    $(".esst-content").load('Includes/home.html');
});

crossroads.addRoute('/Logout', function() {
    $.ajax({
        url:"App/App/app.php",
        data:{action:'resetSession'},
        type: 'POST',
        async: false,
        success: function (result) {
            var serverResponce = JSON.parse(result);
            switch (serverResponce["type"]) {
                case 'ERROR':
                    ShowErrorMessage(serverResponce["msg"]);
                    break;
                case 'SUCCESS':
                    break;
            }
        },
        error: function(xhr, status, error) {
            ShowErrorMessage(error);
        }
    });
    window.location.href = "index.html";
});

crossroads.addRoute('/users', function() {
    crossroads.ignoreState;
    $(".esst-content").load('Auth/users/users.html');
    freshImport('Auth/users/users.js');
});

crossroads.addRoute('/ManageCases', function(userId) {
    $('#loadermain').show();
    $("#l1").css("visibility", "hidden");
    $("#l2").css("visibility", "hidden");
    $("#l3").css("visibility", "hidden");
    $("#l1").css("visibility", "visible");
    $("#l1").html('<i class="ace-icon fa fa-folder-open-o home-icon"></i><span lang="en">Case Studies</span>');
    $("#l1").addClass('active');

    $("#l2").css("visibility", "visible");
    $("#l2").html('Manage cases');
    $("#l2").addClass('active');

    localStorage.setItem("activePage",  null);
    $(".esst-content").load('App/ManageCases/ManageCases.html');
    freshImport('App/ManageCases/ManageCases.js');
});

crossroads.addRoute('/CreateCase', function(userId) {
    //$('#loadermain').show();
    crossroads.ignoreState = true;
    $("#l1").css("visibility", "hidden");
    $("#l2").css("visibility", "hidden");
    $("#l3").css("visibility", "hidden");
    $("#l1").css("visibility", "visible");
    $("#l1").html('<i class="ace-icon fa fa-folder-open-o home-icon"></i><span lang="en">Case Studies</span>');
    $("#l1").addClass('active');

    $("#l2").css("visibility", "visible");
    $("#l2").html('Create case');
    $("#l2").addClass('active');

    localStorage.setItem("activePage",  JSON.stringify('CreateCase'));

    $(".esst-content").load('App/AddCase/AddCase.html');
    freshImport('App/AddCase/AddCase.js');
});

crossroads.addRoute('/DataEntry', function(userId) {
    //$('#loadermain').show();
    crossroads.ignoreState = true;
    $("#l1").css("visibility", "hidden");
    $("#l2").css("visibility", "hidden");
    $("#l3").css("visibility", "hidden");
    $("#l1").css("visibility", "visible");
    $("#l1").html('<i class="ace-icon fa fa-folder-open-o home-icon"></i><span lang="en">Data Entry</span>');
    $("#l1").addClass('active');

    $("#l2").css("visibility", "visible");
    $("#l2").html('Damand data');
    $("#l2").addClass('active');

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
