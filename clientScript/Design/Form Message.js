frappe.ui.form.on('Design', {
    onload(frm) {
        const transformerType = frm.doc.transformer_type
        if (transformerType) {
          frm.set_intro('Please set the value of description ' + transformerType, 'blue');
}

    }
});
