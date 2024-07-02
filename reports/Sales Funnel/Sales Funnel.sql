select a.first_name, a.last_name, a.name as 'Lead:Link/Lead',
b.name, b.status
from `tabLead` a
join `tabOpportunity` b
on b.party_name = a.name