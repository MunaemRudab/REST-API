angular.module("reportApp", ['main']);
var app = angular.module("main", []);

angular.module('reportApp')
    .service('reportService', ReportService)
    .component('reportList', {
        templateUrl: 'components/CRUD/reportList.html',
        controller: ReportListController
    })
