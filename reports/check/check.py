#This is an automation Testing
# Define columns
def get_columns():
    columns = [
        {"fieldname": "name", "label": _("Sales Order"), "fieldtype": "Link", "options": "Sales Order", "width": 140},
        {"fieldname": "customer", "label": _("Customer"), "fieldtype": "Data", "width": 140},
        {"fieldname": "customer_name", "label": _("Customer Name"), "fieldtype": "Data", "width": 140},
        {"fieldname": "company", "label": _("Company"), "fieldtype": "Link", "options": "Company", "width": 140},
    ]
    return columns

# To Fetch the data of Sales Orders
def get_data():
    data = []
    sales_orders = frappe.get_all("Sales Order", fields=['name', 'customer', 'customer_name', 'company'])
    for sales_order in sales_orders:
        output = {'name': sales_order['name'], 'customer': sales_order['customer'], 'customer_name': sales_order['customer_name'], 'company': sales_order['company']}
        data.append(output)
    return data


data = get_columns(), get_data()
