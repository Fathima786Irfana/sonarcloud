import frappe
def create_seats():
    for i in range(1, 51):
        seat_code = f"SEAT{i:03d}"  # This formats the seat code as SEAT001, SEAT002, ..., SEAT050
        item = frappe.new_doc("Item")
        item.item_code = seat_code
        item.item_name = f"Seat {i}"
        item.item_group = "Furniture"  # Adjust the item group as needed
        item.maintain_stock = 1
        item.valuation_rate = 10.00  # Set the cost as needed
        item.insert()

# Uncomment the line below to execute the script
create_seats()
