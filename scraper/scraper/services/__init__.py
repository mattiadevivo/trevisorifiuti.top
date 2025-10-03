from attr import dataclass

from scraper.services.municipality import MunicipalityService
from scraper.services.collection_schedules import CollectionScheduleService

from injector import inject


@inject
@dataclass
class Services:
	"""Convenience class you can fetch with injector.get(Services)"""

	municipality: MunicipalityService
	collection_schedule: CollectionScheduleService
