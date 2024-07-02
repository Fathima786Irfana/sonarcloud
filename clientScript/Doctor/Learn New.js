//This is an automation Testing
//This is Second Phase.
frappe.ui.form.on('Doctor', {
    refresh(frm) {
        var value = frm.doc.doctor_age;
        console.log("Doctor's Age:", value); // Add this line for debugging

        if (value < 35)
            // Show an alert with the field's value
            frappe.show_alert(`Age less than 35: ${value}`);
    }
});
