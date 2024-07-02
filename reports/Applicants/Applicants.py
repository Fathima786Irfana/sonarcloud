#this is an devops test
#Testing
def get_column():
   #define a column list which has no. of dict elements
     columns = [
     {"fieldname":"applicant_name","label":"Name","width":140},
     {"fieldname":"email_id","label":"Email","width":140}
     ]
     
     return columns
 
def get_data():
    data=[]
    output={
    "applicant_name":"raja",
    "email_id":"raja.123@gmail.com"}
    
    data.append(output)
    return data
    
data = get_column(),get_data()     