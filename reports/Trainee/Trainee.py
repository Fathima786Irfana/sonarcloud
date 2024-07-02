def put_columns():
    columns = [ 
        {"fieldname": "f_name", "label": _("First Name"), "fieldtype": "Data", "width": 140},
        {"fieldname": "l_name", "label": _("Last Name"), "fieldtype": "Data", "width": 140},
        {"fieldname": "designation", "label": _("Designation"), "fieldtype": "Data", "width": 140},
        
    ]
    return columns
    
def output():
    final_data = []
    
    output_row = {
        'f_name' : "Fathima",
        'l_name' : "Irfana",
        'designation' : "Trainee"
        }
    final_data.append(output_row)
    return final_data
data = put_columns(), output()