function ReportListController(reportService) {
    //Lists all reports in tabular form, with add, edit and remove options against each report item.
    var $ctrl = this;
    $ctrl.master = {};
    $ctrl.report = {};
    $ctrl.isUpdate = false;
    $ctrl.current_report_item = {};
    $ctrl.types = [
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
    ];

    reportService.get_token().then(
        //gets token from service to authenticate.
        function() {
            console.warn();
        },
        function(errorMessage) {
            console.warn(errorMessage);
        }
    );

    reportService.get_reports().then(
        list_reports,
        function(errorMessage) {
            console.warn(errorMessage);
        }
    );

    $ctrl.saveReportItem = function() {

        if ($ctrl.isUpdate) {
            updateReportItem();
        }
        else {
            addReportItem();
        }
    }

    function updateReportItem() {
        /*updates report item by passing report_item as an argument, 
        and sets new values of item in success.*/
        report_item = current_report_item
        report_item.title = $ctrl.report.title;
        report_item.description = $ctrl.report.description;
        reportService.update_report_item(report_item).then(
            function update(response) {

                if (response) {
                    $ctrl.reports[getIndex(current_report_item.id)] = response.data;
                    $ctrl.editForm = !$ctrl.editForm;
                }
            }
        );
    };

    function addReportItem() {
        /*Adds new report item by getting values from form fields,
        and updates the list view in success.*/
        reportService.add_report_item(get_form_data()).then(
            function add(response) {

                if (response.status === 201) {
                    $ctrl.reports.push(response.data);
                    $ctrl.showAddForm = false;
                }
            }
        );
    };

    $ctrl.removeReportItem = function(report_item) {
        //Removes selected report item and updates list view in success.
        current_report_item = report_item;
        reportService.remove_report_item(report_item).then(
            function remove(response) {

                if (response.status === 204) {
                    $ctrl.reports.splice(getIndex(current_report_item.id), 1);
                }
            }
        );
    };

    function getIndex(item_id) {
        //returns index of the respective report item.
        return $ctrl.reports.findIndex(r => r.id === item_id);
    }

    function get_form_data() {
        //returns form fields values.
        return {
            'title': $ctrl.report.title,
            'description': $ctrl.report.description,
            'report_type': $ctrl.report.types.keys
        };
    }

    function list_reports(response) {
        //sets response data to list view (reports)
        $ctrl.reports = response.data;
    }

    function populateFormFields(report_item) {
        $ctrl.report.title = report_item.title;
        $ctrl.report.description = report_item.description;
        $ctrl.report_type = report_item.report_type;
        current_report_item = report_item;
    }

    $ctrl.toggleAddEditForm = function(report_item) {
        $ctrl.showAddEditForm = !$ctrl.showAddEditForm;

        if (report_item.item) {
            $ctrl.isUpdate = true;
            populateFormFields(report_item.item);
        }
        else {
            $ctrl.isUpdate = false;
            $ctrl.report = angular.copy($ctrl.master);
        }
    }
}
