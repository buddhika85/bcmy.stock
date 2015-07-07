// IIFE to manage contacts controller
(function () {

    "use strict";

    var module = angular.module("stockManagement");                 // get module

    // attach controller to the module
    module.controller("ContactListCtrl", ["$http", "contactResource", "blockUI", "customerSupplierResource", contactListCtrl]);

    // controller funcion
    function contactListCtrl($http, contactResource, blockUI, customerSupplierResource)
    {
        var vm = this;
        vm.title = "Manage Contacts of the Customers/Suppliers";
        vm.apiUrl = 'http://localhost:61945/api/contact/';          // web API url for update and insert

        blockUI.start();
        contactResource.query(function (data) {                     // REST API call to get all the contacts with company names 
            vm.contacts = data;
            createPopulateDataGrid(vm, contactResource);            // populate the data grid
            blockUI.stop();
        });

        populateCompanyDropDown(customerSupplierResource);          // used to populate company ddl for the popups

        vm.insertContact = function ()                              // insert new contact person
        {
            OnInsertBtnClick();
        };

        vm.saveContact = function ()                                // on save button click of the popup
        {            
            var isValid = ValidateInputs();     // validation
            if (isValid)                        // save to DB if the changes are valid
            {
                EnableDisableFeilds(true);          // disable all fields once save button clicked

                // fliter POST or PUT request based on Insert or Update, that is contact Id hidden field value 
                var contactId = $('#contactId').val();
                                
                if (contactId == -1) {
                    // insert                    
                    var newContact = getContactJsonObject(contactId);                   // creation of the json object                    
                    //var jsonStr = JSON.stringify(newContact);                           // covert to json string to pass to web service
                    var serverUrl = 'http://localhost:61945/api/contact?id=' + newContact.id + '&title=' + newContact.title + '&firstName=' + newContact.firstName + '&lastName=' + newContact.lastName
                        + '&position=' + newContact.position + '&directDial=' + newContact.directDial + '&email=' + newContact.email + '&status=' + newContact.status + '&notes=' + newContact.notes
                        + '&customerSupplierId=' + newContact.customerSupplierId + '&extension=' + newContact.extension;

                    // save data via angular
                    $http({
                        method: "get",
                        headers: { 'Content-Type': 'application/json' },
                        url: serverUrl
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
                            contactResource.query(function (data) {                    // REST API call to get all the contacts 
                                vm.contacts = data;
                                createPopulateDataGrid(vm, contactResource);           // populate the data grid
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
                    var newContact = getContactJsonObject(contactId);          // creation of the json object                    
                    //var jsonStr = JSON.stringify(newContact);                  // covert to json string to pass to web service
                    var serverUrl = 'http://localhost:61945/api/contact?id=' + newContact.id + '&title=' + newContact.title + '&firstName=' + newContact.firstName + '&lastName=' + newContact.lastName
                        + '&position=' + newContact.position + '&directDial=' + newContact.directDial + '&email=' + newContact.email + '&status=' + newContact.status + '&notes=' + newContact.notes
                        + '&customerSupplierId=' + newContact.customerSupplierId + '&extension=' + newContact.extension;

                    $http({
                        method: "get",
                        headers: { 'Content-Type': 'application/json' },
                        url: serverUrl
                        //data: JSON.stringify(jsonStr)
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
                            contactResource.query(function (data) {                    // REST API call to get all the contacts 
                                vm.contacts = data;
                                createPopulateDataGrid(vm, contactResource);           // populate the data grid
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
        };

        ApplyUiMasks();                                                     // jquery input mask formatters
    };

    // jquery UI masks to format user inputs
    function ApplyUiMasks() {
        // '+99-(9)9999 9999 next 3 numbers are optional'
        $('#inputlDirectDial').mask('+99 (9) 9999 9999?999');
        //$('#inputlDirectDial').blur(function () { alert("telephone : " + $('#inputlDirectDial').val());});       
    }

    // returns contact json object based on user inputs
    function getContactJsonObject(contactId)
    {
        var contactJson = {
            "id": contactId,
            "title": $.trim($('#selectTitle').val()),
            "firstName": $.trim($('#inputfName').val()),
            "lastName": $.trim($('#inputlName').val()),
            "position": $.trim($('#inputDesignation').val()),
            "directDial": $.trim($('#inputlDirectDial').val()),
            "extension": $.trim($('#inputlExt').val()),
            "email": $.trim($('#inputEmail').val()),
            "status": $.trim($('#selectStatus').val()),
            "notes": $.trim($('#txtNotes').val()),
            "customerSupplierId": $.trim($('#selectCompany').val())
        };

        return contactJson;
    }

    // used to populate company ddl for the popups
    function populateCompanyDropDown(customerSupplierResource)
    {
        customerSupplierResource.query(function (data) {            // REST API call to get all the companies with company names
            var listitems = '<option value=-1 selected="selected">---- Select Customer / Supplier ----</option>';
            $.each(data, function (index, item) {
                listitems += '<option value=' + item.id + '>' + item.name + '</option>';
            });
            $("#selectCompany option").remove();
            $("#selectCompany").append(listitems);
        });
    }

    // Insert new contact person for a company
    function OnInsertBtnClick() {
        
        $('#contactId').val(-1);
        $('#selectCompany').val(-1);
        $('#inputDesignation').val("");
        $('#txtAreaOthers').val("");
        $('#selectStatus').val("active");        
        $('#selectTitle').val(-1);
        $('#inputfName').val("");
        $('#inputlName').val("");
        $('#inputlDirectDial').val("");
        $('#inputlExt').val("");
        $('#inputEmail').val("");
        $('#txtNotes').val("");
        $('#modalTitle').text("Add new Contact");
        $('#lblErrorMessage').text("");
        EnableDisableFeilds(false);
        RemoveOutlineBorders();
        $('#myModal').modal({
            show: true,
            keyboard: true,
            backdrop: true
        });
    }

    // Below function is used to create and populate the JS DataTable Grid
    function createPopulateDataGrid(viewModel, contactResource) {        
        // basic grid creation
        // data population        
        $('#example').dataTable({
            "data": viewModel.contacts,
            "aoColumns": [
                    { "mData": "id", "sTitle": "ID", "bVisible": false },
                    { "mData": "customerSupplierName", "sTitle": "Company" },
                    { "mData": "title", "sTitle": "Title" },
                    { "mData": "firstName", "sTitle": "First name" },
                    { "mData": "lastName", "sTitle": "Last name" },
                    { "mData": "position", "sTitle": "Designation" },
                    { "mData": "status", "sTitle": "Status" },
                    { "mData": "directDial", "sTitle": "Telephone" },
                    { "mData": "extension", "sTitle": "Ext" },
                    { "mData": "email", "sTitle": "Email" },
                    { "mData": "notes", "sTitle": "Notes", "bVisible": false },
                    { "mData": "customerSupplierId", "sTitle": "Company", "bVisible": false },
                    
                    
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
            OnInfoBtnClick(data, contactResource);
        });

        // on edit button clicks
        $('#example tbody').on('click', 'button.businessEdit', function () {
            var data = table.row($(this).parents('tr')).data();
            //alert("Edit Info : " + data.id + " - " + data.name);
            OnEditBtnClick(data, contactResource);
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

    // Editing existing contact person
    function OnEditBtnClick(record, contactResource) {        
        var contact = null;
        if (record != null) {
            // REST API call to get the contact by Id
            contactResource.get({ id: record.id }, function (data) {
                contact = data;
                // populate the Edit form and pop it up
                if (contact != null) {
                    populateFormPopup(contact);
                    EnableDisableFeilds(false);
                    RemoveOutlineBorders();
                    $('#lblErrorMessage').text("");
                    $('#modalTitle').text("Editing Contact : " + contact.firstName + " " + contact.lastName);
                    $('#myModal').modal({
                        show: true,
                        keyboard: true,
                        backdrop: true
                    });
                }
                else {
                    alert("Error - Selected contact does not exist");
                }
            });
        }
    }

    // View information on existing contact person
    function OnInfoBtnClick(record, contactResource) {        
        var contact = null;
        if (record != null) {
            // REST API call to get the contact by Id
            contactResource.get({ id: record.id }, function (data) {
                contact = data;
                // populate the Edit form and pop it up
                if (contact != null) {
                    populateFormPopup(contact);
                    EnableDisableFeilds(true);
                    RemoveOutlineBorders();
                    $('#lblErrorMessage').text("");
                    $('#modalTitle').text("Infomation on Contact : " + contact.firstName + " " + contact.lastName);
                    $('#myModal').modal({
                        show: true,
                        keyboard: true,
                        backdrop: true
                    });
                }
                else {
                    alert("Error - Selected contact does not exist");
                }
            });
        }
    }

    // Used to enable/disable form fields
    function EnableDisableFeilds(isDisabled)
    {
        $('#selectCompany').attr("disabled", isDisabled);
        $('#inputDesignation').attr("disabled", isDisabled);
        $('#txtAreaOthers').attr("disabled", isDisabled);
        $('#selectStatus').attr("disabled", isDisabled);
        $('#selectTitle').attr("disabled", isDisabled);
        $('#inputfName').attr("disabled", isDisabled);
        $('#inputlName').attr("disabled", isDisabled);
        $('#inputlDirectDial').attr("disabled", isDisabled);
        $('#inputlExt').attr("disabled", isDisabled); 
        $('#inputEmail').attr("disabled", isDisabled);
        $('#txtNotes').attr("disabled", isDisabled);
        $('#btnSave').attr("disabled", isDisabled);
        $('#btnCancel').attr("disabled", isDisabled);
    }

    // populates form popup fields based on passed contact object
    function populateFormPopup(contact) {
        $('#contactId').val(contact.id);
        $('#selectCompany').val(contact.customerSupplierId);
        $('#inputDesignation').val(contact.position);
        $('#txtAreaOthers').val(contact.others == "" ? "No one else" : contact.others);
        $('#selectStatus').val(contact.status);
        $('#selectTitle').val(contact.title);
        $('#inputfName').val(contact.firstName);
        $('#inputlName').val(contact.lastName);
        $('#inputlDirectDial').val(contact.directDial);
        $('#inputlExt').val(contact.extension);
        $('#inputEmail').val(contact.email);
        $('#txtNotes').val(contact.notes);
        
        $('#lblErrorMessage').text("");
    }

    // returns true if the user inputs are valid
    function ValidateInputs() {

        var isValid = true;
        RemoveOutlineBorders();                                                                         // remove previouse error indications if any
        $('#lblErrorMessage').text('');

        if (!isValidDropDownListSelection($('#selectCompany')))
        {
            ApplyErrorBorder($('#selectCompany'));                                                      // indicate error
            DisplayErrorMessage("Please select a valid customer/supplier (company)");                   // update error message
            isValid = false;
        }

        if (isValid && isNullOrEmpty($('#inputDesignation')))
        {
            ApplyErrorBorder($('#inputDesignation'));                                                   
            DisplayErrorMessage("Please provide a designation");                                        
            isValid = false;
        }

        if (isValid && (! isValidDropDownListSelection($('#selectTitle')) )) {
            ApplyErrorBorder($('#selectTitle'));                                                      
            DisplayErrorMessage("Please select a valid title for the contact");                       
            isValid = false;
        }
        
        if (isValid && isNullOrEmpty($('#inputfName'))) {
            ApplyErrorBorder($('#inputfName'));                                                   
            DisplayErrorMessage("Please provide a first name");                                        
            isValid = false;
        }
        
        if (isValid && isNullOrEmpty($('#inputlName'))) {
            ApplyErrorBorder($('#inputlName'));
            DisplayErrorMessage("Please provide a last name");
            isValid = false;
        }

        if (isValid && isNullOrEmpty($('#inputlDirectDial'))) {
            ApplyErrorBorder($('#inputlDirectDial'));
            DisplayErrorMessage("Please provide a telephone number");
            isValid = false;
        }
        
        if (isValid && isNullOrEmpty($('#inputEmail'))) {
            ApplyErrorBorder($('#inputEmail'));
            DisplayErrorMessage("Please provide an email address");
            isValid = false;
        }
        else if (isValid) {
            if (!validateByRegex($('#inputEmail'), /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i))
            {
                ApplyErrorBorder($('#inputEmail'));
                DisplayErrorMessage("Please provide a valid email address");
                isValid = false;
            }
        }
        
        return isValid;
    }

    // used to display error messages in the popup
    function DisplayErrorMessage(errorMessage)
    {
        $('#lblErrorMessage').removeClass("successLabel");
        $('#lblErrorMessage').addClass("errorLabel");
        $('#lblErrorMessage').text(errorMessage);
    }

    // used to apply red outline border for the validation errors of fields
    function ApplyErrorBorder(element)
    {
        element.addClass("errorBorder");
    }

    // used to remove error indicating outline borders
    function RemoveOutlineBorders()
    {
        $('#selectCompany').removeClass("errorBorder");
        $('#inputDesignation').removeClass("errorBorder");
        $('#txtAreaOthers').removeClass("errorBorder");
        $('#selectStatus').removeClass("errorBorder");
        $('#selectTitle').removeClass("errorBorder");
        $('#inputfName').removeClass("errorBorder");
        $('#inputlName').removeClass("errorBorder");
        $('#inputlDirectDial').removeClass("errorBorder");
        $('#inputlExt').removeClass("errorBorder");
        $('#inputEmail').removeClass("errorBorder");        
    }

}());