SELECT
    lead.creation AS lead_creation,lead.title,
    opportunity.creation AS opportunity_creation,
    TIMESTAMPDIFF(DAY, lead.creation, opportunity.creation) AS conversion_time_seconds
FROM
    `tabLead` AS lead
JOIN
    `tabOpportunity` AS opportunity ON lead.title = opportunity.title
WHERE
    opportunity.status = 'Converted';
    