//this is an devops test
frappe.query_reports['check'] = {
    get_datatable_options: function(options) {
        return Object.assign(options, {
            checkboxColumn: true
        });
    },
    onload: function (report) {
        //console.log("Triggered");
        report.page.add_inner_button(__("Freeze columns"), function() {
            //console.log("Button Triggered")
            const header_elements = $(`.dt-row-header`);
           //const elements = document.querySelectorAll(`.${className}`);
            //console.log("Elements:", header_elements)
            const header_sticky = $(`.dt-cell--col-0, .dt-cell--col-1, .dt-cell--col-2`);
            console.log("Elements:", header_sticky)
            header_sticky.css({
                'position': 'sticky',
                'left': '0',
                'background-color': 'red'
                
            });
        });
    }
};
