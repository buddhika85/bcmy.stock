// IIFE - to manage Contacts web service call the REST service
(function () {
    "use strict";

    angular
        .module("common.services")
        .factory("contactResource",
                ["$resource",
                 "appSettings",
                    contactResource])

    function contactResource($resource, appSettings) {
        return $resource(appSettings.serverPath + "/api/contact/:id", null, {
            'update': { method: 'PUT' }
        });
    }

}());