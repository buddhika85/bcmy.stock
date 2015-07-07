// IIFE - to manage edit sales orders
(function () {
    "use strict";

    var module = angular.module("stockManagement");

    module.controller("EditSalesOrderCtrl",
        ["$http", "contactResource", "blockUI", "customerSupplierResource", '$location', editSalesOrderCtrl]);

    // controller
    function editSalesOrderCtrl($http, contactResource, blockUI, customerSupplierResource, $location)
    {
        var vm = this;
        var searchObject = $location.search();                                                      // get order Id, that passed as query string
        var salesOrderId = searchObject.orderId;

        vm.title = "Edit Sales Order : Id = " + salesOrderId;
        $('#orderId').val(salesOrderId);                                                            // set sales order Id
        prepareInitialUI($http, customerSupplierResource, contactResource, salesOrderId);           // initial UI
        

        wireCommands(vm, $http, contactResource, customerSupplierResource);
    };

    // used to bind drop down list selection change commands for cascading ddls
    function wireCommands(vm, $http, contactResource, customerSupplierResource)
    {

        // BindDDLSelectionChangeCommands
        // on a company selection
        $('#selectCustSupp').change(function () {
            onCompanyDDLSelection($http, contactResource);
        });

        // on a contact name selection
        $('#selectContact').change(function () {
            onContactDDLSelection($http, customerSupplierResource);
        });

        // on product category selection change
        $('#selectCategory').change(function () {
            onCategorySelection($http, $('#selectCategory'));
        });

        // on product condition selection change
        $('#selectCondition').change(function () {
            onConditionSelection($http, $('#selectCondition'));
        });

        // on product brand selection change
        $('#selectBrand').change(function () {            
            onBrandSelection($http, $('#selectBrand'));
        });
        
        // on create order button click
        vm.createOrder = function () {            
            var isValid = ValidateCustContactSelections();
            //alert("validate customer and compnay selection then create a new order record in the database : " + isValid);
            if (isValid) {
                CreateAnOrder($http);
            }
        }

        // on search products button click
        vm.searchProducts = function () {
            DestroyTable();
            $('#productsGridDiv').removeClass('is-hidden');
            SearchProducts($http);
        }
        // on reset search button click        
        vm.resetSearch = function () {
            ResetSearchDDLs();
        }

        // collapse product search grid
        $('#productPanelHeading').click(function () {
            $('#productsGridDiv').toggleClass('is-hidden');
        });

        // collapse buyer seller selection panel
        $('#customerHeaderPanel').click(function () {
            $('#customerSection').toggleClass('is-hidden');
        });

        // collapse product search panel
        $('#productSearchPanelHeading').click(function () {
            $('#productSerahcForm').toggleClass('is-hidden');
        });

        // collpase order details panel
        $('#orderDetailsPanelHeading').click(function () {
            $('#orderlinesSection').toggleClass('is-hidden');
        });

        // save a negotiation
        vm.recordNegotiation = function () {
            //alert("record negotation");
            RecordNegotiation($http);
        };

        // insert an orderline
        vm.addOrderline = function () {
            //alert("add orderline");
            InsertOrderLine($http);
        };

        // quantity input change
        $('#quantityInput').change(function () {
            calculateTotalIncome();            
        });

        // on price offered input change
        $('#priceInput').change(function () {
            calculateTotalIncome();
        });

        // on download order report button click
        vm.downloadOrderReport = function () {
            alert("Download order report - under construction");
        }

        // on confirm order button click
        vm.confirmOrder = function () {
            //alert("On confirm order button click -
            //make sure all orderlines are in confirmed status - update order record - reduce stock count");
            confirmOrder($http);
        }

        // reloads the same page with no scope variable data
        vm.ReloadPage = function () {
            ReloadCurrentPage();            // from Util JS file
        };
    }

    // used to confirm an order
    function confirmOrder($http) {

        DisplayErrorMessage('', $('#lblErrorOrderLineMessage'));                            // clean errors

        // check for row count in the table - header raw and empty raw makes 2
        if ($('#orderGrid tr:eq(1) > td:eq(0)').text() != 'No data available in table') //if ($('#orderGrid tr').length > 2)
        {
            // check for orderline statuses - if all confimed - pass to server side
            var allConfimed = ValidateForOrderLineStatus();
            if (!allConfimed) {
                DisplayErrorMessage('Warning - make sure that all the orderlines are confirmed before confirming the particular order', $('#lblErrorOrderLineMessage'));
            }
            else {
                //alert('pass to server side - confirm');
                var orderId = $('#orderId').val();
                $http({
                    method: "get",
                    headers: { 'Content-Type': 'application/json' },
                    url: ('http://localhost:61945/api/Order?orderId=' + orderId)
                })
                .success(function (data) {
                    if (data == 'Success - Order confirmation successful')
                    {
                        DisableUIAfterConfirm();
                    }
                    DisplayErrorMessage(data, $('#lblErrorOrderLineMessage'));                    
                }).error(function (data) {
                    // display error message
                    DisplayErrorMessage('Error - Order confirmation unsuccessful - error accessing web service', $('#lblErrorOrderLineMessage'));
                });
            }
        }
        else {
            DisplayErrorMessage('Warning - please add atleast one orderline before confirming the order', $('#lblErrorOrderLineMessage'));
        }
    }

    // used to disable UI controls after confirming an order
    function DisableUIAfterConfirm()
    {
        $('#btnConfirmOdr').attr("disabled", true);     // disable confirm oreder button
        DisableEditBtnsInOrderGrid();
        
        // disable product search form sections
        EnableDisableProductSearchForm(true);

        // remove previouse product searches
        DestroyTable();     // clear out search results        
    }       

    // used to disable all the edit buttons in the orderline grid
    function DisableEditBtnsInOrderGrid()
    {        
        $(".businessEdit").attr("disabled", true);
    }       
    
    // check for orderline statuses - if all confimed - return true
    function ValidateForOrderLineStatus() {

        var allConfimed = true;

        // get orderline data table
        var table = $('#orderGrid').DataTable();                
        table.column(6).data().each(function (value, index) {       // column 6 is status - o based columns in JS datatable
            //alert('Data in index: ' + index + ' is: ' + value);
            if (value == 'in negotiation') {
                allConfimed = false;
            }
        }); 
        return allConfimed;
    }

    // used to calculate and display the total income on quantity or price offered inputs changed
    function calculateTotalIncome() {
        try
        {
            var quantity = $('#quantityInput').val();
            var pricePerItem = RoundUpTo($('#priceInput').val(), 2);
            quantity = parseInt(quantity, 10);
            pricePerItem = parseFloat(pricePerItem);
            var total = quantity * pricePerItem;
            total = RoundUpTo(total, 2);
            if (!isNaN(total))
                $('#totalIncome').text(total);
            else
                throw 'not a number';
        }
        catch(error)
        {
            $('#totalIncome').text('0.0');
        }
    }


    // create order record
    function CreateAnOrder($http) {

        // create the order
        var companyId = $('#selectCustSupp').val();
        var contactFulName = $("#selectContact").val();
        $http({
            method: "get",
            headers: { 'Content-Type': 'application/json' },
            url: ('http://localhost:61945/api/SalesOrder?companyId=' + companyId + '&contactFulName=' + contactFulName)
        })
        .success(function (data) {
            if (data != -999) {                
                // store the returned order Id in the hidden field
                $('#orderId').val(data);
                $('#lblErrorMessageCrtOrdr').removeClass("errorLabel");
                $('#lblErrorMessageCrtOrdr').addClass("successLabel");
                $('#lblErrorMessageCrtOrdr').text("Order creation successful, Please do a product search and add the order lines");

                // display the orderlines grid

                // disable buyer/seller selections, enable product search form
                EnableDisableBuyerSellerFeilds(true);
                EnableDisableProductSearchForm(false);
            }
            else {
                DisplayErrorMessage('Error - Order creation Unsuccessful', $('#lblErrorMessageCrtOrdr'));
            }
        }).error(function (data) {
            // display error message
            DisplayErrorMessage('Error - Order creation Unsuccessful', $('#lblErrorMessageCrtOrdr'));
        });
    }

    // Used to enable/disable buyer/seller form fields
    function EnableDisableBuyerSellerFeilds(isDisabled) {
        $('#selectCustSupp').attr("disabled", isDisabled);
        $('#selectContact').attr("disabled", isDisabled);
        $('#addContactBtn').attr("disabled", isDisabled);
        $('#createOrdrBtn').attr("disabled", isDisabled);
    }

    // Used to enable/disable negoation related buttons
    function EnableDisableNegotiationButtons(isDisabled) {
        $('#btnAddNegotion').attr("disabled", isDisabled);
        $('#btnAddOrderline').attr("disabled", isDisabled);
        $('#quantityInput').attr("disabled", isDisabled);
        $('#priceInput').attr("disabled", isDisabled);
        $('#statusSelect').attr("disabled", isDisabled);
    }

    // Used to enable/disable product search form fields
    function EnableDisableProductSearchForm(isDisabled) {
        $('#selectCategory').attr("disabled", isDisabled);
        $('#selectCondition').attr("disabled", isDisabled);
        $('#selectBrand').attr("disabled", isDisabled);
        $('#selectModel').attr("disabled", isDisabled);
        $('#btnSearchProducts').attr("disabled", isDisabled);
        $('#resetBtn').attr("disabled", isDisabled);
    }

    // used to validate customer/contact ddl selections
    function ValidateCustContactSelections() {

        var isValid = false;
        var customerDdl = $("#selectCustSupp");

        if (isValidDropDownListSelection(customerDdl)) {

            RemoveOutlineBorders(customerDdl);
            isValid = true;
            var contactDdl = $("#selectContact");

            if (isValidDropDownListSelection(contactDdl)) {
                DisplayErrorMessage('', $('#lblErrorMessageCrtOrdr'));
                RemoveOutlineBorders(contactDdl);
                isValid = true;
            }
            else {
                DisplayErrorMessage('Error : Please select contact person to create an order', $('#lblErrorMessageCrtOrdr'));
                ApplyErrorBorder(contactDdl);
                isValid = false;
            }
        }
        else {
            DisplayErrorMessage('Error : Please select customer company to create an order', $('#lblErrorMessageCrtOrdr'));
            ApplyErrorBorder(customerDdl);
            isValid = false;
        }
        return isValid;
    }

    // Destroy the product data grid
    function DestroyTable() {
        if ($.fn.DataTable.isDataTable('#productsGrid')) {
            $('#productsGrid').DataTable().destroy();
            $('#productsGrid').empty();
        }
    }

    // on product category ddl is changed
    function onCategorySelection($http, ddl)
    {
        //alert('category changed : ' + ddl.val());
        var selectedCategory = ddl.val();
        var listitems = '<option value=-1 selected="selected">---- Select Condition ----</option>';
        if (selectedCategory != -1) {
            // remove errors
            RemoveOutlineBorders($('#selectCategory'));
            DisplayErrorMessage('', $('#lblErrorMessage'));

            // populate dependant DDL - condition
            $http({
                method: "get",
                headers: { 'Content-Type': 'application/json' },
                url: ('http://localhost:61945/api/productinfo/categoryId?categoryId=' + selectedCategory),
            }).success(function (data) {
                //alert(data.length);
                $.each(data, function (index, item) {
                    listitems += '<option value=' + item.conditionID + '>' + item.conditionName + '</option>';
                });
                $("#selectCondition option").remove();
                $("#selectCondition").append(listitems);
            }
            ).error(function (data) {
                // display error message
                alert('error - web service access - condition DDL population - please contact IT helpdesk');
                $("#selectCondition option").remove();
                $("#selectCondition").append(listitems);
            });
        }
        else {
            // remove prepopulated items in condition, brand and model            
            ResetDDL($("#selectCondition"), "Condition");
        }

        // remove prepopulated items brand and model  
        ResetDDL($("#selectModel"), "Model");
        ResetDDL($("#selectBrand"), "Brand");
    }

    // on product condition ddl is changed
    function onConditionSelection($http, ddl)
    {
        //alert('condition changed');
        var selectedCondition = ddl.val();
        var selectedCategory = $('#selectCategory').val();
        var listitems = '<option value=-1 selected="selected">---- Select Brand ----</option>';
        var serverUrl = 'http://localhost:61945/api/ProductInfo?categoryId=' + selectedCategory + '&conditionId=' + selectedCondition;
        if (selectedCondition != -1 && selectedCategory != -1) {
            $http({
                method: "get",
                headers: { 'Content-Type': 'application/json' },
                url: serverUrl,
            }).success(function (data) {
                //alert(data.length);                
                $.each(data, function (index, item) {
                    listitems += '<option value=' + item.productbrandid + '>' + item.productbrandname + '</option>';
                });
                $("#selectBrand option").remove();
                $("#selectBrand").append(listitems);
            }
            ).error(function (data) {
                // display error message
                alert('error - web service access - brand DDL population - please contact IT helpdesk');
                $("#selectBrand option").remove();
                $("#selectBrand").append(listitems);
            });
        }
        else {
            // remove prepoluated items on model            
            ResetDDL($("#selectBrand"), "Brand");
        }

        // remove prepopulated items model
        ResetDDL($("#selectModel"), "Model");
    }

    // on product brand ddl is changed
    function onBrandSelection($http, ddl)
    {
        var selectedCategory = $('#selectCategory').val();
        var selectedCondition = $("#selectCondition").val();
        var selectedBrands = ddl.val();
        //alert("brand changed " + selectedBrand);
        var listitems = '<option value=-1 selected="selected">---- Select Model ----</option>';
        var serverUrl = 'http://localhost:61945/api/ProductInfo?categoryId=' + selectedCategory + '&conditionId=' + selectedCondition + '&brandIdsCommaDelimited=' + selectedBrands;
        if (selectedBrands != -1 && selectedCondition != -1 && selectedCategory != -1) {
            $http({
                method: "get",
                headers: { 'Content-Type': 'application/json' },
                url: serverUrl,
            }).success(function (data) {
                //alert(data.length);
                $.each(data, function (index, item) {
                    listitems += '<option value=' + item.productListId + '>' + item.model + '</option>';
                });
                $("#selectModel option").remove();
                $("#selectModel").append(listitems);
            }
            ).error(function (data) {
                // display error message
                alert('error - web service access - model DDL population - please contact IT helpdesk');
                $("#selectModel option").remove();
                $("#selectModel").append(listitems);
            });
        }
        else {
            // remove prepoulated models
            ResetDDL($("#selectModel"), "Model");
        }
    }

    // used to reset search ddls
    function ResetSearchDDLs() {
        // reset main ddl
        var categoryDdl = $("#selectCategory");
        categoryDdl.val(-1);
        RemoveOutlineBorders(categoryDdl);
        DisplayErrorMessage('', $('#lblErrorMessage'));

        // reset other dependant ddls
        ResetDDL($("#selectModel"), "Model");
        ResetDDL($("#selectBrand"), "Brand");
        ResetDDL($("#selectCondition"), "Condition");
    }

    // Reset DDLs
    function ResetDDL(ddl, ddlName)
    {        
        var listitems = '<option value=-1 selected="selected">---- Select' + ddlName + '----</option>';
        ddl.find('option').remove();
        ddl.append(listitems);
    }

    // on a company selection - populate contacts DDL by company id
    function onCompanyDDLSelection($http, contactResource)
    {
        //alert('on company selection - ' + $("#selectCustSupp").val());
        var selectedValue = $("#selectCustSupp").val();
        var selectedFulName = $("#selectContact").val();
        if (selectedValue != -1) {
            // repopulate the contact DDL based on company selection
            $http({
                method: "get",
                headers: { 'Content-Type': 'application/json' },
                url: ('http://localhost:61945/api/Contact?customerSupplierId=' + selectedValue),
            }).success(function (data) {
                var listitems = '<option value=-1 selected="selected">---- Select Contact ----</option>';
                $.each(data, function (index, item) {
                    var firstName = cleanSpaces(item.firstName);
                    var lastName = cleanSpaces(item.lastName);
                    var fulName = (firstName + '_' + lastName);
                    if (selectedFulName == fulName)
                    {
                        listitems += '<option value=' + fulName + ' selected>' + (item.firstName + ' ' + item.lastName) + '</option>';
                    }
                    else
                    {
                        listitems += '<option value=' + fulName + '>' + (item.firstName + ' ' + item.lastName) + '</option>';
                    }                    
                });
                $("#selectContact option").remove();
                $("#selectContact").append(listitems);
            }
            ).error(function (data) {
                // display error message
                alert('error - web service access')
            });
        }
        else {
            populateContactDropDown(contactResource);
        }
    }

    // on a contact name selection - populate company DDL with contact full name
    function onContactDDLSelection($http, customerSupplierResource)
    {
        //alert('on contact selection - ' + $("#selectContact").val());   
        var selectedCompany = $("#selectCustSupp").val();
        var selectedFulName = $("#selectContact").val();
        if (selectedFulName != -1) {
            // repopulate the contact DDL based on company selection
            $http({
                method: "get",
                headers: { 'Content-Type': 'application/json' },
                url: ('http://localhost:61945/api/customerSupplier?contactFulName=' + selectedFulName),
            }).success(function (data) {                            
                var listitems = '<option value=-1 selected="selected">---- Select Customer ----</option>';
                $.each(data, function (index, item) {                    
                    if (selectedCompany == item.id)
                    {
                        listitems += '<option value=' + item.id + ' selected>' + item.name + '</option>';
                    }
                    else
                    {
                        listitems += '<option value=' + item.id + '>' + item.name + '</option>';
                    }
                });                    
                $("#selectCustSupp option").remove();
                $("#selectCustSupp").append(listitems);                
            }
            ).error(function (data) {
                // display error message
                alert('error - web service access')
            });
        }
        else {
            populateCompanyDropDown(customerSupplierResource);
        }
    }

    // used to create initial UI
    function prepareInitialUI($http, customerSupplierResource, contactResource, statusResource, salesOrderId)
    {
        RemoveOutlineBorders($('#selectCategory'));
        DisplayErrorMessage('', $('#lblErrorMessage'));
        DisplayErrorMessage('', $('#lblErrorMessageCrtOrdr'));
        DisplayErrorMessage('', $('#lblErrorOrderLineMessage'));

        populateCategoryDropDown($http);
        populateStatusDropDown($http);
       
        // enable product search form sections
        EnableDisableProductSearchForm(false);

        // show order details panels buttons
        HideOrderDetailsBtns(false);

        // populate order details, orderlines details
        PopulateOrderDetails($http);        
    }

    // populate order details, orderlines details
    function PopulateOrderDetails($http)
    {
        var salesOrderId = $('#orderId').val();                             // sales order Id
       
        // get order by Id
        $http({
            method: "get",
            headers: { 'Content-Type': 'application/json' },
            url: ('http://localhost:61945/api/SalesOrder?orderId=' + salesOrderId),
        }).success(function (data) {
            SelectBuyerSellerInfo(data);
            //EnableDisableConfirmOrderBtn(data);
            DrawOrderlineGridEditMode($http, data);            
        }
        ).error(function (data) {
            // display error message
            alert('error - web service access')
        });
    }

    // draw orderline grid in initial edit mode
    function DrawOrderlineGridEditMode($http, order)
    {
        // get orderlines by orderId
        var orderlines = null;        
        $http({
            method: "get",
            headers: { 'Content-Type': 'application/json' },
            url: ('http://localhost:61945/api/Orderline?orderIdVal=' + order.id),
        }).success(function (data) {
            DrawOrderlineGrid(data, $http);
            // disable UI if order is confirmed            
            if (order.status == 'confirmed') {
                DisableUIAfterConfirm();
                DisableEditBtnsInOrderGrid();       // edit button disabling
                EnableDisableProductSearchForm(true);
                //$(".businessEdit").attr("disabled", true);
            }
        }
        ).error(function (data) {
            // display error message
            alert('error - web service access')
        })        
    }

    // enable/disable confirm order button
    function EnableDisableConfirmOrderBtn(orderVm)
    {
        if (orderVm.status == 'confirmed')
            $('#btnConfirmOdr').attr("disabled", true);
        else
            $('#btnConfirmOdr').attr("disabled", false);
    }

    // select buyer seller section of the form and makes it disabled
    function SelectBuyerSellerInfo(orderVm)
    {        
        populateCompanyDropDown(orderVm);        
        populateContactDropDown(orderVm);
        EnableDisableBuyerSellerFeilds(true);
    }

    // used to hide order details panels buttons
    function HideOrderDetailsBtns(hideMe) {
        if (hideMe)
        {
            $('#btnConfirmOdr').hide();
            $('#btnDwnldOrdRprt').hide();
        }
        else {
            $('#btnConfirmOdr').show();
            $('#btnDwnldOrdRprt').show();
        }
    }

    // used to create the product search result data grid
    function DrawGrid(searchResult, $http)
    {         
        if (searchResult != null) {
            //alert("Grid creation : " + searchResult.length);
            // basic grid creation, data population
            $('#productsGrid').dataTable({
                "data": searchResult,
                "aoColumns": [
                        { "mData": "productlistId", "sTitle": "Product list Id", "bVisible": false },
                        { "mData": "productcategory", "sTitle": "Category ID", "bVisible": false },
                        { "mData": "productCatergoryName", "sTitle": "Category" },
                        { "mData": "productcondition", "sTitle": "Condition ID", "bVisible": false },
                        { "mData": "conditionName", "sTitle": "Condition" },
                        { "mData": "productbrandid", "sTitle": "Brand ID", "bVisible": false },
                        { "mData": "productbrandname", "sTitle": "Brand" },
                        { "mData": "model", "sTitle": "Model" },
                        { "mData": "marketvalue", "sTitle": "Market value &#163", "bVisible": false },
                        { "mData": "stockCount", "sTitle": "Stock count" },
                        { "sTitle": "View More", "defaultContent": "<button class='productInfo'>Negotiate</button>" }
                ],
                "bDestroy": true,
                "aLengthMenu": [[50, 100, 200, -1], [50, 100, 200, "All"]],
                "iDisplayLength": 50
            });

            // data table
            var table = $('#productsGrid').DataTable();

            // on info button clicks
            $('#productsGrid tbody').on('click', 'button.productInfo', function () {
                var data = table.row($(this).parents('tr')).data();                
                //alert("View Info : " + data.productlistId + " - " + data.model);
                OnProductInfoBtnClick(data, $http);
            });
        }
        else {
            DisplayErrorMessage('Error : No products in the specified search criteria', $('#lblErrorMessage'));
            alert('Error : No products in the specified search criteria');
        }
        
    }

    // on product information button click on the grid rows
    function OnProductInfoBtnClick(prodFrmGrid, $http)
    {
        // clean error messages
        RemoveOutlineBordersNegForm();

        // get product/negotiation info
        var productListId = prodFrmGrid.productlistId;
        var category = prodFrmGrid.productCatergoryName;
        var condition = prodFrmGrid.conditionName;
        var brand = prodFrmGrid.productbrandname;
        var model = prodFrmGrid.model;
        var marketValue = '';
        var stockCount = '';

        // get market value and stock count     
        $http({
            method: "get",
            headers: { 'Content-Type': 'application/json' },
            url: ('http://localhost:61945/api/ProductInfo?productlistId=' + productListId),
        }).success(function (data) {
            if (data != null) {
                marketValue = data.marketvalue;
                stockCount = data.stockCount;
                DisplayNegotiationPopup($http, productListId, category, condition, brand, model, marketValue, stockCount);
            }
            else {
                alert('error - web service access - cound not find a product with Id - ' + productListId + ' - please contact IT helpdesk');
            }
        }
        ).error(function (data) {
            // display error message
            alert('error - web service access - product retreival by product Id - please contact IT helpdesk');            
        });
    }

    // used to display the product negotiation popup
    function DisplayNegotiationPopup($http, productListId, category, condition, brand, model, marketValue, stockCount)
    {        
        // populate the popup
        $('#productListId').val(productListId);
        $('#lblCetegory').text(category);
        $('#lblCondition').text(condition);
        $('#lblBrand').text(brand);
        $('#lblModel').text(model);
        $('#lblMktVal').text('£ ' + marketValue);
        $('#lblStockCount').text(stockCount);

        // clean negotiation form
        $('#quantityInput').val('');
        $('#priceInput').val('');
        $('#statusSelect').val(-1);
        $('#totalIncome').text(0);

        DisplayErrorMessage('', $('#lblErrorManageNegotiation'));
        
        
        var newOrderId  = $('#orderId').val();
        if (newOrderId != -1) {
            GetPreiouseSuccessfullNegotiaions($http, newOrderId, productListId);
            RefreshProductNegotiations($http, newOrderId, productListId);
        }
        else {
            DrawSuccessNegotiationsGrid(null);
            DrawNegotiationsGrid(null);                                 // negotiations of the current product in the order
        }

        // show the popup with populated data        
        $('#modelNegotiation').modal({
            show: true,
            keyboard: true,
            backdrop: true
        });
    }

    // select status on edit orderline popup
    function FindStatus($http, status)
    {        
        $http({
            method: "get",
            headers: { 'Content-Type': 'application/json' },
            url: ('http://localhost:61945/api/status'),
        }).success(function (data) {
            var listitems = '';
            $.each(data, function (index, item) {                
                if (item.statusStr == status)
                    $('#statusSelect').val(item.id);
            });
        }
        ).error(function (data) {
            // display error message
            alert('error - web service access')
        });
    }

    // Used to edit an existing orderline
    function DisplayEditOrderLinePopup($http, productListId, category, condition, brand, model, marketValue, stockCount, quantityAsked, negotiatedPricePerItem, totalAsked, status)
    {
        // get status numeric value for selection 
        FindStatus($http, status);

        // populate the popup
        $('#productListId').val(productListId);
        $('#lblCetegory').text(category);
        $('#lblCondition').text(condition);
        $('#lblBrand').text(brand);
        $('#lblModel').text(model);
        $('#lblMktVal').text('£ ' + marketValue);
        $('#lblStockCount').text(stockCount);

        // clean negotiation form
        $('#quantityInput').val(quantityAsked);
        $('#priceInput').val(negotiatedPricePerItem);
        //$('#statusSelect').val(status);
        $('#totalIncome').text(totalAsked);

        DisplayErrorMessage('', $('#lblErrorManageNegotiation'));


        var newOrderId = $('#orderId').val();
        if (newOrderId != -1) {
            GetPreiouseSuccessfullNegotiaions($http, newOrderId, productListId);
            RefreshProductNegotiations($http, newOrderId, productListId);
        }
        else {
            DrawSuccessNegotiationsGrid(null);
            DrawNegotiationsGrid(null);                                 // negotiations of the current product in the order
        }

        // show the popup with populated data        
        $('#modelNegotiation').modal({
            show: true,
            keyboard: true,
            backdrop: true
        });
    }

    // get previouse successful negotions for the same product but different order
    function GetPreiouseSuccessfullNegotiaions($http, newOrderId, productListId)
    {
        var serverUrl = 'http://localhost:61945/api/Negotiation?orderId=' + newOrderId + '&productListId=' + productListId + '&confirmed=true';
        $http({
            method: "get",
            headers: { 'Content-Type': 'application/json' },
            url: serverUrl
        }).success(function (data) {            
            DrawSuccessNegotiationsGrid(data);                              // previouse successful negotiations in other orders            
        }
        ).error(function (data) {
            // display error message                
            DisplayErrorMessage('error - web service access - get negotiations by product, order Ids - please contact IT helpdesk', $('#lblErrorManageNegotiation'));
            //alert('error - web service access - record negotiation - please contact IT helpdesk');
        });
    }

    // display successful negotiations table
    function DrawSuccessNegotiationsGrid(successNegos)
    {
        var htmlTable = "<table class='table table-condensed table-striped table-bordered'><tr><th>Company</th><th>Contact</th><th>Date</th><th>Time</th><th>Qty</th><th>PPI (£)</th><th>Total (£)</th></tr>";
        if (successNegos != null && successNegos.length > 0) {

            $.each(successNegos, function (index, item) {
                htmlTable += "<tr>" + "<td>" + item.cusomerSupplierName + "</td>" + "<td>" + item.contactName + "</td>" + "<td>" + item.date + "</td>" + "<td>" + item.time + "</td>" +
                    "<td>" + item.quantity + "</td>" + "<td>" + item.negotiatedPricePerItem + "</td>" +
                    "<td>" + item.totalAmount + "</td>" + "</tr>";
            });
        }
        else if (successNegos == null || successNegos.length == 0) {
            htmlTable += "<tr>" + "<td>" + "-" + "</td>" + "<td>" + "-" + "</td>" + "<td>" + "-" + "</td>" + "<td>" + "-" + "</td>" +
                    "<td>" + "-" + "</td>" + "<td>" + "-" + "</td>" + "<td>" + "-" + "</td>" + "</tr>";
        }
        htmlTable += "</table>";
        $('#successNegotiationsGridDiv').empty();
        $('#successNegotiationsGridDiv').html(htmlTable);
    }

    // used to record a negotation
    function RecordNegotiation($http) {
        var isValid = ValidateNegotiation();
        if (isValid)
        {
            // disable negotiation form fields
            EnableDisableNegotiationButtons(true);

            // inputs
            var productListId = $('#productListId').val();
            var quantityVal = $('#quantityInput').val();
            var pricePerItem = RoundUpTo($('#priceInput').val(), 2);
            var status = $('#statusSelect').val();
            var totalAmountVal = $('#totalIncome').text();
            var orderId = $('#orderId').val();

            var serverUrl = 'http://localhost:61945/api/Negotiation?productListId=' + productListId + '&quantityVal=' + quantityVal + '&pricePerItem=' + pricePerItem
                + '&totalAmountVal=' + totalAmountVal + '&status=' + status + '&orderIdVal=' + orderId;
            $http({
                method: "get",
                headers: { 'Content-Type': 'application/json' },
                url: serverUrl
            }).success(function (data) {
                if (data == 'success')
                {
                    // display success message
                    $('#lblErrorManageNegotiation').removeClass("errorLabel");
                    $('#lblErrorManageNegotiation').addClass("successLabel");
                    $('#lblErrorManageNegotiation').text("Negotiation Recorded");

                    // clean form
                    CleanNegotiationForm();

                    // Refresh negotiations table
                    RefreshProductNegotiations($http, orderId, productListId);
                }
                else
                {                    
                    DisplayErrorMessage('error - saving data - record negotiation - please contact IT helpdesk', $('#lblErrorManageNegotiation'));
                    //alert('error - saving data - record negotiation - please contact IT helpdesk');
                }
            }
            ).error(function (data) {
                // display error message                
                DisplayErrorMessage('error - web service access - record negotiation - please contact IT helpdesk', $('#lblErrorManageNegotiation'));
                //alert('error - web service access - record negotiation - please contact IT helpdesk');
            });

            // enable form fields
            EnableDisableNegotiationButtons(false);
        }
    }

    // Refreshing the negotiations 
    function RefreshProductNegotiations($http, orderId, productListId) {

        var serverUrl = 'http://localhost:61945/api/Negotiation?orderId=' + orderId + '&productListId=' + productListId;
        $http({
            method: "get",
            headers: { 'Content-Type': 'application/json' },
            url: serverUrl
        }).success(function (data) {
            if (data != null && data.length > 0) {
                // Populate negotiations grid
                //alert('Negotiations count : ' + data.length);
                DrawNegotiationsGrid(data);
            }
            else if (data == null || data.length == 0) {
                DrawNegotiationsGrid(null);
                //DisplayErrorMessage('No negotiations for this product on this order', $('#lblErrorManageNegotiation'));
                //alert('error - saving data - record negotiation - please contact IT helpdesk');
            }
        }
        ).error(function (data) {
            // display error message                
            DisplayErrorMessage('error - web service access - get negotiations by product, order Ids - please contact IT helpdesk', $('#lblErrorManageNegotiation'));
            //alert('error - web service access - record negotiation - please contact IT helpdesk');
        });
    }

    // Used to draw the negotiation grid
    function DrawNegotiationsGrid(negotiations)
    {        
        var htmlTable = "<table class='table table-condensed table-bordered'><tr><th>Date</th><th>Time</th><th>Qty</th><th>PPI (£)</th><th>Total (£)</th><th>Status</th></tr>";
        if (negotiations != null && negotiations.length > 0) {
            
            $.each(negotiations, function (index, item) {
                htmlTable += "<tr>" + "<td>" + item.date + "</td>" + "<td>" + item.time + "</td>" +
                    "<td>" + item.quantity + "</td>" + "<td>" + item.negotiatedPricePerItem + "</td>" +
                    "<td>" + item.totalAmount + "</td>" + "<td>" + item.status + "</td>" + "</tr>";
            });
        }
        else if (negotiations == null || negotiations.length == 0) {
            htmlTable += "<tr>" + "<td>" + "-" + "</td>" + "<td>" + "-" + "</td>" + "<td>" + "-" + "</td>" + "<td>" + "-" + "</td>" +
                    "<td>" + "-" + "</td>" + "<td>" + "-" + "</td>" + "</tr>";
        }
        htmlTable += "</table>";
        $('#orderNegotiationsGridDiv').empty();
        $('#orderNegotiationsGridDiv').html(htmlTable);
    }

    // removes the negotiation inputs
    function CleanNegotiationForm() {        
        $('#quantityInput').val('');
        $('#priceInput').val('');
        $('#statusSelect').val(-1);
        $('#totalIncome').text(0.0);        
    }

    // used to insert an order line
    function InsertOrderLine($http) {
        var isValid = ValidateNegotiation();
        if (isValid) {
            // disable negotiation form fields
            EnableDisableNegotiationButtons(true);

            // inputs
            var productListId = $('#productListId').val();
            var quantityVal = $('#quantityInput').val();
            var pricePerItem = RoundUpTo($('#priceInput').val(), 2);
            var status = $('#statusSelect').val();
            var totalAmountVal = $('#totalIncome').text();
            var orderId = $('#orderId').val();

            var serverUrl = 'http://localhost:61945/api/Orderline?productListId=' + productListId + '&quantityVal=' + quantityVal + '&pricePerItem=' + pricePerItem
                + '&totalAmountVal=' + totalAmountVal + '&statusVal=' + status + '&orderIdVal=' + orderId;
            $http({
                method: "get",
                headers: { 'Content-Type': 'application/json' },
                url: serverUrl
            }).success(function (data) {
                if (data != null) {                    
                    //alert(data.length);
                    // Refresh orderlines grid
                    DrawOrderlineGrid(data, $http);
                    // Navigate to the main add/edit order form
                    $('#modelNegotiation').modal('hide');
                }
                else {
                    DisplayErrorMessage('error - saving data - record negotiation - please contact IT helpdesk', $('#lblErrorManageNegotiation'));
                    //alert('error - saving data - record negotiation - please contact IT helpdesk');
                }
            }
            ).error(function (data) {
                // display error message                
                DisplayErrorMessage('error - web service access - record negotiation - please contact IT helpdesk', $('#lblErrorManageNegotiation'));
                //alert('error - web service access - record negotiation - please contact IT helpdesk');
            });

            // enable form fields
            EnableDisableNegotiationButtons(false);
        }
    }

    // used to create the orderline data grid
    function DrawOrderlineGrid(orderlines, $http) {
        DestroyTable();     // clear out search results
        DisplayErrorMessage('', $('#lblErrorOrderLineMessage'));
        $('#orderGrid').empty();
        
        HideOrderDetailsBtns(false);     // hide order details panels buttons

        if (orderlines != null) {
            //alert("Grid creation : " + searchResult.length);
            // basic grid creation, data population
            $('#orderGrid').dataTable({
                "data": orderlines,
                "aoColumns": [
                        { "mData": "id", "sTitle": "Orderline Id", "bVisible": false },
                        { "mData": "productId", "sTitle": "Product ID", "bVisible": false },
                        { "mData": "conditionId", "sTitle": "conditionId", "bVisible": false },
                        { "mData": "condition", "sTitle": "Condition" },
                        { "mData": "brandId", "sTitle": "brandId", "bVisible": false },
                        { "mData": "brand", "sTitle": "Brand" },
                        { "mData": "model", "sTitle": "Model" },
                        { "mData": "quantity", "sTitle": "Quantity" },
                        { "mData": "negotiatedPricePerItem", "sTitle": "PPI (£)" },
                        { "mData": "totalAmount", "sTitle": "Total (£)" },
                        { "mData": "status", "sTitle": "Status" },
                        { "mData": "orderLineQuantityStatus", "sTitle": "Orderline with stock", "bVisible": false },
                        { "mData": "date", "sTitle": "Date", "bVisible": false },
                        { "mData": "time", "sTitle": "Time", "bVisible": false },
                        { "mData": "orderId", "sTitle": "Order Id", "bVisible": false },

                        { "sTitle": "Edit Info", "defaultContent": "<button class='businessEdit'>Edit</button>" },
                ],
                "bDestroy": true
            });

            // data table
            var table = $('#orderGrid').DataTable();

            // on info button clicks
            $('#orderGrid tbody').on('click', 'button.businessEdit', function () {                
                var dataRow = table.row($(this).parents('tr')).data();
                //alert("View Info : " + data.productlistId + " - " + data.model);
                OnOrderLineEditBtnClick(dataRow, $http);
            });
        }
        //else {
        //    DisplayErrorMessage('Error : No products in the specified search criteria', $('#lblErrorOrderLineMessage'));
        //    alert('Error : No products in the specified search criteria');
        //}

    }

    // edit orderline
    function OnOrderLineEditBtnClick(dataRow, $http)
    {
        RemoveOutlineBordersNegForm();
        //alert('Edit order line id : ' + dataRow.id);
        var serverUrl = 'http://localhost:61945/api/Orderline?orderlineId=' + dataRow.id;
        DisplayErrorMessage('', $('#lblErrorOrderLineMessage'));
        $http({
            method: "get",
            headers: { 'Content-Type': 'application/json' },
            url: serverUrl
        }).success(function (data) {            
            DisplayEditOrderLinePopup($http, data.productId, data.category, data.condition, data.brand, data.model, data.marketvalue, data.stockCount,
                dataRow.quantity, dataRow.negotiatedPricePerItem, dataRow.totalAmount, data.status);
        }
        ).error(function (data) {
            // display error message
            alert('error - web service access - get orerline info - please contact IT helpdesk');
            DisplayErrorMessage('error - web service access - get orerline info - please contact IT helpdesk', $('#lblErrorOrderLineMessage'));
        });        
    }

    // used to validate the negotiation information
    function ValidateNegotiation()
    {
        var isValid = true;
        RemoveOutlineBordersNegForm();                         // remove previouse error indications if any
        DisplayErrorMessage('', $('#lblErrorManageNegotiation'));
        
        var quantityEle = $('#quantityInput');
        if (isNullOrEmpty(quantityEle) || (!IsAWholeNumber(quantityEle.val()))) {
            isValid = false;
            ApplyErrorBorder(quantityEle);
            DisplayErrorMessage('Error - Please input a valid quantity value - a whole number', $('#lblErrorManageNegotiation'));
        }
        
        var priceEle = $('#priceInput');
        if (isValid && (isNullOrEmpty(priceEle) || (!IsANumber(priceEle.val())))) {
            isValid = false;
            ApplyErrorBorder(priceEle);
            DisplayErrorMessage('Error - Please input a valid price value - a whole/decimal number', $('#lblErrorManageNegotiation'));
        }
        
        if (isValid && (!isValidDropDownListSelection($('#statusSelect')))) {
            ApplyErrorBorder($('#statusSelect'));                                                                                       // indicate error
            DisplayErrorMessage("Please select a valid status for the negotiation", $('#lblErrorManageNegotiation'));                   // update error message
            isValid = false;
        }
        //else if ($.trim($('#statusSelect').val()) == '1') {     // if confirmed only
            // perform stock count adjustment considering last negotiation, orderline
            var stockCountEle = $('#lblStockCount');
            var stockCount = parseInt(stockCountEle.text(), 10);
            var quantity = parseInt(quantityEle.val(), 10);            
            var currentAllocation = $('#orderNegotiationsGridDiv tr:eq(1) td:eq(2)').text();    // read last quantity allocation
            if (currentAllocation != '-' && $('#orderNegotiationsGridDiv tr:eq(1) td:eq(5)').text() != 'rejected')
            {
                stockCount = stockCount + parseInt(currentAllocation, 10);
            }
            if (quantity > stockCount)
            {
                //ApplyErrorBorder($('#statusSelect'));                                                                                       // indicate error
                ApplyErrorBorder(quantityEle);
                DisplayErrorMessage("Warning - Stock count is not sufficient to fulfill the quantity requirement", $('#lblErrorManageNegotiation'));     // update error message
                isValid = false;
            }
        //}
        
        return isValid;
    }

    // remove previouse error indications
    function RemoveOutlineBordersNegForm()
    {
        RemoveOutlineBorders($('#quantityInput'));
        RemoveOutlineBorders($('#priceInput'));
        RemoveOutlineBorders($('#statusSelect'));
    }

    // searching product info
    function SearchProducts($http)
    {  
        // get search criterias
        var categoryDdl = $('#selectCategory');
        var searchResult = null;
        var categoryId = categoryDdl.val();
        var conditionId = 'nothing';
        var brandIds = 'nothing';
        var modelIds = 'nothing';
        
        if (isValidDropDownListSelection(categoryDdl))
        {
            RemoveOutlineBorders(categoryDdl);
            conditionId = $('#selectCondition').val();
            brandIds = $('#selectBrand').val();
            modelIds = $('#selectModel').val();
            
            // search and display
            RetriveSearchProductsDrawGrid($http, categoryId, conditionId, brandIds, modelIds);            
        }
        else
        {
            DisplayErrorMessage('Error : Your should atleast select a category perform a product search', $('#lblErrorMessage'));
            ApplyErrorBorder(categoryDdl);
        }        
    }

    // used to search and return the results in the DB
    function RetriveSearchProductsDrawGrid($http, categoryId, conditionId, brandIds, modelIds)
    {
        //var searchParams = getSearchParamsJsonObject(categoryId, conditionId, brandIds, modelIds);       // creation of the json object
        //var jsonStr = JSON.stringify(searchParams);                                                       // covert to json string to pass to web service
        var searchResult = '';
        var serverUrl = 'http://localhost:61945/api/ProductInfo?categoryId=' + categoryId +
                '&conditionId=' + conditionId + '&brandIds=' + brandIds + '&modelIds=' + modelIds;
        $http({
            method: "get",
            headers: { 'Content-Type': 'application/json' },
            url: serverUrl
        }).success(function (data) {
            //alert('search result length : ' + data.length); 
            DrawGrid(data, $http);
        }
        ).error(function (data) {
            // display error message
            alert('error - web service access - product search - please contact IT helpdesk');
            DisplayErrorMessage('error - web service access - product search - please contact IT helpdesk', $('#lblErrorMessage'))
        });
    }

    //used to get json object consisting of search paramters 
    function getSearchParamsJsonObject(categoryId, conditionId, brandIds, modelIds)
    {
        var searchParamsJson = {
            "categoryId": categoryId,
            "conditionId": conditionId,
            "brandIds": brandIds,
            "modelIds": modelIds
        };

        return searchParamsJson;
    }

    // used to display error messages 
    function DisplayErrorMessage(errorMessage, element) {        
        element.addClass("errorLabel");
        element.text(errorMessage);
    }


    // used to apply red outline border for the validation errors of fields
    function ApplyErrorBorder(element) {
        element.addClass("errorBorder");
    }

    // used to remove error indicating outline borders
    function RemoveOutlineBorders(element) {
        element.removeClass("errorBorder");
    }
    
    // used to populate the product category drop down menu
    function populateCategoryDropDown($http) {
        $http({
            method: "get",
            headers: { 'Content-Type': 'application/json' },
            url: ('http://localhost:61945/api/productinfo/getcategories?getcategories=true'),
        }).success(function (data) {            
            var listitems = '<option value=-1 selected="selected">---- Select Category ----</option>';
            $.each(data, function (index, item) {                
                listitems += '<option value=' + item.productCategoryID + '>' + item.productCatergoryName + '</option>';
            });
            $("#selectCategory option").remove();
            $("#selectCategory").append(listitems);
        }
        ).error(function (data) {
            // display error message
            alert('error - web service access')
        });
    }
       

    // used to select persons drop down
    function populateContactDropDown(orderVm) {

        var listitems = '<option value=' + orderVm.contactId + 'selected="selected">' + orderVm.contactFulName + '</option>';
        $("#selectContact option").remove();
        $("#selectContact").append(listitems);        
    }

    // used to select company ddl for the popups
    function populateCompanyDropDown(orderVm) {
        
        var listitems = '<option value=' + orderVm.companyId + 'selected="selected">' + orderVm.company + '</option>';            
        $("#selectCustSupp option").remove();
        $("#selectCustSupp").append(listitems);       
    }

    // used to populate status ddl
    function populateStatusDropDown($http) {

        $http({
            method: "get",
            headers: { 'Content-Type': 'application/json' },
            url: ('http://localhost:61945/api/status'),
        }).success(function (data) {
            var listitems = '';
            $.each(data, function (index, item) {
                listitems += '<option value=' + item.id + '>' + item.statusStr + '</option>';
            });
            $("#statusSelect option").remove();
            $("#statusSelect").append(listitems);
        }
        ).error(function (data) {
            // display error message
            alert('error - web service access')
        });
    }
}());