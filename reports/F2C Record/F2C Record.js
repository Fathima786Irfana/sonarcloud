frappe.query_reports["F2C Record"] = {
    "formatter": function (value, row, column, data, default_formatter) {
        value = default_formatter(value, row, column, data);

        if (column.fieldname == "delay" && data && data[column.fieldname] > 60 && data["status"] == "To Deliver and Bill") {
            value = "<span style='color:red;'>" + value + "</span>";
        }
        return value;
    }
};
