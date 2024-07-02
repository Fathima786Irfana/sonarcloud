def get_columns(self):
    columns = [
        {
            "label": _(self.filters.get("tree_type")),
            "fieldname": "entity",
            "fieldtype": "Link" if self.filters.get("tree_type") != "Order Type" else "Data",
            "options": self.filters.get("tree_type") if self.filters.get("tree_type") != "Order Type" else "",
            "width": 140 if self.filters.get("tree_type") != "Order Type" else 200,
        }
    ]

    if self.filters.get("tree_type") in ["Customer", "Supplier"]:
        columns.append(
            {
                "label": _(self.filters.get("tree_type") + " Name"),
                "fieldname": "entity_name",
                "fieldtype": "Data",
                "width": 140,
            }
        )

    if self.filters.get("tree_type") == "Item":
        columns.append(
            {
                "label": _("UOM"),
                "fieldname": "stock_uom",
                "fieldtype": "Link",
                "options": "UOM",
                "width": 100,
            }
        )

    for end_date in self.periodic_daterange:
        period = self.get_period(end_date)
        columns.append(
            {"label": _(period), "fieldname": self.scrub(period), "fieldtype": "Float", "width": 120}
        )

    columns.append(
        {"label": _("Total"), "fieldname": "total", "fieldtype": "Float", "width": 120}
    )

    return columns
