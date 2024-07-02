SELECT*from tabQuotation where name not in (select attached_to_name from tabFile Manager where attached_to_doctype in ('Quotation') 
)

                
            
                
                