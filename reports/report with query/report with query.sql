SELECT 
  item_name,
  creation,
  modified,
  CURRENT_DATE,
  end_of_life,
  DATEDIFF(CURRENT_DATE, creation) AS age
FROM 
  tabItem;
