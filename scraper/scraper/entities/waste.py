from typing import Literal, List

Waste = Literal["Vegetale", "Secco", "Umido", "VPL", "Carta"]


class CollectionSchedule:
    def __init__(self, date: str, wastes: List[Waste]) -> None:
        self._date = date
        self._wastes = wastes

    @property
    def date(self) -> str:
        return self._date

    def __str__(self):
        return f"{self.date}: {self._wastes}"
