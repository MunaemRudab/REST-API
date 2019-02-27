function ReportListController(reportService) {
    //Lists all reports in tabular form, with add, edit and remove options against each report item.
    var $ctrl = this;
    $ctrl.params = {
        reports : {},
        reportItem : {},
        isUpdate : false,
        types : [
            {
                keys: "AN",
                value: "Annual"
            }, 
            {
                keys: "MO",
                value: "Monthly"
            }, 
            {
                keys: "WE",
                value: "Weekly"
            }
        ]
    };

    $ctrl.$onInit = function(){
        reportService.getReports().then(
            function (response){
                angular.forEach(response.data, function(item){
                    $ctrl.params.reports[item.id] = item;
                });
            }, 
            handleError);
    }

    $ctrl.saveReportItem = function() {
        //saves new/existing report item on the basis of 'isUpdate' variable.
        if ($ctrl.params.isUpdate) {
            updateReportItem();
        }
        else {
            createReportItem();
        }
    }

    function updateReportItem() {
        $ctrl.params.reportItem.report_type = $ctrl.params.reportItem.types.keys;
        reportService.updateReport($ctrl.params.reportItem).then(
            function (response) {
                if (response.status != 403) {
                    $ctrl.params.reports[$ctrl.params.reportItem.id] = response.data;
                    $ctrl.showAddEditForm = false;
                }
            }, 
            handleError);
    };

    function createReportItem() {
        reportService.createReport(mapFormFieldToJSON()).then(
            function (response) {
                if (response.status === 201) {
                    $ctrl.params.reports[response.data.id] = response.data;
                    $ctrl.showAddEditForm = false;
                }
            }, 
            handleError);
    };

    function mapFormFieldToJSON() {
        //maps form fields values to json format.
        return {
            'title': $ctrl.params.reportItem.title,
            'description': $ctrl.params.reportItem.description,
            'report_type': $ctrl.params.reportItem.types.keys
        };
    }

    $ctrl.removeReportItem = function(reportId) {
        reportService.removeReport(reportId).then(
            function (response) {
                if (response.status === 204) {
                    delete $ctrl.params.reports[reportId];
                    $ctrl.showAddEditForm = false;
                }
            }, 
            handleError);
    };

    function handleError(response) {
        return response.data.message;
    }

    $ctrl.toggleAddEditForm = function(isUpdate, reportItem) {
        $ctrl.showAddEditForm = true;
        $ctrl.params.isUpdate = isUpdate;

        if(isUpdate){
            $ctrl.params.reportItem = reportItem;
        }
        else{
            $ctrl.params.reportItem = {};
        }
    }
}
