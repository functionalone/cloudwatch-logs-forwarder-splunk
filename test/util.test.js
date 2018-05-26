'use strict';

const { decodeCloudwatchPayload, getLogEventTime } = require('../src/util');
const {assert} = require('chai');

describe('util tests', function () {

  it('decodeCloudwatchPayload', function() {
    const event = {
      "awslogs": {
        "data": "H4sIACav41oAA+1U227bRhD9FYPoo5fc+y71RsuyfE8c0XLQyBCW5EpmQpEKl/QlRv69Q1EyGictEKAp+tAHQcTOnpmzZ2bOs7eyzpmljZ/W1ht4h1EczS9Gk0k0Hnn7XvVQ2hqOCWVcSKVDDIdFtRzXVbuG88A8uKAwqyQzQVk11iGzXsMvR+u6ytDSNv39SVNbswIAxUQHmAdUBR9+O4/i0SS+tVyYBQ2xzLDkiWLGhIpgIVQiiNFEQQrXJi6t83WTV+VRXjS2dt7gg5cWVZs9mCa9Q25dtOWnvuxRVT+YOrP1ebV0k++gww5106EgzhC5OT+5FHgcxdP3kXe74Tu6t2XTlXj28gxoM46xkBrTjpmUQiumQs2Y0FyFVFIa0lBQjCnRoZBYKYo7wQhQb3JQuDErkIsIyrVUnFNB1P5OeUgfDYcg+fz8zXiw9zzbQGbeYG+2kQthjqiKKRkINcDCZ0z9PvP2IQqPbaq0Kvq7x3H8NiA+6WO1deuqdHaeVtlLMvwqtijM0vVB1IeSJ2jivLapze9t1ocIV38OOpBmm1DKPpC1ten03dXpT9u127R9fle5LUJQn5DQp5T7hPMB52zH6PP8zhpo2YYOaLA2zV2PCforaVU2UBk1MKh9AEatyNNN4eARmdUX9NFVJSL+tn5/1pgaxrBHHD6VZlUdHsxBV4o1wf7YNieNXe0Ai+3kZN3XN8K0ztYIurV7Oww+ctknVIK8H11A4U2g/V6Rl+1jcC99yM327KNNkS3vg+gGurtZk3kP6C7sQf9WubN9gYFpm7uqzpunvkC24ZolfuuQNa6Bd5mV+VKVUNlPqxfKIF0LA4bybbcWKZMWNgktGLOIwzgirZRBPBUpWSRAM4MR+bqbg1ey/7zKO0Rhy+WuZS+DsQGUO447iuKYHURDGg8jfH12cMHfjeMLJY6ORmo65WdXl5M3IhpdTE+PpLwKo8l1FJ2OXyh/nidV9rSle2a7L/jozOck678n8DfzJDci0xYjLkKLCLEawW6mCPY4ldLA2ppFl7Rv7bfYF8kHQtAUU2qQxWGCuKQSGZVlSGWcKMzTBASFLF2a2CSFvTSb1e0JuS4yK6HIKxvhDBIxhqExUsMicKk15RxcgYeKMapCKcBbsAaPwRzLv7ARrcTP2wgdEDWg1Bea/VdshKgf2Qjjf2cjITiI/7+F/BILSRLNNZbgGVIzxLmxsDoLBkMfSmmZDBfY/HIL2Q3Fjy3kWA3p27MrcT6e4qsDdXA6jKdRKC+vL/9BC1EJNjalYCGwkL2FJJykKAlxmBmdMm7Mv2Uht1//AOmZv1GrCQAA"
      }
    }
    const parsed = decodeCloudwatchPayload(event);
    assert.isObject(parsed);
    assert.equal(parsed.logEvents.length, 2);
    const message = parsed.logEvents[0].message;
    assert.isObject(message);
    assert.equal(message.response_code, 200);
    assert.equal(parsed.logEvents[0].prefix, "ACCESS_LOG: ");
  });

  it('getLogEventTime', function() {
    const event = {
      message: {
        time: '2018-04-27T22:17:22.583Z'
      }
    }
    const time = getLogEventTime(event);
    assert.equal(time, 1524867442583);
  });

});
