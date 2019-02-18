function ReportListController(reportService) {
    //Lists all reports in tabular form, with add, edit and remove options against each report item.
    var $ctrl = this;
    $ctrl.master = {};
    $ctrl.report = {};
    $ctrl.isUpdate = false;
    $ctrl.current_report_item = {};
    $ctrl.types = [{
        keys: "AN",
        value: "Annual"
    }, {
        keys: "MO",
        value: "Monthly"
    }, {
        keys: "WE",
        value: "Weekly"
	}];
	
    reportService.get_token()
        //gets token from service to authenticate.
        .then(function() {
                console.warn();
            },
            function(errorMessage) {
                console.warn(errorMessage);
            }
		);
		
    reportService.get_reports()
        .then(list_reports,
            function(errorMessage) {
                console.warn(errorMessage);
            }
		);
		
    $ctrl.saveReportItem = function() {
		
		if ($ctrl.isUpdate) {
            updateReportItem();
		} 
		else {
            addReportItem();
        }
    }

    function updateReportItem() {
        /*updates report item by passing report_item as an argument, 
        and sets new values of item in success.*/
        report_item = current_report_item
        report_item.title = $ctrl.report.title;
        report_item.description = $ctrl.report.description;
        reportService.update_report_item(report_item)
            .then(function update(response) {

                if (response) {
                    $ctrl.reports[getIndex(current_report_item.id)] = response.data;
                    $ctrl.editForm = !$ctrl.editForm;
                }
            });
    };

    function addReportItem() {
        /*Adds new report item by getting values from form fields,
        and updates the list view in success.*/
        reportService.add_report_item(get_form_data())
            .then(function add(response) {

                if (response.status === 201) {
                    $ctrl.reports.push(response.data);
                    $ctrl.showAddForm = false;
                }
            });
	};
	
    $ctrl.removeReportItem = function(report_item) {
        //Removes selected report item and updates list view in success.
        current_report_item = report_item;
        reportService.remove_report_item(report_item)
            .then(function remove(response) {
                if (response.status === 204) {
                    $ctrl.reports.splice(getIndex(current_report_item.id), 1);
                }
            });
    };

    function getIndex(item_id) {
        //returns index of the respective report item.
        return $ctrl.reports.findIndex(r => r.id === item_id);
    }

    function get_form_data() {
        //returns form fields values.
        return {
            'title': $ctrl.report.title,
            'description': $ctrl.report.description,
            'report_type': $ctrl.report.types.keys
        };
    }

    function list_reports(response) {
        //sets response data to list view (reports)
        $ctrl.reports = response.data;
    }

    function populateFormFields(report_item) {
        $ctrl.report.title = report_item.title;
        $ctrl.report.description = report_item.description;
        $ctrl.report_type = report_item.report_type;
        current_report_item = report_item;
	}
	
    $ctrl.toggleAddEditForm = function(report_item) {
        $ctrl.showAddEditForm = !$ctrl.showAddEditForm;
		
		if (report_item.item) {
            $ctrl.isUpdate = true;
            populateFormFields(report_item.item);
		} 
		else {
            $ctrl.isUpdate = false;
            $ctrl.report = angular.copy($ctrl.master);
        }
    }
}

function ReportService($http, $q) {
	
	var reportService_config = {
        /*config object defined in current controller's scope
        for the accessing constant variables.*/
        current_report_item: [],
        auth_token: "",
        api_url: "http://localhost:8000/"
	}
	
    this.get_token = function() {
        /*returns token value from service by a POST request 
        passing username and password as arguments. */
        var request = $http({
            method: "POST",
            url: reportService_config.api_url + 'api/login/',
            data: {
                'username': 'test',
                'password': '1q1q1q1q'
            }
        });
        return (request.then(function(response) {
            reportService_config.auth_token = "Token " + response.data.token;
        }, handleError));
    }

    this.get_reports = function() {
        //returns reports list from service by a GET request.
        var request = $http({
            method: "GET",
            url: reportService_config.api_url + 'reports/'

        });
        return (request.then(handleSuccess, handleError))
    }

    this.add_report_item = function(report_item_to_add) {
        /*adds report_item_to_add.
        Token passed as Authorization header to verify add operation.*/
        var request = $http({
            method: "POST",
            url: reportService_config.api_url + 'reports/',
            headers: {
                'Authorization': reportService_config.auth_token
            },
            data: report_item_to_add
        });
        return (request.then(handleSuccess, handleError));
    }

    this.update_report_item = function(report_item) {
        /*updates report_item.
        Token passed as Authorization header to verify update operation.*/
        var request = $http({
            method: "PUT",
            url: reportService_config.api_url + 'reports/' + report_item.id + '/',
            headers: {
                'Authorization': reportService_config.auth_token,
            },
            data: report_item
        });
        return (request.then(handleSuccess, handleError));
    }

    this.remove_report_item = function(report_item) {
        /*deletes report_item.
        Token passed as Authorization header to verify delete operation.*/
        var request = $http({
            method: 'DELETE',
            url: reportService_config.api_url + 'reports/' + report_item.id + '/',
            headers: {
                'Authorization': reportService_config.auth_token
            },
            data: report_item
        });
        return (request.then(handleSuccess, handleError));
    }

    function handleSuccess(response) {
        //returns service response
        return (response);
    }

    function handleError(response) {
        /*Status 403, forbidden action user isnot allowed to perform certain action.
       	else returns the error messsage.*/
        if (response.status === 403) {
            console.log(response.data.detail);
            return false;
		} 
		
		else if (!angular.isObject(response.data) ||
            !response.data.message) {
            return ($q.reject("An unknown error occurred."));
        }

        return ($q.reject(response.data.message));
    }
}
