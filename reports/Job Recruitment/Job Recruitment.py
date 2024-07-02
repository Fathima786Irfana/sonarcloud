def get_columns():
    columns = [ 
        {"fieldname": "name", "label": _("Job Applicant"), "fieldtype": "Data", "width": 140},
        {"fieldname": "applicant_name", "label": _("Applicant Name"), "fieldtype": "Data", "width": 140},
        {"fieldname": "status", "label": _("Applicant Status"), "fieldtype": "Select", "options": "Status", "width": 140},
        {"fieldname": "interview_round1", "label": _("Interview Round1"), "fieldtype": "Link", "options": "Interview Round", "width": 140},
        {"fieldname": "interview_status1", "label": _("Interview1 Status"), "fieldtype": "Select", "options": "Status", "width": 140},
        {"fieldname": "interview1_summary", "label": _("Interview1 Summary"), "fieldtype": "Text", "width": 140},
        {"fieldname": "interview_round2", "label": _("Interview Round2"), "fieldtype": "Link", "options": "Interview Round", "width": 140},
        {"fieldname": "interview_status2", "label": _("Interview2 Status"), "fieldtype": "Select", "options": "Status", "width": 140},
        {"fieldname": "interview2_summary", "label": _("Interview2 Summary"), "fieldtype": "Text", "width": 140},
        {"fieldname": "offer_status", "label": _("JobOffer Status"), "fieldtype": "Select", "options": "Status", "width": 140},
        {"fieldname": "offer_date", "label": _("Offer Date"), "fieldtype": "Date", "width": 140},
    ]
    return columns

def get_data():
    filtered_data = []
    job_applicants = frappe.get_all("Job Applicant", fields=["name", "applicant_name", "status"])
    for job_applicant in job_applicants:
        output_row = {
            'name': job_applicant['name'],
            'applicant_name': job_applicant['applicant_name'],
            'status': job_applicant['status'],
            'interview_round1': '',
            'interview_status1': '',
            'interview1_summary': '',
            'interview_round2': '',
            'interview_status2': '',
            'interview2_summary': '',
            'offer_status': '',
            'offer_date': ''
        }
        interviews = frappe.get_all('Interview', filters={"job_applicant": job_applicant['name']}, fields=['name', 'interview_round', 'status', 'interview_summary'])
        for interview in interviews:
            if interview['interview_round'] == "technical":
                output_row['interview_round1'] = interview['name']
                output_row['interview_status1'] = interview['status']
                output_row['interview1_summary'] = interview['interview_summary']
            elif interview['interview_round'] == "Fitment":
                output_row['interview_round2'] = interview['name']
                output_row['interview_status2'] = interview['status']
                output_row['interview2_summary'] = interview['interview_summary']
        job_offers = frappe.get_all('Job Offer', filters={"job_applicant": job_applicant['name']}, fields=['name','status','offer_date'])
        for job_offer in job_offers:
            output_row['offer_status'] = job_offer['status']
            output_row['offer_date'] = job_offer['offer_date']
        filtered_data.append(output_row)
    return filtered_data
    

data = get_columns(), get_data()
