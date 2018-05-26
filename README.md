# Cloudwatch Logs Forwarder to Splunk

This project provides a Lambda function to forwrd logs from Cloudwatch to Splunk via HEC interface. It is based upon the refernce blueprint from Splunk: https://github.com/splunk/splunk-aws-serverless-apps/blob/master/splunk-cloudwatch-logs-processor/ . 

The Lambda function has been modified to deal with log payload of the format: 

```
<prefix> <json_data>
```

The function will only forward the json_data (without the prefix) parsed and will set the sourcetype field to `_json`. Addtionally, the function supports extracting the timestamp from a specfied field in the json_data.

If the Cloudwatch log group being monitored is from a Lambda function (log group name starts with `/aws/lambda`) the host field will be set to: `lambda:<function_name>` and source field will be set to `aws_region:<function_version>`.

The project supports the serverless framework and contains a sample serverless.yml file to configure the function and deploy.

## Configuration

Define the following Environment Variables for the Lambda function. If using serverless framework see serverless.yml file to define environment variables.

* SPLUNK_HEC_URL: URL address for your Splunk HTTP event collector endpoint. Default port for event collector is 8088. Example: https://host.com:8088/services/collector

* SPLUNK_HEC_TOKEN: Token for your Splunk HTTP event collector. To create a new token for this Lambda function, refer to Splunk Docs: http://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector#Create_an_Event_Collector_token

* SPLUNK_TIME_FIELD (optional): Defaults to `time`. Will try to parse date from the json field with this name.

It is possible to define the AWS Cloudwatch log groups to trigger this Lambda function in the serverless.yml. In large environments, it may be desired to use a system where each log group is subscribed automatically. See following example how this can be achieved: https://www.sumologic.com/blog/amazon-web-services/auto-subscribing-log-groups-lambda/ .
