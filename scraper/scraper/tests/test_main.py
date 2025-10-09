from unittest.mock import create_autospec, Mock
from venv import create
from assertpy import assert_that, assert_warn
from bs4 import BeautifulSoup
import httpx
from injector import Injector
import pytest
from scraper.adapters import Adapters
from scraper.adapters.db import Config as DbConfig
from scraper.config import Settings
from scraper.domains.waste.municipality import Municipality
from scraper.main import (
	extract_and_save_collection_schedules,
	extract_collection_schedules,
	extract_municipality,
	get_page_content,
	scrape,
)
from scraper.services import Services
from scraper.services.collection_schedules import CollectionScheduleService
from scraper.services.municipality import MunicipalityService
from unittest.mock import patch


@pytest.fixture
def municipality_service_mock() -> MunicipalityService:
	return create_autospec(MunicipalityService)


@pytest.fixture
def collection_schedule_service_mock() -> CollectionScheduleService:
	return create_autospec(CollectionScheduleService)


@pytest.fixture
def settings() -> Settings:
	return Settings()


@pytest.fixture
def services(
	municipality_service_mock, collection_schedule_service_mock, settings
) -> Services:
	injector = Injector()
	injector.binder.bind(DbConfig, DbConfig(settings.db_connection_string))
	injector.binder.bind(MunicipalityService, municipality_service_mock)
	injector.binder.bind(CollectionScheduleService, collection_schedule_service_mock)
	return injector.get(Services)


@pytest.fixture
def adapters(settings) -> Adapters:
	injector = Injector([])
	injector.binder.bind(DbConfig, DbConfig(settings.db_connection_string))
	return injector.get(Adapters)


@pytest.fixture
def html_content() -> bytes:
	return open('scraper/tests/assets/test_get_page_content.html', 'rb').read()


@pytest.fixture
def municipality_table(html_content):
	soup = BeautifulSoup(html_content, 'html.parser')
	return soup.find_all(
		'table', attrs={'class': lambda x: x and x.startswith('table comune')}
	)[1]


@pytest.fixture
def collection_schedule_table(html_content):
	soup = BeautifulSoup(html_content, 'html.parser')
	return soup.find_all(
		'table', attrs={'class': lambda x: x and x.startswith('table comune')}
	)[1]


def test_get_page_content(settings, adapters, html_content):
	adapters.http_client.client = httpx.Client(
		transport=httpx.MockTransport(
			lambda request: httpx.Response(
				200,
				content=html_content,
			)
		)
	)
	page_content = get_page_content(adapters.http_client, settings.page_url)
	assert_that(page_content).is_equal_to(html_content)


def test_get_page_content_error(settings, adapters):
	adapters.http_client.client = httpx.Client(
		transport=httpx.MockTransport(
			lambda request: httpx.Response(
				500,
			)
		)
	)
	assert_that(get_page_content).raises(Exception).when_called_with(
		adapters.http_client, settings.page_url
	)


def test_extract_municipality(municipality_table):
	municipality = extract_municipality(municipality_table)
	assert_that(municipality).is_instance_of(Municipality)


def test_extract_collection_schedules(municipality_table):
	collection_schedules = extract_collection_schedules(
		municipality_table, Municipality(name='Arcade', zone='28', area=None)
	)
	assert_that(collection_schedules).is_type_of(list)


def test_extract_and_save_collection_schedules(
	municipality_table,
	services,
):
	municipality = Municipality(name='Arcade', zone='28', area=None)
	services.municipality.create.return_value = municipality

	with (
		patch('scraper.main.extract_collection_schedules') as _,
		patch('scraper.main.extract_municipality') as mock_extract_municipality,
	):
		mock_extract_municipality.return_value = municipality
		extract_and_save_collection_schedules(municipality_table, services)

	# assertions
	services.municipality.create.assert_called_once()


@patch('scraper.main.extract_and_save_collection_schedules')
@patch('scraper.main.get_page_content')
def test_scrape(
	mock_get_page_content: Mock,
	mock_extract_and_save_collection_schedules: Mock,
	settings,
	html_content,
	adapters,
	services,
):
	mock_get_page_content.return_value = html_content
	scrape(settings, adapters, services)
	mock_get_page_content.assert_called_once_with(
		adapters.http_client, settings.page_url
	)
	mock_extract_and_save_collection_schedules.assert_called()
