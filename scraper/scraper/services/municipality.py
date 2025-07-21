from typing import Sequence
from scraper.domains.waste.municipality import Municipality
from scraper.domains.waste.municipality_repository import MunicipalityRepository


class MunicipalityService:
    def __init__(self, repo: MunicipalityRepository):
        self.repo = repo

    def create(self, name: str, zone: str, area: str | None) -> Municipality:
        municipality = self.repo.get_by_info(name, zone, area)
        if municipality is not None:
            return municipality
        municipality = Municipality(name=name, zone=zone, area=area)
        return self.repo.insert(municipality)

    def list(self) -> Sequence[Municipality]:
        return self.repo.get_all()
