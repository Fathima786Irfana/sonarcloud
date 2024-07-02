frappe.query_reports['check']
     onload:function('report'){
         const style = document.CreateElement("style");
         style.innerHtml='
         .dt-cell__content--header-1{
             background-color:white;
            }
   ';
   document.head.appendChild(style);
   }
};   
   