#this is devops test
#This is an automation test.
def get_columns():
    columns = [ 
        {"fieldname": "name", "label": _("Applicant Name"), "fieldtype": "Data", "width": 140},
        {"fieldname": "status", "label": _("Applicant Status"), "fieldtype": "Select", "options": "Status", "width": 140},
        {"fieldname": "interview_round1", "label": _("Interview Round1"), "fieldtype": "Link", "options": "Interview Round", "width": 140},
        {"fieldname": "interview_status1", "label": _("Interview1 Status"), "fieldtype": "Select", "options": "Status", "width": 140},
        {"fieldname": "interview_round2", "label": _("Interview Round2"), "fieldtype": "Link", "options": "Interview Round", "width": 140},
        {"fieldname": "interview_status2", "label": _("Interview2 Status"), "fieldtype": "Select", "options": "Status", "width": 140},
        {"fieldname": "offer_status", "label": _("Offer Status"), "fieldtype": "Select","options": "Status", "width": 140},
        {"fieldname": "offer_date", "label": _("Offer Date"), "fieldtype": "Date", "width": 140},
    ]
    return columns

def get_data():
    filtered_data = []
    job_applicants = frappe.get_all("Job Applicant", fields=["name", "status"])
    log(job_applicants)
    for job_applicant in job_applicants:
        output_row = {'name': job_applicant['name'], 'status': job_applicant['status']}
        filtered_data.append(output_row)
    sorted_data = sorted(filtered_data, key=lambda x: x['name'])


def get_binary_search(data, target):
    low = 0
    high = len(data) - 1

    while low <= high:
        mid = (low + high) // 2
        if data[mid]['name'] == target:
            return mid
        elif data[mid]['name'] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1


# Example usage of binary search
target_name = 'ratchana@gmail.com'
index = binary_search(sorted_data, target_name)

if index != -1:
    log(f"Found {target_name} at index {index}")
else:
    log(f"{target_name} not found in the list")
    
data = get_column(), get_data(), get_binary_search(data, target)
