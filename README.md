##Deployment

Download gcloud sdk from:
```
https://cloud.google.com/sdk/docs/quickstart-linux
```
Install gcloud sdk
```
tar zxvf [ARCHIVE_FILE] google-cloud-sdk

./google-cloud-sdk/install.sh
```
Initialize gcloud sdk configuration
```
gcloud init

*select 'lp-tool' project*

*select 'us-east1' region host*
```
Deploy
```$xslt
cd lp-express

gcloud app deploy
```

Environment Variable
```$xslt
SQL_USER=admin
SQL_PASSWORD=tgyhUJ22
SQL_DATABASE=lp_database
INSTANCE_CONNECTION_NAME=lp-tool:us-east1:lp-admin-database
```

Local Proxy SQL Connection
```$xslt
Refer to: https://cloud.google.com/appengine/docs/flexible/nodejs/using-cloud-sql
```