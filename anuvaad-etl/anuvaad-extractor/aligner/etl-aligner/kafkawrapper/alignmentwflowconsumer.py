import json
import logging
import traceback

from kafka import KafkaConsumer
import os
from service.alignwflowservice import AlignWflowService
from logging.config import dictConfig

log = logging.getLogger('file')
cluster_details = os.environ.get('KAFKA_CLUSTER_DETAILS', 'localhost:9092')
anu_dp_wf_aligner_in_topic = "anuvaad-dp-tools-aligner-input-v2"
align_job_consumer_grp = "anuvaad-etl-consumer-group"


class WflowConsumer:

    def __init__(self):
        pass

    # Method to instantiate the kafka consumer
    def instantiate(self):
        topics = [anu_dp_wf_aligner_in_topic]
        consumer = KafkaConsumer(*topics,
                                 bootstrap_servers=[cluster_details],
                                 api_version=(1, 0, 0),
                                 group_id=align_job_consumer_grp,
                                 auto_offset_reset='latest',
                                 enable_auto_commit=True,
                                 max_poll_records=1,
                                 value_deserializer=lambda x: self.handle_json(x))
        return consumer

    # Method to read and process the requests from the kafka queue
    def consume(self):
        consumer = self.instantiate()
        wflowservice = AlignWflowService
        log.info("Align WFM Consumer running.......")
        while True:
            try:
                data = {}
                for msg in consumer:
                    data = msg.value
                    topic = msg.topic
                    log.info("Received on Topic: " + topic)
                    break
                wflowservice.wf_process(data)
            except Exception as e:
                log.exception("Exception while consuming: " + str(e))
            finally:
                consumer.close()

    # Method that provides a deserialiser for the kafka record.
    def handle_json(self, x):
        try:
            return json.loads(x.decode('utf-8'))
        except Exception as e:
            log.exception("Exception while deserialising: " + str(e))
            return {}

    # Log config
    dictConfig({
        'version': 1,
        'formatters': {'default': {
            'format': '[%(asctime)s] {%(filename)s:%(lineno)d} %(threadName)s %(levelname)s in %(module)s: %(message)s',
        }},
        'handlers': {
            'info': {
                'class': 'logging.FileHandler',
                'level': 'DEBUG',
                'formatter': 'default',
                'filename': 'info.log'
            },
            'console': {
                'class': 'logging.StreamHandler',
                'level': 'DEBUG',
                'formatter': 'default',
                'stream': 'ext://sys.stdout',
            }
        },
        'loggers': {
            'file': {
                'level': 'DEBUG',
                'handlers': ['info', 'console'],
                'propagate': ''
            }
        },
        'root': {
            'level': 'DEBUG',
            'handlers': ['info', 'console']
        }
    })
