import boto3
import json
import datetime
import time
import random

kinesis = boto3.client('kinesis', region_name='your-region')
cw = boto3.client('cloudwatch', region_name='your-region')

stream_name = 'your-kinesis-stream'
metric_name = 'your-metric-name'
namespace = 'your-metric-namespace'

while True:
    # Get metric data from CloudWatch
    response = cw.get_metric_data(
        MetricDataQueries=[
            {
                'Id': 'm1',
                'MetricStat': {
                    'Metric': {
                        'Namespace': namespace,
                        'MetricName': metric_name,
                    },
                    'Period': 60,
                    'Stat': 'Sum',
                },
                'ReturnData': True,
            },
        ],
        StartTime=datetime.datetime.utcnow() - datetime.timedelta(minutes=5),
        EndTime=datetime.datetime.utcnow(),
    )
