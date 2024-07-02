def get_columns(item):
    columns = [
        {
            "fieldname": "item_add",
            "fieldtype": "Button",
            "label": "Add",
            "options": "Add",
            "action": "add_item",
        },
        {"fieldname": "variant_name", "label": _("Variant"), "fieldtype": "Link", "options": "Item", "width": 200,}
        ]
    
    item_doc = frappe.get_doc("Item", item)
    for entry in item_doc.attributes:
        scrubbed_string = entry.attribute.lower()
        scrubbed_string = ''.join(c if c.isalnum() or c == '_' else '_' for c in scrubbed_string)
        column = {"fieldname": scrubbed_string, "label": entry.attribute, "fieldtype": "Data", "width": 100,}
        columns.append(column)
    return columns
	

	
def get_data(item):
    def get_attribute_values_map(variant_list):
        attribute_list = frappe.db.get_all(
            "Item Variant Attribute",
            fields=["attribute", "attribute_value", "parent"],
            filters={"parent": ["in", variant_list]},
        )
        
        attr_val_map = {}
        for row in attribute_list:
            name = row.get("parent")
            if not attr_val_map.get(name):
                attr_val_map[name] = {}
            attr_val_map[name][row.get("attribute")] = row.get("attribute_value")
            
        return attr_val_map
    def scrub_string(input_string):
        # Convert the string to lowercase
        scrubbed_string = input_string.lower()
        
        # Replace spaces and special characters with underscores
        scrubbed_string = ''.join(c if c.isalnum() or c == '_' else '_' for c in scrubbed_string)
        
        return scrubbed_string
    if not item:
        return []
    item_dicts = []
    variant_results = frappe.db.get_all(
        "Item", fields=["name"], filters={"variant_of": ["=", item], "disabled": 0}
    )
    if not variant_results:
        frappe.msgprint(_("There aren't any item variants for the selected item"))
        return []
    else:
        variant_list = [variant["name"] for variant in variant_results]

    attr_val_map = get_attribute_values_map(variant_list)
    
    attributes = frappe.db.get_all(
        "Item Variant Attribute",
        fields=["attribute"],
        filters={"parent": ["in", variant_list]},
        group_by="attribute",
    )
    
    attribute_list = [row.get("attribute") for row in attributes]
    
    # Prepare dicts
    variant_dicts = [{"variant_name": d["name"]} for d in variant_results]
    for item_dict in variant_dicts:
        name = item_dict.get("variant_name")
        
        
        for attribute in attribute_list:
            attr_dict = attr_val_map.get(name)
            if attr_dict and attr_dict.get(attribute):
                item_dict[scrub_string(attribute)] = attr_val_map.get(name).get(attribute)
        
        item_dicts.append(item_dict)
    return item_dicts

    #return data

# Begin of execute    
data = []
columns = get_columns(filters.item)
output_data = get_data(filters.item)
data = columns, output_data