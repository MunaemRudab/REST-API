function ReportService($http, $q) {

    var reportService_config = {
        current_report_item: [],
        apiURL: "http://localhost:8000/"
    }

    this.getUserToken = function() {
        /*gets token value from service by a POST request 
        passing username and password as arguments. */
        $http({
            method: "POST",
            url: reportService_config.apiURL + 'api/login/',
            data: {
                'username': 'test',
                'password': '1q1q1q1q'
            }
        }).then(
            function(response) {
                $http.defaults.headers.common.Authorization = "Token " + response.data.token;
            }, 
            handleError);
    }

    this.getReports = function() {
        //returns reports list from service by a GET request.
        return $http({
            method: "GET",
            url: reportService_config.apiURL + 'reports/'
        });
    }

    this.addReport = function(newReportItem) {
        /*adds newReportItem.
        Token passed as Authorization header to verify add operation.*/
        return $http({
            method: "POST",
            url: reportService_config.apiURL + 'reports/',
            data: newReportItem
        });

    }

    this.updateReport = function(reportItem) {
        /*updates reportItem.
        Token passed as Authorization header to verify update operation.*/
        reportItem.report_type = reportItem.types.keys;
        return $http({
            method: "PUT",
            url: reportService_config.apiURL + 'reports/' + reportItem.id + '/',
            data: reportItem
        });
    }

    this.removeReport = function(reportId) {
        /*deletes reportItem.
        Token passed as Authorization header to verify delete operation.*/
        return $http({
            method: 'DELETE',
            url: reportService_config.apiURL + 'reports/' + reportId + '/',
        });
    }

    function handleError(response) {
        /*Status 403, forbidden action user isnot allowed to perform certain action.
        else returns the error messsage.*/
        if (response.status === 403) {
            console.log(response.data.detail);
            return false;
        } 
        return ($q.reject(response.data.message));
    }
}
