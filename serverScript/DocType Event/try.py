def check_permission(doc, user):
    if not user.has_permission('Job Applicant', 'read'):
        console.log(user);
        raise frappe.PermissionError('You do not have permission to view this document')
        