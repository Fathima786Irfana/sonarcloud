frappe.ui.form.ControlLink.link_options = function(link) {
    if (link.df.fieldname === "item_code") {
        console.log("Link", link)
        return [
            {
                html: "<span class='text-primary link-option'>"
                    + "<i class='fa fa-search' style='margin-right: 5px;'></i> "
                    + __("Search Variant")
                    + "</span>",
                label: __("Search Variant"),
                value: "item",
                action: function() {
                    frappe.set_route('query-report', 'Item Variant Enhanced');
                    frappe.route_options = {
                        "item": ""
                    };
                }
            }
        ];
    } 
    console.log("I am out of link")
};

frappe.ui.form.on('Quotation', {
    refresh(frm) {
        // When the add icon is clicked from the Item Varaint serach report the report re-directs to the Quotation
        // Once redirected the item_code passed from the report is set to the item_code of last entry in the items table
        // this logic must be changed to make it more dynamic to handle mid entry search
        if (frappe.route_options.item_code) {
            frm.doc.items[frm.doc.items.length -1 ].item_code = frappe.route_options.item_code;
            frm.events.get_pos(frm, frm.doc.items[frm.doc.items.length -1 ] )
            frm.refresh_fields();
        }
    },
})