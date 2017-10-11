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