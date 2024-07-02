frappe.ui.form.on('Item Variant Attribute', {
    onload: function (frm) {
        // Set the default value to "No" for the 'Special' field
        frm.set_value('special', 'No');
    }
});