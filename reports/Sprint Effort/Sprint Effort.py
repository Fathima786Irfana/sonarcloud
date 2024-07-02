def get_columns():
    la_columns = [
        {"fieldname": "name", "label": _("Owner"), "fieldtype": "Data", "width": 140},
        {"fieldname": "task", "label": _("Task"), "fieldtype": "Data", "width": 140},
        {"fieldname": "expected_time", "label": _("Estimated"), "fieldtype": "Float", "width": 140},
    ]
    return la_columns
    
def get_data(filters):
    selected_user = filters["user"] if "user" in filters else None

    table = []
    owner_tasks = {}  # Dictionary to hold tasks for each owner
    
    # Fetch tasks based on selected user if it's provided
    if selected_user:
        la_tasks = frappe.get_all("Task", filters={'owner': selected_user}, fields=['name', 'owner', 'expected_time'], order_by='owner, name')
    else:
        la_tasks = frappe.get_all("Task", fields=['name', 'owner', 'expected_time'], order_by='owner, name')

    for la_task in la_tasks:
        owner = la_task["owner"]
        task_name = la_task["name"]
        expected_time = la_task["expected_time"]

        # Append the task under its owner
        if owner in owner_tasks:
            owner_tasks[owner].append({"name": None, "task": task_name, "indent": 2, "expected_time": expected_time})
        else:
            owner_tasks[owner] = [{"name": None, "task": task_name, "indent": 2, "expected_time": expected_time}]

    # Append owner rows and their tasks to the table
    for owner, tasks in owner_tasks.items():
        total_expected_time = sum(task["expected_time"] for task in tasks)
        table.append({"name": owner, "task": None, "indent": 1, "expected_time": total_expected_time})
        table.extend(tasks)

    return table

data = get_columns(), get_data(filters)