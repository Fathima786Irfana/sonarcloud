frappe.ui.form.on('Lead', {
	refresh(frm) {
	    const attr_map = [{'attribute_name':'HV', 'docfield': 'hv_rated_voltage'},]
	    
        frappe.call(
            {
                'method': 'frappe.client.get',
                'args': { 'doctype': 'Item', 'name':'Toiletries'},
                'callback': function(response){
                    console.log(response.message.attributes)
                    const attributes = response.message.attributes
                    if (attributes) { 
                        
                        let template = `
                            {% for field in attributes %}
                                <div class="frappe-control input-max-width" data-fieldtype="Data" data-fieldname="{{field.attribute}}">
                    				<div class="form-group">
                    					<div class="clearfix">
                    						<label class="control-label reqd" style="padding-right: 0px;">{{ field.attribute }}</label>
                    						<span class="help"></span>
                    					</div>
                    					<div class="control-input-wrapper">
                    						<div class="control-input"><input value="{{frm.doc[frm.events.fn_get_field_mapping(field.attribute)] }}" type="text" autocomplete="off" class="input-with-feedback form-control bold" maxlength="140" data-fieldtype="Data" data-fieldname="{{field.attribute }}" placeholder="" data-doctype="Lead"></div>
                    						<div class="control-value like-disabled-input bold" >{{frm.doc[frm.events.fn_get_field_mapping(field.attribute)]}}</div>
                    						<p class="help-box small text-muted"></p>
                    					</div>
                    				</div>
                    			</div>
                            {% endfor %}
                    `;

            // Data to be injected into the template
            let data = {
                attributes: attributes,
                frm: frm
            };
		    frm.set_df_property('custom_custom_html', 'options', frappe.render(template, data));
		// your code here
	
                    }
                
                } 
                
            } )
        
	    
	    
// // Define the template
// let template = `
//         {% for field in fields %}
//             <div class="frappe-control input-max-width" data-fieldtype="Data" data-fieldname="{{field}}">
// 				<div class="form-group">
// 					<div class="clearfix">
// 						<label class="control-label reqd" style="padding-right: 0px;">{{ field.replace('_', ' ').toUpperCase() }}</label>
// 						<span class="help"></span>
// 					</div>
// 					<div class="control-input-wrapper">
// 						<div class="control-input"><input type="text" autocomplete="off" class="input-with-feedback form-control bold" maxlength="140" data-fieldtype="Data" data-fieldname="{{field}}" placeholder="" data-doctype="Lead"></div>
// 						<div class="control-value like-disabled-input bold" >{{frm.doc[field]}}</div>
// 						<p class="help-box small text-muted"></p>
// 					</div>
// 				</div>
// 			</div>
//         {% endfor %}
// `;

// // Data to be injected into the template
// let data = {
//     fields: field_names,
//     frm: frm
// };
// 		frm.set_df_property('custom_custom_html', 'options', frappe.render(template, {fields: field_names, frm: frm}));
// 		// your code here
	},
	fn_get_field_mapping(iAttributeName){
	    console.log(iAttributeName)
	    const attr_map = [{'attribute_name':'Lpa (d8)', 'docfield': 'first_name'},] 
	    let lAttributeRow =  attr_map.find(x => x.attribute_name === iAttributeName)
	   // console.log(lAttributeRow['docfield'])
	    if(lAttributeRow){
	       return lAttributeRow.docfield 
	    }
	   // 
	}
})