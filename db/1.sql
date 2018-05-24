Select main_schedule.id, group_id, studyGroups.name as group_name,weekday_id,time_id, time.time as time_name 
from main_schedule
INNER JOIN studyGroups ON studyGroups.id = main_schedule.group_id
INNER JOIN time ON time.id = main_schedule.time_id
