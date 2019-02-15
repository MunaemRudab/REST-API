angular.module("reportApp", ['main']);
var app = angular.module("main", []);

angular.module('reportApp')
    .service('reportService', ReportService)
    .component('reportList', {
        templateUrl: 'reportList.html',
        controller: ReportListController
    })

function ReportListController(reportService) {
    //Lists all reports in tabular form, with edit and remove options against each report item.
    var $ctrl = this;
    var report_config = {
        //config object defined in current controller's scope
        //for the accessing constant variables.
        current_report_item: [],
        auth_token: "",
        api_url: "http://localhost:8000/",
        types: [{
            keys: "Annual",
            value: "AN"
        }, {
            keys: "Monthly",
            value: "MO"
        }, {
            keys: "Weekly",
            value: "WE"
        }],
        init: () => {
            //hides edit form and populates dropdown for add form
            $ctrl.editForm = true;
            $ctrl.types = report_config.types;
            $ctrl.report_type = $ctrl.types[0];
        }
    }
    reportService.get_token(report_config)
        //gets token from service to authenticate.
        .then(set_token,
            function(errorMessage) {
                console.warn(errorMessage);
            }
        );
    reportService.get_reports(report_config)
        .then(list_reports,
            function(errorMessage) {
                console.warn(errorMessage);
            }
        );
    $ctrl.editReportItem = function(report_item) {
        //populates form fields with selected report attribute.
        $ctrl.form = false;
        $ctrl.editForm = $ctrl.editForm === false ? true : false;
        $ctrl.report_title = report_item.title;
        $ctrl.report_description = report_item.description;
        report_config.current_report_item = report_item;
    }
    $ctrl.updateReportItem = function() {
        //updates report item by passing report_item as an argument, 
        and sets new values of item in success.
        report_item = report_config.current_report_item
        report_item.title = $ctrl.report_title;
        report_item.description = $ctrl.report_description;
        reportService.update_report_item(report_config, report_item)
            .then(function update(response) {

                if (response) {
                    $ctrl.reports[getIndex(report_config.current_report_item.id)] = response.data;
                    $ctrl.editForm = !$ctrl.editForm;
                }
            });
    };
    $ctrl.addReportItem = function() {
        //Adds new report item by getting values from form fields,
        //and updates the list view in success.
        reportService.add_report_item(report_config, get_form_data())
            .then(function add(response) {

                if (response.status === 201) {
                    $ctrl.reports.push(response.data);
                    $ctrl.form = false;
                }
            });
    };
    $ctrl.removeReportItem = function(report_item) {
        //Removes selected report item and updates list view in success.
        report_config.current_report_item = report_item;
        reportService.remove_report_item(report_config, report_item)
            .then(function remove(response) {
                if (response.status === 204) {
                    $ctrl.reports.splice(getIndex(report_config.current_report_item.id), 1);
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
            'title': $ctrl.title,
            'description': $ctrl.description,
            'report_type': $ctrl.report_type.value
        };
    }

    function list_reports(response) {
        //sets response data to list view (reports)
        $ctrl.reports = response.data;
    }

    function set_token(response) {
        //sets token value in controller's scope for further use
        report_config.auth_token = "Token " + response.data.token;
    }

    angular.element(document).ready(function() {
        //on document ready
        report_config.init();
    });
}

function ReportService($http, $q) {

    this.get_token = function(report_config) {
        //returns token value from service by a POST request 
        //passing username and password as arguments. 
        var request = $http({
            method: "POST",
            url: report_config.api_url + 'api/login/',
            data: {
                'username': 'test',
                'password': '1q1q1q1q'
            }
        });
        return (request.then(handleSuccess, handleError));
    }

    this.get_reports = function(report_config) {
        //returns reports list from service by a GET request.
        var request = $http({
            method: "GET",
            url: report_config.api_url + 'reports/'

        });
        return (request.then(handleSuccess, handleError))
    }

    this.add_report_item = function(report_config, report_item_to_add) {
        //adds report_item_to_add.
        //Token passed as Authorization header to verify add operation.
        var request = $http({
            method: "POST",
            url: report_config.api_url + 'reports/',
            headers: {
                'Authorization': report_config.auth_token
            },
            data: report_item_to_add
        });
        return (request.then(handleSuccess, handleError));
    }

    this.update_report_item = function(report_config, report_item) {
        //updates report_item.
        //Token passed as Authorization header to verify update operation.
        var request = $http({
            method: "PUT",
            url: report_config.api_url + 'reports/' + report_item.id + '/',
            headers: {
                'Authorization': report_config.auth_token,
            },
            data: report_item
        });
        return (request.then(handleSuccess, handleError));
    }

    this.remove_report_item = function(report_config, report_item) {
        //deletes report_item.
        //Token passed as Authorization header to verify delete operation.
        var request = $http({
            method: 'DELETE',
            url: report_config.api_url + 'reports/' + report_item.id + '/',
            headers: {
                'Authorization': report_config.auth_token
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
        //Status 403, forbidden action user isnot allowed to perform certain action.
        //else returns the error messsage.
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