angular.module("reportApp", ['main']);
var main = angular.module("main", []);

main.run(['reportService', 
    function(ReportService) {
        ReportService.getUserToken();
    }
]);

main
    .service('reportService', ReportService)
    .component('reportList', {
        templateUrl: "static/components/reports/reportList.html",
        controller: ReportListController
    });
