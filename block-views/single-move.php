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
        <input type="image" class="blockButton preview" src="images/EyeButton.png"/>
        <br>
        <input type="image" onclick="removeBlock(this)" class="blockButton" src="images/TrashButton.png"/>
    </div>
</div>