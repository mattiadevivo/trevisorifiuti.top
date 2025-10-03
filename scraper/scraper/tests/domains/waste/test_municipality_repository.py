from unittest.mock import MagicMock, Mock, create_autospec
from uuid import UUID
import pytest
from sqlalchemy import ScalarResult

from scraper.adapters.db import Db

from sqlmodel import Session

from scraper.domains.waste.municipality import Municipality
from scraper.domains.waste.municipality_repository import MunicipalityRepository


@pytest.fixture
def db_mock():
	db = create_autospec(Db)
	db.session.return_value.__enter__.return_value = create_autospec(
		Session, spec_set=True
	)
	db.session.return_value.__exit__.return_value = False
	return db


@pytest.fixture
def repository(db_mock):
	return MunicipalityRepository(db=db_mock)


def test_insert(
	repository,
):
	municipality = Municipality.model_construct(
		id=UUID('123e4567-e89b-12d3-a456-426614174000'),
		name='Casier',
		zone='',
		area=None,
	)
	result = repository.insert(municipality)

	assert result.model_dump_json() == municipality.model_dump_json()
	repository.db.session.assert_called_once()


# def test_get_by_info(
# repository,
# ):
# municipality = Municipality.model_construct(
# id=UUID('123e4567-e89b-12d3-a456-426614174000'),
# name='Casier',
# zone='',
# area=None,
# )
#
# result = repository.get_by_info(
# name='Casier',
# zone='',
# area=None,
# )
#
# assert result is not None
# repository.db.session.assert_called_once()
#
#
# def test_get_all(
# repository,
# ):
# municipalities = [
# Municipality.model_construct(
# id=UUID('123e4567-e89b-12d3-a456-426614174000'),
# name='Casier',
# zone='',
# area=None,
# )
# ]
# repository.db.session.return_value.exec.return_value.all.return_value = (
# municipalities
# )
#
# result = repository.get_all()
#
# assert len(result) == len(municipalities)
# repository.db.session.assert_called_once()
