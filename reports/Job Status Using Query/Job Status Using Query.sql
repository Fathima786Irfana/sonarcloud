SELECT
    ja.name ,
    ja.applicant_name,
    ja.status ,
    i1.name ,
    i1.status ,
    i1.interview_summary ,
    i2.name ,
    i2.status ,
    i2.interview_summary ,
    jo.status,
    jo.offer_date
FROM
    `tabJob Applicant` ja
LEFT JOIN
    (
        SELECT name, status, interview_summary, job_applicant
        FROM `tabInterview`
        WHERE interview_round = 'technical'
    ) i1 ON ja.name = i1.job_applicant
LEFT JOIN
    (
        SELECT name, status, interview_summary, job_applicant
        FROM `tabInterview`
        WHERE interview_round = 'Fitment'
    ) i2 ON ja.name = i2.job_applicant
LEFT JOIN
    `tabJob Offer` jo ON ja.name = jo.job_applicant
WHERE
   ja.status IN ('Replied', 'Rejected', 'Hold', 'Accepted');
   
   
   
   
   
   
   
  