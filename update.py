import requests

access_token = 'YOUR TOKEN'
url = 'https://www.strava.com/api/v3/athlete/activities?per_page=30'
headers = {'Authorization': f'Bearer {access_token}'}
response = requests.get(url, headers=headers)
file_path = 'log.txt'
file = open(file_path, "r")
description=file.read()
index = (int)(description[0])
description = description[1:]


if response.status_code == 200:
    activities_data = response.json()
    if activities_data:
        activity_list= activities_data
        id= activity_list[index]['id']
        update_url = f'https://www.strava.com/api/v3/activities/{id}?description={description}'
        response = requests.put(update_url, headers=headers)
        if response.status_code == 200:
            print("Activity description updated successfully!")
        else:
            print(f"Failed to update activity description: {response.status_code}")
        
else:
    print('Failed to fetch activities data')
    print(response.text)  # Print error details if available


