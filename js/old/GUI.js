/*****
*	GUI.js
*	This javascript file is used to programatically generate the div elements
*	that make up the light grid and to interface with various GUI elements.
*	This includes drag and drop functionality, handlers for buttons with toggled 
*   images, functions to enter and exit presentation view, and the fullscreen
*   button functionality.
*	Holds globals for the the current state of togglable buttons and for the 
*   array of references used to update divs within the light grid. 
******/

// Global variables
var gridDivs; // Array of references to the HTML divs that make up the grid
var StartStopState ="start"; // Holds the state of the start/stop button
var LoginLogoutState = "login"; // Holds the state of the login/logout button

/*****
*	$()
*   Called on window load. This function sets up jQuery UI elements and
*   calls InitGrid16(), which creates HTML elements used in the light
*   grid.
******/
$(function () {
    $("#ToolsAccordion").accordion({ heightStyle: "fill" }); // Creates Blocks accordion
    $("#block-list").sortable();             // Creates sortable list for pattern
    $(".spinner#ms-per-tick").spinner({      // Creates spinner for tick speed rule
        max: HIGHEST_TICK_SPEED,
        min: LOWEST_TICK_SPEED
    });
    $("#SingleDraggable").draggable({       // Makes Single block icon draggable.
        revert: "invalid",
        helper: "clone",
        scroll: false,
        zindex: 10000
    });
    $("#ComparisonDraggable").draggable({   // Makes Comparison block icon draggable.
        revert: "invalid",
        helper: "clone",
        scroll: false,
        zindex: 10000
    });
    $("#RangeDraggable").draggable({        // Makes Range block icon draggable.
        revert: "invalid",
        helper: "clone",
        scroll: false,
        zindex: 10000
    });
    $("#CircleDraggable").draggable({       // Makes Circles block icon draggable.
        revert: "invalid",
        helper: "clone",
        scroll: false,
        zindex: 10000
    });
    $("#SingleMoveDraggable").draggable({   // Makes Single Move block icon draggable.
        revert: "invalid",
        helper: "clone",
        scroll: false,
        zindex: 10000
    });
    $("#ComparisonMoveDraggable").draggable({ // Makes Comparison Move block icon draggable.
        revert: "invalid",
        helper: "clone",
        scroll: false,
        zindex: 10000
    });
    $("#RangeMoveDraggable").draggable({    // Makes Range Move block icon draggable.
        revert: "invalid",
        helper: "clone",
        scroll: false,
        zindex: 10000
    });
    $("#CommentDraggable").draggable({      // Makes Comment block icon draggable.
        revert: "invalid",
        helper: "clone",
        scroll: false,
        zindex: 10000
    });
    $("#ActualCode").droppable({            // Handles drop event by calling a function to create
        drop: function (event, ui) {        // the corresponding block list item.
            if (ui.draggable.get(0).id == "SingleDraggable") {
                addBlock('SingleBlock', 'single-template');
            }
            else if (ui.draggable.get(0).id == 'ComparisonDraggable') {
                addBlock('Comparison', 'comparison-template');
            }
            else if (ui.draggable.get(0).id == 'RangeDraggable') {
                addBlock('Range', 'range-template');
            }
            else if (ui.draggable.get(0).id == 'CircleDraggable') {
                addBlock('CircleBlock', 'circle-template');
            }
            else if (ui.draggable.get(0).id == 'SingleMoveDraggable') {
                addBlock('SingleMove', 'single-move-template');
            }
            else if (ui.draggable.get(0).id == 'ComparisonMoveDraggable') {
                addBlock('ComparisonMove', 'comparison-move-template');
            }
            else if (ui.draggable.get(0).id == 'RangeMoveDraggable') {
                addBlock('RangeMove', 'range-move-template');
            }
            else if (ui.draggable.get(0).id == 'CommentDraggable') {
                addBlock('Comment', 'comment-template');
            }
            return true;
        }
    });
});

/*****
*	createArray(length)
*   This is a helper function used by InitGrid16 to create multi-dimensional
*   arrays.
*   Parameters:
*       length: size of the array to be created. If multiple values are given,
*           an n-dimensional array is created where n is the number of multiple
*           values given.
*   Returns a reference to the array created.
******/
function createArray(length) {
    var arr = new Array(length || 0),   // Creates new array of size equal to length parameter.
        i = length;

    // If more than one parameter is passed, add another dimension of the size specified by
    // the parameter.
    if (arguments.length > 1) { 
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}

/*****
*	StartStopToggle()
*   This function handles the onclick event for the Start/Stop button. It
*   either starts or stops the algorithm, changes the button's image, and
*   updates the StartStopState variable.
******/
function StartStopToggle() {
    if (StartStopState == "start") {    // If button currently displays "start"
        startAlgorithm();               // Start the algorithm
        $(".StartStopButton").attr("src", 'images/StopButton.png'); // Update image
        StartStopState = "stop";        // Update state variable
    }
    else if (StartStopState == "stop") {    // If button currently displays "stop"
        stopAlgorithm();                    // Stop the algorithm
        $(".StartStopButton").attr("src", 'images/StartButton.png'); // Update image
        StartStopState = "start";           // Update state variable
    }
    return false;   // Return false to prevent page from being reloaded after onclick event
}

/*****
*	LoginLogoutHandler()
*   This function handles the onclick event for the Login/Logout button. It
*   changes the button's image and updates the LoginLogoutState variable.
******/
function LoginLogoutHandler(StateIn) {
    LoginLogoutState = StateIn;
    if (LoginLogoutState == "login") {      // If button currently displays "login"
        $("#menuLoginButton").attr("src", 'images/LogoutButton.png'); // Change image in editor
        $("#presentationLoginButton").attr("src", 'images/PresentationLogoutButton.png'); // Change image in presentation view
        LoginLogoutState = "logout";        // Update state variable
    }
    else if (LoginLogoutState == "logout") {    // If button currently displays "logout"s
        $("#menuLoginButton").attr("src", 'images/LoginButton.png'); // Change image in editor
        $("#presentationLoginButton").attr("src", 'images/PresentationLoginButton.png'); // Change image in presentation views
        LoginLogoutState = "login";             // Update state variable
    }
    return false;   // Return false to prevent page from being reloaded after onclick event
}

/*****
*	EnterPresentationMode()
*   This function hides and reveals HTML GUI elements in order to switch
*   the GUI from editing mode into presentation mode.
******/
function EnterPresentationMode() {
    var ActualGrid = document.getElementById("ActualGrid");
    ActualGrid.style.paddingTop = '0px';
    ActualGrid.style.paddingLeft = '9px';

    var MenuBar = document.getElementById("MenuBar");
    MenuBar.style.display = 'none';                     // Hide the editor menu

    var CodeDiv = document.getElementById("CodeDiv");
    CodeDiv.style.display = 'none';                     // Hide the Your Pattern area

    var ToolsDiv = document.getElementById("ToolsDiv");
    ToolsDiv.style.display = 'none';                    // Hide the Blocks area

    var RightHalf = document.getElementById("RightHalf");
    RightHalf.style.margin = 'auto';                    // Center elements in right half of editor
    RightHalf.style.cssFloat = 'none';

    var PresentationMenu = document.getElementById("PresentationMenu");
    PresentationMenu.style.display = 'inline';          // Reveal presentation menu

    $('.rowGridLabels').css({ visibility: 'hidden' });  // Hide grid row labels
    $('.colGridLabels').css({ visibility: 'hidden' });  // Hide grid column labels

    return false;   // Return false to prevent page refresh after onclick event
}

/*****
*	ExitPresentationMode()
*   This function hides and reveals HTML GUI elements in order to switch
*   the GUI from presentation mode into editing mode.
******/
function ExitPresentationMode() {
    var ActualGrid = document.getElementById("ActualGrid");
    ActualGrid.style.paddingTop = '20px';
    ActualGrid.style.paddingLeft = '13px';

    var MenuBar = document.getElementById("MenuBar");
    MenuBar.style.display = 'inherit';                  // Reveal editor menu

    var CodeDiv = document.getElementById("CodeDiv");
    CodeDiv.style.display = 'inline';                   // Reveal Your pattern area

    var ToolsDiv = document.getElementById("ToolsDiv");
    ToolsDiv.style.display = 'inline';                  // Reveal Blocks area

    var RightHalf = document.getElementById("RightHalf");
    RightHalf.style.margin = '0px';                     // Remove centering on right half
    RightHalf.style.cssFloat = 'left';

    var PresentationMenu = document.getElementById("PresentationMenu");
    PresentationMenu.style.display = 'none';            // Hide presentation menu

    $('.rowGridLabels').css({ visibility: 'visible' }); // Reveal grid row labels
    $('.colGridLabels').css({ visibility: 'visible' }); // Reveal grid column labels
    return false;   // Return false to prevent page refresh after onclick event
}

/*****
*	requestFullScreen()
*   This is the onclick handler for the fullscreen button. It contains browser-dependent 
*   code that requests that the browser make the LightWriter window fullscreen.
******/
function requestFullScreen() {
    var element = document.body;
    // Supports most browsers and their versions.
    try {
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen(element.ALLOW_KEYBOARD_INPUT) || element.mozRequestFullScreen || element.msRequestFullScreen;
    } catch (e) {
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    }
    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
    return false;
}