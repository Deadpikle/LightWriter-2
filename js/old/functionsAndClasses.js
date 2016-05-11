/*****
*	functionsAndClasses.js
*	Created on 9/25/2013
*	Last Modified 11/26/2013
*	Holds js "classes" and functions that
*	those classes utilize. These classes
*	are called by index.js to be the "backend"
*	data structures for the GUI.
******/

/*****
*	BlockList class
*	Provides for a list of blocks that each
*	perform their own action on a 2D grid array.
*	Takes care of block ID generation upon addition
*	to the block list.
******/
function BlockList() {
	// blockList: used as a hashed array but is actually an object.
	// Holds all blocks. Access them by getBlock().
    this.blockList = {};
	// currIdNumsUsed remembers the last Id # generated for a specific block type.
	// This allows for quicker and easier Id generation. This does NOT reuse
	// numbers after a block is deleted.
    this.currIdNumsUsed = {};
    /*****
	*	resetListAndIdNums()
	*   Stops a running algorithm, then deletes the current block list and ID
    *   numbers used. Also deletes all blocks from the block list (GUI).
	******/
    this.resetListAndIdNums = function () {
        stopAlgorithm();
        this.blockList = {};
        this.currIdNumsUsed = {};
        $("ul#block-list li").remove();
    }
	/*****
	*	addBlock(block)
	*   Adds a block to the blockList object after generating
	*	an Id for it and setting the block to have that Id.
	*   Parameters:
	*   	block: the block object to add to blockList
	*	Returns the Id of the newly added block
	******/
	this.addBlock = function(block) {
		var id = this.generateIdForBlock(block.type);
		block.id = id;
		this.blockList[id] = block;
		return id;
	}
	/*****
	*	removeBlock(id)
	*   Removes a block from the blockList object with a 
	*	given id.
	*   Parameters:
	*   	id: the id of the block to remove
	******/
	this.removeBlock = function(id) {
		//var block = this.blockList[id]; // uncomment later if we need the block obj still
		delete this.blockList[id];
		//return block; // unneeded at this point, left for possible later needs
	}
	/*****
	*	generateIdForBlock(block)
	*   Generates an Id string for a given block type in
	*	format "blockType-idNumber"; does not reuse numbers
	*	that are no longer used in blockList after a block
	*	has been deleted.
	*   Parameters:
	*   	blockType: the block type to generate an Id for
	******/
	this.generateIdForBlock = function(blockType) { // todo: make this "private"
		// Get the most recently used number for the type of block
		var latestNumUsed = this.currIdNumsUsed[blockType];
		var idString = blockType + '-';
		// Now figure out the number to put after the hyphen.
		// If the latest number used is undefined, then we haven't generated an id
		// for this block type before.
		if (typeof latestNumUsed == "undefined" || latestNumUsed == null) {
			var num = 0;
			idString += num;
			this.currIdNumsUsed[blockType] = num;
		}
		else { 
			// Retrieve and increment the latest used number, then set it to var num
			var num = ++this.currIdNumsUsed[blockType];
			idString += num;
		}
		return idString;
	}
	/*****
	*	getBlock(id)
	*   Returns a block with a given id
	*   Parameters:
	*   	id: the id of the block to retrieve
	*	Returns the block object.
	******/
	this.getBlock = function(id) {
		return this.blockList[id];
	}
	/*****
	*	executeBlocks()
	*   Goes through the GUI list of block items in order,
	*	retreives the block id, and executes that block's algorithm/action.
	*	Each block's action only modifies the LightGrid object, not the GUI itself.
	******/
	this.executeBlocks = function() {
		var blockListObj = this; // have to redefine "this" [the block list object] since it changes in the .each
		$("ul#block-list li").each(function() {
			// "this" now refers to the li item
			var blockId = $(this).find("div").attr("id"); // "this" is now the li
			if (typeof blockId != "undefined") { // allows for sorting while algorithm runs
			    var block = blockListObj.getBlock(blockId);
				block.performAction();
			}
		});
	}
    /*****
	*	executeBlocksThroughId(id)
	*   Goes through the GUI list of block items in order up through block with given id,
	*	retreives the block id, and executes that block's algorithm/action.
	*	Each block's action only modifies the LightGrid object, not the GUI itself.
    *   Stops executing after executing block with the given id.
	******/
	this.executeBlocksThroughId = function (id) {
	    var blockListObj = this; // have to redefine "this" [the block list object] since it changes in the .each
	    $("ul#block-list li").each(function () {
	        // "this" now refers to the li item
	        var blockId = $(this).find("div").attr("id"); // "this" is now the li
	        if (typeof blockId != "undefined") { // allows for sorting while algorithm runs
	            var block = blockListObj.getBlock(blockId);
	            block.performAction();
	        }
	        if (blockId == id)
	            return false; // makes it stop looping (.each() feature since we can't do break;)
	    });
	    return false; // so the page doesn't refresh on the button click event (preview button)
	}
    /*****
	*	resetBlocks()
	*   Goes through the GUI list of block items in order,
	*	retreives the block id, and resets the block if necessary
	*	Pretty much only used by the move blocks at this point in time.
	******/
	this.resetBlocks = function () {
	    var blockListObj = this; // have to redefine "this" [the block list object] since it changes in the .each
	    $("ul#block-list li").each(function () {
	        // "this" now refers to the li item
	        var blockId = $(this).find("div").attr("id"); // "this" is now the li
	        if (typeof blockId != "undefined") { // allows for sorting while algorithm runs
	            var block = blockListObj.getBlock(blockId);
	            if (block.needsToReset)
	                block.reset();
	        }
	    });
	}
}

/*****
*	LightGrid class
*	Provides for a 2D array of light colors.
*	This class manipulates the GUI! Be forewarned!
******/
function LightGrid() {
	this.grid; // a 2D array of HTML color codes
	/*****
	*	initLightGrid()
	*   Initializes the 2D grid array by using the MAX_ROW global to
	* 	determine the size of each row and column.
	*	Sets each position to DEFAULT_BOX_COLOR.
	******/
	this.initLightGrid = function() {
		this.grid = new Array(MAX_ROW);
		for (var i = 0; i < MAX_ROW; i++) { // while still smaller than the grid sizes
			this.grid[i] = new Array(MAX_ROW); // init the 2D part of the array
			for (var j = 0; j < MAX_ROW; j++)
				this.grid[i][j] = DEFAULT_BOX_COLOR;
		}
	}
	/*****
	*	resetGrid()
	*   Sets every position of the grid to DEFAULT_BOX_COLOR.
	******/
	this.resetGrid = function() {
		for (var i = 0; i < MAX_ROW; i++) 
			for (var j = 0; j < MAX_ROW; j++)
			    this.grid[i][j] = DEFAULT_BOX_COLOR;
	}

    /*****
	*	checkBoundaries(rowIndex, columnIndex)
	*   Returns true if the parameters rowIndex and columnIndex
    *       are within the correct grid size for inserting in the array
    *   Returns false if it is outside these bounds
    *
    *	Parameters:
	*		rowIndex: index of the row in the grid to set
	*		columnIndex: index of the column in the grid to set
	******/
	function checkBoundaries(rowIndex, columnIndex) {
        // use row stuff since it is a number and these functions are sent numbers
	    if (rowIndex < (MIN_ROW - 1) || rowIndex > (MAX_ROW - 1) ||
            columnIndex < (MIN_ROW - 1) || columnIndex > (MAX_ROW - 1))
	        return false;
	    return true;
	}

	/*****
	*	setLocationToColor(rowIndex, columnIndex, color)
	*   Sets the specified square (row/column box) to the specified
	*	HTML color code.
	*	Future use: detect color changing and do any mixing as needed
	*	Parameters:
	*		rowIndex: index of the row in the grid to set (MUST BE AN INT)
	*		columnIndex: index of the column in the grid to set (MUST BE AN INT)
	*		color: the HTML color code to set in the row/column of the grid
	******/
	this.setLocationToColor = function(rowIndex, columnIndex, color) {
	    // This is where color mixing would be detected/happen!
	    if (checkBoundaries(rowIndex, columnIndex)) {
	        var currColorInLocation = this.getColorAtLocation(rowIndex, columnIndex);
	        if (COLOR_MIXING && !(currColorInLocation == DEFAULT_BOX_COLOR || currColorInLocation == "#444444")) {
	            var currColor = $.Color(currColorInLocation); // turn colors into jquery color objects for the mixer
	            var toMixColor = $.Color(color);
	            var resultColor = Color_mixer.mix(currColor, toMixColor); // mix the colors!
	            this.grid[rowIndex][columnIndex] = resultColor.toHexString();
	        }
	        else this.grid[rowIndex][columnIndex] = color;
	    }
	}
	/*****
	*	setLocationToColor(rowIndex, columnIndex, color)
	*   Returns the HTML color code at the row and column of the grid
	*	Parameters:
	*		rowIndex: index of the row in the grid to set (MUST BE AN INT)
	*		columnIndex: index of the column in the grid to set (MUST BE AN INT)
	******/
	this.getColorAtLocation = function (rowIndex, columnIndex) {
	    if (checkBoundaries(rowIndex, columnIndex))
	        return this.grid[rowIndex][columnIndex];
	    else return DEFAULT_BOX_COLOR; // "error"; we tried to check outside the boundaries
	}
	/*****
	*	paint()
	*   TOUCHES THE GUI. 
	*	This function takes the HTML color codes in the 2D grid array and
	*	paints each GUI square with that color.
	******/
	this.paint = function() { // touches the GUI!
		for (var i = 0; i < MAX_ROW; i++) {
			for (var j = 0; j < MAX_ROW; j++) {
				var column = String.fromCharCode(65+j);
				$("#"+column+(i+1)).attr("style", "background-color: " + this.grid[i][j]);
			}
		}
	}
	// The following calls the init function upon LightGrid object construction
	this.initLightGrid(); 
}

// In order to avoid an addBlock function for every type in index.js, we 
// put all of the blocks into a namespace so that they can be initialized
// by a string instead of via a long string of if/else.
// http://stackoverflow.com/questions/9803947/create-object-from-string
var blockNamespace = {};

/*****
*	Comparison [Block] class
*	A simple if block that adjusts a set of rows or columns
*	and performs one of three actions upon them in order to 
*	color the LightGrid.
*	Block template:
*		If row/column is [comparison] to/than [row/column], then [action].
******/
blockNamespace.Comparison = function ComparisonBlock() {
	this.type = "Comparison"; // type of block; same for every block of this type
	this.id = ''; // id of block generated by the BlockList
	this.comparisonAction = function() {showLightWriterMessage("Error: No action set " +
		+ "for block with id " + this.id);} // function to calculate rows/columns to color
	this.comparisonActionString = "None"; // so saving and loading will work; represents comp action
	this.rowOrColumnId; // row or column we are comparing against
	// action is the action function to perform and is an error until initialized
	this.action = function () { showLightWriterMessage("Error: No action set for block with id " + this.id); }
	this.actionString = "None"; // String representation of action so that saving/loading will work
	// performAction is what is called by the BlockList to perform the action.
	// BlockList does NOT call action() in case we need to do stuff before/after the action
	// takes place.
	this.performAction = function() { this.action() } 
	/*****
	*	setAction(action)
	*   Sets the action of this block to the specified action.
	*	Parameters:
	*		action: string of action for this block to perform
	******/
	this.setAction = function (action) {
	    this.actionString = action;
	    var blockSelector = "#" + this.id;
	    if (action == "setto") { // Set the row/columns to a specific color
	        this.action = this.setToColor;
	        // Find and show the setToColor box for this block
	        $(blockSelector).find("input.setToColor").removeClass("hidden");
	        $(blockSelector).find("a").show(); // show the color picker button
	        $(blockSelector).find("input.setToColor").focus(); // focus the box to make it look right w/color picker
	        $(blockSelector).find("input.setToColor").blur(); // unfocus the box so it doesn't look strange to the user via focus events
	    }
	    else {
	        // Find and hide the setToColor box for this block
	        $(blockSelector).find("input.setToColor").addClass("hidden");
	        $(blockSelector).find("a").hide(); // hide the color picker button
	        if (action == "remove")
	            this.action = this.removeColor;
	        else if (action == "randomize")
	            this.action = this.randomizeColor;
	    }
	}
	/*****
	*	setComparisonAction(comparisonAction)
	*   Sets the comparison action of this block to the specified comparison function.
	*	Parameters:
	*		comparisonAction: string of comparison for this block to use
	*			when finding which rows/columns to adjust
	******/
	this.setComparisonAction = function (comparisonAction) {
	    this.comparisonActionString = comparisonAction;
		if (comparisonAction == "<=")
			this.comparisonAction = gridLessEqual;
		else if (comparisonAction == "<")
			this.comparisonAction = gridLess;
		else if (comparisonAction == "=")
			this.comparisonAction = gridEqual;
		else if (comparisonAction == ">")
			this.comparisonAction = gridGreater;
		else if (comparisonAction == ">=")
			this.comparisonAction = gridGreaterEqual;
	}
	/*****
	*	removeColor()
	*  	Performs the remove color function for this block. The remove color
	*	function sets each appropriate row and column to DEFAULT_BOX_COLOR.
	******/
	this.removeColor = function() {
	    var rowsOrColumnsToAdjust = this.comparisonAction(this.rowOrColumnId);
	    for (var i = 0; i < rowsOrColumnsToAdjust.length; i++) {
	        var rowOrColumnToAdjust = rowsOrColumnsToAdjust[i];
	        setGridRowOrColumnToColor(rowOrColumnToAdjust, DEFAULT_BOX_COLOR);
	    }
	}
	/*****
	*	randomizeColor()
	*  	Performs the random color function for this block. The random color
	*	function sets each appropriate row and column to the same random color.
	*	The random color is recalculated upon every call to this function.
	******/
	this.randomizeColor = function() {
		var rowsOrColumnsToAdjust = this.comparisonAction(this.rowOrColumnId);
		var color = getRandomColor();
		for (var i = 0; i < rowsOrColumnsToAdjust.length; i++) {
		    var rowOrColumnToAdjust = rowsOrColumnsToAdjust[i];
		    setGridRowOrColumnToColor(rowOrColumnToAdjust, color);
		}
	}
	/*****
	*	setToColor()
	*  	Performs the set to color function for this block. The set to color
	*	function sets each appropriate row and column to the same user-specified
	*	color. If the HTML color code provided by the user is invalid, then the
	*	block sets those rows and columns to DEFAULT_BOX_COLOR and highlights
	*	the poorly-formatted box in red (ui-state-error, jquery UI css).
	******/
	this.setToColor = function() {
		var rowsOrColumnsToAdjust = this.comparisonAction(this.rowOrColumnId);
		var color = $("#"+this.id).find("input.setToColor").val();
		if (!isValidColor(color)) { // is the HTML color code valid?
			color = DEFAULT_BOX_COLOR;
			$("#"+this.id).find("input.setToColor").addClass("ui-state-error");
		}
		else 
		    $("#" + this.id).find("input.setToColor").removeClass("ui-state-error");
	    for (var i = 0; i < rowsOrColumnsToAdjust.length; i++) {
	        var rowOrColumnToAdjust = rowsOrColumnsToAdjust[i];
	        setGridRowOrColumnToColor(rowOrColumnToAdjust, color);
	    }
	}
	// Initializing functions for this block follow. These make the block's
	// initial state match the HTML's initial state.
	this.constructObject = function () {
	    this.setAction("randomize");
	    this.setComparisonAction('=');
	    this.rowOrColumnId = 'A'; // row or column we are comparing against
	}
	this.constructObject(); // call the constructor
}

/*****
*	Range Block
*	A simple range block that adjusts a set of rows or columns
*	and performs one of three actions upon them in order to 
*	color the LightGrid. 
*	Block template:
*		Between [row/column] and [row/column], perform
*           action: [action]
******/
blockNamespace.Range = function RangeBlock() {
	this.type = "Range"; // type of block; same for every block of this type
	this.id = ''; // id of block generated by the BlockList
	this.leftRowOrColumnId; // left select box for row or column
	this.rightRowOrColumnId; // right select box for row or column
	// action is the action function to perform and is an error until initialized
	this.action = function() {showLightWriterMessage("Error: No action set for block with id " + this.id);}
	// performAction is what is called by the BlockList to perform the action.
	// BlockList does NOT call action() in case we need to do stuff before/after the action
    // takes place.
	this.needsToReset = false; // Doesn't need to reset after the timer stops
	this.actionString = "None"; // String representation of action so that saving/loading will work
	this.performAction = function() { this.action() } 
	/*****
	*	setAction(action)
	*   Sets the action of this block to the specified action.
	*	Parameters:
	*		action: string of action for this block to perform
	******/
	this.setAction = function (action) {
	    this.actionString = action;
	    var blockSelector = "#" + this.id;
	    if (action == "setto") { // Set the row/columns to a specific color
	        this.action = this.setToColor;
	        // Find and show the setToColor box for this block
	        $(blockSelector).find("input.setToColor").removeClass("hidden");
	        $(blockSelector).find("a").show(); // show the color picker button
	        $(blockSelector).find("input.setToColor").focus(); // focus the box to make it look right w/color picker
	        $(blockSelector).find("input.setToColor").blur(); // unfocus the box so it doesn't look strange to the user via focus events

	    }
	    else {
	        // Find and hide the setToColor box for this block
	        $(blockSelector).find("input.setToColor").addClass("hidden");
	        $(blockSelector).find("a").hide(); // hide the color picker button
	        if (action == "remove")
	            this.action = this.removeColor;
	        else if (action == "randomize")
	            this.action = this.randomizeColor;
	    }
	}
    /*****
	*	setLeftRowOrColumnId()
	*   Sets the left selector row or column Id.
	******/
	this.setLeftRowOrColumnId = function (leftRowOrColumnId) {
	    this.leftRowOrColumnId = leftRowOrColumnId;
	}
    /*****
	*	setRightRowOrColumnId()
	*   Sets the right selector row or column Id.
	******/
	this.setRightRowOrColumnId = function (rightRowOrColumnId) {
	    this.rightRowOrColumnId = rightRowOrColumnId;
	}
	/*****
	*	getRowsOrColumnsForRange()
	*   Retrieves the sets of rows or columns that the user wants to have in their
	*		range.
	******/
	this.getRowsOrColumnsForRange = function () {
	    var rowsOrColumns = [];
	    var leftSelectVal = this.leftRowOrColumnId;
	    var rightSelectVal = this.rightRowOrColumnId;
	    var amWorkingWithRows;
	    if (isVariableANumber(leftSelectVal) && isVariableANumber(rightSelectVal))
	        amWorkingWithRows = true;
	    else if (!isVariableANumber(leftSelectVal) && !isVariableANumber(rightSelectVal))
	        amWorkingWithRows = false;
	    else return []; // User selected 1 row and 1 column! Invalid input! Return [].
	    while (leftSelectVal != rightSelectVal) { // add all rows/columns up to the rightSelectVal
	        rowsOrColumns.push(leftSelectVal);
	        if (amWorkingWithRows)
	            leftSelectVal = moveRowNumberDown(leftSelectVal, 1);
	        else
	            leftSelectVal = moveColumnLetterRight(leftSelectVal, 1);
	    }
	    rowsOrColumns.push(rightSelectVal); // get the last row/column to paint
	    return rowsOrColumns;
	}
	// The action functions will cause the block selectors to be highlighted in
	// red if the user puts in bad input.
	/*****
	*	randomizeColor()
	*  	Performs the random color function for this block. The random color
	*	function sets each appropriate row and column to the same random color.
	*	The random color is recalculated upon every call [tick] to this function.
	******/
	this.randomizeColor = function() {
		// Figure out if comparisons are valid
		var rowsOrColumnsToAdjust = this.getRowsOrColumnsForRange();
		if (rowsOrColumnsToAdjust.length) {
			this.removeRangeIntoVisibleErrorState();
			// Get the random color
			var color = getRandomColor();
		    // Set the grid to the color if the comparisons were valid
			for (var i = 0; i < rowsOrColumnsToAdjust.length; i++) {
			    var rowOrColumnToAdjust = rowsOrColumnsToAdjust[i];
			    setGridRowOrColumnToColor(rowOrColumnToAdjust, color);
			}
		}
		else
			this.setRangeIntoVisibleErrorState();
	}
	/*****
	*	removeColor()
	*  	Performs the remove color function for this block. The remove color
	*	function sets each appropriate row and column to DEFAULT_BOX_COLOR.
	******/
	this.removeColor = function() {
		// Figure out if comparisons are valid
		var rowsOrColumnsToAdjust = this.getRowsOrColumnsForRange();
		if (rowsOrColumnsToAdjust.length) {
			this.removeRangeIntoVisibleErrorState();
		    // Set the grid to the color if the comparisons were valid
			for (var i = 0; i < rowsOrColumnsToAdjust.length; i++) {
			    var rowOrColumnToAdjust = rowsOrColumnsToAdjust[i];
			    setGridRowOrColumnToColor(rowOrColumnToAdjust, DEFAULT_BOX_COLOR);
			}
		}
		else
			this.setRangeIntoVisibleErrorState();
	}
	/*****
	*	setToColor()
	*  	Performs the set to color function for this block. The set to color
	*	function sets each appropriate row and column to the same user-specified
	*	color. If the HTML color code provided by the user is invalid, then the
	*	block sets those rows and columns to DEFAULT_BOX_COLOR and highlights
	*	the poorly-formatted box in red (ui-state-error, jquery UI css).
	******/
	this.setToColor = function() {
		var rowsOrColumnsToAdjust = this.getRowsOrColumnsForRange();
		var color = $("#"+this.id).find("input.setToColor").val();
		if (rowsOrColumnsToAdjust.length) {
			this.removeRangeIntoVisibleErrorState();
			if (!isValidColor(color)) { // is the HTML color code valid?
				color = DEFAULT_BOX_COLOR;
				$("#"+this.id).find("input.setToColor").addClass("ui-state-error");
			}
			else 
			    $("#" + this.id).find("input.setToColor").removeClass("ui-state-error");
            for (var i = 0; i < rowsOrColumnsToAdjust.length; i++) {
                var rowOrColumnToAdjust = rowsOrColumnsToAdjust[i];
                setGridRowOrColumnToColor(rowOrColumnToAdjust, color);
            }
		}
		else
			this.setRangeIntoVisibleErrorState();
	}
	/*****
	*	setRangeIntoVisibleErrorState()
	*  	Sets the comparison range block into a visible error state by
	*		setting each selector and input in the block to ui-state-error,
	*		which highlights those elements in red.
	******/
	this.setRangeIntoVisibleErrorState = function() {
	    $("#" + this.id).find(".columnrow").addClass("ui-state-error");
	}
	/*****
	*	removeRangeIntoVisibleErrorState()
	*  	Removes any ui-state-error class on the blocks select or input
	*		blocks so that they won't be highlighted in red.
	******/
	this.removeRangeIntoVisibleErrorState = function() {
	    $("#" + this.id).find(".columnrow").removeClass("ui-state-error");
	}
    /*****
	*	constructObject()
	*  	 Initialization calls that happen when the block is created (to reflect the HTML)
	******/
	this.constructObject = function () {
	    this.setAction("randomize");
	    this.setLeftRowOrColumnId('A'); // left select box for row or column
	    this.setRightRowOrColumnId('B'); // right select box for row or column
	}
	this.constructObject();
}


/*****
*	SingleBlock class
*	A simple block that adjusts a single square
*	and performs one of three actions upon them in order to 
*	color the LightGrid.
*	Block template:
*		Set [row][column] square to [action].
******/
blockNamespace.SingleBlock = function SingleBlock() {
    this.type = "SingleBlock"; // type of block; same for every block of this type
    this.id = ''; // id of block generated by the BlockList
    // action is the action function to perform and is an error until initialized
    this.action = function () { showLightWriterMessage("Error: No action set for block with id " + this.id); }
    this.actionString = "None"; // String representation of action so that saving/loading will work
    // performAction is what is called by the BlockList to perform the action.
    // BlockList does NOT call action() in case we need to do stuff before/after the action
    // takes place.
    this.needsToReset = false; // Doesn't need to reset after a the timer stops
    this.performAction = function () { this.action() }
    /*****
	*	setAction()
	*   Sets the action of this block to the specified action.
	*	Parameters:
	*		action: string of action for this block to perform
	******/
    this.setAction = function (action) {
        this.actionString = action;
        var blockSelector = "#" + this.id;
        if (action == "setto") { // Set the row/columns to a specific color
            this.action = this.setToColor;
            // Find and show the setToColor box for this block
            $(blockSelector).find("input.setToColor").removeClass("hidden");
            $(blockSelector).find("a").show(); // show the color picker button
            $(blockSelector).find("input.setToColor").focus(); // focus the box to make it look right w/color picker
            $(blockSelector).find("input.setToColor").blur(); // unfocus the box so it doesn't look strange to the user via focus events
        }
        else {
            // Find and hide the setToColor box for this block
            $(blockSelector).find("input.setToColor").addClass("hidden");
            $(blockSelector).find("a").hide(); // hide the color picker button
            if (action == "remove")
                this.action = this.removeColor;
            else if (action == "randomize")
                this.action = this.randomizeColor;
        }
    }

    /*****
	*	removeColor()
	*  	Performs the remove color function for this block. The remove color
	*	function sets each appropriate row and column to DEFAULT_BOX_COLOR.
	******/
    this.removeColor = function () {
        var rowId = this.rowId;
        var columnId = this.columnId
        setGridSquareToColor(rowId, columnId, DEFAULT_BOX_COLOR);
    }
    /*****
	*	randomizeColor()
	*  	Performs the random color function for this block. The random color
	*	function sets each appropriate row and column to the same random color.
	*	The random color is recalculated upon every call to this function.
	******/
    this.randomizeColor = function () {
        var rowId = this.rowId;
        var columnId = this.columnId
        var color = getRandomColor();
        setGridSquareToColor(rowId, columnId, color);
    }
    /*****
	*	setToColor()
	*  	Performs the set to color function for this block. The set to color
	*	function sets each appropriate row and column to the same user-specified
	*	color. If the HTML color code provided by the user is invalid, then the
	*	block sets those rows and columns to DEFAULT_BOX_COLOR and highlights
	*	the poorly-formatted box in red (ui-state-error, jquery UI css).
	******/
    this.setToColor = function () {
        var rowId = this.rowId;
        var columnId = this.columnId;
        var color = $("#" + this.id).find("input.setToColor").val();
        if (!isValidColor(color)) { // is the HTML color code valid?
            color = DEFAULT_BOX_COLOR;
            $("#" + this.id).find("input.setToColor").addClass("ui-state-error");
        }
        else
            $("#" + this.id).find("input.setToColor").removeClass("ui-state-error");
        setGridSquareToColor(rowId, columnId, color);
    }
    /*****
	*	constructObject()
	*  	Initialization calls that happen when the block is created (to reflect the HTML)
	******/
    this.constructObject = function () {
        this.setAction("randomize");
        this.rowId = '1';
        this.columnId = 'A';
    }
    this.constructObject();
}

/*****
*	CircleBlock class
*	A simple block that adjusts a single square
*	and performs one of three actions upon them in order to 
*	color the LightGrid.
*	Block template:
*		Set [row][column] square to [action].
******/
blockNamespace.CircleBlock = function CircleBlock() {
    this.type = "CircleBlock"; // type of block; same for every block of this type
    this.id = ''; // id of block generated by the BlockList
    // action is the action function to perform and is an error until initialized
    this.action = function () { showLightWriterMessage("Error: No action set for block with id " + this.id); }
    this.actionString = "None"; // For usage by the saving/loading functions
    // performAction is what is called by the BlockList to perform the action.
    // BlockList does NOT call action() in case we need to do stuff before/after the action
    // takes place.
    this.needsToReset = false; // Doesn't need to reset after a the timer stops
    this.performAction = function () { this.action() }
    /*****
	*	setAction()
	*   Sets the action of this block to the specified action.
	*	Parameters:
	*		action: string of action for this block to perform
	******/
    this.setAction = function (action) {
        this.actionString = action;
        var blockSelector = "#" + this.id;
        if (action == "setto") { // Set the row/columns to a specific color
            this.action = this.setToColor;
            // Find and show the setToColor box for this block
            $(blockSelector).find("input.setToColor").removeClass("hidden");
            $(blockSelector).find("a").show(); // show the color picker button
            $(blockSelector).find("input.setToColor").focus(); // focus the box to make it look right w/color picker
            $(blockSelector).find("input.setToColor").blur(); // unfocus the box so it doesn't look strange to the user via focus events
        }
        else {
            // Find and hide the setToColor box for this block
            $(blockSelector).find("input.setToColor").addClass("hidden");
            $(blockSelector).find("a").hide(); // hide the color picker button
            if (action == "remove")
                this.action = this.removeColor;
            else if (action == "randomize")
                this.action = this.randomizeColor;
        }
    }

    /*****
	*	removeColor()
	*  	Performs the remove color function for this block. The remove color
	*	function sets each appropriate row and column to DEFAULT_BOX_COLOR.
	******/
    this.removeColor = function () {
        var rowId = this.rowId;
        var columnId = this.columnId;
        var radius = this.radius;
        setGridCircleToColor(rowId, columnId, radius, DEFAULT_BOX_COLOR);
    }
    /*****
	*	randomizeColor()
	*  	Performs the random color function for this block. The random color
	*	function sets each appropriate row and column to the same random color.
	*	The random color is recalculated upon every call to this function.
	******/
    this.randomizeColor = function () {
        var rowId = this.rowId;
        var columnId = this.columnId;
        var radius = this.radius;
        var color = getRandomColor();
        setGridCircleToColor(rowId, columnId, radius, color);
    }
    /*****
	*	setToColor()
	*  	Performs the set to color function for this block. The set to color
	*	function sets each appropriate row and column to the same user-specified
	*	color. If the HTML color code provided by the user is invalid, then the
	*	block sets those rows and columns to DEFAULT_BOX_COLOR and highlights
	*	the poorly-formatted box in red (ui-state-error, jquery UI css).
	******/
    this.setToColor = function () {
        var rowId = this.rowId;
        var columnId = this.columnId;
        var radius = this.radius;
        var color = $("#" + this.id).find("input.setToColor").val();
        if (!isValidColor(color)) { // is the HTML color code valid?
            color = DEFAULT_BOX_COLOR;
            $("#" + this.id).find("input.setToColor").addClass("ui-state-error");
        }
        else
            $("#" + this.id).find("input.setToColor").removeClass("ui-state-error");
        setGridCircleToColor(rowId, columnId, radius, color);
    }
    /*****
	*	constructObject()
	*  	Initialization calls that happen when the block is created (to reflect the HTML)
	******/
    this.constructObject = function () {
        this.setAction("randomize");
        this.rowId = '1';
        this.columnId = 'A';
        this.radius = '1';
    }
    this.constructObject();
}

//////////// Move blocks start here

/*****
*	Single Move [Block] class
*	This block inherits all properties and classes of the SingleBlock class, 
*   which is part of the blockNamespace.
*   This block type is more advanced and allows users to make a single block
*   that "moves" across the grid on every user-designated amount of ticks.
*	Block template:
*		Start at [row][column] with color [action dropdown] and move 
*       [up/down/left/right] [x blocks] every [y] ticks
******/
blockNamespace.SingleMove = function () {
    this.type = "SingleMoveBlock";
    // The following 3 items are initialized to the same state as the HTML (aspx)
    this.direction = "up"; // direction to move on conditional change
    this.numberBlocksToMove = 1; // number of blocks to move on conditional change
    this.numberTicksBeforeChange = 1; // number of ticks to count up to before changing the single block location
    this.ticksCounted = 0; // number of ticks we have counted in order to reach numberTicksBeforeChange
    this.needsToReset = true; // This block needs to reset its values after the user stops the light show
    this.initialRowId = '1'; // The initial row ID for the block before any ticks have happened
    this.initialColumnId = 'A'; // The initial column ID for the block before any ticks have happened
    /*****
	*	reset()
	*   Resets the block after the user has stopped algorithm execution.
    *   Sets ticks counted to 0 and reinitializes rowID and columnID;
	******/
    this.reset = function () {
        this.ticksCounted = 0;
        this.rowId = this.initialRowId;
        this.columnId = this.initialColumnId;
    }
    /*****
	*	performAction()
	*   Not only takes the user action (remove/set/randomize color), but also determines if it
    *   is time to change the row and column Ids for this block since it is a move block.
    *   Determines changes AFTER an action has taken place instead of before. Thus, the
    *   block is set up to take the correct action on the next iteration of algorithm
    *   execution.
	******/
    this.performAction = function () {
        this.action();
        this.ticksCounted++; // + 1 the number of actions taken
        if (this.ticksCounted == this.numberTicksBeforeChange) {
            this.changeConditional(); //change the conditional for the next block action iteration
            this.ticksCounted = 0; // reset tick count
        }
    }
    /*****
	*	setRowId()
	*   Sets the rowId and initialRowId to rowId
	******/
    this.setRowId = function (rowId) {
        this.rowId = rowId;
        this.initialRowId = rowId;
    }
    /*****
	*	setColumnId()
	*   Sets the columnId and initialColumnId to columnId
	******/
    this.setColumnId = function (columnId) {
        this.columnId = columnId;
        this.initialColumnId = columnId;
    }
    /*****
	*	changeConditional()
	*   Changes the column/row conditional for this moving block, as determined by
    *   the direction, row/column Id, and the number of blocks to move.
	******/
    this.changeConditional = function () {
        if (this.direction == "up") // Subtracting from the row number
            this.rowId = moveRowNumberUp(this.rowId, this.numberBlocksToMove);
        else if (this.direction == "down") // Adding to the row number
            this.rowId = moveRowNumberDown(this.rowId, this.numberBlocksToMove);
        else if (this.direction == "left") // "Subtracting" from the ASCII column value
            this.columnId = moveColumnLetterLeft(this.columnId, this.numberBlocksToMove);
        else if (this.direction == "right") // "Adding" to the ASCII column value 
            this.columnId = moveColumnLetterRight(this.columnId, this.numberBlocksToMove);
        else if (this.direction == "up-left") { // Diagonal up + left
            this.rowId = moveRowNumberUp(this.rowId, this.numberBlocksToMove);
            this.columnId = moveColumnLetterLeft(this.columnId, this.numberBlocksToMove);
        }
        else if (this.direction == "up-right") { // Diagonal up + right
            this.rowId = moveRowNumberUp(this.rowId, this.numberBlocksToMove);
            this.columnId = moveColumnLetterRight(this.columnId, this.numberBlocksToMove);
        }
        else if (this.direction == "down-left") { // Diagonal down + left
            this.rowId = moveRowNumberDown(this.rowId, this.numberBlocksToMove);
            this.columnId = moveColumnLetterLeft(this.columnId, this.numberBlocksToMove);
        }
        else if (this.direction == "down-right") {// Diagonal down + right
            this.rowId = moveRowNumberDown(this.rowId, this.numberBlocksToMove);
            this.columnId = moveColumnLetterRight(this.columnId, this.numberBlocksToMove);
        }
    }
    this.constructObject(); // get the "this" variables from the SingleBlock
}
blockNamespace.SingleMove.prototype = new blockNamespace.SingleBlock; // allows for inheritance from previously established blocks

/*****
*	Range Move [Block] class
*	This block inherits all properties and classes of the Comparison class, 
*   which is part of the blockNamespace.
*   This block type is more advanced and allows users to make a comparison block
*   that "moves" the column/row conditional across the grid on every user-designated amount of ticks.
*	Block template:
*		If row/column is [comparison] to/than [row/column], then [action]. Move
*           [up/down/left/right] [#] blocks every [#] tick(s).
******/
blockNamespace.ComparisonMove = function () {
    this.type = "ComparisonMoveBlock";
    // The following 3 items are initialized to the same state as the HTML (aspx)
    this.direction = "right"; // direction to move on conditional change
    this.numberBlocksToMove = 1; // number of blocks to move on conditional change
    this.numberTicksBeforeChange = 1; // number of ticks to count up to before changing the single block location
    this.ticksCounted = 0; // number of ticks we have counted in order to reach numberTicksBeforeChange
    this.needsToReset = true; // This block needs to reset its values after the user stops the light show
    this.initialRowOrColumnId = 'A'; // The initial row/column ID for the block before any ticks have happened
    /*****
	*	reset()
	*   Resets the block after the user has stopped algorithm execution.
    *   Sets ticks counted to 0 and reinitializes rowID and columnID;
	******/
    this.reset = function () {
        this.ticksCounted = 0;
        this.rowOrColumnId = this.initialRowOrColumnId;
    }
    /*****
	*	performAction()
	*   Not only takes the user action (remove/set/randomize color), but also determines if it
    *   is time to change the row and column Ids for this block since it is a move block.
    *   Determines changes AFTER an action has taken place instead of before. Thus, the
    *   block is set up to take the correct action on the next iteration of algorithm
    *   execution.
	******/
    this.performAction = function () {
        this.action();
        this.ticksCounted++; // + 1 the number of actions taken
        if (this.ticksCounted == this.numberTicksBeforeChange) {
            this.changeConditional(); //change the conditional for the next block action iteration
            this.ticksCounted = 0; // reset tick count
        }
    }
    /*****
	*	setRowId()
	*   Sets the rowId and initialRowId to rowId
	******/
    this.setRowOrColumnId = function (rowOrColumnId) {
        this.rowOrColumnId = rowOrColumnId;
        this.initialRowOrColumnId = rowOrColumnId;
    }
    /*****
	*	changeConditional()
	*   Changes the column/row conditional for this moving block, as determined by
    *   the direction, row/column Id, and the number of blocks to move.
	******/
    this.changeConditional = function () {
        var wasUserInputGood = true;
        if (isVariableANumber(this.rowOrColumnId)) { // messing with rows, can move up or down
            if (this.direction == "up") // Subtracting from the row number
                this.rowOrColumnId = moveRowNumberUp(this.rowOrColumnId, this.numberBlocksToMove);
            else if (this.direction == "down") // Adding to the row number
                this.rowOrColumnId = moveRowNumberDown(this.rowOrColumnId, this.numberBlocksToMove);
            else wasUserInputGood = false;
        }
        else { // messing with columns
            if (this.direction == "left") // "Subtracting" from the ASCII column value
                this.rowOrColumnId = moveColumnLetterLeft(this.rowOrColumnId, this.numberBlocksToMove);
            else if (this.direction == "right") // "Adding" to the ASCII column value 
                this.rowOrColumnId = moveColumnLetterRight(this.rowOrColumnId, this.numberBlocksToMove);
            else wasUserInputGood = false;
        }
        if (!wasUserInputGood) { // user input error, highlight bad boxes
            $("div#" + this.id).find(".move-direction").addClass("ui-state-error");
        }
        else {
            $("div#" + this.id).find(".move-direction").removeClass("ui-state-error");
        }
    }
    this.constructObject(); // get the "this" variables from the Comparison Block
}
blockNamespace.ComparisonMove.prototype = new blockNamespace.Comparison; // allows for inheritance from previously established blocks

/*****
*	Range [Block] class
*	A simple range block that adjusts a set of rows or columns
*	and performs one of three actions upon them in order to 
*	color the LightGrid. 
*	Block template:
*		Between [row/column] and [row/column], perform
*           action: [action]. Move [up/down/left/right]
*           [#] rows/columns every [#] tick(s).
******/
blockNamespace.RangeMove = function RangeMoveBlock() {
    this.type; // type of block; same for every block of this type

    this.direction; // direction to move on conditional change
    this.numberBlocksToMove; // number of blocks to move on conditional change
    this.numberTicksBeforeChange; // number of ticks to count up to before changing the single block location
    this.ticksCounted; // number of ticks we have counted in order to reach numberTicksBeforeChange
    this.needsToReset; // This block needs to reset its values after the user stops the light show
    this.initialLeftRowOrColumnId; // The initial left row/column ID for the block before any ticks have happened
    this.initialRightRowOrColumnId; // The initial right row/column ID for the block before any ticks have happened
    /*****
	*	reset()
	*   Resets the block after the user has stopped algorithm execution.
    *   Sets ticks counted to 0 and reinitializes rowID and columnID;
	******/
    this.reset = function () {
        this.ticksCounted = 0;
        this.leftRowOrColumnId = this.initialLeftRowOrColumnId;
        this.rightRowOrColumnId = this.initialRightRowOrColumnId;
    }
    /*****
	*	performAction()
	*   Not only takes the user action (remove/set/randomize color), but also determines if it
    *   is time to change the row and column Ids for this block since it is a move block.
    *   Determines changes AFTER an action has taken place instead of before. Thus, the
    *   block is set up to take the correct action on the next iteration of algorithm
    *   execution.
	******/
    this.performAction = function () {
        this.action();
        this.ticksCounted++; // + 1 the number of actions taken
        if (this.ticksCounted == this.numberTicksBeforeChange) {
            this.changeConditional(); //change the conditional for the next block action iteration
            this.ticksCounted = 0; // reset tick count
        }
    }
    /*****
	*	setLeftRowOrColumnId()
	*   Sets the left selector row or column Id.
	******/
    this.setLeftRowOrColumnId = function (leftRowOrColumnId) {
        this.leftRowOrColumnId = leftRowOrColumnId;
        this.initialLeftRowOrColumnId = leftRowOrColumnId;
    }
    /*****
	*	setRightRowOrColumnId()
	*   Sets the right selector row or column Id.
	******/
    this.setRightRowOrColumnId = function (rightRowOrColumnId) {
        this.rightRowOrColumnId = rightRowOrColumnId;
        this.initialRightRowOrColumnId = rightRowOrColumnId;
    }
    /*****
	*	changeConditional()
	*   Changes the column/row conditional for this moving block, as determined by
    *   the direction, row/column Id, and the number of blocks to move.
	******/
    this.changeConditional = function () {
        var wasUserInputGood = true;
        var amWorkingWithRows;
        // Make sure both left & right selectors are the same type [both row or both column]
        if (isVariableANumber(this.leftRowOrColumnId) && isVariableANumber(this.rightRowOrColumnId))
            amWorkingWithRows = true;
        else if (!isVariableANumber(this.leftRowOrColumnId) && !isVariableANumber(this.rightRowOrColumnId))
            amWorkingWithRows = false;
        else return; // nothing else for this function to do since the input is bad
        if (amWorkingWithRows && wasUserInputGood) { // messing with rows, can move up or down
            if (this.direction == "up") { // Subtracting from the row number
                this.leftRowOrColumnId = moveRowNumberUp(this.leftRowOrColumnId, this.numberBlocksToMove);
                this.rightRowOrColumnId = moveRowNumberUp(this.rightRowOrColumnId, this.numberBlocksToMove);
            }
            else if (this.direction == "down") { // Adding to the row number
                this.leftRowOrColumnId = moveRowNumberDown(this.leftRowOrColumnId, this.numberBlocksToMove);
                this.rightRowOrColumnId = moveRowNumberDown(this.rightRowOrColumnId, this.numberBlocksToMove);
            }
            else wasUserInputGood = false;
        }
        else if (wasUserInputGood) { // messing with columns
            if (this.direction == "left") { // "Subtracting" from the ASCII column value
                this.leftRowOrColumnId = moveColumnLetterLeft(this.leftRowOrColumnId, this.numberBlocksToMove);
                this.rightRowOrColumnId = moveColumnLetterLeft(this.rightRowOrColumnId, this.numberBlocksToMove);
            }
            else if (this.direction == "right") { // "Adding" to the ASCII column value 
                this.leftRowOrColumnId = moveColumnLetterRight(this.leftRowOrColumnId, this.numberBlocksToMove);
                this.rightRowOrColumnId = moveColumnLetterRight(this.rightRowOrColumnId, this.numberBlocksToMove);
            }
            else wasUserInputGood = false;
        }
        if (!wasUserInputGood) { // user input error, highlight bad boxes
            $("div#" + this.id).find(".move-direction").addClass("ui-state-error");
        }
        else {
            $("div#" + this.id).find(".move-direction").removeClass("ui-state-error");
        }
    }
    /*****
	*	constructObject()
	*  	Initialization calls that happen when the block is created (to reflect the HTML and init the block)
	******/
    this.constructInheritedObject = function () {
        this.type = "RangeMove";
        this.direction = "right";
        this.numberBlocksToMove = 1; 
        this.numberTicksBeforeChange = 1; 
        this.ticksCounted = 0; 
        this.needsToReset = true; 
        this.initialLeftRowOrColumnId = 'A'; 
        this.initialRightRowOrColumnId = 'B';
    }
    this.constructObject(); // call the "super" constructor [aka the Range block's constructor]
    this.constructInheritedObject(); // call this object's constructor 
    // Yes, this is horribly broken and needs to be revised, but we don't have time for that this semester.
    // TODO.txt has a link with how to do proper JS inheritance.
}
blockNamespace.RangeMove.prototype = new blockNamespace.Range; // allows for inheritance from previously established blocks

///////// Move blocks end here

blockNamespace.Comment = function CommentBlock() {
    this.type = "Comment"; // type of block; same for every block of this type
    this.id = ''; // id of block generated by the BlockList
    // action is the action function to perform and is an error until initialized
    this.action = function () { showLightWriterMessage("Error: No action set for block with id " + this.id); }
    this.needsToReset = false; // Doesn't need to reset after a the timer stops
    this.performAction = function () { } // no action
}

/*****
*	isVariableANumber(variable)
*   Checks to see whether a variable is a number or not.
*   Parameters:
*       variable: The variable to check
*   Returns true if the variable is a number; false otherwise
******/
function isVariableANumber(variable) {
    /*if (typeof variable == "number")
        return true;
    else if (!isNaN(parseInt(variable)))
        return true;
    return false;
    */
    if (isNaN(parseInt(variable))) // List is full of columns [letters]
        return false;
    return true;
}

/*****
*	moveRowNumberUp(initialRowNum, amountToMove)
*   Moves a row number "up" amountToMove blocks and "wraps" around
*   the grid when it needs to. Stays within MIN_ROW and MAX_ROW
*   boundaries.
*   Parameters:
*       initialRowNum: The initial row number to change
*       amountToMove: The number of blocks up to move
*   Returns the new row number after the "move"
******/
function moveRowNumberUp(initialRowNum, amountToMove) {
    var rowNum = parseInt(initialRowNum);
    var numBlocksToMove = parseInt(amountToMove);
    rowNum -= numBlocksToMove;
    if (rowNum < MIN_ROW) // Can't have a row # less than MIN_ROW!
        return MAX_ROW - Math.abs(rowNum);
    else return rowNum;
}

/*****
*	moveRowNumberDown(initialRowNum, amountToMove)
*   Moves a row number "down" amountToMove blocks and "wraps" around
*   the grid when it needs to. Stays within MIN_ROW and MAX_ROW
*   boundaries.
*   Parameters:
*       initialRowNum: The initial row number to change
*       amountToMove: The number of blocks down to move
*   Returns the new row number after the "move"
******/
function moveRowNumberDown(initialRowNum, amountToMove) {
    var rowNum = parseInt(initialRowNum);
    var numBlocksToMove = parseInt(amountToMove);
    rowNum += numBlocksToMove;
    if (rowNum > MAX_ROW)
        return (rowNum % MAX_ROW);
    else return rowNum;
}

/*****
*	moveColumnLetterRight(initialColumnLetter, amountToMove)
*   Moves a column letter "right" amountToMove blocks and "wraps" around
*   the grid when it needs to. Stays within MIN_COLUMN and MAX_COLUMN
*   boundaries.
*   Parameters:
*       initialColumnLetter: The initial column number to change
*       amountToMove: The number of blocks right to move
*   Returns the new column letter after the "move"
******/
function moveColumnLetterRight(initialColumnLetter, amountToMove) {
    var column = asciiVal(initialColumnLetter); // get the ASCII value of the column
    var numBlocksToMove = parseInt(amountToMove);
    var nextColumn = column + numBlocksToMove;
    if (nextColumn > asciiVal(MAX_COLUMN)) { // less than 65 (A)
        nextColumn -= asciiVal(MAX_COLUMN) + 1; // Get the number to add to MIN_COLUMN to find the next column letter
        var minAsciiVal = asciiVal(MIN_COLUMN);
        return asciiToString(minAsciiVal + nextColumn);
    }
    else return asciiToString(nextColumn);
}

/*****
*	moveColumnLetterLeft(initialColumnLetter, amountToMove)
*   Moves a column letter "left" amountToMove blocks and "wraps" around
*   the grid when it needs to. Stays within MIN_COLUMN and MAX_COLUMN
*   boundaries.
*   Parameters:
*       initialColumnLetter: The initial column number to change
*       amountToMove: The number of blocks left to move
*   Returns the new column letter after the "move"
******/
function moveColumnLetterLeft(initialColumnLetter, amountToMove) {
    var column = asciiVal(initialColumnLetter); // get the ASCII value of the column
    var numBlocksToMove = parseInt(amountToMove);
    var nextColumn = column - numBlocksToMove;
    if (nextColumn < asciiVal(MIN_COLUMN)) { // less than 65 (A)
        nextColumn -= (asciiVal(MIN_COLUMN) - 1); // Get the number to subtract from MAX_COLUMN to find the next column letter
        var maxAsciiVal = asciiVal(MAX_COLUMN);
        return asciiToString(maxAsciiVal - Math.abs(nextColumn));
    }
    else return asciiToString(nextColumn);
}

/*****
*	isValidColor(str)
*  	Checks to see whether str is a valid HTML color code via regex.
*	Parameters:
*		str: The string to check
*	Returns true if the string is a valid HTML color code, false otherwise.
*	Source: 
*	http://stackoverflow.com/questions/8868799/in-javascript-regex-how-do-i-validate-that-a-string-is-a-valid-hex
******/
function isValidColor(str) {
    if (typeof str == "undefined" || str == null) return false;
    return str.match(/^#[a-f0-9]{6}$/i) !== null;
}

/*****
*	setGridRowOrColumnToColor()
*  	Sets a full grid row or column to the specified color.
*	Parameters:
*		rowOrColumnToAdjust: the row or column to set to the color
*		color: the color to set the row or column to
******/
function setGridRowOrColumnToColor(rowOrColumnToAdjust, color) {
	var isColumn = false; // assume it is a column at first
	if (isNaN(parseInt(rowOrColumnToAdjust))) { // determine if char; if it is, turn it into num
		isColumn = true;
		rowOrColumnToAdjust = parseInt(rowOrColumnToAdjust.charCodeAt(0)-65);
	}
	if (isColumn) { // coloring a column
		for (var i = 0; i < MAX_ROW; i++)
			grid.setLocationToColor(i, rowOrColumnToAdjust, color);
	}
	else { // coloring a row
		var rowIndex = parseInt(rowOrColumnToAdjust)-1; // -1 because the 2D array is 0-based
		for (var i = 0; i < MAX_ROW; i++)
			grid.setLocationToColor(rowIndex, i, color);
	}
}

/*****
*	setGridSquareToColor()
*  	Sets a single square to the specified color.
*	Parameters:
*		rowId: row id to set to the color
*		columnId: column id to set to the color
*		color: the color to set the row or column to
******/
function setGridSquareToColor(rowId, columnId, color) {
    rowId = rowId - 1;
    columnId = parseInt(columnId.charCodeAt(0) - 65);
    grid.setLocationToColor(rowId, columnId, color);
}

/*****
*	setGridCircleToColor()
*   adapted from -- 
*     http://www.w3professors.com/Data/Courses/Computer-Graphics/Programs/program-to-draw-a-circle-using-mid-point-algorithm.pdf
*  	Sets a circle to the specified color.
*	Parameters:
*		rowId: row id for start row of circle
*		columnId: column id for start column of circle
*		radius: radius of the circle to be drawn
*		color: the color to set the circle to
******/
function setGridCircleToColor(rowId, columnId, radius, color) {
    rowId = rowId - 1;
    columnId = parseInt(columnId.charCodeAt(0) - 65);
    radius = parseInt(radius);
    x = 0, y = radius;
    p = 1 - radius;

    while (x < y) {
        drawCircle(rowId, columnId, x, y, color);
        x++;

        if (p < 0)
            p = p + 2 * x + 1;
        else {
            y--;
            //p = (p + 2) * ((x - y) + 1); // makes slightly different edges on higher radii
            p = p + 2 * (x - y) + 1;
        }

        drawCircle(rowId, columnId, x, y, color);
    }
}

/*****
*	drawCircle(cenx, ceny, x, y, color)
*   adapted from -- 
*     http://www.w3professors.com/Data/Courses/Computer-Graphics/Programs/program-to-draw-a-circle-using-mid-point-algorithm.pdf
*  	Draws a circle of the specified color.
*	Parameters:
*		cenx: center for x
*		ceny: center for y
*		x: x offset for drawing the circle
*       y: y offset for drawing the circle
*		color: the color to set the circle to
******/
function drawCircle(cenx, ceny, x, y, color) {

    grid.setLocationToColor(cenx+x, ceny+y, color);
    grid.setLocationToColor(cenx-x, ceny+y, color);
    grid.setLocationToColor(cenx+x, ceny-y, color);
    grid.setLocationToColor(cenx-x, ceny-y, color);
    grid.setLocationToColor(cenx+y, ceny+x, color);
    grid.setLocationToColor(cenx-y, ceny+x, color);
    grid.setLocationToColor(cenx+y, ceny-x, color);
    grid.setLocationToColor(cenx-y, ceny-x, color);
}

/***** 
*	intersect_safe(a, b) -- modified from stack overflow (including comments) at
*	http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
*	Finds the intersection of 
* 	two sorted arrays in a simple fashion.  
* 	Parameters:
*  		a: first array, must already be sorted
*  		b: second array, must already be sorted
* 	Notes:
*  	Should have O(n) operations, where n is 
*    	n = MIN(a.length(), b.length())
*   Not used anymore, since the ComparisonRange block was trashed for the Range block
*   Kept since it might come in handy later!
******/
function intersectRowsOrColumns(a, b) {
	var ai = 0, bi = 0;
	var result = new Array();
	while (ai < a.length && bi < b.length)
	{
	    aVal = '' + a[ai]; // cast as string so (int)1 and "B" can be differentiated
	    bVal = '' + b[bi];
		if (aVal < bVal)
			ai++; 
		else if (aVal > bVal) 
			bi++; 
		else // they're equal
		{
			result.push(aVal);
			ai++;
			bi++;
		}
	}
	return result;
}

// The following three functions are modified from:
// http://stackoverflow.com/questions/4095106/javascript-find-out-previous-letter-in-alphabet
/*****
*	prevAsciiVal(val)
*  	Finds and returns the previous string ASCII value for the specified ASCII value.
*	Used to get the previous ASCII value for a column letter string or a row number.
*	Parameters:
*		val: the val to get the previous ASCII value for
*	Returns the ASCII value before val.
******/
function prevAsciiVal(val) {
	val = "" + val; // cast as string if val is a number
    return String.fromCharCode(val.charCodeAt(0)-1);
}

/*****
*	nextAsciiVal(letter)
*  	Finds and returns the next string ASCII value for the specified ASCII value.
*	Used to get the next ASCII value for a column letter string or a row number.
*	Parameters:
*		val: the val to get the next ASCII value for
*	Returns the ASCII value after val.
******/
function nextAsciiVal(val) {
    val = "" + val; // cast as string if val is a number
    return String.fromCharCode(val.charCodeAt(0)+1);
}

/*****
*	asciiVal(letter)
*  	Returns the integer ASCII value for val.
*	Parameters:
*		val: the val to get the ASCII value for
*	Returns the integer ASCII value of val.
******/
function asciiVal(val) {
    val = "" + val; // cast as string if val is a number
    return val.charCodeAt(0);
}

/*****
*	asciiToString(asciiVal)
*  	Returns the string representation of the ASCII val.
*	Parameters:
*		asciiVal: the ASCII value to change into a string
*	Returns the string ASCII character of asciiVal.
******/
function asciiToString(asciiVal) {
    return String.fromCharCode(asciiVal);
}

/*****
*	nextVal(rowOrColumnVal)
*  	If rowOrColumnVal is an int [row number], returns the
*   row number + 1. Otherwise, rowOrColumnVal is a column
*   character, so we return the next ASCII value after the 
*   column character [i.e. nextVal("A") -> returns "B"].
*	Parameters:
*		rowOrColumnVal: the row or column to get the next value for
*	Returns the next value after rowOrColumnVal.
******/
function nextVal(rowOrColumnVal) {
    var parsedVal = parseInt(rowOrColumnVal);
    if (isNaN(parsedVal)) // NaN? Then the val passed into this func was a column string.
        return nextAsciiVal(rowOrColumnVal);
    else return parsedVal + 1;
}

/*****
*	prevVal(rowOrColumnVal)
*  	If rowOrColumnVal is an int [row number], returns the
*   row number - 1. Otherwise, rowOrColumnVal is a column
*   character, so we return the previous ASCII value after  
*   the column character [i.e. prevVal("B") -> returns "A"].
*	Parameters:
*		rowOrColumnVal: the row or column to get the prev value for
*	Returns the previous value after rowOrColumnVal.
******/
function prevVal(rowOrColumnVal) {
    var parsedVal = parseInt(rowOrColumnVal);
    if (isNaN(parsedVal)) // NaN? Then the val passed into this func was a column string.
        return prevAsciiVal(rowOrColumnVal);
    else return parsedVal - 1;
}
/*****
*	verifyVariableType(variable)
*   Makes a string int an int and keeps a string a string.
*	Parameters:
*		variable: the variable to verify the type of
*	Returns the same variable as an int if its a number of
*   as a string if it was a string.
*   Boo on weakly typed languages.
*   (this is to "fix" some errors that I didn't have time to debug :( )
******/
function verifyVariableType(variable) {
    var parsedVal = parseInt(variable);
    if (isNaN(parsedVal)) // NaN? Then the val passed into this func was a column string.
        return variable;
    else return parsedVal;
}

// Functions to find rows/columns that are greater than, equal to, less than, etc. another row/column
/*****
*	gridGreaterEqual(rowOrColumnId)
*  	Finds and returns all the columns or rows after and equaling the rowOrColumnId.
*	"After" for columns means to the right of the column Id.
*	Parameters:
*		rowOrColumnId: The row or column Id in the grid to compare against.
*	Returns a sorted array of classes (as ASCII vals) for a block to use for knowing which
*	rows need to be acted upon.
******/
function gridGreaterEqual(rowOrColumnId) {
	var classesToReturn = [];
	var currRowOrColumn = verifyVariableType(rowOrColumnId);
	while (currRowOrColumn != nextVal(MAX_COLUMN) && currRowOrColumn != nextVal(MAX_ROW)) {
		classesToReturn.push(currRowOrColumn);
		currRowOrColumn = nextVal(currRowOrColumn);
	}
	return sortClassList(classesToReturn);
}

/*****
*	gridGreater(rowOrColumnId)
*  	Finds and returns all the columns or rows after but not equaling the rowOrColumnId.
*	"After" for columns means to the right of the column Id.
*	Parameters:
*		rowOrColumnId: The row or column Id in the grid to compare against.
*	Returns a sorted array of classes (as ASCII vals) for a block to use for knowing which
*	rows need to be acted upon.
******/
function gridGreater(rowOrColumnId) {
    var classesToReturn = [];
    var currRowOrColumn = nextVal(verifyVariableType(rowOrColumnId)); // don't want to include rowOrColumnId
    while (currRowOrColumn != nextVal(MAX_COLUMN) && currRowOrColumn != nextVal(MAX_ROW)) {
		classesToReturn.push(currRowOrColumn);
		currRowOrColumn = nextVal(currRowOrColumn);
    }
    return sortClassList(classesToReturn);
}

/*****
*	gridEqual(rowOrColumnId)
*  	Finds and returns the column or row equaling the rowOrColumnId.
*	Parameters:
*		rowOrColumnId: The row or column Id in the grid to compare against.
*	Returns the row or column id in an array (for standardized output for these functions).
******/
function gridEqual(rowOrColumnId) {
	var classesToReturn = [];
	classesToReturn.push(verifyVariableType(rowOrColumnId));
	return classesToReturn;
}

/*****
*	gridLess(rowOrColumnId)
*  	Finds and returns all the columns or rows before but not equaling the rowOrColumnId.
*	"Before" for columns means to the left of the column Id.
*	Parameters:
*		rowOrColumnId: The row or column Id in the grid to compare against.
*	Returns a sorted array of classes (as ASCII vals) for a block to use for knowing which
*	rows need to be acted upon.
******/
function gridLess(rowOrColumnId) {
	var classesToReturn = [];
	var currRowOrColumn = prevVal(verifyVariableType(rowOrColumnId)); // don't want to include rowOrColumnId
	while (currRowOrColumn != prevVal(MIN_COLUMN) && currRowOrColumn != prevVal(MIN_ROW)) {
		classesToReturn.push(currRowOrColumn);
		currRowOrColumn = prevVal(currRowOrColumn);
	}
	return sortClassList(classesToReturn);
}

/*****
*	gridLessEqual(rowOrColumnId)
*  	Finds and returns all the columns or rows before and equaling the rowOrColumnId.
*	"Before" for columns means to the left of the column Id.
*	Parameters:
*		rowOrColumnId: The row or column Id in the grid to compare against.
*	Returns a sorted array of classes (as ASCII vals) for a block to use for knowing which
*	rows need to be acted upon.
******/
function gridLessEqual(rowOrColumnId) {
	var classesToReturn = [];
	var currRowOrColumn = verifyVariableType(rowOrColumnId); // don't want to include rowOrColumnId
	while (currRowOrColumn != prevVal(MIN_COLUMN) && currRowOrColumn != prevVal(MIN_ROW)) {
		classesToReturn.push(currRowOrColumn);
		currRowOrColumn = prevVal(currRowOrColumn);
	}
	return sortClassList(classesToReturn);
}

/*****
*	sortClassList(listToSort)
*   Sorts an array of class letters or numbers. We can't just call
*   .sort() on the array, since an array of numbers would be sorted
*   alphabetically instead of numerically, so instead we use this
*   function to sort things based upon being letters or numbers.
*	Parameters:
*		listToSort: The array of row or column #s/letters to sort
*	Returns a sorted array of classes.
******/
function sortClassList(listToSort) {
    if (listToSort.length > 0) {
        if (isNaN(parseInt(listToSort[0]))) // List is full of columns [letters]
            listToSort = listToSort.sort(); // sort alphabetically
        else 
            listToSort = listToSort.sort(function (a, b) { return a - b }); // sort numerically
    }
    return listToSort;
}

/*****
*	getRandomColor()
*  	Gets and returns a random HTML color code.
*	Modified from several stack overflow threads (search for "javascript random character string")
******/
function getRandomColor() {
    /*
	var possibleChars = "0A1B2C3D4E5F6789";
	var colorString = "#";
	for (var i = 0; i < 6; i++)
		colorString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
	return colorString;
    */
    // A new, better way
    // http://stackoverflow.com/questions/5092808/how-do-i-randomly-generate-html-hex-color-codes-using-javascript
    return "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
}