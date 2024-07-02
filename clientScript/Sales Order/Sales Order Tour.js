frappe.ui.form.on('Sales Order', {
    refresh(frm) {
        console.log('inside refresh');
        frm.add_custom_button(__('Form Tour'), function() {
            // Your button click action
            // For example, you can show an alert
            console.log('inside button click');
            const tour_name = 'Sales Order';
            frm.tour.init({ tour_name }).then(() => frm.tour.start());
        }).addClass('btn-primary').css('background-color', '#2490EF');
    }
});


