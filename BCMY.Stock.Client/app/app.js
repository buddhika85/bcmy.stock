// IIFE to manage main module of the Stock application

(function () {

    "use strict";
    var app = angular.module("stockManagement",
                                ["ui.router", "common.services", "ngFileUpload", "blockUI"]);

    app.config(["$stateProvider",
                "$urlRouterProvider",
                "blockUIConfig",
                    function ($stateProvider, $urlRouterProvider, blockUIConfig) {

                        // block UI - change the default overlay message
                        blockUIConfig.message = 'Please wait';

                        // landing page
                        $urlRouterProvider.otherwise("/dashboard");

                        // dashboard
                        $stateProvider.state("dashboard", {
                            url: "/dashboard",
                            templateUrl: "app/dashboard/dashboardView.html",
                            controller: "DashboardCtrl as vm"
                        })
                        // customerSuppliers
                        .state("customerSupplierList", {
                            url: "/customerSupplier",
                            templateUrl: "app/customerSupplier/customerSupplierListView.html",
                            controller: "CustomerSupplierListCtrl as vm"
                        })
                        // contact
                        .state("contactList", {
                            url: "/contact",
                            templateUrl: "app/contact/contactListView.html",
                            controller: "ContactListCtrl as vm"
                        })
                        // sales orders
                        .state("searchSalesOrders", {
                            url: "/order/salesOrder/search",
                            templateUrl: "app/order/salesOrder/searchSalesOrdersView.html",
                            controller: "SearchSalesOrdersCtrl as vm"
                        })
                        .state("addEditSalesOrders", {
                            url: "/order/salesOrder/addSalesOrder",
                            templateUrl: "app/order/salesOrder/addEditSalesOrderView.html",
                            controller: "AddEditSalesOrderCtrl as vm"
                        })
                        // edit sales order
                        .state("editSalesOrders", {
                            url: "/order/salesOrder/editSalesOrder",
                            templateUrl: "app/order/salesOrder/editSalesOrderView.html",
                            controller: "EditSalesOrderCtrl as vm"
                        })
                    }
                ]
    );

    

}());