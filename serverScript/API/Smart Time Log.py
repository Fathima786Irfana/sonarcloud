l_today_date = frappe.utils.today()
l_yesterday_date = frappe.utils.add_days(l_today_date, -1)

la_employees = frappe.get_all("Employee", fields=['user_id'])

ld_result = {}

for la_employee in la_employees:
    if la_employee.user_id:
        
        la_tasks = frappe.get_all("Task", 
                                   fields=['name', 'status', 'exp_start_date','custom_time_btg'], 
                                   filters={'owner': la_employee.user_id,
                                            'status': 'Working', 
                                            'exp_start_date': ['between', [l_yesterday_date, l_today_date]]})
        
        if la_tasks:
            ld_result[la_employee.user_id] = la_tasks


#frappe.flags.message = {"ld_message": ld_result}
frappe.flags.message = ld_result