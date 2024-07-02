def get_columns():
    columns = [
        {"fieldname": "department", "label" : _("Department"), "fieldtype": "Link", "options": "Department", "width": 140},
        {"fieldname": "job_title", "label" : _("Job Opening"), "fieldtype": "Data", "options": "Job Opening", "width": 140},
        {"fieldname": "count", "label" : _("Total Applicants"), "fieldtype": "Data", "width": 140},
        {"fieldname": "applicant_to_hire", "label": _("Application to Hire"), "fieldtype": "Data", "width": 120},
        {"fieldname": "applicant_to_hire_rate", "label": _("Application to Hire Rate(%)"), "fieldtype": "Data", "width": 120}
    ]
    return columns

def get_data(filters):
    filtered_data = []
    data_out = [{"department": '', "job_title": '', "count": '', "applicant_to_hire": '', "applicant_to_hire_rate": ''}]
    department = filters.get('department')
    def get_filtered_data():
        filtered_data = []
        if department:
            filters['department'] = department
            staffing_plan = frappe.get_all("Staffing Plan", fields=["name", "department"])
            total_applicants = len(frappe.get_list("Job Applicant", filters={"department": department}))
            accepted_applicants = len(frappe.get_list("Job Applicant", filters={"department": department, "status": "Accepted"}))
            for staff in staffing_plan:
                row = {
                    "department": staff.get("department"),
                    "job_title": staff.get("name"),
                    "count": total_applicants,
                    "applicant_to_hire": accepted_applicants,
                    "applicant_to_hire_rate": (accepted_applicants / total_applicants) * 100 
                }
            filtered_data.append(row)
        return filtered_data
    return data_out + filtered_data

data = get_columns(), get_data(filter)