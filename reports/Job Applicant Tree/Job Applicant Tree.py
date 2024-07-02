def get_columns():
    columns = [
        {"label": "Applicant Name", "fieldname": "name", "fieldtype": "Data"},
        {"label": "Applicant Status", "fieldname": "status", "fieldtype": "Data"}
    ]
    return columns

def get_data():
    
    job_applicants = [
        {"name": "001", "applicant_name": "John Doe", "status": "Pending"},
        {"name": "002", "applicant_name": "Jane Smith", "status": "Accepted"}
    ]
    
    
    interviews = [
        {"name": "001", "job_applicant": "001", "interview_round": "First Round", "status": "Completed", "interview_summary": "Good performance"},
        {"name": "002", "job_applicant": "002", "interview_round": "Final Round", "status": "Scheduled", "interview_summary": ""}
    ]
    
    
    job_offers = [
        {"name": "001", "job_applicant": "002", "status": "Pending", "offer_date": "2024-04-10"}
    ]
    
    
    
    tree_data = []
    for job_applicant in job_applicants:
        applicant_node = {
            'name': job_applicant['applicant_name'],
            'status': job_applicant['status'],
            'children': []
        }
        for interview in interviews:
            if interview['job_applicant'] == job_applicant['name']:
                interview_node = {
                    'name': interview['interview_round'],
                    'status': interview['status'],
                    'summary': interview['interview_summary']
                }
                applicant_node['children'].append(interview_node)
        
        for job_offer in job_offers:
            if job_offer['job_applicant'] == job_applicant['name']:
                job_offer_node = {
                    'name': 'Job Offer',
                    'status': job_offer['status'],
                    'offer_date': job_offer['offer_date']
                }
                applicant_node['children'].append(job_offer_node)
        
        tree_data.append(applicant_node)
    
    return tree_data
column = get_columns()
tree_data = get_data()


