// Testing
// frappe.ui.form.on("Hospital System", {
//     disease: function(frm) {
//         var selectedDisease = frm.doc.disease;

//         // Clear the doctor_name field
//         frm.set_value("doctor_name", "");

//         // Set the filter query for doctor_name field in the Hospital Specialist child table
//         frm.fields_dict.hospital_specialist.grid.get_field("doctor_name").get_query = function() {
//             return {
//                 filters: {
//                     disease: selectedDisease
//                 }
//             };
//         };
//     }
// });

// frappe.ui.form.on("Hospital System", {
//      onload: function(frm) {
//         frappe.call({
// 			"method": "frappe.client.get",
// 			args: {
// 				doctype: "Doctor",
// 				name: frm.doc.disease
// 			},
// 			callback: function(data){
// 				frm.clear_table('hospital_specialist');
// 				let disease = data.message.hospital_specialist;
// 				for (var dis in disease) {
// 					var row = frm.add_child("");
// 					row.skill = design[des].skill;
// 				}
// 				frm.refresh_field("skills");
// 			}
// 		});
		
//     },
// });



frappe.ui.form.on("Hospital System", {
    before_submit: function (frm) {
        // console.log("Before Submit is called"); 
        frappe.throw("Hello Welcome");
    }
});

