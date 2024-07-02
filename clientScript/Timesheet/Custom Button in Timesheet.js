frappe.ui.form.on('Timesheet', {
    refresh: function(frm) {
        // Check if the form status is 'Draft'
        if (frm.doc.docstatus === 0) {
            // Add a custom button
            frm.add_custom_button(__('Smart Time Log'), function() {
                frappe.call({
                    method: "get_list_of_updated_tasks", // Server-side method to call
                    callback: function(response) {
                        if (response.message) {
                            console.log("Display List of Tasks based on the User", response.message);

                            var tasks = response.message.message;

                            // Convert dictionary values to array and reverse it
                            var taskNames = Object.values(tasks)[0].reverse(); // Extract the array from the dictionary and reverse it

                            // Get current date
                            var currentDate = new Date();
                            var previousTaskEndTime = null;
                            var totalHours = 8; // Total hours for the day
                            var totalTaskHours = 0; // Total hours for all tasks

                            // Iterate over the reversed array of task names
                            taskNames.forEach(function(taskName, index) {
                                // Check if taskName is an object and has a 'name' property
                                if (typeof taskName === "object" && taskName.name) {
                                    // Add a new row
                                    var row;
                                    // If it's the first iteration, use the first row
                                    if (index === 0) {
                                        row = frm.doc.time_logs[0];
                                    } else {
                                        // Otherwise, add a new row
                                        row = frappe.model.add_child(frm.doc, "Timesheet Detail", "time_logs");
                                    }
                                    // Set Activity Type
                                    row.activity_type = "Development";
                                    // Assign task name to the 'task' field
                                    row.task = taskName.name;
                                    
                                    // Calculate hours for the task
                                    var remainingHours = totalHours - (index === 0 ? 0 : parseFloat(taskNames[index - 1].custom_time_btg));
                                    var hours = Math.min(remainingHours, parseFloat(taskName.custom_time_btg)); // Ensure hours don't exceed remaining hours or task's hours
                                    row.hours = hours;
                                    totalTaskHours += hours; // Add hours to totalTaskHours
                                    
                                    // Calculate start time based on the end time of the previous task
                                    if (previousTaskEndTime) {
                                        var startTime = new Date(previousTaskEndTime);
                                        startTime.setHours(startTime.getHours() + Math.floor(parseFloat(taskNames[index - 1].custom_time_btg)), startTime.getMinutes() + Math.round((parseFloat(taskNames[index - 1].custom_time_btg) % 1) * 60));
                                        // Set the "from_time" field value directly
                                        row.from_time = frappe.datetime.get_datetime_as_string(startTime);
                                    } else {
                                        // Set start time to today's date with 9:00 AM for the first task
                                        var startTime = new Date();
                                        startTime.setHours(9, 0, 0, 0); // Set hours to 9:00 AM
                                        // Set the "from_time" field value directly
                                        row.from_time = frappe.datetime.get_datetime_as_string(startTime);
                                    }

                                    // Make the row editable
                                    row.read_only = 0;

                                    // Update previous task end time
                                    previousTaskEndTime = startTime;
                                } else {
                                    console.error("Task name not found or invalid in task object:", taskName);
                                }
                            });

                            // Set the total hours for all tasks
                            frm.set_value('total_hours', totalTaskHours);

                            // Refresh the child table to reflect changes
                            frm.refresh_field("time_logs");
                        } else {
                            console.error("User ID is undefined");
                        }
                    }
                });
            }).addClass('btn-primary').css('background-color', '#2490EF');
        }
    }
});
