'use strict';

const zlib = require('zlib');

/**
 * Expected event is in format:
 * {
    "awslogs": {
        "data": "<base64>"
    }
  } 
 * The decoded data is expected to be in the following format:
 * 
 * {
    "messageType": "DATA_MESSAGE",
    "owner": "1234567890",
    "logGroup": "/aws/lambda/notes-app-api-prod-update",
    "logStream": "2018/04/27/[$LATEST]c30ebb39a0d149f399dbea7e7e4b4130",
    "subscriptionFilters": [
        "cloudwatch-splunk-prod-ForwarderLogsSubscriptionFilterCloudWatchLog5-JG7U7YRKICGR"
    ],
    "logEvents": [
        {
            "id": "34005680495516388769310312574423232114162102229804384260",
            "timestamp": 1524867451414,
            "message": "<data>"
        }
    ]
}
 * 
 * Will analyze message and if contains '{' (with possible prefix) and ends with '}' (with possible whitespace after) will parse the message as a json object. 
 * Will set prefix if the message contained a json object with a prefix.
 * @param {object} cloudwatch_event: event passed into a lambda function from cloudwatch for processing.
 * @throws exception if event is not in expected format
 */
exports.decodeCloudwatchPayload = (cloudwatch_event) => {
  if (!cloudwatch_event.awslogs || !cloudwatch_event.awslogs.data) {
    throw new Error('Cloudwatch event not in expected format. Got event: ' + JSON.stringify(cloudwatch_event, null, 2));
  }
  // CloudWatch Logs data is base64 encoded so decode here
  const payload = Buffer.from(cloudwatch_event.awslogs.data, 'base64');
  const data = zlib.gunzipSync(payload);
  const parsed = JSON.parse(data.toString('utf-8'));
  // console.log('Decoded payload:', JSON.stringify(parsed, null, 2));
  if (parsed.logEvents) {
    parsed.logEvents.forEach((item) => {
      if (item.message && typeof item.message === 'string') {
        const first_brace = item.message.indexOf('{');
        if (first_brace >= 0) {
          const json_message = item.message.substr(first_brace).trimRight();
          if (json_message.endsWith('}')) {
            try {
              if (first_brace > 0) {
                item.prefix = item.message.substr(0, first_brace);
              }
              const parsed_message = JSON.parse(json_message);
              item.message = parsed_message;
            } catch (error) {
              console.log("Failed parsing message although it has a json pattern: " + item.message, error);
            }
          }
        }
      }
    });
  }
  return parsed;
}

/**
 * @param {object} log_event 
 * @returns the log event time stamp. Will try to extract from message if it is an object. Will use env SPLUNK_TIME_FIELD for 
 * the extraction field defaulting to "time"
 */
exports.getLogEventTime = (log_event) => {
  const time_field = process.env.SPLUNK_TIME_FIELD || "time";
  if (typeof log_event.message === 'object') {
    const unparsed = log_event.message[time_field];
    if (unparsed) {
      const res = Date.parse(unparsed);
      if (!Number.isNaN(res)) {
        return res;
      }
    }
  }
  return log_event.timestamp ? new Date(log_event.timestamp).getTime() : Date.now();
}
