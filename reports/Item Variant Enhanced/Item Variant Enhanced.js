frappe.query_reports["Item Variant Enhanced"] = {
    "filters": [
        {
            "reqd": 1,
            "default": "DTTHZ2N",
            "options": "Item",
            "label": __("Item"),
            "fieldname": "item",
            "fieldtype": "Link",
            "get_query": () => {
                return {
                    "filters": {"has_variants": 1}
                }
            }
        },
        {
            "fieldname": "catalog_designs",
            "label": __("Catalog Designs"),
            "fieldtype": "Check",
            "default": true
        },
        // hidden field to hold the value of the row index from the quotation Items child table
        {
            "fieldname": "quotation_item_idx",
            "fieldtype": "Int",
            "display": "hidden",
            "hidden": 1
        }
    ],
    
    onload: async function (report) {
        frappe.open_dialog = function (item_code, price_list_rate) {
            // Find the route of the Quotation Form from the frappe.route_history
            const quotation_route = frappe.route_history.find(entry => entry[0] === "Form" && entry[1] === "Quotation");
            if (quotation_route) {
                // Set the route back to the Quotation
                frappe.set_route(quotation_route[0], quotation_route[1], quotation_route[2]);
                // Set the Item code value from the clicked add action to the route options
                frappe.route_options = {
                    "item_code": item_code,
                    "quotation_item_idx": frappe.query_report.filters[2].value,
                };
                
                
            }
        };
    }
};
    /*onload: async function (report) {
        frappe.open_dialog = function (item_code, qty, price_list_rate) {
      
            const quotation_route = frappe.route_history.find(entry => entry[0] === "Form" && entry[1] === "Quotation");
            if (quotation_route) {
        
                frappe.set_route(quotation_route[0], quotation_route[1], quotation_route[2]);
                frappe.route_options = {
                    "item_code": item_code,
                    "quotation_item_idx": frappe.query_report.filters[2].value,
                    "qty": qty,
                    "quotation_item_idx": frappe.query_report.filters[3].value,
                    "price_list_rate": price_list_rate,
                    "quotation_item_idx": frappe.query_report.filters[4].value
                };
                
            
            }
        }
    }*/

