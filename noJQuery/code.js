/*
 * set input field and attach event handler
 */
var init = function (document) {
    input = document.getElementById("text_input");
    input.focus();
    input.onkeydown = onKeyDownHandler;
};

/*
 * tab completion starts here ------------------------------------------------
 */

//variables used in tab completion
var prevKeyWasTab = false,
    pattern = "", //text fragment respective pattern to look for
    candidate = "", //candidate
    source = [], //array of values to be matched
    sourcePos = 0, //the search starting position
    //variables used in multi tab completion
    patternPos = -1,
    prePattern = "";

//the onkeydown event handler
var onKeyDownHandler = function (event) {
    if (source.length == 0) {
        source = nicks; //initialization in case we press Tab with no prior input
    }
    //Note: you may need to further play with the line below to enable support for additional UAs
    event = event || window.event; //+ support for IE8
    if (event.keyCode == 9) {
        //Note: you may need to further play with the line below to enable support for additional UAs
        event.preventDefault ? event.preventDefault() : event.returnValue = false; // + support for IE8
        if (prevKeyWasTab == false) {
            prevKeyWasTab = true;
            pattern = input.value;
            patternPos = pattern.lastIndexOf(" ");
            if (patternPos != -1 ) {
                prePattern = pattern.substr(0, patternPos + 1);
                pattern = pattern.substr(patternPos + 1);
            };
            pattern = new RegExp("^" + pattern, "i");
            sourcePos = 0;
            candidate = incrementalSearch(pattern, source, sourcePos);
            if (candidate.length > 0) {
                //candidate found
                input.value = prePattern + candidate;
                return;
            }
        } else {
            candidate = incrementalSearch(pattern, source, sourcePos);
            if (candidate.length > 0) {
                //candidate found
                input.value = prePattern + candidate;
                return;
            }
        }
    } else {
        prevKeyWasTab = false;
        prePattern = "";
        source = nicks; //we do not want the source to change during tabcompletion
    }
}

//helper function
var incrementalSearch = function (pattern, source, sp) {
    var result = "",
        r = 0,
        i = 0;
    for (i = sp; i < source.length; i++) {
        r = source[i].search(pattern);
        sourcePos = (i + 1 > source.length - 1) ? 0 : i + 1;
        if (r == 0) {
            return source[i];
        }
    }
    for (i = 0; i < sp; i++) {
        r = source[i].search(pattern);
        sourcePos = i + 1;
        if (r == 0) {
            return source[i];
        }
    }
    return result;
}

/*
 * tab completion ends here ------------------------------------------------
 */