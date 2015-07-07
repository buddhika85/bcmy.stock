// IIFE to manage common service calls

// setting REST web service URL
// Needs to be replaced with actual URL in the production enviroment 
(function () {
    "use strict";

    angular
        .module("common.services",
                    ["ngResource"])
    	.constant("appSettings",
        {
            serverPath: "http://localhost:61945"
        });
}());