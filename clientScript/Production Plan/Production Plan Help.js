frappe.ui.form.on('Production Plan', {
refresh: function(frm) {
        // Add the custom button
        frm.add_custom_button(__('Form Tour'), function() {
            console.log('inside button click');
            const tour_name = 'Demo Production plan';
            // Initialize and start the tour when button is clicked
            frm.tour.init({ tour_name }).then(() => frm.tour.start());
        }).addClass('btn-primary').css('background-color', '#2490EF');
    }
});
