frappe.query_reports["Job Recruitment"] = {
    "filters": [
        {
            "fieldname": "search_term",
            "label": __("Search Term"),
            "fieldtype": "Data",
            "placeholder": __("Enter search term")
        }
    ],
    "formatter": function(value, row, column, data, default_formatter) {
        if (value && column.fieldname === "search_term") {
            // Apply search term filtering
            if (row.some(function(cell) { return cell.toLowerCase().includes(value.toLowerCase()); })) {
                return value;
            } else {
                return '';
            }
        } else {
            return default_formatter(value, row, column, data);
        }
    }
};
