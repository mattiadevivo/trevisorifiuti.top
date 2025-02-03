class Comune:
    def __init__(self, name: str, zone: str, area: str | None) -> None:
        self._name = name
        self._area = area
        self._zone = zone

    @property
    def name(self) -> str:
        return self._name

    @property
    def area(self) -> str | None:
        return self._area

    @property
    def zone(self) -> str:
        return self._zone
