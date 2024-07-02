frappe.query_reports['Sprint Effort'] = {
    "filters": [
        {
            "fieldname": "sprint",
            "label": __("Sprint"),
            "fieldtype": "Link",
            "width": "80",
            "options": "Sprint"
        },
        {
            "fieldname": "user",
            "label": __("User"),
            "fieldtype": "Link",
            "width": "80",
            "options": "User"
        },
        {
            "fieldname": "task",
            "label": __("Task"),
            "fieldtype": "Link",
            "width": "80",
            "options": "Task"
        }
    ], 
    
    "tree": true,
    "name_field": "name",
    "parent_field": "parent",
    "initial_depth": 1,
    "formatter": function(value, row, column, data, default_formatter) {
        value = default_formatter(value, row, column, data);

        if (data && (data.indent == 0.0 || data.indent == 1.0)) {
            value = $(`<span>${value}</span>`);
            var $value = $(value).css("font-weight", "bold");
            value = $value.wrap("<p></p>").parent().html();
        }

        return value;
    }
};
