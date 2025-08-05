from typing import Sequence
from sqlalchemy.dialects.postgresql import insert
from sqlmodel import Session, select
from scraper.adapters.db import Db
from scraper.domains.waste.municipality import Municipality


class MunicipalityRepository:
    def __init__(self, db: Db) -> None:
        self.db = db.engine

    def insert(self, municipality: Municipality) -> Municipality:
        insertStatement = (
            insert(Municipality)
            .values(municipality.model_dump())
            .on_conflict_do_nothing(index_elements=["name", "area", "zone"])
        )
        with Session(self.db) as session:
            session.exec(insertStatement)  # type:ignore
            session.commit()
            return municipality

    def get_by_info(
        self, name: str, zone: str, area: str | None
    ) -> Municipality | None:
        with Session(self.db) as session:
            municipality = session.exec(
                select(Municipality)
                .where(Municipality.name == name)
                .where(Municipality.zone == zone)
                .where(Municipality.area == area)
            ).first()
            return municipality

    def get_all(self) -> Sequence[Municipality]:
        with Session(self.db) as session:
            municipalities = session.exec(select(Municipality)).all()
            return municipalities
