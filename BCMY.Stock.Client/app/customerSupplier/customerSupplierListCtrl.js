// IIFE to manage customer/supplier controller
(function () {
    "use strict";
    var module = angular.module("stockManagement");         // get module

    // attach controller to the module
    module.controller("CustomerSupplierListCtrl",
        ["$http", "customerSupplierResource", "Upload", "blockUI", customerSupplierListCtrl]);

    // controller function
    function customerSupplierListCtrl($http, customerSupplierResource, Upload, blockUI)
    {        
        var vm = this;
        vm.apiUrl = 'http://localhost:61945/api/customerSupplier/';         // web API url for update and insert
        vm.newCustomerSupplier = {};
        vm.title = "Manage Customers/Suppliers";        
        
        blockUI.start();
        customerSupplierResource.query(function (data) {                    // REST API call to get all the customerSuppliers 
            vm.customerSuppliers = data;
            createPopulateDataGrid(vm, customerSupplierResource);           // populate the data grid
            blockUI.stop();
        });
        
        //$scope.$watch('files', function () {
        //    vm.onFileSelect(this.files);
        //});
        //vm.onFileSelect = function ($files) {                                // image upload to the server
        //    alert("image upload : ");
        //};

        vm.insertBusiness = function ()                                     // insert new customer/supplier
        {
            OnInsertBtnClick();
        };

        vm.saveBusiness = function ()                                       // on save button click
        {            
            var isValid = ValidateInputs();     // validation
            if (isValid)                        // save to DB if the changes are valid
            {
                EnableDisableFeilds(true);          // disable all fields once save button clicked
                // fliter POST or PUT request based on Insert or Update, that is customer Id hidden field value 
                var custId = $('#custId').val();                
                
                if (custId == -1) {
                    // insert                    
                    var newCustomerSupplier = getCustomerSupplierJsonObject(custId);    // creation of the json object                    
                    //var jsonStr = JSON.stringify(newCustomerSupplier);                  // covert to json string to pass to web service
                    var serverUrl = 'http://localhost:61945/api/customerSupplier?idVal=' + newCustomerSupplier.id + '&name=' + newCustomerSupplier.name + '&logo=""' +
                         '&addressLine1=' + newCustomerSupplier.addressLine1 + '&addressLine2=' + newCustomerSupplier.addressLine2 + '&addressLine3=' + newCustomerSupplier.addressLine3 +
                         '&postcode=' + newCustomerSupplier.postcode + '&country=' + newCustomerSupplier.country + '&telephone=' + newCustomerSupplier.telephone +
                         '&bank=' + newCustomerSupplier.bank + '&vatNumber=' + newCustomerSupplier.vatNumber + '&accountNumber=' + newCustomerSupplier.accountNumber +
                         '&sortcode=' + newCustomerSupplier.sortcode + '&iban=' + newCustomerSupplier.iban + '&swift=' + newCustomerSupplier.swift + '&active=' + newCustomerSupplier.active +
                         '&town=' + newCustomerSupplier.town + '&county=' + newCustomerSupplier.county;
                   
                    // save data via angular
                    $http({
                        method: "get",
                        headers: { 'Content-Type': 'application/json' },
                        url: serverUrl, //'http://localhost:61945/api/customerSupplier/',
                        //data: JSON.stringify(jsonStr)
                    })
                    .success(function (data) {
                        if (data == "success") {
                            // enable cancel button to escape from the popup
                            $('#btnCancel').attr("disabled", false);

                            // display success message
                            $('#lblErrorMessage').removeClass("errorLabel");
                            $('#lblErrorMessage').addClass("successLabel");                            
                            $('#lblErrorMessage').text("Save successful");
                                                        
                            // refersh the grid to display the new record
                            var table = $('#example').DataTable();
                            table.destroy();
                            customerSupplierResource.query(function (data) {                    // REST API call to get all the customerSuppliers 
                                vm.customerSuppliers = data;
                                createPopulateDataGrid(vm, customerSupplierResource);           // populate the data grid
                            });                            
                        }
                        else {
                            EnableDisableFeilds(false);          // enable all fields to re-enter/correct inputs

                            // display error message
                            $('#lblErrorMessage').removeClass("successLabel");
                            $('#lblErrorMessage').addClass("errorLabel");                            
                            $('#lblErrorMessage').text(data);
                        }
                    }).error(function (data) {
                        // display error message
                        $('#lblErrorMessage').removeClass("successLabel");
                        $('#lblErrorMessage').addClass("errorLabel");
                        $('#lblErrorMessage').text("Error - Angular - Contact IT support - Info :" + data);
                    });
                }
                else {
                    
                    // update 
                    var newCustomerSupplier = getCustomerSupplierJsonObject(custId);    // creation of the json object                    
                    //var jsonStr = JSON.stringify(updatedCustomerSupplier);                  // covert to json string to pass to web service
                    
                    var serverUrl = 'http://localhost:61945/api/customerSupplier?idVal=' + newCustomerSupplier.id + '&name=' + newCustomerSupplier.name + '&logo=""' +
                        '&addressLine1=' + newCustomerSupplier.addressLine1 + '&addressLine2=' + newCustomerSupplier.addressLine2 + '&addressLine3=' + newCustomerSupplier.addressLine3 +
                        '&postcode=' + newCustomerSupplier.postcode + '&country=' + newCustomerSupplier.country + '&telephone=' + newCustomerSupplier.telephone +
                        '&bank=' + newCustomerSupplier.bank + '&vatNumber=' + newCustomerSupplier.vatNumber + '&accountNumber=' + newCustomerSupplier.accountNumber +
                        '&sortcode=' + newCustomerSupplier.sortcode + '&iban=' + newCustomerSupplier.iban + '&swift=' + newCustomerSupplier.swift + '&active=' + newCustomerSupplier.active + 
                        '&town=' + newCustomerSupplier.town + '&county=' + newCustomerSupplier.county;
                                        
                    $http({
                        method: "get",
                        headers: { 'Content-Type': 'application/json' },
                        url: serverUrl, 
                    })
                    .success(function (data) {
                        if (data == "success") {
                            // enable cancel button to escape from the popup
                            $('#btnCancel').attr("disabled", false);

                            // display success message
                            $('#lblErrorMessage').removeClass("errorLabel");
                            $('#lblErrorMessage').addClass("successLabel");
                            $('#lblErrorMessage').text("Update successful");

                            // refersh the grid to display the updated record
                            var table = $('#example').DataTable();
                            table.destroy();
                            customerSupplierResource.query(function (data) {                    // REST API call to get all the customerSuppliers 
                                vm.customerSuppliers = data;
                                createPopulateDataGrid(vm, customerSupplierResource);           // populate the data grid
                            });
                        }
                        else {
                            EnableDisableFeilds(false);          // enable all fields to re-enter/correct inputs

                            // display error message
                            $('#lblErrorMessage').removeClass("successLabel");
                            $('#lblErrorMessage').addClass("errorLabel");
                            $('#lblErrorMessage').text(data);
                        }
                    }).error(function (data) {
                        // display error message
                        $('#lblErrorMessage').removeClass("successLabel");
                        $('#lblErrorMessage').addClass("errorLabel");
                        $('#lblErrorMessage').text("Error - Angular - Contact IT support - Info :" + data);
                    });
                }
            }
            //else {
            //    // Invalid user inputs
            //}
        }

        ApplyUiMasks();                                                     // jquery input mask formatters
    };

    // jquery UI masks to format user inputs
    function ApplyUiMasks()
    {
        // '+99-(9)9999 9999 next 3 numbers are optional'
        $('#inputTele').mask('+99 (9) 9999 9999?999');
        //$('#inputTele').blur(function () { alert("telephone : " + $('#inputTele').val());});
        $('#inputSortCode').mask('99-99-99'); 
    }

    // creates and return customerSupplierJson object for insert and update options
    function getCustomerSupplierJsonObject(custId)
    {        
        var customerSupplierJson = {
            "id": custId,
            "name": $.trim($('#inputName').val()),
            "logo": "",  //"logo": $('#inputLogo').val() == "" ? $.trim($('#logo').val()) : $.trim($('#inputLogo').val()),           
            "addressLine1": $.trim($('#inputAddLine1').val()),
            "addressLine2": $.trim($('#inputAddLine2').val()),
            "addressLine3": $.trim($('#inputAddLine3').val()),
            "town": $.trim($('#inputTown').val()),
            "county": $.trim($('#inputCounty').val()),
            "postcode": $.trim($('#inputPostCode').val()),
            "country": $.trim($('#selectCountry').val()),
            "telephone":  $.trim($('#inputTele').val()),
            "bank": $.trim($('#inputBank').val()),
            "vatNumber": $.trim($('#inputVat').val()),
            "accountNumber": $.trim($('#inputAccountNum').val()),
            "sortcode": $.trim($('#inputSortCode').val()),
            "iban": $.trim($('#inputIban').val()),
            "swift": $.trim($('#inputSwift').val()),
            "active": $('#inputActive').val() == 1 ? true : false,
            "creationDateTime": $.trim($('#creationDateTime').val()),
            "inactiveDateTime": null
        };

        return customerSupplierJson;
    }

    // returns true if the user inputs are valid
    function ValidateInputs()
    {
        RemoveOutlineBorders();
        var isValid = true;
        if (isNullOrEmpty($('#inputName'))) {
            ApplyErrorBorder($('#inputName'));
            DisplayErrorMessage("Please provide a valid name");
            isValid = false;
        }

        if (isValid && isNullOrEmpty($('#inputTele'))) {
            ApplyErrorBorder($('#inputTele'));
            DisplayErrorMessage("Please provide a telephone number");
            isValid = false;
        }

        if (isValid && isNullOrEmpty($('#inputAddLine1'))) {
            ApplyErrorBorder($('#inputAddLine1'));
            DisplayErrorMessage("Please provide a valid address line 1");
            isValid = false;
        }

        //if (isValid && isNullOrEmpty($('#inputAddLine2'))) {
        //    ApplyErrorBorder($('#inputAddLine2'));
        //    DisplayErrorMessage("Please provide a valid address line 2");
        //    isValid = false;
        //}

        //if (isValid && isNullOrEmpty($('#inputAddLine3'))) {
        //    ApplyErrorBorder($('#inputAddLine3'));
        //    DisplayErrorMessage("Please provide a valid address line 3");
        //    isValid = false;
        //}

        if (isValid && isNullOrEmpty($('#inputTown'))) {
            ApplyErrorBorder($('#inputTown'));
            DisplayErrorMessage("Please provide a valid town");
            isValid = false;
        }

        if (isValid && isNullOrEmpty($('#inputCounty'))) {
            ApplyErrorBorder($('#inputCounty'));
            DisplayErrorMessage("Please provide a valid county");
            isValid = false;
        }

        if (isValid && isNullOrEmpty($('#inputPostCode'))) {
            ApplyErrorBorder($('#inputPostCode'));
            DisplayErrorMessage("Please provide a valid postcode");
            isValid = false;
        }

        if (isValid && isNullOrEmpty($('#selectCountry'))) {
            ApplyErrorBorder($('#selectCountry'));
            DisplayErrorMessage("Please select a country");
            isValid = false;
        }

        // optional account holder name field
        //if (isValid && isNullOrEmpty($('#inputBank'))) {

        //    ApplyErrorBorder($('#inputBank'));
        //    DisplayErrorMessage("Please provide a valid account holder name");
        //    isValid = false;
        //}

        //if (isValid && isNullOrEmpty($('#inputAccountNum'))) {
        //    ApplyErrorBorder($('#inputAccountNum'));
        //    DisplayErrorMessage("Please provide an account number");
        //    isValid = false;
        //}

        //if (isValid && isNullOrEmpty($('#inputVat'))) {
        //    ApplyErrorBorder($('#inputVat'));
        //    DisplayErrorMessage("Please provide a VAT number");
        //    isValid = false;
        //}

        return isValid;
    }

    // used to display error messages in the popup
    function DisplayErrorMessage(errorMessage) {
        $('#lblErrorMessage').removeClass("successLabel");
        $('#lblErrorMessage').addClass("errorLabel");
        $('#lblErrorMessage').text(errorMessage);
    }

    // used to apply red outline border for the validation errors of fields
    function ApplyErrorBorder(element) {
        element.addClass("errorBorder");
    }

    // used to remove error indicating outline borders
    function RemoveOutlineBorders() {
        $('#inputName').removeClass("errorBorder");
        $('#inputAddLine1').removeClass("errorBorder");
        $('#inputAddLine2').removeClass("errorBorder");
        $('#inputAddLine3').removeClass("errorBorder");
        $('#inputTown').removeClass("errorBorder");
        $('#inputCounty').removeClass("errorBorder");
        $('#inputPostCode').removeClass("errorBorder");
        $('#selectCountry').removeClass("errorBorder");
        $('#inputTele').removeClass("errorBorder");
        $('#inputBank').removeClass("errorBorder");
        $('#inputVat').removeClass("errorBorder");
        $('#inputAccountNum').removeClass("errorBorder");
    }

    // Adding new customer/supplier
    function OnInsertBtnClick()
    {
        RemoveOutlineBorders();
        $('#custId').val(-1);
        //$('#inputLogo').val("")
        $('#creationDateTime').val("");
        $('#logo').val("");
        $('#inputName').val("");
        //$('#inputLogo').val("");
        $('#inputTele').val("");
        $('#inputAddLine1').val("");
        $('#inputAddLine2').val("");
        $('#inputAddLine3').val("");
        $('#inputTown').val("");
        $('#inputCounty').val("");
        $('#inputPostCode').val("");
        $('#inputBank').val("");
        $('#inputAccountNum').val("");
        $('#inputSortCode').val("");
        $('#inputVat').val("");
        $('#inputIban').val("");
        $('#inputSwift').val("");
        $('#selectCountry').val("United Kingdom");
        $('#modalTitle').text("Add new Customer/Supplier");
        $('#lblErrorMessage').text("");
        EnableDisableFeilds(false);
        $('#myModal').modal({
            show: true,
            keyboard: true,
            backdrop: true
        });
    }

    // used to enable/disable fields based on the param passed
    function EnableDisableFeilds(isDisabled)
    {
        $('#inputName').attr("disabled", isDisabled);
        //$('#inputLogo').attr("disabled", isDisabled);
        $('#inputTele').attr("disabled", isDisabled);
        $('#inputAddLine1').attr("disabled", isDisabled);
        $('#inputAddLine2').attr("disabled", isDisabled);
        $('#inputAddLine3').attr("disabled", isDisabled);
        $('#inputTown').attr("disabled", isDisabled);
        $('#inputCounty').attr("disabled", isDisabled);
        $('#inputPostCode').attr("disabled", isDisabled);
        $('#inputBank').attr("disabled", isDisabled);
        $('#inputAccountNum').attr("disabled", isDisabled);
        $('#inputSortCode').attr("disabled", isDisabled);
        $('#inputVat').attr("disabled", isDisabled);
        $('#inputIban').attr("disabled", isDisabled);
        $('#inputSwift').attr("disabled", isDisabled);
        $('#btnSave').attr("disabled", isDisabled);
        $('#btnCancel').attr("disabled", isDisabled);
        $('#selectCountry').attr("disabled", isDisabled);
        $('#inputActive').attr("disabled", isDisabled);
    }

    // populates form popup fields based on passed customerSupplier object
    function populateFormPopup(customerSupplier)
    {
        $('#custId').val(customerSupplier.id);
        $('#creationDateTime').val(customerSupplier.creationDateTime);
        $('#inputName').val(customerSupplier.name);
        $('#logo').val(customerSupplier.logo);
        //$('#inputLogo').val("");        
        $('#inputActive').val(customerSupplier.active == true ? "1" : "0");
        $('#inputTele').val(customerSupplier.telephone);
        $('#inputAddLine1').val(customerSupplier.addressLine1);
        $('#inputAddLine2').val(customerSupplier.addressLine2);
        $('#inputAddLine3').val(customerSupplier.addressLine3);
        $('#inputTown').val(customerSupplier.town)
        $('#inputCounty').val(customerSupplier.county)
        $('#inputPostCode').val(customerSupplier.postcode);
        $('#selectCountry').val(customerSupplier.country);
        $('#inputBank').val(customerSupplier.bank);
        $('#inputAccountNum').val(customerSupplier.accountNumber);
        $('#inputSortCode').val(customerSupplier.sortcode);
        $('#inputVat').val(customerSupplier.vatNumber);
        $('#inputIban').val(customerSupplier.iban);
        $('#inputSwift').val(customerSupplier.swift);
        $('#lblErrorMessage').text("");
    }

    // Editing existing customer/supplier
    function OnEditBtnClick(record, customerSupplierResource)
    {
        var customerSupplier = null;
        RemoveOutlineBorders();
        if (record != null) {
            // REST API call to get the customerSuppliers by Id
            customerSupplierResource.get({ id: record.id }, function (data) {
                customerSupplier = data;
                // populate the Edit form and pop it up
                if (customerSupplier != null) {
                    populateFormPopup(customerSupplier);
                    EnableDisableFeilds(false);
                    $('#lblErrorMessage').text("");
                    $('#modalTitle').text("Editing Customer/Supplier : " + customerSupplier.name);
                    $('#myModal').modal({
                        show: true,
                        keyboard: true,
                        backdrop: true
                    });
                }
                else {
                    alert("Error - Selected customer does not exist");
                }
            });
        }
        //else {
        //    alert("Error - Please select a customer/supplier first");
        //}
    }

    // View information on existing customer/supplier
    function OnInfoBtnClick(record, customerSupplierResource)
    {
        var customerSupplier = null;
        if (record != null) {
            // REST API call to get the customerSuppliers by Id
            customerSupplierResource.get({ id: record.id }, function (data) {
                customerSupplier = data;
                // populate the Edit form and pop it up
                if (customerSupplier != null) {
                    populateFormPopup(customerSupplier);
                    EnableDisableFeilds(true);
                    $('#lblErrorMessage').text("");
                    $('#modalTitle').text("Infomation Customer/Supplier : " + record.name);
                    $('#myModal').modal({
                        show: true,
                        keyboard: true,
                        backdrop: true
                    });
                }
                else {
                    alert("Error - Selected customer does not exist");
                }
            });
        }
        //else {
        //    alert("Error - Please select a customer/supplier first");
        //}
    }

    // Below function is used to create and populate the JS DataTable Grid
    function createPopulateDataGrid(viewModel, customerSupplierResource)
    {
        // basic grid creation
        // { "mData": "logo", "sTitle": "Logo", "bVisible": false },
        // data population
        $('#example').dataTable({
            "data": viewModel.customerSuppliers,
            "aoColumns": [
                    { "mData": "id", "sTitle": "ID", "bVisible": false },                    
                    { "mData": "creationDateTime", "sTitle": "Creation Date Time", "bVisible": false },                    
                    { "mData": "name", "sTitle": "Customer/Supplier Name" },
                    {
                        "mData": "logo", "bVisible": false, "sTitle": "Logo", "mRender": function (data, type, row) {
                            if (data != null) {
                                return '<img src = ' + data + ' style="height:18px;width:19px;"></img>';
                            }
                            else {
                                return "No Logo uploaded";
                            }
                        },
                        "aTargets": [0]
                    },
                    { "mData": "telephone", "sTitle": "Telephone" },
                    { "mData": "country", "sTitle": "Country" },
                    { "sTitle": "View More", "defaultContent": "<button class='businessInfo'>Info!</button>" },
                    { "sTitle": "Edit Info", "defaultContent": "<button class='businessEdit'>Edit</button>" },
            ]
        });

        // data table
        var table = $('#example').DataTable();

        // on info button clicks
        $('#example tbody').on('click', 'button.businessInfo', function () {
            var data = table.row($(this).parents('tr')).data();
            //alert("View Info : " + data.id + " - " + data.name);
            OnInfoBtnClick(data, customerSupplierResource);
        });

        // on edit button clicks
        $('#example tbody').on('click', 'button.businessEdit', function () {
            var data = table.row($(this).parents('tr')).data();
            //alert("Edit Info : " + data.id + " - " + data.name);
            OnEditBtnClick(data, customerSupplierResource);
        });

        // row selection in the data grid        
        $('#example tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
    }

}());