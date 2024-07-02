def run(globals):
    def get_period_date_ranges(globals):
        #from dateutil.relativedelta import MO, relativedelta
        #globals.date_field = 'transaction_date' if globals.filters.doc_type in ['Sales Order', 'Purchase Order'] else 'posting_date'
        dates = frappe.utils.getdate(globals.filters.from_date), frappe.utils.getdate(globals.filters.to_date)
        from_date= dates[0]
        to_date = dates[1]
        
        increment = {
			"Monthly": 1,
			"Quarterly": 3,
			"Half-Yearly": 6,
			"Yearly": 12
		}.get(globals.filters.range, 1)
		
        if globals.filters.range in ['Monthly', 'Quarterly']:
            from_date = from_date.replace(day=1)
        elif globals.filters.range == "Yearly":
	        from_date = get_fiscal_year(from_date)[1]
        else:
            from_date = from_date #+ relativedelta(from_date, weekday=MO(-1))
            
        globals['periodic_daterange'] = []
        for dummy in range(1, 53):
            if globals.filters.range == "Weekly":
                period_end_date = frappe.utils.add_days(from_date, 6)  
            else:
                period_end_date = frappe.utils.add_to_date(from_date, months=increment, days=-1)
        
            if period_end_date is not None and to_date is not None:
                if period_end_date > to_date:
                    period_end_date = to_date
            
            def periodic_daterange(globals):
                globals.periodic_daterange = []
                globals.periodic_daterange.append(period_end_date) 
                from_date = frappe.utils.add_days(period_end_date, 1)
                if period_end_date == to_date:
                    pass
    
    # def getdate(date_string):
    #     pass
    
    # def add_to_date(from_date, months=0, days=0):
    #     pass

    def get_period(globals, posting_date):
        if globals.filters.range == 'Weekly':
            period = "Week " + str(posting_date.isocalendar()[1]) + " " + str(posting_date.year)
        elif globals.filters.range == 'Monthly':
            period = str(globals.months[posting_date.month - 1]) + " " + str(posting_date.year)
        elif globals.filters.range == 'Quarterly':
            period = "Quarter " + str(((posting_date.month - 1) // 3) + 1) + " " + str(posting_date.year)
        else:
            year = get_fiscal_year(posting_date, company=globals.filters.company)
            period = str(year[0])
        return period
        
    def get_periodic_data(globals):
       
        globals['entity_periodic_data'] = dict({})
       
        for d in ['globals.entries']:
            if globals.filters.tree_type == "Supplier Group":
                d.entity = globals.parent_child_map.get(d.entity)
            period = globals.get_period(d.get(globals.date_field))
            globals.entity_periodic_data.setdefault(d.entity, dict({})).setdefault(period, 0.0)
            globals.entity_periodic_data[d.entity][period] = globals.entity_periodic_data[d.entity][period] + frappe.utils.flt(d.value_field)
            
            if globals.filters.tree_type == "Item":
                globals.entity_periodic_data[d.entity]['stock_uom'] = d.stock_uom 

    def get_columns(globals):
        get_period_date_ranges(globals)  
        globals['columns'] = [{
            "label": _(globals.filters.tree_type),
            "options": globals.filters.tree_type if globals.filters.tree_type != "Order Type" else "",
            "fieldname": "entity",
            "fieldtype": "Link" if globals.filters.tree_type != "Order Type" else "Data",
            "width": 140 if globals.filters.tree_type != "Order Type" else 200
        }]
    
        if globals.filters.tree_type in ["Customer", "Supplier", "Item"]:
            globals.columns.append({
                "label": _(globals.filters.tree_type + " Name"),
                "fieldname": "entity_name",
                "fieldtype": "Data",
                "width": 140
            })
        if globals.filters.tree_type == "Item":
            globals.columns.append({
                "label": _("UOM"),
                "fieldname": 'stock_uom',
                "fieldtype": "Link",
                "options": "UOM",
                "width": 100
            })
    
        for end_date in globals['periodic_daterange']:
            period = globals.get_period(end_date)
            globals.columns.append({
                "label": _(period),
                "fieldname": scrub(period),
                "fieldtype": "Float",
                "width": 120
            })
        
        globals['columns'].append({
            "label": _("Total"),
            "fieldname": "total",
            "fieldtype": "Float",
            "width": 120
        })
        return globals.columns  

    get_columns(globals)
    get_periodic_data(globals)
    

    skip_total_row = 0
    if globals['filters'].tree_type in ["Supplier Group", "Item Group", "Customer Group", "Territory"]:
        skip_total_row = 1
    return globals.columns  
    
globals = {
    "filters": filters,
    "columns": [],
    
}
result1 = run(globals)  
