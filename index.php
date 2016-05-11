<?php
// Note:
// Just for ease, I have brought over the old stuff so that I have it in the project for reference. Eventually, it will be deleted/refactored/removed.
// Keeps me from having to keep switching to the old project to look at stuff >_>
// <_<
// ...yay for messy beginning projects!

    session_start();    
?>

<html>

<head>
    <title>LightWriter</title>
    <!-- TODO: Minify ALL the things! -->
    <script type="text/javascript" src="js/old/lib/jquery-1.10.2.js"></script>
    <script type="text/javascript" src="js/old/lib/jquery-ui-1.10.3.min.js"></script>
    <script type="text/javascript" src="js/old/lib/Procolor/prototype.js"></script>
    <script type="text/javascript" src="js/old/lib/Procolor/procolor.js"></script>
    <script type="text/javascript" src="js/old/lib/ColorMixer/jquery.color.2.1.2.min.js"></script>
    <script type="text/javascript" src="js/old/lib/ColorMixer/color_mixer.js"></script>
    <script type="text/javascript" src="js/old/GUI.js"></script>
    <script type="text/javascript" src="js/old/functionsAndClasses.js"></script>
    <script type="text/javascript" src="js/old/index.js"></script>
    <script type="text/javascript" src="js/old/ajaxServicesAndDialogs.js"></script>
    
	<link rel="stylesheet" type="text/css" href="css/theme/jquery-ui-1.10.3.custom.css" />
	<link rel="stylesheet" type="text/css" href="css/index.css" />
	<link rel="stylesheet" type="text/css" href="css/GUI.css" />
</head>
<body>
    <div id="PageDiv">
        <div id="ToolsDiv">
            <div id="ToolsTitle" class="title">
                <div class="TitleTextOffset">
                    <img src="images/BlocksBanner.png" alt="Blocks"/>
                </div>
            </div>
            <div id="ToolsAccordion">
                <h3>Static Blocks</h3>
                <div> <!-- TODO: Remove onclick calls and add them as an event handler in the js via .on() [seperate GUI & logic] -->
                    <div id="SingleDraggable" class="DraggableBlock">
                        <div><img src="images/SingleIcon.png" alt="Single"/></div>
                        <label>Single</label>
                    </div>
                    <div id="ComparisonDraggable" class="DraggableBlock">
                        <div><img src="images/ComparisonIcon.png" alt="Comparison"/></div>
                        <label>Comparison</label>
                    </div>
                    <div id="RangeDraggable" class="DraggableBlock">
                        <div><img src="images/RangeIcon.png" alt="Range"/></div>
                        <label>Range</label>
                    </div>
                    <div id="CircleDraggable" class="DraggableBlock">
                        <div><img src="images/CircleIcon.png" alt="Circle"/></div>
                        <label>Circle</label>
                    </div>
                </div>
                <h3>Movement Blocks</h3>
                <div>
                    <div id="SingleMoveDraggable" class="DraggableBlock">
                        <div><img src="images/SingleMove.gif" alt="Single Move"/></div>
                        <label>Single Move</label>
                    </div>
                    <div id="ComparisonMoveDraggable" class="DraggableBlock">
                        <div><img src="images/ComparisonMove.gif" alt="Comparison Move"/></div>
                        <label>Comparison Move</label>
                    </div>
                    <div id="RangeMoveDraggable" class="DraggableBlock">
                        <div><img src="images/RangeMove.gif" alt="Range Move"/></div>
                        <label>Range Move</label>
                    </div>
                </div>
                <h3>Advanced Blocks</h3>
                <div>
                    <div id="CommentDraggable" class="DraggableBlock">
                        <div><img src="images/CommentIcon.png" alt="Comment"/></div>
                        <label>Comment</label>
                    </div>
                </div>
            </div>
        </div>
        <div id="CodeDiv">
            <div id="CodeTitle" class="title">
                <div class="TitleTextOffset"><img src="images/PatternBanner.png" alt="Your Pattern"/></div>
            </div>
            <div id="ActualCode">
                <ul id="block-list">
                </ul> 
            </div>
        </div>
        <div id="RightHalf">
            <div id="MenuBar">
                <div id="MenuBanner"><img src="images/MenuBanner.png" alt="Menu"/></div>
			    <div id="MenuButtons">
                    <input type="image" onclick=" return StartStopToggle()" class="menuButton StartStopButton" src="images/StartButton.png"/>
                    <input type="image" onclick=" return false" class="menuButton saveAlgorithmButton" 
                        src="images/SaveButton.png"/>
                    <input type="image" onclick=" return false" class="menuButton loadAlgorithmButton" 
                        src="images/LoadButton.png"/>
                    <input type="image" onclick=" return EnterPresentationMode()" class="menuButton" src="images/PresentButton.png"/>
                    <input type="image" id="rules-button" class="menuButton" src="images/RulesButton.png"/>
                    <input type="image" onclick=" return requestFullScreen()" class="menuButton" src="images/FullButton.png"/>
                    <input id="menuLoginButton" type="image" class="menuButton loginButton" 
                            runat="server" src="images/LoginButton.png"/>
                    <img class="busy-spinner" id="menu-busy-spinner" src="images/ajax-loader-menu.gif" />
			    </div>
            </div>
            <div id="LightGrid">
                <div id="ActualGrid"></div>
            </div>
            <div id="PresentationMenu">
			    <div id="PresentationButtons">
                    <input type="image" onclick=" return StartStopToggle()" class="presentationButton StartStopButton" src="images/StartButton.png"/>
                    <!--input type="image" onclick=" return false" class="presentationButton saveAlgorithmButton" 
                        src="images/SaveButton.png"/-->
                    <input type="image" onclick=" return false" class="presentationButton loadAlgorithmButton" 
                        src="images/LoadButton.png"/>
                    <input type="image" id="shareButton" class="presentationButton" src="images/ShareButton.png"/>
                    <input type="image" onclick=" return ExitPresentationMode()" class="presentationButton" src="images/EditorButton.png"/>
                    <input type="image" onclick=" return requestFullScreen()" class="presentationButton" src="images/PresentationFullButton.png"/>
                    <input id="presentationLoginButton" type="image" class="presentationButton loginButton" 
                            runat="server" src="images/PresentationLoginButton.png"/>
                    <br />
                    <img class="busy-spinner" id="present-busy-spinner" src="images/ajax-loader-share.gif" />
			    </div>
            </div>
        </div>        
    </div>
    <div class="form-dialog" id="register-form-dialog" title="Register for/Login to LightWriter"> <!-- also functions as login form -->
        <div id="register"><p class="validateTips">Fields marked with a * are required. 
            If registering for the first time, please fill in the "Confirm Password"
            box as well. The system will automatically log you in upon registration success.</p>
            <form id="register-form">
                <fieldset>
                    <legend></legend>
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username" class="text ui-widget-content ui-corner-all" /> *
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" value="" class="text ui-widget-content ui-corner-all" /> *
                    <label for="confPassword">Confirm Password</label>
                    <input type="password" name="confPassword" id="confPassword" value="" class="text ui-widget-content ui-corner-all" /> &nbsp;&nbsp;
                    <br />
                    <img class="busy-spinner hidden" id="register-busy-spinner" src="Content/images/ajax-loader-big.gif" />
                </fieldset>
            </form>
        </div>
    </div>

    <div class="form-dialog" id="save-algorithm-dialog" title="Save LightWriter Algorithm"> <!-- also functions as login form -->
        <div id="saveAlg">
            <p class="validateTips">All form fields are required.</p>
            <!--form id="save-algorithm-form"-->
                <fieldset>
                    <legend></legend>
                    <label for="alg-name">Algorithm Name</label>
                    <input type="text" name="alg-name" id="algorithmName" class="text ui-widget-content ui-corner-all" />
                    <p>Old algorithms of the same name will be overwritten.</p>
                    <img class="busy-spinner hidden" id="save-busy-spinner" src="Content/images/ajax-loader-big.gif" />
                </fieldset>
            <!--/form-->
        </div>
    </div>

    <div class="form-dialog" id="load-algorithm-dialog" title="Load or Delete LightWriter Algorithm"> <!-- also functions as login form -->
        <p class="validateTips">Choose an algorithm to load or delete.</p>
        <form id="load-algorithm-form">
            <fieldset>
                <legend></legend>
                <select id="algorithm-selector">
                    <option value="-1">Choose an algorithm...</option>
                </select>
                <br />
                <img class="busy-spinner hidden" id="load-busy-spinner" src="Content/images/ajax-loader-big.gif" />
            </fieldset>
        </form>
    </div>

    <div class="form-dialog" id="message-dialog" title="LightWriter Message"> <!-- also functions as login form -->
        <p id="message-box">Here be message (replaced on every call of this dialog)</p>
    </div>

    <div class="form-dialog" id="confirmation-dialog" title="LightWriter Confirmation"> <!-- also functions as login form -->
        <p class="hidden" id="confirmation-message">Here be message (replaced on every call of this dialog)</p>
    </div>

    <div class="form-dialog" id="share-algorithm-dialog" title="Share LightWriter Algorithm"> <!-- also functions as login form -->
        <div id="pre-share-elements">
            <p class="validateTips">Choose an algorithm to share, or save and share your current algorithm by inserting a name for
            the algorithm in the provided text input area. If any text is in the text input area, it will use the new name by default instead
            of what is in the select box.</p>
            <form id="share-algorithm-form">
                <fieldset>
                    <legend></legend>
                    <select id="alg-selector">
                        <option value="-1">Choose an algorithm...</option>
                    </select>
                    <br />
                    <input type="text" name="alg-name" id="algNameToShareAndSave" placeholder="Algorithm Name" class="text ui-widget-content ui-corner-all" />
                    <p>Old algorithms of the same name will be overwritten.</p>
                    <img class="busy-spinner hidden" id="share-busy-spinner" src="Content/images/ajax-loader-big.gif" />
                </fieldset>
            </form>
        </div>
        <div id="post-share-click-elements" class="hidden">
            <p id="share-success-msg">To share your awesome algorithm with a friend, just send them this URL to open in any modern browser!</p>
            <input type="text" name="alg-name" id="share-url" placeholder="Algorithm Name" />
        </div>
    </div>

    <div class="form-dialog" id="rules-dialog" title="Change LightWriter Rules"> <!-- also functions as login form -->
        <p class="validateTips">Change some of LightWriter's rules.</p>
        <form id="rules-form">
            <fieldset>
                <legend></legend>
                <label class="bolded" for="def-square-color">Default Square Color</label>
			    <input id="def-square-color" name="def-square-color" class="setToColor" type="text"/>
                <label class="bolded" for="ms-per-tick">Number of Milliseconds Per Tick (1000 per second)</label>
                <label>Warning: Making the number too low may be 
                    dangerous for those with seizures (flashing colors) or may cause execution to be sluggish on slow computers.</label>
                <input id="ms-per-tick" name="ms-per-tick" class="spinner" value="500" disabled="disabled"/>
                <label class="bolded" for="color-mixing">Mix Colors Instead of Overwriting</label>
                <input type="checkbox" id="color-mixing" name="color-mixing" />
                <img class="busy-spinner hidden" id="Img1" src="Content/images/ajax-loader-big.gif" />
            </fieldset>
        </form>
    </div>

    <div class="hidden templates"> <!-- TODO: Refactor to different files and stuff -->
		<div class="comparison-block codeBlock" id="comparison-template">
			<div class="innerBlock">
                <label>If row/column is&nbsp;</label>
			    <select class="option-changer comparison">
				    <option value='>'>></option>
				    <option value='>='>>=</option>
				    <option value='=' selected>=</option>
				    <option value='<='><=</option>
				    <option value='<'><</option>
			    </select>
			    <label>&nbsp;to/than&nbsp;</label>
			    <select class="option-changer columnrow">
				    <option value='A' selected>A</option>
				    <option value='B'>B</option>
				    <option value='C'>C</option>
				    <option value='D'>D</option>
				    <option value='E'>E</option>
				    <option value='F'>F</option>
				    <option value='G'>G</option>
				    <option value='H'>H</option>
				    <option value='I'>I</option>
				    <option value='J'>J</option>
				    <option value='K'>K</option>
				    <option value='L'>L</option>
				    <option value='M'>M</option>
				    <option value='N'>N</option>
				    <option value='O'>O</option>
				    <option value='P'>P</option>
				    <option value='1'>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>
				    <option value='11'>11</option>
				    <option value='12'>12</option>
				    <option value='13'>13</option>
				    <option value='14'>14</option>
				    <option value='15'>15</option>
				    <option value='16'>16</option>
			    </select>
			    <label>, then </label>
			    <select class="option-changer action">
				    <option value="remove">remove color</option>
				    <option value="setto">set to color</option>
				    <option value="randomize" selected>random color</option>
			    </select>
			    <input class="setToColor hidden" type="text" placeholder="#33ccff (Hex Color String)"/>
			    <label>.</label>
            </div>
            <div class="blockButtons">
                <input type="image" class="blockButton preview" src="Content/images/EyeButton.png"/>
                <br>
                <input type="image" onclick="removeBlock(this)" class="blockButton" src="Content/images/TrashButton.png"/>
            </div>				
		</div>
			
		<div class="range-block codeBlock" id="range-template">
			<div class="innerBlock">
                <label>Between</label>
			    <select class="option-changer leftColumnRow">
				    <option value='A' selected>A</option>
				    <option value='B'>B</option>
				    <option value='C'>C</option>
				    <option value='D'>D</option>
				    <option value='E'>E</option>
				    <option value='F'>F</option>
				    <option value='G'>G</option>
				    <option value='H'>H</option>
				    <option value='I'>I</option>
				    <option value='J'>J</option>
				    <option value='K'>K</option>
				    <option value='L'>L</option>
				    <option value='M'>M</option>
				    <option value='N'>N</option>
				    <option value='O'>O</option>
				    <option value='P'>P</option>
				    <option value='1'>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>
				    <option value='11'>11</option>
				    <option value='12'>12</option>
				    <option value='13'>13</option>
				    <option value='14'>14</option>
				    <option value='15'>15</option>
				    <option value='16'>16</option>
			    </select>
			    <label> and </label>
			    <select class="option-changer rightColumnRow">
				    <option value='A'>A</option>
				    <option value='B' selected>B</option>
				    <option value='C'>C</option>
				    <option value='D'>D</option>
				    <option value='E'>E</option>
				    <option value='F'>F</option>
				    <option value='G'>G</option>
				    <option value='H'>H</option>
				    <option value='I'>I</option>
				    <option value='J'>J</option>
				    <option value='K'>K</option>
				    <option value='L'>L</option>
				    <option value='M'>M</option>
				    <option value='N'>N</option>
				    <option value='O'>O</option>
				    <option value='P'>P</option>
				    <option value='1'>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>
				    <option value='11'>11</option>
				    <option value='12'>12</option>
				    <option value='13'>13</option>
				    <option value='14'>14</option>
				    <option value='15'>15</option>
				    <option value='16'>16</option>
			    </select>
			    <label>, perform action:</label>
			    <select class="option-changer action">
				    <option value="remove">remove color</option>
				    <option value="setto">set to color</option>
				    <option value="randomize" selected>random color</option>
			    </select>
			    <input class="setToColor hidden" type="text" placeholder="#33ccff (Hex Color String)"/>
			    <label>.</label>				
		    </div>
            <div class ="blockButtons">
                <input type="image" class="blockButton preview" src="Content/images/EyeButton.png"/>
                <br>
                <input type="image" onclick="removeBlock(this)" class="blockButton" src="Content/images/TrashButton.png"/>
            </div>
        </div>
		
		<div class="single-block codeBlock" id="single-template">
            <div class="innerBlock">
			    <label>Set &nbsp;</label>
			    <select class="option-changer column">
				    <option value='A' selected>A</option>
				    <option value='B'>B</option>
				    <option value='C'>C</option>
				    <option value='D'>D</option>
				    <option value='E'>E</option>
				    <option value='F'>F</option>
				    <option value='G'>G</option>
				    <option value='H'>H</option>
				    <option value='I'>I</option>
				    <option value='J'>J</option>
				    <option value='K'>K</option>
				    <option value='L'>L</option>
				    <option value='M'>M</option>
				    <option value='N'>N</option>
				    <option value='O'>O</option>
				    <option value='P'>P</option>
			    </select>
			    <select class="option-changer row">
				    <option value='1' selected>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>
				    <option value='11'>11</option>
				    <option value='12'>12</option>
				    <option value='13'>13</option>
				    <option value='14'>14</option>
				    <option value='15'>15</option>
				    <option value='16'>16</option>
			    </select>
			    <label> square to </label>
			    <select class="option-changer action">
				    <option value="remove">remove color</option>
				    <option value="setto">set to color</option>
				    <option value="randomize" selected>random color</option>
			    </select>
			    <input class="setToColor hidden" type="text" placeholder="#33ccff (Hex Color String)"/>
			    <label>.</label>				
            </div>
            <div class ="blockButtons">
                <input type="image" class="blockButton preview" src="Content/images/EyeButton.png"/>
                <br>
                <input type="image" onclick="removeBlock(this)" class="blockButton" src="Content/images/TrashButton.png"/>
            </div>
		</div>
        <div class="circle-block codeBlock" id="circle-template">
            <div class ="innerBlock"
			    <label>Create circle with center at &nbsp;</label>
			    <select class="option-changer column">
				    <option value='A' selected>A</option>
				    <option value='B'>B</option>
				    <option value='C'>C</option>
				    <option value='D'>D</option>
				    <option value='E'>E</option>
				    <option value='F'>F</option>
				    <option value='G'>G</option>
				    <option value='H'>H</option>
				    <option value='I'>I</option>
				    <option value='J'>J</option>
				    <option value='K'>K</option>
				    <option value='L'>L</option>
				    <option value='M'>M</option>
				    <option value='N'>N</option>
				    <option value='O'>O</option>
				    <option value='P'>P</option>
			    </select>
			    <select class="option-changer row">
				    <option value='1' selected>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>
				    <option value='11'>11</option>
				    <option value='12'>12</option>
				    <option value='13'>13</option>
				    <option value='14'>14</option>
				    <option value='15'>15</option>
				    <option value='16'>16</option>
			    </select>
			    <label> and radius </label>
			    <select class="option-changer radius">
				    <option value='1' selected>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
                    <option value='5'>5</option>
                    <option value='6'>6</option>
                    <option value='7'>7</option>
                    <option value='8'>8</option>
			    </select>
			    <label> color </label>
			    <select class="option-changer action">
				    <option value="remove">remove color</option>
				    <option value="setto">set to color</option>
				    <option value="randomize" selected>random color</option>
			    </select>
			    <input class="setToColor hidden" type="text" placeholder="#33ccff (Hex Color String)"/>
			    <label>.</label>
		    </div>
            <div class ="blockButtons">
                <input type="image" class="blockButton preview" src="Content/images/EyeButton.png"/>
                <br>
                <input type="image" onclick="removeBlock(this)" class="blockButton" src="Content/images/TrashButton.png"/>
            </div>
        </div>

        <!-- Move Blocks Start Here -->
        <div class="single-move-block codeBlock" id="single-move-template">
            <div class="innerBlock">
                <label>Start at&nbsp;</label>
			    <select class="option-changer column">
				    <option value='A' selected>A</option>
				    <option value='B'>B</option>
				    <option value='C'>C</option>
				    <option value='D'>D</option>
				    <option value='E'>E</option>
				    <option value='F'>F</option>
				    <option value='G'>G</option>
				    <option value='H'>H</option>
				    <option value='I'>I</option>
				    <option value='J'>J</option>
				    <option value='K'>K</option>
				    <option value='L'>L</option>
				    <option value='M'>M</option>
				    <option value='N'>N</option>
				    <option value='O'>O</option>
				    <option value='P'>P</option>
			    </select>
			    <select class="option-changer row">
				    <option value='1' selected>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>
				    <option value='11'>11</option>
				    <option value='12'>12</option>
				    <option value='13'>13</option>
				    <option value='14'>14</option>
				    <option value='15'>15</option>
				    <option value='16'>16</option>
			    </select>
			    <label> with action </label>
			    <select class="option-changer action">
				    <option value="remove">remove color</option>
				    <option value="setto">set to color</option>
				    <option value="randomize" selected>random color</option>
			    </select>
			    <input class="setToColor hidden" type="text" placeholder="#33ccff (Hex Color String)"/>
			    <label> and move </label>
                <select class="option-changer move-direction">
                    <option value="up" selected>up</option>
                    <option value="down">down</option>
                    <option value="left">left</option>
                    <option value="right">right</option>
                    <option value="up-left">up & left</option>
                    <option value="up-right">up & right</option>
                    <option value="down-left">down & left</option>
                    <option value="down-right">down & right</option>
                </select>
                <select class="option-changer move-amount">
                    <option value="1" selected>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>
				    <option value='11'>11</option>
				    <option value='12'>12</option>
				    <option value='13'>13</option>
				    <option value='14'>14</option>
				    <option value='15'>15</option>
                </select>
                <label> blocks every </label>
                <select class="option-changer tick-amount">
                    <option value="1" selected>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>  
                </select>
                <label> tick(s).</label>
            </div>
            <div class="blockButtons">
                <input type="image" class="blockButton preview" src="Content/images/EyeButton.png"/>
                <br>
                <input type="image" onclick="removeBlock(this)" class="blockButton" src="Content/images/TrashButton.png"/>
            </div>
		</div>

        <div class="comparison-move-block codeBlock" id="comparison-move-template">
			<div class="innerBlock">
                <label>If row/column is&nbsp;</label>
			    <select class="option-changer comparison">
				    <option value='>'>></option>
				    <option value='>='>>=</option>
				    <option value='=' selected>=</option>
				    <option value='<='><=</option>
				    <option value='<'><</option>
			    </select>
			    <label>&nbsp;to/than&nbsp;</label>
			    <select class="option-changer columnrow">
				    <option value='A' selected>A</option>
				    <option value='B'>B</option>
				    <option value='C'>C</option>
				    <option value='D'>D</option>
				    <option value='E'>E</option>
				    <option value='F'>F</option>
				    <option value='G'>G</option>
				    <option value='H'>H</option>
				    <option value='I'>I</option>
				    <option value='J'>J</option>
				    <option value='K'>K</option>
				    <option value='L'>L</option>
				    <option value='M'>M</option>
				    <option value='N'>N</option>
				    <option value='O'>O</option>
				    <option value='P'>P</option>
				    <option value='1'>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>
				    <option value='11'>11</option>
				    <option value='12'>12</option>
				    <option value='13'>13</option>
				    <option value='14'>14</option>
				    <option value='15'>15</option>
				    <option value='16'>16</option>
			    </select>
			    <label>, then </label>
			    <select class="option-changer action">
				    <option value="remove">remove color</option>
				    <option value="setto">set to color</option>
				    <option value="randomize" selected>random color</option>
			    </select>
			    <input class="setToColor hidden" type="text" placeholder="#33ccff (Hex Color String)"></input>
			    <label>. Move </label>
                <select class="option-changer move-direction">
                    <option value="up">up</option>
                    <option value="down">down</option>
                    <option value="left">left</option>
                    <option value="right" selected>right</option>
                </select>
                <select class="option-changer move-amount">
                    <option value="1" selected>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>
				    <option value='11'>11</option>
				    <option value='12'>12</option>
				    <option value='13'>13</option>
				    <option value='14'>14</option>
				    <option value='15'>15</option>
                </select>
			    <label> blocks every </label>
                <select class="option-changer tick-amount">
                    <option value="1" selected>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>  
                </select>
			    <label>tick(s).</label>
            </div>
            <div class ="blockButtons">
                <input type="image" class="blockButton preview" src="Content/images/EyeButton.png"/>
                <br>
                <input type="image" onclick="removeBlock(this)" class="blockButton" src="Content/images/TrashButton.png"/>
            </div>				
		</div>
        <div class="range-move-block codeBlock" id="range-move-template">
			<div class="innerBlock">
                <label>Between</label>
			    <select class="option-changer leftColumnRow columnrow">
				    <option value='A' selected>A</option>
				    <option value='B'>B</option>
				    <option value='C'>C</option>
				    <option value='D'>D</option>
				    <option value='E'>E</option>
				    <option value='F'>F</option>
				    <option value='G'>G</option>
				    <option value='H'>H</option>
				    <option value='I'>I</option>
				    <option value='J'>J</option>
				    <option value='K'>K</option>
				    <option value='L'>L</option>
				    <option value='M'>M</option>
				    <option value='N'>N</option>
				    <option value='O'>O</option>
				    <option value='P'>P</option>
				    <option value='1'>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>
				    <option value='11'>11</option>
				    <option value='12'>12</option>
				    <option value='13'>13</option>
				    <option value='14'>14</option>
				    <option value='15'>15</option>
				    <option value='16'>16</option>
			    </select>
			    <label> and </label>
			    <select class="option-changer rightColumnRow columnrow">
				    <option value='A'>A</option>
				    <option value='B' selected>B</option>
				    <option value='C'>C</option>
				    <option value='D'>D</option>
				    <option value='E'>E</option>
				    <option value='F'>F</option>
				    <option value='G'>G</option>
				    <option value='H'>H</option>
				    <option value='I'>I</option>
				    <option value='J'>J</option>
				    <option value='K'>K</option>
				    <option value='L'>L</option>
				    <option value='M'>M</option>
				    <option value='N'>N</option>
				    <option value='O'>O</option>
				    <option value='P'>P</option>
				    <option value='1'>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>
				    <option value='11'>11</option>
				    <option value='12'>12</option>
				    <option value='13'>13</option>
				    <option value='14'>14</option>
				    <option value='15'>15</option>
				    <option value='16'>16</option>
			    </select>
			    <label>, perform action:</label>
			    <select class="option-changer action">
				    <option value="remove">remove color</option>
				    <option value="setto">set to color</option>
				    <option value="randomize" selected>random color</option>
			    </select>
			    <input class="setToColor hidden" type="text" placeholder="#33ccff (Hex Color String)"/>
			    <label>. Move</label>	
                <select class="option-changer move-direction">
                    <option value="up">up</option>
                    <option value="down">down</option>
                    <option value="left">left</option>
                    <option value="right" selected>right</option>
                </select>
                <select class="option-changer move-amount">
                    <option value="1" selected>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>
				    <option value='11'>11</option>
				    <option value='12'>12</option>
				    <option value='13'>13</option>
				    <option value='14'>14</option>
				    <option value='15'>15</option>
                </select>
			    <label> rows/columns every </label>
                <select class="option-changer tick-amount">
                    <option value="1" selected>1</option>
				    <option value='2'>2</option>
				    <option value='3'>3</option>
				    <option value='4'>4</option>
				    <option value='5'>5</option>
				    <option value='6'>6</option>
				    <option value='7'>7</option>
				    <option value='8'>8</option>
				    <option value='9'>9</option>
				    <option value='10'>10</option>  
                </select>
			    <label>tick(s).</label>			
		    </div>
            <div class ="blockButtons">
                <input type="image" class="blockButton preview" src="Content/images/EyeButton.png"/>
                <br>
                <input type="image" onclick="removeBlock(this)" class="blockButton" src="Content/images/TrashButton.png"/>
            </div>
        </div>
        <!-- Move Blocks End Here -->
		<div class="comment-block codeBlock" id="comment-template">
			<div class="innerBlock">
                <textarea class="commentTextArea" rows="4" cols="44" maxlength="1024" ></textarea>			
		    </div>
            <div class ="blockButtons">
                <input type="image" onclick="removeBlock(this)" class="blockButton" src="Content/images/TrashButton.png"/>
            </div>
        </div>
	</div>
</html>