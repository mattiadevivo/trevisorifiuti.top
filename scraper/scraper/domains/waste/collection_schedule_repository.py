from typing import Sequence
from sqlalchemy.dialects.postgresql import insert
from sqlmodel import Session
from scraper.adapters.db import Db
from scraper.domains.waste.collection_schedule import CollectionSchedule


class CollectionScheduleRepository:
    def __init__(self, db: Db) -> None:
        self.db = db.engine

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
            .on_conflict_do_nothing(index_elements=["date", "waste", "municipality_id"])
        )
        with Session(self.db) as session:
            session.exec(insertStatement)  # type:ignore
            session.commit()
            return collection_schedules
