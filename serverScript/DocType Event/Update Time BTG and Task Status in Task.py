for timelog in doc.time_logs:
    task = frappe.get_doc('Task', timelog.task)
    task.custom_time_btg = task.custom_time_btg - timelog.hours
    task.save()
    frappe.msgprint(task.name + " updated with BTG " + str(task.custom_time_btg) )