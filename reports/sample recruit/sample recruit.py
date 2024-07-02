def get_columns():
    columns = [
        {"fieldname": "department", "label" : _("Department"), "fieldtype": "Link", "options": "Department", "width": 140},
        {"fieldname": "designation", "label" : _("Designation"), "fieldtype": "Link", "options": "Designation", "width": 140},
        {"fieldname": "job_title", "label" : _("Job Opening"), "fieldtype": "Data", "options": "Job Opening", "width": 140},
        {"fieldname": "count", "label" : _("Total Applicants"), "fieldtype": "Data", "width": 140},
        {"fieldname": "applicant_to_hire", "label": _("Application to Hire"), "fieldtype": "Data", "width": 120},
        {"fieldname": "applicant_to_hire_rate", "label": _("Application to Hire Rate(%)"), "fieldtype": "Data", "width": 120}
    ]
    return columns

def get_data(filters):
    filtered_data = []
    data_out = [{"department": '', "designation": '', "job_title": '', "count": '', "applicant_to_hire": '', "applicant_to_hire_rate": ''}]
    
    department = filters.get('department')
    if department:
        #filters['department'] = department
        staffing_plans = frappe.get_all("Staffing Plan", filters={"department": department}, fields=["name", "department"])
        
        for staffing_plan in staffing_plans:
            output_row = dict({'department': '', 'name': '', 'designation': '', 'count': '', 'applicant_to_hire': '', 'applicant_to_hire_rate': ''})
            output_row['department'] = staffing_plan['department']
            output_row['job_title'] = staffing_plan['name']
            staffing_plan_details = frappe.get_all("Staffing Plan Detail", filters={"parent": staffing_plan['name']}, fields=["designation"]) 

            #staffing_plan_details = frappe.get_all("Staffing Plan Detail", fields=["designation"]) 
            for staffing_plan_detail in staffing_plan_details:
                output_row['designation'] = staffing_plan_detail['designation']
                total_applicants = frappe.get_all("Job Applicant", filters={"designation": staffing_plan_detail['designation']}, fields=["name"])
                output_row['count'] = len(total_applicants)
                applicant_to_hire = frappe.get_all("Job Applicant", filters={"designation": staffing_plan_detail['designation'], "status": "accepted"}, fields=["name"])
                output_row['applicant_to_hire'] = len(applicant_to_hire)
                if output_row['count'] != 0:
                    output_row['applicant_to_hire_rate'] = (output_row['applicant_to_hire'] / output_row['count']) * 100
                else:
                    output_row['applicant_to_hire_rate'] = 0
            filtered_data.append(output_row)
           
    return filtered_data + data_out
    

data = get_columns(), get_data(filters)
