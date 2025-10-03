from typing import Sequence
from injector import Module, inject, provider, singleton
from sqlalchemy.dialects.postgresql import insert
from scraper.adapters.db import Db
from scraper.domains.waste.collection_schedule import CollectionSchedule


class CollectionScheduleRepository:
	@inject
	def __init__(self, db: Db) -> None:
		self.db = db

	def insert_many(
		self, collection_schedules: Sequence[CollectionSchedule]
	) -> Sequence[CollectionSchedule]:
		insertStatement = (
			insert(CollectionSchedule)
			.values(
				[
					collection_schedule.model_dump()
					for collection_schedule in collection_schedules
				]
			)
			.on_conflict_do_nothing(index_elements=['date', 'waste', 'municipality_id'])
		)
		with self.db.session() as session:
			session.exec(insertStatement)  # type:ignore
			session.commit()
			return collection_schedules


class CollectionScheduleRepositoryModule(Module):
	"""Instruct the Injector what are the
	dependencies to get CollectionScheduleModule
	"""

	@singleton
	@provider
	def provide_repository(self, db: Db) -> CollectionScheduleRepository:
		return CollectionScheduleRepository(db)
