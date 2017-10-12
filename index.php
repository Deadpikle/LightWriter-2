<?php
// Note:
// Just for ease, I have brought over the old stuff so that I have it in the project for reference. Eventually, it will be deleted/refactored/removed.
// Keeps me from having to keep switching to the old project to look at stuff >_>
// <_<
// ...yay for messy beginning projects!

    require_once 'init.php';
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
    <?php require_once 'partials/login-register-form.php'; ?>
    <?php require_once 'partials/save-algorithm-dialog.php'; ?>
    <?php require_once 'partials/load-algorithm-dialog.php'; ?>
    
    <?php require_once 'partials/message-dialog.php'; ?>
    <?php require_once 'partials/confirmation-dialog.php'; ?>

    <?php require_once 'partials/share-algorithm-dialog.php'; ?>
    <?php require_once 'partials/rules-dialog.php'; ?>

    <div class="hidden templates">
		<?php require_once 'block-views/single.php'; ?>
		<?php require_once 'block-views/comparison.php'; ?>
		<?php require_once 'block-views/range.php'; ?>

        <?php require_once 'block-views/single-move.php'; ?>
        <?php require_once 'block-views/comparison-move.php'; ?>
        <?php require_once 'block-views/range-move.php'; ?>
        
        <?php require_once 'block-views/comment.php'; ?>
	</div>
</html>