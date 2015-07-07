// IIFE to manage dashboard controller
(function () {
    "use strict";
    var module = angular.module("stockManagement");         // get module
    var dashboardCtrl = function ()                   // controller funcion
    {
        var vm = this;
        vm.title = "Main Dashboard";
    };
    module.controller("DashboardCtrl", [dashboardCtrl]);    // attach controller to the module

}());