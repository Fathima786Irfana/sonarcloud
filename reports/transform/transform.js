frappe.query_reports['transform'] = {
    "filters": [
        {
            "fieldname": "from_date",
            "label": __("End Date From"),
            "fieldtype": "Date",
            "width": "80",
            "default": '2023-01-02'
        },
        {
            "fieldname": "to_date",
            "label": __("End Date To"),
            "fieldtype": "Date",
            "width": "80",
            "default": frappe.datetime.year_end()
        }
    ],
    get_datatable_options: function (options) {
        return Object.assign(options, {
            checkboxColumn: true
            
        });
    },
    formatter: function (value, row, column, data, default_formatter) {
        value = default_formatter(value, row, column, data);
        if (column.fieldname === 'power') {
            column.className = 'dt-instance-1';
        }
        if (data) {
            if (data['power'] !== 'Weekly Capacity') {
                if (data['power'] === 'Total') {
                    var report_data = frappe.query_report.data;
                    var weekly_capacity_row = frappe.query_report.data.find(row => row.power === 'Weekly Capacity');
                    value = $(`<div>${value}</div>`);
                    var $value = $(value).css("font-weight", "bold");

                    if (data[column.fieldname] > weekly_capacity_row[column.fieldname]) {
                        $value.addClass("bg-danger text-white");
                    }

                    value = $value.wrap("<p></p>").parent().html();

                } else if (column.fieldname === 'col_2' && data['col_2'] > data['weekly_capacity']) {
                    var $value = $(value).css("font-weight", "normal");
                    $value.addClass("bg-danger text-white");
                    value = $value.wrap("<p></p>").parent().html();
                }
            }
        }
        if (column.fieldname === 'power') {
        column.className += ' sticky-column'; // Add a class to indicate a sticky column
    }
        return value;
    },
    onload: function (report) {
        var firstColumnHeader = $('.dt-container .dt-thead th:first-child');

        // Apply bold font style to the first column header
        firstColumnHeader.css('font-weight', 'bold');
        var stickyColumnCells = $('.dt-instance-1 .sticky-column');
        stickyColumnCells.addClass('sticky-left bg-danger');
    }
};

const style = document.createElement('style');
style.innerHTML = `
    .dt-row--highlight .dt-cell {
        background-color: #fffce7;
        background-color: var(--dt-selection-highlight-color);
        background-color: #DDDDDD;
    }

    .dt-instance-1 {
        display: block;
        overflow-x: auto;
        
    }
    .dt-instance-1 .dt-cell--col-2 {
        position: sticky;
        left: 0px;
        z-index: 1;
        background-color: light grey; /* Adjust as needed */
    }
    
    .sticky-column {
        position: sticky;
        left: 0;
        z-index: 1;
        background-color: red;
    }
    .sticky-column th:nth-child(2),
    .sticky-column td:nth-child(2) {
        background-color: red;
    }
`;
document.head.appendChild(style); 
   


