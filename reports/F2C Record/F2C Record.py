def get_columns():
    columns = [
        {"fieldname": "name", "label": _("Sales Order"), "fieldtype": "Link", "options": "Sales Order", "width": 140},
        {"fieldname": "customer", "label": _("Customer"), "fieldtype": "Link", "options": "Customer", "width": 180},
        {"fieldname": "delivery_note", "label": _("Delivery Note"), "fieldtype": "Link", "options": "Delivery Note", "width": 180},
        {"fieldname": "po_no", "label": _("PO"), "fieldtype": "Data", "width": 100},
        {"fieldname": "transaction_date", "label": _("Date"), "fieldtype": "Date", "width": 100},
        {"fieldname": "delivery_date", "label": _("Delivery Date"), "fieldtype": "Date", "width": 100},
        {"fieldname": "status", "label": _("SO Status"), "fieldtype": "Select", "width": 100},
        {"fieldname": "delay", "label": _("Delay (in Days)"), "fieldtype": "Int", "width": 100},
    ]
    return columns

def combined_data():
    combined_data = []

    def calculate_delay(order_date):
        return frappe.utils.date_diff(frappe.utils.now(), order_date)

    def get_pending():
        data = []
        sales_orders = frappe.get_all("Sales Order", fields=["name", "customer", "po_no", "transaction_date", "delivery_date", "status"])
        for sales_order in sales_orders:
            order_date = sales_order.transaction_date
            days_difference = calculate_delay(order_date)
            if sales_order.status == "To Deliver and Bill":
                output_row = {
                    "name": sales_order.name,
                    "customer": sales_order.customer,
                    "delivery_note": '',
                    "po_no": sales_order.po_no,
                    "transaction_date": sales_order.transaction_date,
                    "delivery_date": sales_order.delivery_date,
                    "status": sales_order.status,
                    "delay": days_difference
                }
                delivery_details = frappe.get_all("Delivery Note", filters={"against_sales_order": sales_order.name}, fields=["name"])
                for delivery_detail in delivery_details:
                    output_row["delivery_note"] = delivery_detail.name
                data.append(output_row)
        return data

    def get_not_invoiced():
        filtered_data = []
        sales_orders = frappe.get_all("Sales Order", fields=["name", "customer", "po_no", "transaction_date", "delivery_date", "status"])
        for sales_order in sales_orders:
            sales_invoice_status = frappe.get_all("Sales Invoice", filters={"sales_order": sales_order.name}, fields=["status"])
            if sales_order.status == "To Bill" and not sales_invoice_status:
                order_date = sales_order.transaction_date
                days_difference = calculate_delay(order_date)
                table_row = {
                    "name": sales_order.name,
                    "customer": sales_order.customer,
                    "delivery_note": '',
                    "po_no": sales_order.po_no,
                    "transaction_date": sales_order.transaction_date,
                    "delivery_date": sales_order.delivery_date,
                    "status": sales_order.status,
                    "delay": days_difference,
                }
                delivery_details = frappe.get_all("Delivery Note", filters={"against_sales_order": sales_order.name}, fields=["name"])
                for delivery_detail in delivery_details:
                    table_row["delivery_note"] = delivery_detail.name
                filtered_data.append(table_row)
        return filtered_data

    combined_data.extend(get_pending())
    combined_data.extend(get_not_invoiced())
    return combined_data

data = get_columns(), combined_data()
