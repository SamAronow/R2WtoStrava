from requests_oauthlib import OAuth2Session
client_id = 'enter your client id'
client_secret = 'enter your client secret'
redirect_url = 'http://localhost'

session = OAuth2Session(client_id=client_id,redirect_uri=redirect_url)

auth_base_url = "https://www.strava.com/oauth/authorize"
session.scope = ["activity:write,activity:read"]
auth_link = session.authorization_url(auth_base_url)

print(f"Click Here!!! {auth_link[0]}") 

