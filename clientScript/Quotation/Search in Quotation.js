frappe.ui.form.on('Quotation', {
    refresh: function(frm) {
        // Add a button to trigger the advanced search
        frm.add_custom_button(__('Button Search'), function() {
            open_advanced_search_dialog(frm);
        });
    }
});

function open_advanced_search_dialog(frm) {
    // Open a dialog to perform advanced item search
    frappe.prompt({
        fieldtype: 'Link',
        label: __('Item'),
        fieldname: 'item_code',
        options: 'Item',
        reqd: 1,
        get_query: function() {
            return {
                filters: {
                    // You can add additional filters based on your requirements
                }
            };
        },
        callback: function(item_code) {
            // After selecting the item, prompt for quantity and price
            frappe.prompt([
                {
                    fieldtype: 'Float',
                    label: __('Quantity'),
                    fieldname: 'qty',
                    reqd: 1,
                },
                {
                    fieldtype: 'Currency',
                    label: __('Rate'),
                    fieldname: 'price_list_rate',
                    reqd: 1,
                }
            ], function(values) {
                // Add the selected item to the Quotation table
                frm.fields_dict['items'].grid.df.get_query = function() {
                    return {
                        filters: {
                            'item_code': item_code
                        }
                    };
                };
                frm.fields_dict['items'].grid.get_field('item_code').get_query = function() {
                    return {
                        filters: {
                            'item_code': item_code
                        }
                    };
                };
                frappe.model.with_doc('Item', item_code, function() {
                    var item = frappe.model.get_doc('Item', item_code);
                    var child = frm.add_child('items');
                    frappe.model.set_value(child.doctype, child.name, 'item_code', item_code);
                    frappe.model.set_value(child.doctype, child.name, 'item_name', item.item_name);
                    frappe.model.set_value(child.doctype, child.name, 'qty', values.qty);
                    frappe.model.set_value(child.doctype, child.name, 'rate', values.price_list_rate);
                    frm.refresh_field('items');
                });
            }, 'Enter Quantity and Price', 'Add Item');
        }
    }, 'Enter Item Code', 'Add Item');
}
