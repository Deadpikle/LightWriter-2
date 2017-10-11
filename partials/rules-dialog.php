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
            <img class="busy-spinner hidden" id="Img1" src="images/ajax-loader-big.gif" />
        </fieldset>
    </form>
</div>