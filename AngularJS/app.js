angular.module("App", ['main']);
angular.module("main", []);

angular.module('main')
    .controller('reportsApi', function($scope, $http) {

        var report_config = {
            current_report_item: [],
            auth_token: "",
            scope: $scope,
            ajax: $http,
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
            Init: () => {
                $scope.toggle = true;
                $scope.toggleFilter = function(report_item) {
                    $scope.toggle = $scope.toggle === false ? true : false;
                    $scope.title = report_item.title;
                    $scope.description = report_item.description;
                    current_report_item = report_item;
                }
                $scope.types = report_config.types;
                report_config.get_token();
                report_config.get_reports();
            },
            getIndex: (item_id) => {
              //returns index for respective item
                return report_config.scope.reports.findIndex(r => r.id === item_id);
            },
            get_token: () => {
              //gets token for user
                report_config.ajax({
                    method: 'POST',
                    url: report_config.api_url + 'api/login/',
                    data: {
                        'username': 'admin',
                        'password': '1q1q1q1q'
                    }
                }).then(function(response) {
                        report_config.auth_token = "Token " + response.data.token;
                    },
                    function(error) {
                        alert(error.data.detail)
                    });
            },
            get_reports: () => {
              //lists all reports
                report_config.ajax({
                    method: 'GET',
                    url: report_config.api_url + 'reports/',
                    headers: {}
                }).then(function(response) {
                        $scope.reports = response.data;
                    },
                    function(error) {
                        alert(error.data.detail)
                    });
            },
            get_form_data: () => {
              //get form fields data 
                if (report_config.scope.addForm.$valid) {
                    return {
                        'title': report_config.scope.title,
                        'description': report_config.scope.description,
                        'report_type': report_config.scope.report_type.value
                    };
                }
            },
            update_report_item: () => {
              //update respective report item
                report_item = current_report_item
                report_item.title = report_config.scope.title;
                report_item.description = report_config.scope.description;
                report_config.ajax({
                    method: 'PUT',
                    url: report_config.api_url + 'reports/' + report_item.id + '/',
                    headers: {
                        'Authorization': report_config.auth_token
                    },
                    data: report_item
                }).then(function(response) {
                        report_config.scope.reports[report_config.getIndex(current_report_item.id)] = response.data;
                    },
                    function(error) {
                        alert(error.data.detail)
                    });
            },
            add_report_item: () => {
              //add new report item
                report_config.ajax({
                    method: 'POST',
                    url: report_config.api_url + 'reports/',
                    headers: {
                        'Authorization': report_config.auth_token
                    },
                    data: report_config.get_form_data()
                }).then(function(response) {
                        if (response.status === 201) {
                            report_config.scope.reports.push(response.data);
                            report_config.scope.form = false;
                        }
                    },
                    function(response) {
                        alert(response.data.detail)
                    });
            },
            remove_report_item: (report_item) => {
              //removes report item
                report_config.ajax({
                    method: 'DELETE',
                    url: report_config.api_url + 'reports/' + report_item.id + '/',
                    headers: {
                        'Authorization': report_config.auth_token,
                    }
                }).then(function(response) {
                        if (response.status === 204) {
                            report_config.scope.reports.splice(report_config.getIndex(report_item.id), 1);
                        }
                    },
                    function(response) {
                        alert(response.data.detail)
                    });
            }
        }
        $scope.update = function() {
            report_config.update_report_item();
        };
        $scope.add = function() {
            report_config.add_report_item();
        };
        $scope.remove = function(report_item) {
            report_config.remove_report_item(report_item);
        };
        angular.element(document).ready(function() {
          report_config.Init();
        });
    });