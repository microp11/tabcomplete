(function ($) {

    $.fn.tabComplete = function (nicks) {

        return this.each(function () {

            // Variables used in tab completion
            var prevKeyWasTab = false,
                pattern = "", // Text fragment respective pattern to look for
                candidate = "", // Candidate
                source = [], // Array of values to be matched
                sourcePos = 0, // The search starting position
                // Varibles used in multi tab completion
                patternPos = -1,
                prePattern = "",
                el = $(this); // Element

            // Start snippet
            el.bind('keydown', function (event) {
                if (source.length === 0) {
                    source = nicks; // Initialization in case we press Tab with no prior input
                }
                if (event.keyCode === 9) {
                    event.preventDefault();
                    if (prevKeyWasTab === false) {
                        prevKeyWasTab = true;
                        pattern = el.val();
                        patternPos = pattern.lastIndexOf(" ");
                        if (patternPos !== -1) {
                            prePattern = pattern.substr(0, patternPos + 1);
                            pattern = pattern.substr(patternPos + 1);
                        }
                        pattern = new RegExp("^" + pattern, "i");
                        sourcePos = 0;
                        candidate = incrementalSearch(pattern, source, sourcePos);
                        if (candidate.length > 0) {
                            // Candidate found
                            el.val(prePattern + candidate);
                            return;
                        }
                    } else {
                        candidate = incrementalSearch(pattern, source, sourcePos);
                        if (candidate.length > 0) {
                            // Candidate found
                            el.val(prePattern + candidate);
                            return;
                        }
                    }
                } else {
                    prevKeyWasTab = false;
                    prePattern = "";
                    source = nicks; // We do not want the source to change during tabcompletion
                }
            });

            var incrementalSearch = function (pattern, source, sp) {
                var result = "",
                    r = 0,
                    i = sp;
                for (i; i < source.length; i++) {
                    r = source[i].search(pattern);
                    sourcePos = (i + 1 > source.length - 1) ? 0 : i + 1;
                    if (r === 0) {
                        return source[i];
                    }
                }
                for (i = 0; i < sp; i++) {
                    r = source[i].search(pattern);
                    sourcePos = i + 1;
                    if (r === 0) {
                        return source[i];
                    }
                }
                return result;
            };

        });

    };

})( jQuery );