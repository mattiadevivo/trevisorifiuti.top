from typing import Sequence
from unittest.mock import create_autospec

from injector import Injector
import pytest

from scraper.domains.waste.collection_schedule import CollectionSchedule
from scraper.services.collection_schedules import (
	CollectionScheduleService,
	CollectionScheduleServiceModule,
)
from scraper.domains.waste.collection_schedule_repository import (
	CollectionScheduleRepository,
)


@pytest.fixture
def repository_mock() -> CollectionScheduleRepository:
	return create_autospec(CollectionScheduleRepository)


@pytest.fixture
def service(repository_mock) -> CollectionScheduleService:
	injector = Injector([CollectionScheduleServiceModule])
	injector.binder.bind(CollectionScheduleRepository, repository_mock)
	return injector.get(CollectionScheduleService)


def test_create_many(repository_mock, service):
	collection_schedules: Sequence[CollectionSchedule] = [
		CollectionSchedule.model_construct(
			date='2023-10-01',
			wastes=['VPL'],
		),
	]
	repository_mock.insert_many.return_value = collection_schedules

	result = service.create_many(collection_schedules)

	assert result == collection_schedules
	repository_mock.insert_many.assert_called_once_with(collection_schedules)
