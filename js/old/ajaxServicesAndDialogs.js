/*****
*	ajaxServicesAndDialogs.js
*	Created on 10/27/2013/
*	Last Modified 11/29/2013
*	This javascript file hosts all of the request
*   and response code for Ajax service calls to the
*   server. This allows the user to log in/out of 
*   the system as well as save their block algorithms.
*
*   Also hosts all code for creating and maintaining
*   dialogs that are used in said service requests!
******/
/*****
*	$()
*	Called on window load. This function can be used to call js functions on 
*	"init" and/or set up events for select boxes and such.
******/
var tips; // validation text input for dialogs (uses same class name in every dialog)
$(function () {
    tips = $(".validateTips");
    // http://stackoverflow.com/questions/4355268/how-to-display-a-busy-indicator-with-jquery
    $.ajaxSetup({ // Set up function calls for every ajax call so we can have a busy spinner displayed!
        beforeSend: function () {
            $(".busy-spinner").show(); // show all the busy spinner gifs
        },
        complete: function () {
            $(".busy-spinner").hide(); // hide all the busy spinner gifs
        }
    });
    $(".busy-spinner").hide(); // hide busy spinners initially [on page load]
    // Button click events here
    /*****
    *	$("input#registrationButton").on("click", function (event) {});
    *	Called when the register button is clicked. Opens the registration
    *   dialog box so that the user can register with the system!
    ******/
    $("input.loginButton").on("click", function (event) {
        // attemptUserLogin();
        if (LoginLogoutState == "login") // From GUI.js
            $("#register-form-dialog").dialog("open"); // doubles as the login form
        else (logout());
        return false;
    });
    /*****
    *	logout()
    *	Logs the user out of the system.
    ******/
    function logout() {
        ajaxService("logout.php", {},
            function (result) {
                if (result.status == 200 && result.success == true) { // server was able to log the user out
                    LoginLogoutHandler("logout");
                    showLightWriterMessage("Successfully logged out.");
                }
                else { // something bad happened to prevent logging out
                    showLightWriterMessage(result.d);
                }
            }, null);
    }
    /*****
    *	$("input#saveAlgorithmButton").on("click", function (event) {});
    *	Called when the save button is saved. Opens up the saving dialog
    *   so the user can save their block list algorithm.
    ******/
    $("input.saveAlgorithmButton").on("click", function (event) {
        if (isAlgRunning)
            stopAlgorithm();
        ajaxService("check-user-session.php", {},
            function (result) {
                if (result.d == "Active")
                    $("#save-algorithm-dialog").dialog("open");
                else {
                    showLightWriterMessage("You must log in first before saving.");
                    LoginLogoutHandler("logout");
                }
            }, null);
        return false;
    });
    /*****
    *	$("input#loadAlgorithmButton").on("click", function (event) {});
    *	Called when the load button is clicked. Opens up the load dialog
    *   so that the user can load their algorithms, assuming that they're
    *   logged in.
    ******/
    $("input.loadAlgorithmButton").on("click", function (event) {
        if (isAlgRunning)
            stopAlgorithm();
        ajaxService("check-user-session.php", {},
            function (result) {
                if (result.d == "Active") {
                    ajaxService("LoadUserAlgorithmNames", {},
                        function (result) {
                            loadUserAlgorithmNamesIntoSelector(result, "#algorithm-selector", "#load-algorithm-dialog", true);
                        }, null);
                }
                else {
                    showLightWriterMessage("You must log in first before loading.");
                    LoginLogoutHandler("logout");
                }
            }, null);
    });

    /*****
    *	$("input#shareButton").on("click", function (event) {});
    *	Called when the share button is clicked. Opens up the share dialog
    *   so that the user can share their algorithms, assuming that they're
    *   logged in.
    ******/
    $("input#shareButton").on("click", function (event) {
        if (isAlgRunning)
            stopAlgorithm();
        ajaxService("check-user-session.php", {},
            function (result) {
                if (result.d == "Active") {
                    ajaxService("LoadUserAlgorithmNames", {},
                        function (result) {
                            loadUserAlgorithmNamesIntoSelector(result, "#alg-selector", "#share-algorithm-dialog", false);
                        }, null);
                }
                else {
                    showLightWriterMessage("You must log in first before loading.");
                    LoginLogoutHandler("logout");
                }
            }, null);
        return false;
    });

    //checkSessionButton [debug function, thus no comments; checks to see if a user is logged in]
    $("input#checkSessionButton").on("click", function (event) {
        checkUserSession();
    });
    /*****
    *	$("input#rules-button").on("click", function (event) {});
    *	Called when the rules button is clicked. Opens up the rules dialog
    *   after saving the rules (in case they hit "cancel") Adds a color picker
    *   for pertinent items if the color picker hasn't been initialized yet.
    ******/
    $("input#rules-button").on("click", function (event) {
        saveRulesBeforeChange();
        $("#rules-dialog").dialog("open");
        if (!$("#rules-dialog").find(".setToColor").next().is("a")) // only create color picker for def box color if one doesn't exist
            ProColor.prototype.attachButton("def-square-color", {
                imgPath: "js/old/lib/Procolor/img/procolor_win_",
                showInField: true,
                color: DEFAULT_BOX_COLOR,
            });
        return false;
    });

    // Dialog js follows

    // Registration form variables and dialog controller
    var usernameInput = $("#username"),
      	passwordInput = $("#password"),
      	confirmPasswordInput = $("#confPassword"),
      	registrationFields = $([]).add(usernameInput).add(passwordInput).add(confirmPasswordInput);
    $("#register-form-dialog").dialog({ // initialize registration and login form dialog and its functions
        autoOpen: false,
        width: 350,
        modal: true,
        buttons: {
            // Logs a user into the system after doing form validatino
            // Optionally registers a user for the system.
            "Login/Register": function () { // User clicks the "Login" button
                var formIsValid = true;
                var userIsRegistering = confirmPasswordInput.val() == '' ? false : true; // if blank, user isn't registering
                registrationFields.removeClass("ui-state-error"); // remove any error state from before
                var username = usernameInput.val();
                var password = passwordInput.val();
                var confirmPassword = confirmPasswordInput.val();
                // Do a small bit of validation (aka checking if fields are blank)
                formIsValid = checkNotBlank(usernameInput, formIsValid, "register-form-dialog");
                formIsValid = checkNotBlank(passwordInput, formIsValid, "register-form-dialog");
                if (userIsRegistering) {
                    if (formIsValid && password != confirmPassword) { // form is valid, but the passwords don't match!
                        passwordInput.addClass("ui-state-error");
                        confirmPasswordInput.addClass("ui-state-error");
                        updateTips("register-form-dialog", "Passwords don't match.");
                        formIsValid = false;
                    }
                    else { // user is attempting to register and the form is good
                        var serviceParams = {
                            username: username,
                            password: password
                        };
                        var dialog = this;
                        ajaxService("register.php", serviceParams,
                            function (result) {
                                if (result.status == 200 && result.success == true) { 
                                    // server was able to register him/her; server also logged them in
                                    userRegistrationAndLoginSuccess(username);
                                    //updateTips("register-form-dialog", "User \"" + username + "\" successfully registered. You may now log in.");
                                    registrationFields.val('');
                                    $(dialog).dialog("close");
                                }
                                else { // something bad happened to prevent registration
                                    registrationFields.removeClass("ui-state-error");
                                    usernameInput.addClass("ui-state-error");
                                    updateTips("register-form-dialog", result.d);
                                }
                            }, null);
                    }
                }
                else {
                    if (formIsValid) { // form is valid and user is trying to register
                        var serviceParams = {
                            username: username,
                            password: password
                        };
                        var dialog = this;
                        ajaxService("login.php", serviceParams,
                            function (result) {
                                if (result.status == 200 && result.success == true) { // server was able to login the user
                                    $(dialog).dialog("close");
                                    userLoginSuccess(username);
                                }
                                else { // something bad happened to prevent logging in
                                    registrationFields.removeClass("ui-state-error");
                                    updateTips("register-form-dialog", "Couldn't log you into the system. Please check your username and password.");
                                }
                            }, null);
                    }
                }
            },
            Cancel: function () { // User clicks the "Cancel" button on the dialog
                $(this).dialog("close");
            }
        },
        close: function () { // called upon any sort of close of the dialog
            registrationFields.val("").removeClass("ui-state-error");
            restoreOldValidateTipsMsg("register-form-dialog");
        }
    });
    $("#save-algorithm-dialog").dialog({ // initialize save dialog and its functions
        autoOpen: false,
        width: 350,
        modal: true,
        buttons: {
            "Save": function () { // User clicks the "Login" button
                var formIsValid = true;
                $("#algorithmName").removeClass("ui-state-error"); 
                // Do a small bit of validation (aka checking if fields are blank)
                var algorithmName = $("#algorithmName").val();
                if (algorithmName != '') {
                    // form is valid, go ahead and attempt a save
                    saveUserAlgorithm(algorithmName, true, null);
                }
                else {
                    $("#algorithmName").addClass("ui-state-error");
                    updateTips("save-algorithm-dialog", "You must give this algorithm a name");
                }
            },
            Cancel: function () { // User clicks the "Cancel" button on the dialog
                $(this).dialog("close");
            }
        },
        close: function () { // called upon any sort of close of the dialog
            $("#algorithmName").val("").removeClass("ui-state-error");
            restoreOldValidateTipsMsg("save-algorithm-dialog");
        }
    });
    $("#load-algorithm-dialog").dialog({ // initialize load dialog and its functions
        autoOpen: false,
        width: 350,
        modal: true,
        buttons: {
            "Load": function () { // User clicks the "Load" button
                $("#algorithm-selector").removeClass("ui-state-error");
                // See if they selected something
                var selectedValue = $("#algorithm-selector").val();
                if (selectedValue == -1) { // user didn't select anything
                    $("#algorithm-selector").addClass("ui-state-error");
                    updateTips("load-algorithm-dialog", "You must select an algorithm to load.");
                }
                else {
                    loadAlgorithm(selectedValue, "#load-algorithm-dialog");
                }
            },
            "Delete": function () {
                $("#algorithm-selector").removeClass("ui-state-error");
                // See if they selected something
                var selectedValue = $("#algorithm-selector").val();
                var optionText = $("#algorithm-selector option[value='" + selectedValue + "']").text();
                if (selectedValue == -1 || selectedValue == "-1")
                    updateTips("load-algorithm-dialog", "You can't delete the 'choose an algorithm' option, you goof.");
                else {
                    var confirmFunction = function () {
                        var serviceParams = {
                            id: selectedValue
                        };
                        ajaxService("DeleteUserAlgorithm", serviceParams,
                           function (result) {
                               if (result.d == "Success") {
                                   // Remove this algorithm from the selector
                                   updateTips("load-algorithm-dialog", "Algorithm successfully deleted. Please choose another algorithm" +
                                       " to load or delete.");
                                   $("#algorithm-selector option[value='" + selectedValue + "']").remove();
                               }
                               else {
                                   $("#algorithm-selector").addClass("ui-state-error");
                                   updateTips("load-algorithm-dialog", result.d);
                               }
                           }, null);
                    }
                    lightWriterConfirmBox("Are you sure you want to delete this algorithm with name " + optionText + "?", confirmFunction, null);
                }
            },
            Cancel: function () { // User clicks the "Cancel" button on the dialog
                $(this).dialog("close");
            }
        },
        close: function () { // called upon any sort of close of the dialog
            $("#algorithm-selector").val("-1").removeClass("ui-state-error");
            restoreOldValidateTipsMsg("load-algorithm-dialog");
        }
    });
    $("#message-dialog").dialog({ // initialize load dialog and its functions
        autoOpen: false,
        width: 350,
        height: "auto",
        modal: true,
        buttons: {
            "Close": function () { // User clicks the "Load" button
                $(this).dialog("close");
            }
        },
        close: function () { // called upon any sort of close of the dialog
        }
    });
    /*****
   *	initShareDialog(algID)
   *	Initializes the share dialog with the appropriate buttons and functions.
   ******/
    function initShareDialog() {
        $("#share-algorithm-dialog").dialog({ // initialize share dialog and its functions
            autoOpen: false,
            width: 350,
            modal: true,
            buttons: {
                "Save & Share": function () { // User clicks the "Login" button
                    $("#alg-selector").removeClass("ui-state-error");
                    $("#algNameToShareAndSave").removeClass("ui-state-error");
                    // If they put any text in the text box, use that by default
                    var algNameInput = $("#algNameToShareAndSave").val();
                    if (algNameInput != "")
                        saveUserAlgorithm(algNameInput, false, swapShareDialogToShareIDBox);
                    else {
                        // See if they selected something
                        var selectedValue = $("#alg-selector").val();
                        if (selectedValue == -1) { // user didn't select anything
                            $("#alg-selector").addClass("ui-state-error");
                            updateTips("share-algorithm-dialog", "You must select an algorithm to load.");
                        }
                        else
                            swapShareDialogToShareIDBox(selectedValue); // alg is already saved since they used the selector (it stores IDs)
                    }
                    /*
                    else {
                        $(this).dialog("close");
                        //loadAlgorithm(selectedValue);
                    }*/
                },
                Cancel: function () { // User clicks the "Cancel" button on the dialog
                    $(this).dialog("close");
                }
            },
            close: function () { // called upon any sort of close of the dialog
                // Basically reset EVERYTHING, including after a URL has been created for sharing
                $("#alg-selector").removeClass("ui-state-error");
                $("#algNameToShareAndSave").removeClass("ui-state-error");
                $("#algNameToShareAndSave").val("");
                $("#alg-selector").val(-1);
                $("#pre-share-elements").removeClass("hidden");
                $("#post-share-click-elements").addClass("hidden");
                $("#share-algorithm-dialog").dialog("destroy");
                initShareDialog(); // reset full dialog buttons & options since, if they got a share url, its all messed up
            }
        });
    }
    initShareDialog(); // init the share dialog on page load

    /*****
    *	swapShareDialogToShareIDBox(algID)
    *	Swaps the share dialog from a pre-share save/choose alg state
    *   to a sharing state with a URL input box with a valid sharing URL.
    *   Redoes the dialog options a bit to accomodate the change.
    *   When this redone dialog is closed, it destroys itself and then
    *   reinitializes itself in order to reset its buttons and everything
    *   Parameters:
    *       algID: the ID of the algorithm to share
    ******/
    function swapShareDialogToShareIDBox(algID) {
        $("#pre-share-elements").addClass("hidden");
        $("#post-share-click-elements").removeClass("hidden");
        $("#share-algorithm-dialog").dialog("option", {
            height: "225",
            width: "360",
            buttons: { // Remove "Save & Share" / "Cancel" buttons and replace 'em with a "Close" button
                "Finish": function () { // User clicks the "close" button
                    $(this).dialog("close");
                }
            }
        });
        $("#share-url").val(SITE_URL_BASE_FOR_SHARING + "?shareID=" + algID).select(); // .select() will auto select the text so they can just ctrl+c it
    }

    $("#rules-dialog").dialog({ // initialize rules dialog and its functions
        autoOpen: false,
        width: 450,
        modal: true,
        buttons: {
            // Rules functions that this dialog calls are defined in index.js
            "Save & Close": function () { // User clicks the "Save" button
                if (saveRules()) {
                    saveRulesBeforeChange();
                    $(this).dialog("close");
                }
            },
            "Reset Rules & Save": function () { // User clicks the "Reset" button
                resetRules();
                saveRules();
                saveRulesBeforeChange();
            },
            Cancel: function () { // User clicks the "Cancel" button on the dialog
                $(this).dialog("close");
            }
        },
        close: function () { // called upon any sort of close of the dialog
            restoreRulesAfterDialogClose(); // still works after a normal save TODO don't call this every time the dialog is closed
            restoreOldValidateTipsMsg("rules-dialog");
        }
    });

    /*****
    *	restoreOldValidateTipsMsg(idOfDialog)
    *	Restores the initial (on html page load) message into the 
    *   dialog with idOfDialog, since this message can change over
    *   time.
    *   Parameters:
    *       idOfDialog: The ID of the dialog to restore the tips message
    *           for.
    ******/
    function restoreOldValidateTipsMsg(idOfDialog) {
        var tipsElement = $("#" + idOfDialog + " .validateTips");
        var oldValidateTipsMsg = $(tipsElement).attr("old-message");
        if (oldValidateTipsMsg != "" && oldValidateTipsMsg != null)
            $(tipsElement).text(oldValidateTipsMsg);
    }

    /*****
    *	checkNotBlank(field, wasFormValidBefore)
    *	Checks to see whether a jquery input field is blank or not. If
    *   it is, then updates the tips portion of the dialog with an error
    *   and highlights the not-filled-in field in red.
    *   Parameters:
    *       Field: the field to check to see if blank
    *       wasFormValidBefore: True/false value to see if the form was valid before
    *           calling this function
    *   Returns:
    *       wasFormValidBefore if field was not blank, and false otherwise.
    ******/
    function checkNotBlank(field, wasFormValidBefore, idOfValidateTips) {
        if (field.val() == "") {
            field.addClass("ui-state-error");
            updateTips(idOfValidateTips, "Please fill out all parts of the form.");
            return false;
        }
        else return wasFormValidBefore;
    }

    /*****
    *	saveUserAlgorithm(algorithmName, shouldAlertSuccess)
    *	Saves a users block algorithm by creating a JSON representation
    *   of the algorithm and then sending it to the server. Called
    *   from the save dialog after the user has inserted a name.
    *   Parameters:
    *       algorithmName: The name of the algorithm to save.
    *       shouldAlertSuccess: Whether the user should be alerted that
    *           the save was successful
    *       successFuncCallWithAlgId: Function to call after success (calls with algID)
    ******/
    function saveUserAlgorithm(algorithmName, shouldAlertSuccess, successFuncCallWithAlgId) {
        // First, save the order of the blocks so that we can save them in the correct order!
        setUpBlocksForSaving();
        var rulesForAlgorithm = saveRulesBeforeChange();
        var serviceParams = {
            blockListJson: JSON.stringify(blockList.blockList),
            algorithmName: algorithmName,
            rulesJson: JSON.stringify(rulesForAlgorithm)
        };
        ajaxService("SaveUserAlgorithm", serviceParams,
            function (result) {
                var resultDict = result.d;
                if (typeof resultDict["LoginError"] != "undefined") { // No errors in loading algorithm
                    updateTips("save-algorithm-dialog", "Error saving an algorithm. Error: " + loadedList["LoginError"]);
                    LoginLogoutHandler("logout");
                }
                else if (typeof resultDict["Error"] != "undefined") {
                    updateTips("save-algorithm-dialog", "Error saving an algorithm. Error: " + loadedList["Error"]);
                }
                else { // everything is OK
                    if (!successFuncCallWithAlgId) // if !successFuncCallWithAlgId, they're in the save-algorithm-dialog (not share one)
                        $("#save-algorithm-dialog").dialog("close");
                    if (shouldAlertSuccess)
                        showLightWriterMessage("Algorithm saved successfully!");
                    if (successFuncCallWithAlgId)
                        successFuncCallWithAlgId(resultDict["AlgID"]);
                }
                /*
                if (result.d >= 0) {
                    if (!successFuncCallWithAlgId) // if !successFuncCallWithAlgId, they're in the save-algorithm-dialog (not share one)
                        $("#save-algorithm-dialog").dialog("close");
                    if (shouldAlertSuccess)
                        showLightWriterMessage("Algorithm saved successfully!");
                    if (successFuncCallWithAlgId)
                        successFuncCallWithAlgId(result.d);
                }
                else updateTips("save-algorithm-dialog", "Something happened while trying to save -- \n" + "User not logged in.");*/
            }, null);
    }
    /*****
    *	setUpBlocksForSaving()
    *	Sets up the user's blocks for saving on the server by
    *   saving the block's position and setToColor variable to
    *   the block itself (which is what is sent to the server)
    ******/
    function setUpBlocksForSaving() {
        $("ul#block-list li").each(function (index) {
            // "this" now refers to the li item
            var blockId = $(this).find("div").attr("id");
            if (typeof blockId != "undefined") {
                var block = blockList.getBlock(blockId);
                block.position = index;
                var setToColor = $("#" + blockId).find("input.setToColor").val();
                if (setToColor != null && setToColor != "")
                    block.setToColor = setToColor;
                if (block.type == "Comment")
                    block.comment = $("#" + blockId).find(".commentTextArea").val();
            }
        });
    }

    /*****
    *	userRegistrationSuccess(username)
    *	Called upon successful registration of a user. Shows a success message
    *   to the user.
    *   Parameters:
    *       username: the username just registered.
    ******/
    function userRegistrationSuccess(username) {
        showLightWriterMessage("User \"" + username + "\" created. You can now login to LightWriter.");
    }

    /*****
    *	userLoginSuccess(username)
    *	Called upon successful login of the user. Just gives a success
    *   message.
    *   Parameters:
    *       username: the username just logged in.
    ******/
    function userLoginSuccess(username) {
        LoginLogoutHandler("login"); // change button and state
        showLightWriterMessage("User \"" + username + "\" logged in!");
    }

    /*****
    *	userLoginSuccess(username)
    *	Called upon successful registration (and thus log in) of the user. Just gives a success
    *   message.
    *   Parameters:
    *       username: the username just logged in.
    ******/
    function userRegistrationAndLoginSuccess(username) {
        LoginLogoutHandler("login"); // change button and state
        showLightWriterMessage("User \"" + username + "\" successfully registered and logged in!");
    }

    // [debug function] Checks to see if a user is logged in
    function checkUserSession() {
        ajaxService("check-user-session.php", {},
            function (result) {
                showLightWriterMessage(result.d);
            }, null);
    }

    /*****
    *	loadUserAlgorithmNamesIntoSelector(result, nameSelector, dialogSelector, shouldWarnOnNoSaved)
    *	Loads the array of algorithm names loaded from the server
    *   into a select box (which is in a dialog) so the user
    *   can select one to load.
    *   Parameters:
    *       result: the result given by the server upon ajax request
    *       nameSelector: selector to find the alg name selector via jquery
    *       dialogSelector: selector to find the overall dialog that the user sees
    *           to use this select box
    *       shouldWarnOnNoSaved: Whether an error should be thrown when there are no
    *           algorithms saved for this user [true/false]
    ******/
    function loadUserAlgorithmNamesIntoSelector(result, nameSelector, dialogSelector, shouldWarnOnNoSaved) {
        var algorithmNames = result.d;
        if (shouldWarnOnNoSaved && algorithmNames.length == 0)
            showLightWriterMessage("No saved algorithms available.");
        else {
            $(nameSelector).find("option:gt(0)").remove(); // get rid of any old options from previous loadings
            for (var i = 0; i < algorithmNames.length; i++) {
                var algParts = algorithmNames[i].split(";;;;");
                var algId = algParts[0];
                var algName = algParts[1];
                var optionString = "<option value='" + algId + "'>" + algName + "</option>";
                $(nameSelector).append(optionString);
            }
            // open the load dialog
            $(dialogSelector).dialog("open");
        }
    }

    /*****
    *	loadAlgorithm(algorithmId)
    *	Loads an algorithm with id of algorithmId by requesting
    *   that the server send the block/algorithm data back to
    *   the client via an Ajax request. This function is called
    *   when the user selects an algorithm to load in the 
    *   load dialog.
    *   Parameters:
    *       algorithmId: the ID of the algorithm to load
    *       dialogSelector: selector of dialog to close on success
    ******/
    function loadAlgorithm(algorithmId, dialogSelector) {
        var serviceParams = {
            algorithmID: algorithmId
        };
        ajaxService("LoadUserAlgorithm", serviceParams,
            function (result) {
                var loadedList = result.d;
                if (typeof loadedList["Error"] == "undefined") { // No errors in loading algorithm
                    loadAlgorithmIntoListAndPage(loadedList);
                    $(dialogSelector).dialog("close");
                }
                else {
                    showLightWriterMessage("Error loading an algorithm. Error: " + loadedList["Error"]);
                }
            }, null);
    }

    /*****
    *	loadAlgorithmForSharing(algorithmId)
    *	Loads an algorithm with id of algorithmId by requesting
    *   that the server send the block/algorithm data back to
    *   the client via an Ajax request. This function is called
    *   when the user selects an algorithm to load in the 
    *   load dialog.
    *   Same as above func, but with a success function it calls
    *   after the algorithm is loaded. Used for sharing.
    *   Parameters:
    *       algorithmId: the ID of the algorithm to load
    *       successFunc: Function to call upon success of loading
    ******/
    function loadAlgorithmForSharing(algorithmId, successFunc) {
        var serviceParams = {
            algorithmID: algorithmId,
            URL: document.URL
        };
        var dialog = this;
        ajaxService("LoadUserAlgorithmForSharing", serviceParams,
            function (result) {
                var loadedList = result.d;
                if (typeof loadedList["Error"] == "undefined") { // No errors in loading algorithm
                    loadAlgorithmIntoListAndPage(loadedList);
                    successFunc();
                }
                else {
                    showLightWriterMessage("Error loading a shared algorithm. Error: " + loadedList["Error"]);
                }
            }, null);
    }

    /*****
    *	loadAlgorithmIntoListAndPage(loadedList)
    *	Resets the block/algorithm list by clearing it
    *   and then loads the loaded algorithm from the server
    *   into the page. Adds blocks to the backend data-structure
    *   and then adjusts the GUI to reflect the internal state
    *   of the block.
    *   Parameters:
    *       loadedList: The data from the server that contains
    *           all the blocks to insert into the page.
    ******/
    function loadAlgorithmIntoListAndPage(loadedList) {
        blockList.resetListAndIdNums();
        if (typeof loadedList.singleBlocks == "undefined") {
            showLightWriterMessage("Something went wrong loading the algorithm. The list object is empty! Please contact an administrator with the " +
                "circumstances of this error.");
            return;
        }
        // Now load all the blocks! (sort at the end)
        var singleBlocks = loadedList.singleBlocks;
        for (var i = 0; i < singleBlocks.length; i++) {
            var singleBlock = singleBlocks[i];
            var blockId = addBlock("SingleBlock", "single-template");
            var addedBlock = blockList.getBlock(blockId);
            var selector = '#' + blockId;
            $(selector).find("input.setToColor").val(singleBlock.SetToColor); // must make HTML match before setting action so the GUI looks
            // right with the color picker (makes the input box the color of the HTML color string)
            addedBlock.setAction(singleBlock.ActionString);
            addedBlock.rowId = singleBlock.RowID;
            addedBlock.columnId = singleBlock.ColumnID;
            addedBlock.position = singleBlock.Position;
            // Adjust the GUI div to mirror the internal state of the block
            $(selector).find("select.row").val(addedBlock.rowId);
            $(selector).find("select.column").val(addedBlock.columnId);
            $(selector).find("select.action").val(singleBlock.ActionString);
        }
        var comparisonBlocks = loadedList.comparisonBlocks;
        for (var i = 0; i < comparisonBlocks.length; i++) {
            var comparisonBlock = comparisonBlocks[i];
            var blockId = addBlock("Comparison", "comparison-template");
            var addedBlock = blockList.getBlock(blockId);
            var selector = '#' + blockId;
            $(selector).find("input.setToColor").val(comparisonBlock.SetToColor); // must make HTML match before setting action so the GUI looks
            // right with the color picker (makes the input box the color of the HTML color string)
            addedBlock.setAction(comparisonBlock.ActionString);
            addedBlock.rowOrColumnId = comparisonBlock.RowOrColumnID;
            addedBlock.setComparisonAction(comparisonBlock.ComparisonActionString);
            addedBlock.position = comparisonBlock.Position;
            // Adjust the GUI div to mirror the internal state of the block
            $(selector).find("select.columnrow").val(comparisonBlock.RowOrColumnID);
            $(selector).find("select.comparison").val(comparisonBlock.ComparisonActionString);
            $(selector).find("select.action").val(comparisonBlock.ActionString);
        }
        var rangeBlocks = loadedList.rangeBlocks;
        for (var i = 0; i < rangeBlocks.length; i++) {
            var rangeBlock = rangeBlocks[i];
            var blockId = addBlock("Range", "range-template");
            var addedBlock = blockList.getBlock(blockId);
            var selector = '#' + blockId;
            $(selector).find("input.setToColor").val(rangeBlock.SetToColor); // must make HTML match before setting action so the GUI looks
            // right with the color picker (makes the input box the color of the HTML color string)
            addedBlock.setAction(rangeBlock.ActionString);
            addedBlock.setLeftRowOrColumnId(rangeBlock.LeftRowOrColumnID);
            addedBlock.setRightRowOrColumnId(rangeBlock.RightRowOrColumnID);
            addedBlock.position = rangeBlock.Position;
            // Adjust the GUI div to mirror the internal state of the block
            $(selector).find("select.leftColumnRow").val(rangeBlock.LeftRowOrColumnID);
            $(selector).find("select.rightColumnRow").val(rangeBlock.RightRowOrColumnID);
            $(selector).find("select.action").val(rangeBlock.ActionString);
        }
        var circleBlocks = loadedList.circleBlocks;
        for (var i = 0; i < circleBlocks.length; i++) {
            var circleBlock = circleBlocks[i];
            var blockId = addBlock("CircleBlock", "circle-template");
            var addedBlock = blockList.getBlock(blockId);
            var selector = '#' + blockId;
            $(selector).find("input.setToColor").val(circleBlock.SetToColor); // must make HTML match before setting action so the GUI looks
            // right with the color picker (makes the input box the color of the HTML color string)
            addedBlock.setAction(circleBlock.ActionString);
            addedBlock.rowId = circleBlock.RowID;
            addedBlock.columnId = circleBlock.ColumnID;
            addedBlock.radius = circleBlock.Radius;
            addedBlock.position = circleBlock.Position;
            // Make GUI mirror internal state of block
            $(selector).find("select.column").val(addedBlock.columnId);
            $(selector).find("select.row").val(addedBlock.rowId);
            $(selector).find("select.radius").val(addedBlock.radius);
            $(selector).find("select.action").val(addedBlock.actionString);
        }
        var singleMoveBlocks = loadedList.singleMoveBlocks;
        for (var i = 0; i < singleMoveBlocks.length; i++) {
            var singleMoveBlock = singleMoveBlocks[i];
            var blockId = addBlock("SingleMove", "single-move-template");
            var addedBlock = blockList.getBlock(blockId);
            var selector = '#' + blockId;
            $(selector).find("input.setToColor").val(singleMoveBlock.SetToColor); // must make HTML match before setting action so the GUI looks
            // right with the color picker (makes the input box the color of the HTML color string)
            addedBlock.setAction(singleMoveBlock.ActionString);
            addedBlock.setRowId(singleMoveBlock.RowID);
            addedBlock.setColumnId(singleMoveBlock.ColumnID);
            addedBlock.position = singleMoveBlock.Position;
            addedBlock.numberTicksBeforeChange = singleMoveBlock.NumberTicksBeforeChange;
            addedBlock.numberBlocksToMove = singleMoveBlock.NumberBlocksToMove;
            addedBlock.direction = singleMoveBlock.Direction;
            // Adjust the GUI div to mirror the internal state of the block
            $(selector).find("select.row").val(addedBlock.rowId);
            $(selector).find("select.column").val(addedBlock.columnId);
            $(selector).find("select.action").val(singleMoveBlock.ActionString);
            $(selector).find("input.setToColor").val(singleMoveBlock.SetToColor);
            $(selector).find("select.move-amount").val(singleMoveBlock.NumberBlocksToMove);
            $(selector).find("select.tick-amount").val(singleMoveBlock.NumberTicksBeforeChange);
            $(selector).find("select.move-direction").val(singleMoveBlock.Direction);
        }
        var comparisonMoveBlocks = loadedList.comparisonMoveBlocks;
        for (var i = 0; i < comparisonMoveBlocks.length; i++) {
            var comparisonMoveBlock = comparisonMoveBlocks[i];
            var blockId = addBlock('ComparisonMove', 'comparison-move-template');
            var addedBlock = blockList.getBlock(blockId);
            var selector = '#' + blockId;
            $(selector).find("input.setToColor").val(comparisonMoveBlock.SetToColor); // must make HTML match before setting action so the GUI looks
            // right with the color picker (makes the input box the color of the HTML color string)
            addedBlock.setAction(comparisonMoveBlock.ActionString);
            addedBlock.setComparisonAction(comparisonMoveBlock.ComparisonActionString);
            addedBlock.setRowOrColumnId(comparisonMoveBlock.RowOrColumnID);
            addedBlock.position = comparisonMoveBlock.Position;
            addedBlock.numberTicksBeforeChange = comparisonMoveBlock.NumberTicksBeforeChange;
            addedBlock.numberBlocksToMove = comparisonMoveBlock.NumberBlocksToMove;
            addedBlock.direction = comparisonMoveBlock.Direction;
            // Adjust the GUI div to mirror the internal state of the block
            $(selector).find("select.comparison").val(comparisonMoveBlock.ComparisonActionString);
            $(selector).find("select.columnrow").val(comparisonMoveBlock.RowOrColumnID);
            $(selector).find("select.action").val(comparisonMoveBlock.ActionString);
            $(selector).find("select.move-amount").val(comparisonMoveBlock.NumberBlocksToMove);
            $(selector).find("select.move-direction").val(comparisonMoveBlock.Direction);
            $(selector).find("select.tick-amount").val(comparisonMoveBlock.NumberTicksBeforeChange);
        }
        var rangeMoveBlocks = loadedList.rangeMoveBlocks;
        for (var i = 0; i < rangeMoveBlocks.length; i++) {
            var rangeMoveBlock = rangeMoveBlocks[i];
            var blockId = addBlock("RangeMove", "range-move-template");
            var addedBlock = blockList.getBlock(blockId);
            var selector = '#' + blockId;
            $(selector).find("input.setToColor").val(rangeMoveBlock.SetToColor); // must make HTML match before setting action so the GUI looks
            // right with the color picker (makes the input box the color of the HTML color string)
            addedBlock.setAction(rangeMoveBlock.ActionString);
            addedBlock.setLeftRowOrColumnId(rangeMoveBlock.LeftRowOrColumnID);
            addedBlock.setRightRowOrColumnId(rangeMoveBlock.RightRowOrColumnID);
            addedBlock.position = rangeMoveBlock.Position;
            addedBlock.numberTicksBeforeChange = rangeMoveBlock.NumberTicksBeforeChange;
            addedBlock.numberBlocksToMove = rangeMoveBlock.NumberBlocksToMove;
            addedBlock.direction = rangeMoveBlock.Direction;
            // Adjust the GUI div to mirror the internal state of the block
            $(selector).find("select.leftColumnRow").val(rangeMoveBlock.LeftRowOrColumnID);
            $(selector).find("select.rightColumnRow").val(rangeMoveBlock.RightRowOrColumnID);
            $(selector).find("select.action").val(rangeMoveBlock.ActionString);
            $(selector).find("select.move-amount").val(rangeMoveBlock.NumberBlocksToMove);
            $(selector).find("select.move-direction").val(rangeMoveBlock.Direction);
            $(selector).find("select.tick-amount").val(rangeMoveBlock.NumberTicksBeforeChange);
        }
        var commentBlocks = loadedList.commentBlocks;
        for (var i = 0; i < commentBlocks.length; i++) {
            var commentBlock = commentBlocks[i];
            var blockId = addBlock("Comment", "comment-template");
            var addedBlock = blockList.getBlock(blockId);
            addedBlock.position = commentBlock.Position;
            var selector = '#' + blockId;
            $(selector).find(".commentTextArea").val(commentBlock.Comment);
        }
        // now sort the ul via the positions (http://stackoverflow.com/questions/304396/what-is-the-easiest-way-to-order-a-ul-ol-in-jquery)
        var items = $("#block-list li").get();
        items.sort(function (a, b) {
            var aId = $(a).find("div").attr("id");
            var positionA = blockList.getBlock(aId).position;
            var bId = $(b).find("div").attr("id");
            var positionB = blockList.getBlock(bId).position;

            if (positionA < positionB) return -1;
            if (positionA > positionB) return 1;
            return 0;
        });
        var ul = $("#block-list");
        $.each(items, function (i, li) {
            ul.append(li);
        });
        // Now set up the rules that were saved
        var rules = loadedList.rules;
        if (rules.length) {
            rules = rules[0];
            DEFAULT_BOX_COLOR = rules.DefaultBoxColor;
            MS_PER_TICK = rules.MSPerTick;
            COLOR_MIXING = rules.ColorMixing == 1 ? true : false;
            restoreRulesAfterDialogClose(false); // restore the GUI for the rules
            clearGrid(); // resets visible default box color for user
        }
        else {
            resetRules();
            clearGrid(); // resets visible default box color for user
        }
    }

    function showLightWriterMessage(msg) {
        $("#message-box").html(msg);
        $("#message-dialog").dialog("open");
    }

    function lightWriterConfirmBox(msg, confirmFunc, denyFunc) {
        $("#confirmation-message").html(msg);
        if (confirmFunc == null)
            confirmFunc = function () { };
        if (denyFunc == null)
            denyFunc = function () { };
        $("#confirmation-message").removeClass("hidden");
        $("#confirmation-dialog").dialog({ // initialize rules dialog and its functions
            autoOpen: false,
            width: 400,
            modal: true,
            buttons: {
                // Rules functions that this dialog calls are defined in index.js
                "OK": function () { // User clicks the "Save" button
                    $(this).dialog("close");
                    confirmFunc();
                },
                Cancel: function () { // User clicks the "Cancel" button on the dialog
                    $(this).dialog("close");
                    denyFunc();
                }
            },
            close: function () { // called upon any sort of close of the dialog
                $(this).dialog("destroy");
                $("#confirmation-message").addClass("hidden");
            }
        });
        $("#confirmation-dialog").dialog("open");
    }

    /*****
    *	manageURL()
    *	Called on page load. Since this file is one of the last to be loaded,
    *   this function is called pretty much once everything else is initialized.
    *   Checks the URL to see if we are processing a user attempting to load
    *   a shared algorithm. If so (url contains ?shareID=#), load the algorithm
    *   and stick the user into presentation mode.
    ******/
    function manageURL() {
        var url = document.URL;
        if (url.indexOf("?shareID=") != -1) {
            var algIDToLoad = url.split("?shareID=")[1]; // should be docURL?shareID=# and nothing more
            if (isVariableANumber(algIDToLoad)) {
                // TODO show some "Loading" message or something??
                // Load algorithm, put page into presentation mode after its loaded
                loadAlgorithmForSharing(algIDToLoad, enterPresentModeAndPlayAlg);
            }
            else showLightWriterMessage("Invalid sharing ID.");
        }
    }

    /*****
    *	enterPresentModeAndPlayAlg()
    *	Called after an algorithm is loaded for sharing.
    *   Starts presentation mode and the algorithm.
    ******/
    function enterPresentModeAndPlayAlg() {
        EnterPresentationMode();
        StartStopToggle();
    }

    manageURL(); // call the manageURL function to check the URL and load stuff if need be

    /*****
    *	ajaxService(serviceName, serviceParameters, successFunction, errorFunction)
    *	A small abstraction of the ajax service caller from jQuery. This allows
    *   service callers to just use a simple function call instead of the syntactic
    *   nastyness that can be jQuery Ajax. 
    *   Makes a call to a given web service in AjaxServices.asmx using the given
    *   serviceName and serviceParameters, as well as calling successFunction or
    *   errorFunction upon ajax call success or error, respectively.
    *   Parameters:
    *       serviceName: The name of the service in AjaxServices.asmx to call
    *       serviceParameters: Parameters in object format {} to send to the server
    *       successFunction: function to call upon ajax success
    *       errorFunction: function to call upon ajax failure
    ******/
    function ajaxService(serviceName, serviceParameters, successFunction, errorFunction) {
        if (successFunction == null) {
            successFunction = function (result) { }; // showLightWriterMessage(result.d); could also be another default
        }
        if (errorFunction == null) {
            errorFunction = function (result) {
                showLightWriterMessage(result.status + ' ' + result.responseText);
            };
        }
        $.ajax({
            type: "POST",
            url: "ajax/" + serviceName,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(serviceParameters),
            dataType: "json",
            success: successFunction,
            error: errorFunction
        });
    }
});

/*****
*	updateTips(t)
*	Updates the validation message/"tips" portion of an open dialog.
*   Also highlights said message for 1500 ms.
*   Parameters:
*       t: the message to add to the validation message portion of the dialog.
******/
function updateTips(idOfDiv, text) {
    var tipsElement = $("#" + idOfDiv + " .validateTips");
    var oldValidateTipsMsg = $(tipsElement).attr("old-message");
    if (oldValidateTipsMsg == "" || oldValidateTipsMsg == null)
        $(tipsElement).attr("old-message", $(tipsElement).text());
    $(tipsElement).text(text).addClass("ui-state-highlight");
    setTimeout(function () {
        tips.removeClass("ui-state-highlight", 1500);
    }, 500);
}