frappe.query_reports["Item Variant Sample"] = {
    "filters": [
        {
            "reqd": 1,
            "default": "",
            "options": "Item",
            "label": __("Item"),
            "fieldname": "item",
            "fieldtype": "Link",
            "get_query": () => {
                return {
                    "filters": {"has_variants": 1}
                };
            }
        }
    ],
    "list_view": {
        "fields": [
            "item_add"
        ]
    },
    "onload": function (report) {
        // Add a button to the report page
        report.page.add_inner_button(__("Button"), function () {
            // Show the "Include All Fields" checkbox when the button is clicked
            report.page.add_field({
                "fieldname": "include_all_fields",
                "label": __("Include All Fields"),
                "fieldtype": "Check",
                "default": true
            });
        });
    }
};
