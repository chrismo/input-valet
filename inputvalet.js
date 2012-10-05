// InputValet provides a set of functions to both reformat and validate an input
// using a regex and a separator. It also provides pre- and post- hooks for
// altering the input / output values before and after the formatting.
//
// This was written to support the strict zipcode formatting required by AVS
// checks for credit cards in the UK.


// Create a new InputValet.
//
// options - a dictionary of options (all optional):
//           regexes     - a list of regexes to use to reformat and validate the
//                         input
//           separator   - this will be stripped from the string, then replaced
//                         between each matched group in the regexes.
//           preProcess  - a function that takes one argument and returns a
//                         string, if preprocessing of the value is desired.
//           postProcess - a function that takes one argument and returns a
//                         string, if preprocessing of the value is desired.
function InputValet(options) {
    this.regexes = options.regexes || [];
    this.separator = options.separator || '';
    this.preProcess = options.preProcess || null;
    this.postProcess = options.postProcess || null;
}

InputValet.prototype = {

    // Private: retrieve the new value for the input.
    //
    // Applies the formatting and validation to the given value.
    formattedValue: function (value) {
        value = (this.preProcess && value) ? this.preProcess(value) : value;
        value = this.reformat(value);
        return (this.postProcess && value) ? this.postProcess(value) : value;
    },

    // Private: reformat the given value
    //
    // returns a reformatted string, or null if not matched
    reformat: function (value) {
        var stripped = value.replace(new RegExp(this.separator, 'gi'), '');

        // iterate over the regexes until one matches
        for (var i = 0; i < this.regexes.length; i++) {
            var regex = this.regexes[i];

            // when the regex matches, join the matched parts with the
            // separator, and return it.
            if (regex.test(stripped)) {
                match = regex.exec(stripped);
                if (match.length == 1) {
                    return match[0];
                }
                var accum = '';
                for (var j = 1; j < match.length; j++) {
                    if (accum.length > 0) {
                        accum += this.separator;
                    }
                    accum += match[j];
                }
                return accum;
            }
        }
        return null;
    },

    // Public: hook into the keyup event on an input. Useful for debugging.
    hookKeyUp:function (input) {
        var valet = this;
        input.keyup(function () {
            var $input = $(this);
            var formatted = valet.formattedValue($input.val());
            if (formatted === null) {
                $input.css('background-color', 'red');
            }
            else if (input.val() != formatted) {
                $input.css('background-color', 'white');
                $input.val(formatted);
            }
        });
    },

    // Public: define a jQuery validator for this input and configuration.
    //
    // To attach the actual validation to the input, give the input the
    // className class (if used), or bind the validation directly, e.g.
    //
    //   $('form').validate({
    //      rules: {
    //        'inputName': {
    //          ruleName: true
    //        }
    //      }
    //    });
    //
    // ruleName  - the name of the validation rule to add to the validator
    // message   - the error message to display when validation fails
    // className - an optional class name to add for the validation
    defineJQueryValidator:function (ruleName, message, className) {
        var valet = this;

        $.validator.addMethod(ruleName, function (current, element) {
            var formatted = valet.formattedValue(current);
            var valid = formatted !== null;
            if (valid && $(element).val() != formatted) {
                $(element).val(formatted);
            }
            return valid;
        }, message);

        if (className) {
            var hash = {};
            hash[ruleName] = true;
            $.validator.addClassRules(className, hash);
        }
    }
};
