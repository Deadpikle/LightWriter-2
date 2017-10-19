# TODO

## General

* Minify JS code
  * Don't be afraid to have a ton of JS files if it will clean up the code and all
* Minify CSS
* Get rid of all the ugliness everywhere (repeated code, ugly algorithms, etc.)
* Clean up the HTML (lowercase-format-class-names, no click handlers in HTML, etc.)
* Get rid of jQuery UI
  * HTML5 modal dialogs
  * Color scheme improvements
  * HTML5 accordion for left side panel (should be possible without library if necessary)
  * HTML5 drag and drop
* Config options in config (grid size, etc.)
* More refactoring of PHP to dynamically generate some code (e.g. rows, columns) for less repeated, more maintainable code
* Allow for clicking block buttons to add to pattern instead of drag & drop (should fix some mobile issues)
* Consider entirely new GUI that is more mobile friendly
* Database migrations / setup page
* Probably need to write the block data to disk instead of db due to max column length (or otherwise compress it -- gzcompress & gzdecode? probably need to change column encoding in db)
* Save/load locally in browser

## Blocks

* Better block prototype/class
* Don't hardcode block types/template names in multiple places
* Improve `this.ABCD` locations in code so properties are easy to see
* More block types
  * Rectangles
  * Squares
  * "Functions"

## API/Ajax calls

* Make all calls more secure-ish by using user token rather than user ID
* Sharing algorithm shouldn't just blindly load the pattern ID
* Route through a common API handler?
  * Would allow for third party pattern usage perhaps