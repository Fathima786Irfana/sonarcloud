def get_columns():
    columns = [ 
        {"fieldname": "sales_order", "label": ("Sales Order"), "fieldtype": "Data", "width": 100},
        {"fieldname": "customer", "label": ("Customer"), "fieldtype": "Data", "width": 100},
        {"fieldname": "order_date", "label": ("Order Date"), "fieldtype": "Date", "width": 100},
        {"fieldname": "days_pending", "label": ("Days Pending Fulfillment"), "fieldtype": "Data", "width": 120},
        {"fieldname": "fulfillment_status", "label": ("Fulfillment Status"), "fieldtype": "Data", "width": 120},
        {"fieldname": "invoice_status", "label": ("Invoice Status"), "fieldtype": "Data", "width": 120},
    ]
    return columns

def get_data():
    filtered_data = []
    data_out = [{"name": '', "customer": '', "order_date": '', "days_pending": '', "fulfillment_statu": '', "invoice_status": ''}]
    data = frappe.get_all("F2C Sales Order", fields=["name", "customer", "order_date", "days_pending", "fulfillment_status", "invoice_status"])
    for row in data:
        specific_datetime = frappe.utils.get_datetime(row.order_date)
        days_pending_ful = frappe.utils.date_diff(frappe.utils.now(), specific_datetime)
        
        output_row = {
            "name": row.name,
            "order_date": row.order_date,
            "days_pending": days_pending_ful.days,
            "fulfillment_status": row.fulfillment_status,
            "invoice_status": row.invoice_status,
        }
   
    return filtered_data + data_out + data


data = get_columns(), get_data()
