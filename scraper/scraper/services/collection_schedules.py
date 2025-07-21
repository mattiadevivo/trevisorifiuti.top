from typing import Sequence
from scraper.domains.waste.collection_schedule import CollectionSchedule
from scraper.domains.waste.collection_schedule_repository import (
    CollectionScheduleRepository,
)


class CollectionScheduleService:
    def __init__(self, repo: CollectionScheduleRepository):
        self.repo = repo

    def create_many(
        self, collection_schedules: Sequence[CollectionSchedule]
    ) -> Sequence[CollectionSchedule]:
        return self.repo.insert_many(collection_schedules)
