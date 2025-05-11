import logging
from app.models.alarm import Alarm

logging.basicConfig(filename='alarm_test.log', level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger()

def test_alarm_trigger():
    alarm = Alarm(id=1, name="Main Alarm", status="active", location="Entrance")

    try:
        alarm.trigger(user="Admin", door_id=1)
        logger.info("Alarm triggered successfully for user=Admin, door_id=1")
    except Exception as e:
        logger.error(f"Alarm trigger failed: {e}")
        raise

    assert alarm.status == "triggered"
