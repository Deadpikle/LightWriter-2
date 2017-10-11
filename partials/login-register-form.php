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