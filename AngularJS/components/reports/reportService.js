function ReportService($http, $q) {

    var reportService_config = {
        current_report_item: [],
        apiURL: "http://localhost:8000/"
    }

    this.getUserToken = function() {
        /*gets token value from service by a POST request 
        passing username and password as arguments. */
        var data = {
            'username': 'test',
            'password': '1q1q1q1q'
        };

        return $http.post(reportService_config.apiURL + 'api/login/', data)
                .then(setToken, handleError);
    }

    this.getReports = function() {
        //returns reports list from service by a GET request.
        return $http.get(reportService_config.apiURL + 'reports/');
    }

    this.createReport = function(newReportItem) {
        /*creates newReportItem.
        Token passed as Authorization header to verify add operation.*/
        return $http.post(reportService_config.apiURL + 'reports/', newReportItem);
    }

    this.updateReport = function(reportItem) {
        /*updates reportItem.
        Token passed as Authorization header to verify update operation.*/
        reportItem.report_type = reportItem.types.keys;
        var url = reportService_config.apiURL + 'reports/'+ reportItem.id + '/'; 
        return $http.put(url, reportItem);
    }

    this.removeReport = function(reportId) {
        /*deletes reportItem.
        Token passed as Authorization header to verify delete operation.*/
        return $http.delete(reportService_config.apiURL + 'reports/'+ reportId + '/');
    }

    function setToken(response){
        $http.defaults.headers.common.Authorization = "Token " + response.data.token;
    }

    function handleError(response) {
        /*Status 403, forbidden action user isnot allowed to perform certain action.
        else returns the error messsage.*/
        if(response.status === -1){
            return false;
        }
        else if (response.status === 403) {
            console.log(response.data.detail);
            return false;
        } 
        return (response.data.message);
    }
}
