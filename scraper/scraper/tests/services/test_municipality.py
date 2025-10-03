from unittest.mock import create_autospec
from uuid import UUID

from injector import Injector
import pytest
from scraper.domains.waste.municipality import Municipality
from scraper.domains.waste.municipality_repository import MunicipalityRepository
from scraper.services.municipality import MunicipalityService, MunicipalityServiceModule


@pytest.fixture
def repository_mock() -> MunicipalityRepository:
	return create_autospec(MunicipalityRepository)


@pytest.fixture
def service(repository_mock) -> MunicipalityService:
	injector = Injector(MunicipalityServiceModule)
	injector.binder.bind(MunicipalityRepository, repository_mock)
	return injector.get(MunicipalityService)


def test_create(repository_mock, service):
	municipality = Municipality.model_construct(
		id=UUID('123e4567-e89b-12d3-a456-426614174000'),
		name='Casier',
		zone='',
		area=None,
	)
	repository_mock.get_by_info.return_value = municipality

	result = service.create('Casier', '', None)

	assert isinstance(result, Municipality)
	assert result.model_dump_json() == municipality.model_dump_json()
	repository_mock.get_by_info.assert_called_once_with('Casier', '', None)
	repository_mock.insert.assert_not_called()


def test_create_municipality_not_exists(repository_mock, service):
	municipality = Municipality.model_construct(
		id=UUID('123e4567-e89b-12d3-a456-426614174000'),
		name='Casier',
		zone='',
		area=None,
	)
	repository_mock.get_by_info.return_value = None
	repository_mock.insert.return_value = municipality

	result = service.create('Casier', '', None)

	assert isinstance(result, Municipality)
	assert result.model_dump_json() == municipality.model_dump_json()
	repository_mock.get_by_info.assert_called_once_with('Casier', '', None)
	repository_mock.insert.assert_called_once()


def test_list(repository_mock, service):
	repository_mock.get_all.return_value = []

	result = service.list()

	assert result == []
	repository_mock.get_all.assert_called_once()
