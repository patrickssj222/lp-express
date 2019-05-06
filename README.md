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