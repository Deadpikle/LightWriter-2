/*****
*	index.js
*	This is the main Javascript file for the
*	interactions between the user and the underlying
*	blocks and data structures. 
*	Holds globals for the LightWriter logic, inits and
*	controls the data structures, and executes the 
*	block algorithm every MS_PER_TICK milliseconds when
*	the user starts the algorithm.
*
*	General jQuery/js tips moved to bottom of file
******/

// Documentation for classes & functions template
/*****
*	nameOfFunction(parameter1, parameter2, ..., parameterN)
*   -Function Description
*   -Function parameters   (optional)
*   -Function return values (optional)
******/

// Global constants
var MIN_COLUMN = 'A'; // First alphabet letter for leftmost column
var MAX_COLUMN = 'P'; // Last alphabet letter for rightmost column
var MIN_ROW = 1; // First number for the topmost row
var MAX_ROW = 16; // Last number for the bottom most row. Also used to calc table size!
var DEFAULT_BOX_COLOR = "#444444";
var MS_PER_TICK = 500; // number of milliseconds per tick
var COLOR_MIXING = false; // If true, mixes colors instead of overwriting them
var SITE_URL_BASE_FOR_SHARING = "https://URL_BASE"; // sharing mechanism appends to this url for sharing

var LOWEST_TICK_SPEED = 50; // lowest possible tick speed for rule setting
var HIGHEST_TICK_SPEED = 10000; // highest possible tick speed for rule setting

// Global variables
var blockList = new BlockList(); // List of blocks the user is manipulating/running.
var grid = new LightGrid(); // Grid that the blocks adjust. The grid paints the GUI.
var timer; // Timer that executes the executeAlgorithms function on every tick.
var isAlgRunning = false;
var currentPatternID = -1; // ID of currently loaded pattern (-1 if doesn't represent a saved pattern in the db)

/*****
*	outerHTML
*	Used by jquery objects; overwrites the jQuery prototype.
*	Used to get the HTML of a DOM element including itself and not
*	just the HTML inside of it.
*	<div id="outerTest">
*		<p>HI!</p>
*	</div>
*	$("#outerTest").outerHTML(); would return all that HTML, not just
*	the <p> element.
*	Modified from http://stackoverflow.com/questions/2419749/get-selected-elements-outer-html
*	and http://stackoverflow.com/questions/3614212/jquery-get-html-of-a-whole-element
******/
jQuery.fn.outerHTML = function() {
	return $(this).clone().wrap("<p>").parent().html();
};

/*****
*	$()
*	Called on window load. This function can be used to call js functions on 
*	"init" and/or set up events for select boxes and such.
******/
$(function () {
    /*****
	*	$("#block-list").on("click", ".preview", function (event)
	*	Sets up an event handler for when a user clicks a prview buton
	*	Calls previewBlocks() with the button that they clicked.
	******/
    $("#block-list").on("click", ".preview", function (event) {
        previewBlocks(event.target);
        return false;
    });
	/*****
	*	$("#block-list").on("change", ".comparison-block .option-changer")
	*	Sets up an event handler for when a select box changes
	*	inside of a comparison block.
	*	Propogates changes to underlying data structure that corresponds
	*	to this comparison block.
	******/
	$("#block-list").on("change", ".comparison-block .option-changer", function(event) {
		var selectBox = event.target;
		var selectedValue = $(selectBox).val();
		// get out the second class name
		var selectType = $(selectBox).attr("class").split(' ').slice(1, 2);
		var idOfBlock = $(selectBox).closest(".comparison-block").attr("id");
		var block = blockList.getBlock(idOfBlock);
		if (selectType == "comparison")
			block.setComparisonAction(selectedValue);
		else if (selectType == "columnrow")
			block.rowOrColumnId = selectedValue;
		else if (selectType == "action")
			block.setAction(selectedValue);
	    // don't have to reset block in algorithm array since I got a "pointer" to the object
		blockList.resetBlocks();
	});
	/*****
	*	$("#block-list").on("change", ".range-block .option-changer")
	*	Sets up an event handler for when a select box changes
	*	inside of a comparison range block.
	*	Propogates changes to underlying data structure that corresponds
	*	to this comparison block.
	*	Does all the splitting and stuff because classes come in as (for example)
	*		""option-changer columnrow-1".
	******/
	$("#block-list").on("change", ".range-block .option-changer", function (event) {
	    var selectBox = event.target;
	    var selectedValue = $(selectBox).val();
	    var selectTypeWithNumArr = $(selectBox).attr("class").split(' ');
	    // Get out the type class for this select box (such as leftColumnRow)
	    var selectType = selectTypeWithNumArr.slice(1, 2).pop();
	    var idOfBlock = $(selectBox).closest(".range-block").attr("id");
	    var block = blockList.getBlock(idOfBlock);
	    if (selectType == "leftColumnRow")
	        block.setLeftRowOrColumnId(selectedValue);
	    else if (selectType == "rightColumnRow")
	        block.setRightRowOrColumnId(selectedValue);
		else if (selectType == "action")
		    block.setAction(selectedValue);
	    blockList.resetBlocks();
	});
    // All the rest of these block-list events are pretty much the same.
	$("#block-list").on("change", ".single-block .option-changer", function (event) {
	    var selectBox = event.target;
	    var selectedValue = $(selectBox).val();
	    var selectType = $(selectBox).attr("class").split(' ').pop();
	    var idOfBlock = $(selectBox).closest(".single-block").attr("id");
	    var block = blockList.getBlock(idOfBlock);
	    if (selectType == "row")
	        block.rowId = selectedValue;
	    else if (selectType == "column")
	        block.columnId = selectedValue;
	    else if (selectType == "action")
	        block.setAction(selectedValue);
	    blockList.resetBlocks();
	});

	$("#block-list").on("change", ".circle-block .option-changer", function (event) {
	    var selectBox = event.target;
	    var selectedValue = $(selectBox).val();
	    var selectType = $(selectBox).attr("class").split(' ').pop();
	    var idOfBlock = $(selectBox).closest(".circle-block").attr("id");
	    var block = blockList.getBlock(idOfBlock);
	    if (selectType == "row")
	        block.rowId = selectedValue;
	    else if (selectType == "column")
	        block.columnId = selectedValue;
	    else if (selectType == "radius")
	        block.radius = selectedValue;
	    else if (selectType == "action")
	        block.setAction(selectedValue);
	    blockList.resetBlocks();
	});

    // Move blocks

	$("#block-list").on("change", ".single-move-block .option-changer", function (event) {
	    var selectBox = event.target;
	    var selectedValue = $(selectBox).val();
	    var selectType = $(selectBox).attr("class").split(' ').pop();
	    var idOfBlock = $(selectBox).closest(".single-move-block").attr("id");
	    var block = blockList.getBlock(idOfBlock);
	    if (selectType == "row")
	        block.setRowId(selectedValue);
	    else if (selectType == "column")
	        block.setColumnId(selectedValue);
	    else if (selectType == "action")
	        block.setAction(selectedValue);
	    else if (selectType == "move-direction")
	        block.direction = selectedValue;
	    else if (selectType == "move-amount")
	        block.numberBlocksToMove = selectedValue;
	    else if (selectType == "tick-amount")
	        block.numberTicksBeforeChange = selectedValue;
	    blockList.resetBlocks();
	});

	$("#block-list").on("change", ".comparison-move-block .option-changer", function (event) {
	    var selectBox = event.target;
	    var selectedValue = $(selectBox).val();
	    var selectTypeWithNumArr = $(selectBox).attr("class").split(' ');
	    // Get out the type class for this select box (such as columnrow-1)
	    selectTypeWithNumArr = selectTypeWithNumArr.slice(1, 2).pop();
	    var selectType = selectTypeWithNumArr;
	    var idOfBlock = $(selectBox).closest(".comparison-move-block").attr("id");
	    var block = blockList.getBlock(idOfBlock);
	    if (selectType == "comparison")
	        block.setComparisonAction(selectedValue);
	    else if (selectType == "columnrow")
	        block.setRowOrColumnId(selectedValue);
	    else if (selectType == "action")
	        block.setAction(selectedValue);
	    else if (selectType == "move-direction")
	        block.direction = selectedValue;
	    else if (selectType == "move-amount")
	        block.numberBlocksToMove = selectedValue;
	    else if (selectType == "tick-amount")
	        block.numberTicksBeforeChange = selectedValue;
	    blockList.resetBlocks();
	});

	$("#block-list").on("change", ".range-move-block .option-changer", function (event) {
	    var selectBox = event.target;
	    var selectedValue = $(selectBox).val();
	    var selectTypeWithNumArr = $(selectBox).attr("class").split(' ');
	    // Get out the type class for this select box (such as leftColumnRow)
	    var selectType = selectTypeWithNumArr.slice(1, 2).pop();
	    var idOfBlock = $(selectBox).closest(".range-move-block").attr("id");
	    var block = blockList.getBlock(idOfBlock);
	    if (selectType == "leftColumnRow")
	        block.setLeftRowOrColumnId(selectedValue);
	    else if (selectType == "rightColumnRow")
	        block.setRightRowOrColumnId(selectedValue);
	    else if (selectType == "action")
	        block.setAction(selectedValue);
	    else if (selectType == "move-direction")
	        block.direction = selectedValue;
	    else if (selectType == "move-amount")
	        block.numberBlocksToMove = selectedValue;
	    else if (selectType == "tick-amount")
	        block.numberTicksBeforeChange = selectedValue;
	    blockList.resetBlocks();
	});

    // Other page load stuff
	if ($(".loginButton").attr("src").indexOf("LogoutButton") !== -1) // src img string has LoginButton in it
	    LoginLogoutHandler("login"); // set internal state to logged in
});


/*****
*	addBlock(type, templateId)
*	Call this function to add a block of a certain type
*	and with a certain templateId to the block list and to
*	the visible GUI for the user.
*	Parameters:
*		type: the type of block that is being added
*		templateId: the Id of the template HTML for this type
*			of block
******/
function addBlock(type, templateId) {
	// Initialize the block and add it to the block list 
	var block = new blockNamespace[type]();
	var blockId = blockList.addBlock(block);
	// duplicate html into visible list
	var template = $('#'+templateId).outerHTML();
	var adjustedBlock = $(template).attr("id", blockId);
	$("#block-list").append(adjustedBlock);
	$(adjustedBlock).wrap(document.createElement("li")); // put the block in the ul as an li
    // Set up the color picker
	var addedBlockSelector = "#" + blockId;
	var addedBlockColorPickerId = blockId + "-color-picker";
	$(addedBlockSelector).find(".setToColor").attr("id", addedBlockColorPickerId);
	ProColor.prototype.attachButton(addedBlockColorPickerId, { // add in the color picker
	    imgPath: "js/old/lib/Procolor/img/procolor_win_",
	    showInField: true,
	    color: '#FFFFFF',
	    mode: "popup",
	    parent: addedBlockColorPickerId,
	    useOptionalPositionFinder: true
	});
    // Hide the newly formed color picker button since the default action is random color
	$(addedBlockSelector).find("a").hide();
	if (isAlgRunning) 
	    disableBlockChanges(); // don't let user change blocks while alg is running
	return blockId;
}

/*****
*	previewBlocks(button)
*	Previews a user algorithm up through the block where
*   the preview button was clicked. Executes all blocks
*   (starting from the top of the list) one by one
*   and stops after executing the block where they clicked
*   the button.
*	Parameters:
*		button: the button the user clicked that is
*			inside the block they wish to preview
******/
function previewBlocks(button) {
    clearGrid();
    // Find the uppermost div that has the block id
    var blockDiv = $(button).closest("li").find("div");
    blockList.executeBlocksThroughId($(blockDiv).attr("id"));
    grid.paint();
}

/*****
*	removeBlock(button)
*	Removes a specific block from the block list and from
*	the GUI.
*	Parameters:
*		button: the button the user clicked that is
*			inside the block they wish to remove
******/
function removeBlock(button) {
	// Find the uppermost div that has the block id
	var blockDiv = $(button).closest("li").find("div"); 
	// Remove the block from the algorithm list
	blockList.removeBlock(blockDiv.attr("id"));
	// Remove the block from the GUI
	$(blockDiv).closest("li").remove();
}

/*****
*	startAlgorithm()
*	Checks to see if the timer is already running and clears
*	it if it is. Then disables the algorithm-changing buttons
*	and selectors, then starts the timer which will run the
*	algorithm every MS_PER_TICK milliseconds.
******/
function startAlgorithm() {
	if (typeof timer != "undefined")
	    clearInterval(timer);
    blockList.resetBlocks(); // in case the user has previewed blocks
    // Disable block and other input changes
    disableBlockChanges();
    timer = setInterval(executeAlgorithms, MS_PER_TICK);
    isAlgRunning = true;
}
/*****
*	disableBlockChanges()
*	Disables all changes to blocks (so that changes can't be made while
*   the algorithm is running).
******/
function disableBlockChanges() {
    $("#block-list select").prop("disabled", "disabled");
    $("#block-list input").prop("disabled", "disabled");
    $("#ToolsAccordion input").prop("disabled", "disabled");
}

/*****
*	stopAlgorithm()
*	Clears the grid of all color and resets the blocks, 
*	reenables block modifiers, and then stops the timer.
******/
function stopAlgorithm() {
    clearGrid();
    blockList.resetBlocks();
    $("#block-list select").prop("disabled", false);
    $("#block-list input").prop("disabled", false);
    $("#ToolsAccordion input").prop("disabled", false);
	if (typeof timer != "undefined")
	    clearInterval(timer);
    isAlgRunning = false;
}

/*****
*	clearGrid()
*	Clears the grid of all color by telling the
*	grid to reset (sets all squares to DEFAULT_BOX_COLOR)
*	and then repaint.
******/
function clearGrid() {
	grid.resetGrid();
	grid.paint();
}

/*****
*	executeAlgorithms()
*	Called every MS_PER_TICK milliseconds.
*	Clears the grid, executes the block algorithms, and
*	then paints the grid.
******/
function executeAlgorithms() {
	clearGrid();
	blockList.executeBlocks();
	grid.paint();
}

/*****
*	resetRules()
*	Resets all rules back to their default values (including the rules dialog).
*   Breaks the separation of index & ajaxServices files, but I would rather
*   have the function here since that's where the globals for "rules" are
*   located.
******/
function resetRules() {
    DEFAULT_BOX_COLOR = "#444444";
    MS_PER_TICK = 500;
    COLOR_MIXING = false;
    restoreRulesAfterDialogClose(false); // Makes the GUI right
}
/*****
*	saveRules()
*	Saves the rules that the user just messed with.
*   Breaks the separation of index & ajaxServices files, but I would rather
*   have the function here since that's where the globals for "rules" are
*   located.
*   Returns true if rules are valid and false otherwise.
******/
function saveRules() {
    var areRulesValid = verifyRulesBeforeSave();
    if (areRulesValid) {
        DEFAULT_BOX_COLOR = $("#def-square-color").val();
        MS_PER_TICK = $("#ms-per-tick").val();
        COLOR_MIXING = $("#color-mixing").is(":checked");
        clearGrid(); // since box color just changed, reset grid and repaint it
    }
    return areRulesValid;
}

/*****
*	verifyRulesBeforeSave()
*	Verifies that rules are in the correct state (box color is a hex value, etc.)
*   Returns true if they are fine and false otherwise.
******/
function verifyRulesBeforeSave() {
    var rulesAreValid = true;
    var errorMessage = "";
    var defBoxColor = $("#def-square-color").val();
    if (!isValidColor(defBoxColor)) {
        rulesAreValid = false;
        errorMessage += "Default square color needs to be a valid hex string of form: #123456. ";
    }
   /* var tickSpeed = $("#ms-per-tick").val();
    if (!isVariableANumber(tickSpeed)) {
        rulesAreValid = false;
        errorMessage += "Tick speed must be a number between "+ LOWEST_TICK_SPEED + " and " + HIGHEST_TICK_SPEED + ". ";
    }
    else {
        tickSpeed = parseInt(tickSpeed);
        if (tickSpeed < LOWEST_TICK_SPEED || tickSpeed >= HIGHEST_TICK_SPEED) {
            rulesAreValid = false;
            errorMessage += "Tick speed must be a number between " + LOWEST_TICK_SPEED + " and " + HIGHEST_TICK_SPEED + ". ";
        }
    }*/
    if (!rulesAreValid)
        updateTips("rules-dialog", errorMessage);
    return rulesAreValid;
}

var tmpRuleSaver = {}; // for temporary saving of rules in case the user canceles changes
/*****
*	saveRulesBeforeChange()
*	Saves the rules that the user is about to mess with in case they decide to cancel
*   their changes.
*   Returns the array of saved rules in case the calling function needs it.
******/
function saveRulesBeforeChange() {
    tmpRuleSaver.DEFAULT_BOX_COLOR = DEFAULT_BOX_COLOR;
    tmpRuleSaver.MS_PER_TICK = MS_PER_TICK;
    tmpRuleSaver.COLOR_MIXING = COLOR_MIXING;
    return tmpRuleSaver; // in case the calling func needs it (used for saving to db)
}
/*****
*	restoreRulesAfterDialogClose()
*	Restores the rules that are the most current & valid right after the user closes
*   the dialog.
*   Main purpose is to save rules in case they hit cancel, but this is also called
*   upon a dialog reset and a dialog save so that the closing logic is simpler 
*   (we can just call this on every close and its safe)
*   Has to make the GUI match up as well!
*   Parameters:
*       shouldLoadValsFromTmpSaver: Whether the func should load vals from the tmp saver
*           or just restore the rules GUI to the global values.
******/
function restoreRulesAfterDialogClose(shouldLoadValsFromTmpSaver) {
    if (shouldLoadValsFromTmpSaver) {
        DEFAULT_BOX_COLOR = tmpRuleSaver.DEFAULT_BOX_COLOR;
        MS_PER_TICK = tmpRuleSaver.MS_PER_TICK;
        COLOR_MIXING = tmpRuleSaver.COLOR_MIXING;
    }
    $("#def-square-color").val(DEFAULT_BOX_COLOR);
    $("#def-square-color").focus(); // focus the box to make it look right w/color picker
    $("#def-square-color").blur(); // unfocus the box so it doesn't look strange to the user via focus events
    $("#ms-per-tick").val(MS_PER_TICK);
    $("#color-mixing").prop("checked", COLOR_MIXING);
}

// Anything outside of functions is called/setup right at page load (when the javascript is loaded)
// Can also be used for globals

// Anything with the $ is a jquery call. $ is kind of the global call and is
// the easiest way to get something.
// $("#blah") finds the HTML element with the ID of blah
// $(".blah") finds the HTML element (or elementS) that have the CLASS of blah