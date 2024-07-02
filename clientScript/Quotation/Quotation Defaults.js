//Filter Search results
cur_frm.set_query("parent_item", "items", function(doc, cdt, cdn) {
    var parent_items = [];
    //Filter Items not belonging to Accessories
	parent_items = doc.items.filter(item=> item.item_group !== "Accessories").map((item) => { return item.item_name; });
	return{
		filters: [
			['Item', 'name', 'in', parent_items ]
		]
	};
}),

frappe.ui.form.on('Quotation', {
    transaction_date(frm) {
        frm.events.set_valid_till(frm);
    },
	refresh(frm) {
	   if(!frm.doc.shipping_address_name){ 
    	   frm.doc.shipping_address_name = frm.doc.customer_address;
    	   frm.refresh_fields();
    	}
        if(!frm.doc.company_contact){ 
            
            frm.doc.company_contact=frappe.session.user_fullname;
            frm.refresh_fields();
        }
	    if (frm.is_new()) {
    	    frm.events.set_valid_till(frm);
    	    frm.events.set_quotation_presets(frm);
    	    frm.events.set_terms_and_conditions(frm);
    
	    }
        // frm.fields_dict['items'].grid.get_field('item_code').get_query = function(doc, cdt, cdn) {
        //     var child = locals[cdt][cdn];
        //     //console.log(child);
        //     return {    
        //         filters:[
        //             ['Item', 'has_variants', '=', 0],
        //         ],
        //         options: 'order by is_catalog_item desc'
        //     };
        // };
	},
	set_quotation_presets(frm) {
	    var response = frappe.call({ method:"frappe.client.get_value",
		args:{
			doctype: "Quotation Presets",
			fieldname: ['delivery_time', 'delivery_text', 'packaging'],
		    async: false,
		},
		callback: function(res){ 
		    if(!frm.doc.delivery_time) { frm.doc.delivery_time = res.message.delivery_time;}
		    if(!frm.doc.delivery_text) { frm.doc.delivery_text = res.message.delivery_text;}
		    if(!frm.doc.ll_packaging) { frm.doc.ll_packaging = res.message.packaging;}
		    frm.refresh_fields();
		}
	      
	    });
	},
	set_valid_till(frm) {
	    frappe.call({ method:"frappe.client.get_value",
		args:{
			doctype: "Quotation Presets",
			fieldname: ["default_validity"],
		    async: false,
		},
    		callback: function(res){ 
    		    
    		    var default_validity = res.message.default_validity;
                frm.doc.valid_till = frappe.datetime.add_days(frm.doc.transaction_date, default_validity);
                frm.refresh_fields();
    	    }
        });
	},
	set_terms_and_conditions(frm){
	    frm.doc.tc_name = `Offer Condition_${frm.doc.language}`;
	    frappe.db.get_value("Terms and Conditions", {"name":frm.doc.tc_name}, "terms", function(tc){
	        if (tc){
	            frm.doc.terms = tc.terms;
	        }
	        
	    });
	    frm.refresh_fields();
	},
	// on change of customer change the terms and conditions too
    customer_name(frm){
        frm.events.set_terms_and_conditions(frm);
    },
	get_pos(frm,item){
	    var prev_item = frm.doc.items[item.idx-2];
  // If Previous Item is available(eg DTTZ2N-1600/10/6/75)
	    // Then find the item group
	    // If parent item group is Accessories or item group is Servies then add .1 to the pos(eg from 10 to 10.1 or 10.1 to 10.2)
	    // If DTTZ2N then round of previous pos to whole number of 10s(eg 10.4 to 10)
	    // and add 10 to it( eg 10.4 will become 20)
	    // Carry forward the Main item Quantity(Items with whole 10s ie item groups other than Accessories and Services)
	    // to sub items.
	    if(prev_item){
	        frappe.call({
	         	"method": "frappe.client.get",
        		"args": {"doctype": "Item", "name": item.item_code, async: false, fields:['item_group']},
        		"callback": function(response) { 
        		    frappe.db.get_value("Item Group", {"name":response.message.item_group}, "old_parent", function(itemgroup){

        		        if(itemgroup.old_parent=='Accessories' || response.message.item_group=='Services'){
            	            item.pos = prev_item.pos + 1/10;
            	            item.qty = prev_item.qty;
            	            frm.refresh_fields();
    	                }else {
        	                item.pos = Math.floor(prev_item.pos) + 10;
            	            frm.refresh_fields();
    	                }
        		    });
        		}});  
	        
	    } else{
	        return 10;
	    }
	},
	
});

frappe.ui.form.on('Quotation Item', {
    item_code(frm, cdt, cdn) {
        var item = locals[cdt][cdn];
        if (!item.pos) {
            frm.events.get_pos(frm, item);
            item.pos = frm.events.get_pos(frm, item);
            frm.refresh_fields();
        }
        frm.events.calculate_item_price(frm, item);
    },
    
    qty(frm, cdt, cdn) {
        var item = locals[cdt][cdn];
        frm.events.calculate_item_price(frm, item);
    },
    
    rate(frm, cdt, cdn) {
        var item = locals[cdt][cdn];
        frm.events.calculate_item_price(frm, item);
    }
});

// Add a new function to calculate the item's price based on quantity and rate
frappe.ui.form.on('Quotation', {
    calculate_item_price(frm, item) {
        item.amount = item.qty * item.rate;
        frm.refresh_fields();
    }
});
