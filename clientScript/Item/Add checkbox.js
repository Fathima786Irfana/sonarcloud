
frappe.ui.form.on('Item', {
    refresh: function (frm) {
        // Add the custom button
        frm.add_custom_button(__('Single Variant'), function () {
            // Modify the button's click event
            frappe.prompt([
                {
                    label: 'Include All Fields',
                    fieldname: 'include_all_fields',
                    fieldtype: 'Check',
                    default: 1 // 1 for true, 0 for false
                }
                // Add more fields if needed
            ], function (values) {
                // Handle the values returned from the prompt
                if (values.include_all_fields) {
                    // Do something when the checkbox is checked
                } else {
                    // Do something when the checkbox is not checked wnhegwgvgcdwhbkqhgfbtfyvcyitvctwfycgvcy
                }
            }, __('Create'));
        });
    }
});