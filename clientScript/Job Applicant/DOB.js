frappe.ui.form.on('Job Applicant', {
    date_of_birth: function(frm) {
        calculateAge(frm);
    }
});

function calculateAge(frm) {
    var dateOfBirthField = frm.doc.date_of_birth;
    if (!dateOfBirthField) return;

    var today = frappe.datetime.now_date();
    var birthDate = new Date(dateOfBirthField);
    var age = today.getFullYear() - birthDate.getFullYear();
    var birthMonth = birthDate.getMonth();
    var todayMonth = today.getMonth();

    if (todayMonth < birthMonth || (todayMonth === birthMonth && today.getDate() < birthDate.getDate())) {
        age--;
    }

    frm.set_value('age', age);
}
