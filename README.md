## What is this repository for? ##

This is the pipeline for uploading Facebook and Linkedin marketing metrics to Google Big Query, using Firebase Cloud Funtions

## How do I get set up? ##

### Summary of set up ###
First of all, you need to have token for calling APIs from Facebook and Linkedin. The existed tokens are located in .env.
When you have tokens, you can call these APIs to get metrics that you need for analytics.
Facebook Graph APIs: https://developers.facebook.com/docs/graph-api/get-started
Linkedin Marketing APIs: https://learn.microsoft.com/en-us/linkedin/marketing/getting-started?view=li-lms-2022-10

### Dependencies ###
Start on /functions to install dependencies.
### How to run tests ###
These are pubsub functions so we cannot run these on local. Instead, change to 
functions.https.onRequest(async (req, res) => {}) so we can run them. 
Then, use `npm run serve `. Then the command line will show us a list of endpoints. Access an endpoint to run.
`ALERT` --> when making a test, the "uploadFile" function `MUST` be comment out, otherwise it will upload data to our Big Query database, which is not recommended.
Instead, make a res.send(data) to view the data we get via each endpoint.

### Deployment instructions ###
`npm run deploy`

### About the token ###

Facebook: If you have access to our app on Facebook Developer, simply go to https://developers.facebook.com/tools/accesstoken and copy the User Token section. 
The token will not expired, unless your Facebook's account been locked. As long as your Facebook's account is usable, you can use the User Token. 

Linkedin: The token for Linkedin will be expired every 2 months, so you need to setup reminder to get a new token every 2 months. 
This token will be expired for 2 months start from the day you get the new token. 
After 365 days from the first token was created, you need to reauthorized your app.
For more details, see: https://learn.microsoft.com/en-us/linkedin/shared/authentication/programmatic-refresh-tokens/
