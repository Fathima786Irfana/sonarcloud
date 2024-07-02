def get_columns():
    columns = frappe.get_doc('Report', 'Idle Time Report').as_dict()
    return columns['columns']
def get_data():
    table = []
    def get_unique_records(dict_array, key_fields, amount_field):
        unique_records = {}
    
        for record in dict_array:
            unique_key = tuple(record[field] for field in key_fields)
            
            if unique_key in unique_records:
                unique_records[unique_key][amount_field] = unique_records[unique_key].get(amount_field, 0) + record[amount_field]
            else:
                unique_records[unique_key] = record.copy()
    
        return list(unique_records.values())


    job_cards = frappe.get_all('Job Card', fields=['name', 'posting_date', 'workstation', 'total_time_in_mins'])
    unique_workstation_for_date = get_unique_records(job_cards, ['posting_date', 'workstation'], 'total_time_in_mins' )

    for unique_workstation in unique_workstation_for_date:
        output_row = unique_workstation
        output_row['total_idle_time'] = 24*60 - unique_workstation.total_time_in_mins
        table.append(output_row)
    return table

data = get_columns(), get_data()