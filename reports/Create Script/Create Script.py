
def get_columns():
    columns = [ 
        {"fieldname": "name", "label" : _("Sales Order"), "fieldtype": "Link", "options": "Sales Order", "width": 140},
        {"fieldname": "customer", "label" : _("Customer"), "fieldtype": "Data", "width": 140},
       
      ]
    
    return columns
# To Fetch the data's of Sales Order 
def get_data():
    data = []
    sales_orders = frappe.get_all("Sales Order", fields=['name', 'customer']) 
    for sales_order  in sales_orders:
        output = {'name': sales_order['name'], 'customer':sales_order['customer']}
        data.append(output)

    return data


#Begin of Execution
data = get_columns(), get_data()