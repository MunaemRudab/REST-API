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
        return (request.then(
            function(response) {
                reportService_config.auth_token = "Token " + response.data.token;
            }, 
            handleError)
        );
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

        return ($q.reject(response.data.message));
    }
}
