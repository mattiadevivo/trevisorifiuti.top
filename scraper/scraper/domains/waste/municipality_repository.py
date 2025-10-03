from typing import Sequence
from injector import Module, inject, provider, singleton
from sqlalchemy.dialects.postgresql import insert
from sqlmodel import select
from scraper.adapters.db import Db
from scraper.domains.waste.municipality import Municipality


class MunicipalityRepository:
	@inject
	def __init__(self, db: Db) -> None:
		self.db = db

	def insert(self, municipality: Municipality) -> Municipality:
		insertStatement = (
			insert(Municipality)
			.values(municipality.model_dump())
			.on_conflict_do_nothing(index_elements=['name', 'area', 'zone'])
		)
		with self.db.session() as session:
			session.exec(insertStatement)  # type:ignore
			session.commit()
			return municipality

	def get_by_info(
		self, name: str, zone: str, area: str | None
	) -> Municipality | None:
		with self.db.session() as session:
			municipality = session.exec(
				select(Municipality)
				.where(Municipality.name == name)
				.where(Municipality.zone == zone)
				.where(Municipality.area == area)
			).first()
			return municipality

	def get_all(self) -> Sequence[Municipality]:
		with self.db.session() as session:
			municipalities = session.exec(select(Municipality)).all()
			return municipalities


class MunicipalityRepositoryModule(Module):
	"""Instruct the Injector what are the dependencies to get MunicipalityRepository"""

	@singleton
	@provider
	def provide_repository(self, db: Db) -> MunicipalityRepository:
		return MunicipalityRepository(db)
