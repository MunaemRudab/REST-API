function ReportListController(reportService) {
    //Lists all reports in tabular form, with add, edit and remove options against each report item.
    var $ctrl = this;
    $ctrl.params = {
        defaultReport : {},
        report : {},
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
            listReports, handleError);
    }

    function listReports(response) {
        //sets response data to list view (reports)
        $ctrl.reports = response.data;
    }

    $ctrl.saveReportItem = function() {
        /*saves new/existing report item on the basis of 'isUpdate' variable.
        isUpdate = true for update report and false for adding new report.*/
        if ($ctrl.params.isUpdate) {
            updateReportItem();
        }
        else {
            createReportItem();
        }
    }

    function updateReportItem() {
        /*updates report item by passing report_item as an argument,
        and sets new values of item in success.*/
        reportService.updateReport($ctrl.params.report).then(
            function (response) {
                if (response.data != null) {
                    var index = $ctrl.reports.indexOf($ctrl.params.report);
                    if(index > -1){
                        $ctrl.reports[index] = response.data;
                        $ctrl.showAddEditForm = !$ctrl.showAddEditForm;
                    }
                }
            }, 
            handleError);
    };

    function createReportItem() {
        /*Cerates new report item by getting values from form fields,
        and updates the list view in success.*/
        reportService.createReport(mapFormFieldToJSON()).then(
            function (response) {
                if (response.status === 201) {
                    $ctrl.reports.push(response.data);
                    $ctrl.showAddEditForm = false;
                }
            }, 
            handleError);
    };

    function mapFormFieldToJSON() {
        //maps form fields values to json format.
        return {
            'title': $ctrl.params.report.title,
            'description': $ctrl.params.report.description,
            'report_type': $ctrl.params.report.types.keys
        };
    }

    $ctrl.removeReportItem = function(reportItem) {
        //Removes selected report item and updates list view in success.
        reportService.removeReport(reportItem.id).then(
            function (response) {
                if (response.status === 204) {
                    if($ctrl.reports.indexOf(reportItem) > -1){
                        $ctrl.reports.splice($ctrl.reports.indexOf(reportItem), 1);
                        $ctrl.showAddEditForm = false;
                    }
                }
            }, 
            handleError);
    };

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

    $ctrl.toggleAddEditForm = function(reportItem) {
        $ctrl.showAddEditForm = true;

        if (reportItem.title) {
            $ctrl.params.isUpdate = true;
            $ctrl.params.report = reportItem;
            populateFormFields(reportItem);
        }
        else {
            $ctrl.params.isUpdate = false;
            $ctrl.params.report = angular.copy($ctrl.params.defaultReport);
        }
    }

    function populateFormFields(reportItem) {
        $ctrl.params.report.title = reportItem.title;
        $ctrl.params.report.description = reportItem.description;
        $ctrl.params.report_type = reportItem.report_type;
    }
}
