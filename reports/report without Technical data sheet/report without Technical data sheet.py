def get_columns():
    columns = [
        {"fieldname": "item_name", "label": _("Item Name"), "fieldtype": "Data", "width": 140},
        {"fieldname": "creation", "label": _("Creation"), "fieldtype": "Date", "width": 140},
        {"fieldname": "modified", "label": _("Modified"), "fieldtype": "Date", "width": 140},
    ]
    return columns

def get_data():
    data = []
    items = frappe.get_all("Item", fields=["item_name", "creation", "modified"])

    for item in items:
        creation_date = item["creation"]
        modified_date = item["modified"]
        current_date = datetime.datetime.now().date()
        
        age = (current_date - creation_date.date()).days

        data_out = {
            "item_name": item["item_name"],
            "creation": item["creation"],
            "modified": item["modified"],
            "age": age
        }
        data.append(data_out)

    return data

data = get_columns(), get_data()