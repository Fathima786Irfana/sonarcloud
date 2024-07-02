frappe.ui.form.on('User Login', {
    refresh: function(frm) {
        frm.add_custom_button(__('Login'), function() {
            frappe.show_progress(__('Processing'), __('Please wait...'));//check the %

            setTimeout(function() {
                frappe.hide_progress();
            }, 3000); // Simulating a 3-second time-consuming task
        });
    }
});
