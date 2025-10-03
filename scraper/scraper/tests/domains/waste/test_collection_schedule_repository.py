from unittest.mock import MagicMock, create_autospec
import pytest

from scraper.adapters.db import Db
from scraper.domains.waste.collection_schedule import CollectionSchedule
from scraper.domains.waste.collection_schedule_repository import (
	CollectionScheduleRepository,
)
from sqlmodel import Session


@pytest.fixture
def db_mock():
	db = create_autospec(spec=Db)
	db.session.return_value.__enter__.return_value = create_autospec(Session)
	db.session.return_value.__exit__.return_value = False
	return db


@pytest.fixture
def repository(db_mock):
	return CollectionScheduleRepository(db=db_mock)


def test_insert_many(
	repository,
):
	schedules = [
		CollectionSchedule.model_construct(
			date='2023-10-01',
			wastes=['VPL'],
		),
	]
	result = repository.insert_many(schedules)

	assert len(result) == len(schedules)
	repository.db.session.assert_called_once()
