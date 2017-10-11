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