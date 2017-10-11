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