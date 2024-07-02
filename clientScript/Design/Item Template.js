// Define a variable to track if the setup function has already been executed
var setupExecuted = false;

frappe.ui.form.on('Design', {
    setup: function(frm) {
        if (!setupExecuted) {
            frm.set_query('item', function() {
                return {
                    filters: {
                        'has_variants': 1
                    }
                };
            });
            setupExecuted = true;
        }
    },

    item: function(frm) {
        var item_code = frm.doc.item;
        if (item_code) {
            frappe.call({
                method: "frappe.client.get",
                args: {
                    doctype: "Item",
                    name: item_code
                },
                callback: function(r) {
                    if (r.message && r.message.attributes && r.message.attributes.length > 0) {
                        let attributes = r.message.attributes;
                        attributes.sort((a, b) => a.attribute.localeCompare(b.attribute)); // Correct sorting function
                        
                        var attributeDetailsRequests = attributes.map(attr => {
                            return frappe.call({
                                method: "frappe.client.get",
                                args: {
                                    doctype: "Item Attribute",
                                    name: attr.attribute
                                },
                                callback: function(response) {
                                    return response;
                                }
                            });
                        });

                        $.when.apply($, attributeDetailsRequests).done(function(...responses) {
                            renderAttributes(frm, attributes, responses.map(response => response[0].message));
                        });
                    } else {
                        console.log("No attributes or values found for the item.");
                        document.getElementById('attribute').innerHTML = 'No attributes to display.';
                    }
                }
            });
        }
    },
    validate: function(frm) {
        var hasErrors = false;
        $('.attribute-value').each(function() {
            var $input = $(this);
            var value = $input.val();
            var attribute = $input.data('attribute');
            var numericValues = parseInt($input.data('numericValues'));

            if (numericValues === 1) {
                var fromRange = parseFloat($input.data('fromRange'));
                var toRange = parseFloat($input.data('toRange'));
                if (isNaN(value) || value < fromRange || value > toRange) {
                    frappe.msgprint('Value for ' + attribute + ' must be a number between ' + fromRange + ' and ' + toRange);
                    hasErrors = true;
                }
            }

            if ($input.prop('required') && !value) {
                frappe.msgprint('Please enter a value for ' + attribute);
                hasErrors = true;
            }
        });

        if (hasErrors) {
            frappe.validated = false;
        }
    }
});

 

function renderAttributes(frm, attributes, attributeDetails) {
    var container = document.getElementById('attribute');
    frm.clear_table("variant_attributes");
    container.innerHTML = '';

    attributes.forEach((attr, idx) => {
        const details = attributeDetails[idx];
        if (details) {
            var div = document.createElement('div');
            div.className = 'form-group';

            var label = document.createElement('label');
            label.className = 'control-label';
            label.textContent = attr.attribute;
            div.appendChild(label);

            if (details.numeric_values === 1) {
                var input = document.createElement('input');
                input.type = 'number'; // Ensure input type number for numeric values
                input.className = 'form-control attribute-value';
                input.dataset.attribute = attr.attribute;
                input.dataset.numericValues = details.numeric_values;
                input.dataset.fromRange = details.from_range;
                input.dataset.toRange = details.to_range;
                input.id = `attribute-${attr.attribute}`;
                div.appendChild(input);

                var small = document.createElement('small');
                small.className = 'form-text text-muted';
                small.textContent = `Min Value: ${details.from_range}, Max Value: ${details.to_range}, in Increments of: ${details.increment}`;
                div.appendChild(small);
            } else {
                var select = document.createElement('select');
                select.className = 'form-control attribute-value';
                select.dataset.attribute = attr.attribute;
                select.id = `attribute-${attr.attribute}`;

                var defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select';
                select.appendChild(defaultOption);

                details.item_attribute_values.forEach(val => {
                    var option = document.createElement('option');
                    option.value = val.abbr;
                    option.textContent = val.abbr;
                    select.appendChild(option);
                });
                div.appendChild(select);
            }

            container.appendChild(div);
            var child = frm.add_child("variant_attributes");
            child.attribute = attr.attribute;
            child.attribute_value = '';
        }
    });
    frm.refresh_field("variant_attributes");
}

//                     } else {
//                         console.log("No attributes or values found for the item.");
//                         container.innerHTML = 'No attributes to display.';
//                     }
//                 }
//             });
//         }
//     }
// });

$(document).off('change', '.attribute-value').on('change', '.attribute-value', function() {
    var attribute = $(this).data('attribute');
    var value = $(this).val();
    var numericValues = parseInt($(this).data('numericValues'));

    // Validate numeric value against range if numeric_values is 1
    if (numericValues === 1) {
        var fromRange = parseFloat($(this).data('fromRange'));
        var toRange = parseFloat($(this).data('toRange'));
        if (isNaN(value) || value < fromRange || value > toRange) {
            frappe.msgprint('Value must be a number between ' + fromRange + ' and ' + toRange + ' for attribute ' + attribute);
            // Reset value to empty
            // $(this).val('');
            return;
        }
        
        // Ensure at most two digits after the decimal point
        if (!/^(\-)?\d+(\.\d{0,2})?$/.test(value)) {
            frappe.msgprint('Value must have at most two digits after the decimal point for attribute ' + attribute);
            // Reset value to empty
            // $(this).val('');
            return;
        }
    }

    var children = cur_frm.doc.variant_attributes || [];
    var child = children.find(child => child.attribute === attribute);
    if (child) {
        child.attribute_value = value;
        cur_frm.refresh_field("variant_attributes");
    }
});
