frappe.ui.form.on('Leave Application', {
    after_save: function(frm) {
        // Check if the status is changed to "Approved" after saving
        if (frm.doc.status == "Approved") {
            frappe.after_ajax(function() {
                updateTaskStatus(frm);
            });
        }
    }
});

function updateTaskStatus(frm) {
    // Fetch the associated Task documents based on modified_by field
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Task',
            filters: {
                'modified_by': frm.doc.employee_name,
                'status': 'Open'  // Adjust the status condition based on your use case
            },
            fields: ['name']
        },
        callback: function(response) {
            const tasks = response.message;

            // Update the status of each Task document to "Pending Review"
            tasks.forEach(task => {
                frappe.call({
                    method: 'frappe.client.set_value',
                    args: {
                        doctype: 'Task',
                        name: task.name,
                        fieldname: 'status',
                        value: 'Pending Review'
                    },
                    callback: function(response) {
                        // Handle callback if needed
                    }
                });
            });
        }
    });
}
