from typing import Sequence

from injector import Module, inject, provider, singleton
from scraper.domains.waste.collection_schedule import CollectionSchedule
from scraper.domains.waste.collection_schedule_repository import (
	CollectionScheduleRepository,
)


class CollectionScheduleService:
	@inject
	def __init__(self, repo: CollectionScheduleRepository):
		self.repo = repo

	def create_many(
		self, collection_schedules: Sequence[CollectionSchedule]
	) -> Sequence[CollectionSchedule]:
		return self.repo.insert_many(collection_schedules)


class CollectionScheduleServiceModule(Module):
	"""Instruct the injector how to build the ReturnType
	(CollectionScheduleService) of the functions marked with @provider label
	"""

	@singleton
	@provider
	def provide_service(
		self, repo: CollectionScheduleRepository
	) -> CollectionScheduleService:
		return CollectionScheduleService(repo)
