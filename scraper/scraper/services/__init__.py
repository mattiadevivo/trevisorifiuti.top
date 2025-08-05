from typing import TypedDict

from attr import dataclass

from scraper.adapters import Adapters
from scraper.domains.waste.collection_schedule_repository import (
    CollectionScheduleRepository,
)
from scraper.domains.waste.municipality_repository import MunicipalityRepository
from scraper.services.municipality import MunicipalityService
from scraper.services.collection_schedules import CollectionScheduleService


class Config(TypedDict):
    pass


@dataclass
class Services:
    municipality: MunicipalityService
    collection_schedule: CollectionScheduleService


def create(config: Config, adapters: Adapters) -> Services:
    municipality = MunicipalityService(MunicipalityRepository(db=adapters.db))
    collection_schedule = CollectionScheduleService(
        CollectionScheduleRepository(db=adapters.db)
    )
    return Services(municipality=municipality, collection_schedule=collection_schedule)
