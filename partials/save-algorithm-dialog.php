<div class="form-dialog" id="save-algorithm-dialog" title="Save LightWriter Pattern"> <!-- also functions as login form -->
    <div id="saveAlg">
        <p class="validateTips">All form fields are required.</p>
        <!--form id="save-algorithm-form"-->
            <fieldset>
                <legend></legend>
                <label for="alg-name">Pattern Name</label>
                <input type="text" name="alg-name" id="algorithmName" class="text ui-widget-content ui-corner-all" />
                <p>If you've already loaded a pattern, "Save" will update the pattern on the server and will ignore the name box. If you have a new pattern to save, choose "Save as New" and it will save your current pattern as a new pattern regardless.</p>
                <img class="busy-spinner hidden" id="save-busy-spinner" src="images/ajax-loader-big.gif" />
            </fieldset>
        <!--/form-->
    </div>
</div>