// frappe.ui.form.on('Show Details', {
//     refresh: function(frm) {
//         // Add your custom logic here

//         // Add a trigger on change of the 'Show' field
//         frm.fields_dict['show_name'].get_query = function(doc, cdt, cdn) {
//             return {
//                 filters: {
//                     // Specify filters if needed
//                 }
//             };
//         };

//         frm.fields_dict['show'].on('change', function() {
//             // Fetch description based on the selected show
//             var selectedShow = frm.doc.show;

//             frappe.call({
//                 method: 'frappe.client.get_value',
//                 args: {
//                     doctype: 'Show',
//                     fieldname: 'description',
//                     filters: { 'name': selectedShow }
//                 },
//                 callback: function(response) {
//                     // Set the description field value
//                     frm.set_value('description', response.message.description);
//                 }
//             });
//         });
//     }
// });


