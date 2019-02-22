function ReportService($http, $q) {

    this.getUserToken = function() {
        var data = {
            'username': 'test',
            'password': '1q1q1q1q'
        };

        return $http
                .post('api/login/', data).then(
                    setToken, 
                    function(response) {
                        return response.data.message;
                    }
                );
    }

    this.getReports = function() {
        return $http.get('reports/');
    }

    this.createReport = function(newReportItem) {
        return $http.post('reports/', newReportItem);
    }

    this.updateReport = function(reportItem) {
        return $http.put('reports/'+ reportItem.id + '/', reportItem);
    }

    this.removeReport = function(reportId) {
        return $http.delete('reports/'+ reportId + '/');
    }

    function setToken(response){
        $http.defaults.headers.common.Authorization = "Token " + response.data.token;
    }
}
