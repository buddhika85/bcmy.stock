// IIFE to manage common utility functions
//(function () {

    // used to validate a provided string with specified regex pattern
    // ref - http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    function validateByRegex(element, regexPattern)
    {
        // email - /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        var isValid = false;
        if (regexPattern.test(element.val()))
        {
            isValid = true;
        }
        return isValid;
    }

    // used to check whether a passed string is null or empty
    function isNullOrEmpty(element)
    {
        var isNullOrEmpty = false;
        if (element.val() == null || $.trim(element.val()) == "")
        {
            isNullOrEmpty = true;
        }
        return isNullOrEmpty;
    }

    // used to validate a drop down list
    function isValidDropDownListSelection(element)
    {
        var isValidDDLSelection = false;
        try {
            if (parseInt(element.val(), 10) != -1) {
                isValidDDLSelection = true;
            }
        }
        catch (exception)
        {
            isValidDDLSelection = true;     // means a wording selection on ddl
        }        
        return isValidDDLSelection;
    }

    // if with in the string valae there are any spaces they will be replaced by ^ sign
    function cleanSpaces(value)
    {        
        if (value.indexOf(" ") >= 0)
        {
            // contains spaces - " "
            value = value.replace(" ", "^");
        }
        return value;
    }

    // returns true if its only a whole number
    function IsAWholeNumber(value)
    {        
        if (!(isNaN(value)))
        {
            if (value % 1 == 0)
            {
                //alert('Whole Number');
                return true;
            }
            else
            {
                //value('Not a Whole Number');
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    // returns true if its a whole or decimal number
    function IsANumber(value) {        
        if (!(isNaN(value))) 
            return true;        
        else 
            return false;        
    }

    // float value round up
    function RoundUpTo(floatValue, numOfDecimalPlaces)
    {
        floatValue = parseFloat(floatValue);
        return floatValue.toFixed(numOfDecimalPlaces);
    }

    // reloads current page without angular scope variables
    function ReloadCurrentPage()
    {
        window.location.reload();
    }

    // validation - on key press of numeric only <input /> tag
    function isNumberKey(evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }
//}());