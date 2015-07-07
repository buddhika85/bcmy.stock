// IIFE - to manage status web service call the REST service
(function () {
    "use strict";

    angular
        .module("common.services")
        .factory("statusResource",
                ["$resource",
                 "appSettings",
                    statusResource])

    function statusResource($resource, appSettings) {
        return $resource(appSettings.serverPath + "/api/status/:id", null, {
            'update': { method: 'PUT' }
        });
    }

}());