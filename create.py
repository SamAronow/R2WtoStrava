import requests

access_token = 'fb6390850ad9daac481c9898ffbd1ef1fd6494db'

# Endpoint for creating an activity
url = 'https://www.strava.com/api/v3/activities'

# Set the authorization header with the access token
headers = {'Authorization': f'Bearer {access_token}'}

file_path = '/Users/samaronow/strava/log.txt'
file = open(file_path, "r")
txt=file.read()

time = txt[txt.index(", TIME: ")+8:txt.index(", DATE: ")]
date = txt[txt.index(", DATE: ")+8:txt.index(", DIST: ")]
description=txt[0:txt.index(", TIME")]
dist=txt[txt.index(", DIST: ")+8:]
if dist==0.01:
    activity_data = {
        "name": "Activity",
        "type": "ride",  # Change to the type of your activity (e.g., ride, swim, etc.)
        "start_date_local": date,  # UTC timestamp of activity start
        "elapsed_time": time,  # Duration of activity in seconds
        "description": description,
    }
else: 
    activity_data = {
        "name": "Activity",
        "type": "run",  # Change to the type of your activity (e.g., ride, swim, etc.)
        "start_date_local": date,  # UTC timestamp of activity start
        "elapsed_time": time,  # Duration of activity in seconds
        "description": description,
        "distance": float(dist)*1609.34
    }


# Make a POST request to create the activity
response = requests.post(url, headers=headers, json=activity_data)

if response.status_code == 201:
    print("Activity created successfully.")
else:
    print(f"Failed to create activity. Status code: {response.status_code}")
    print(response.reason)  # Print error details if available
