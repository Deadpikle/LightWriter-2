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