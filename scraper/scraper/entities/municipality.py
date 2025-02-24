from json import dumps


class Municipality:
    def __init__(self, name: str, zone: str, area: str | None):
        self._name = name
        self._zone = zone
        self._area = area

    def __str__(self):
        return dumps(self.__dict__)

    @property
    def name(self) -> str:
        return self._name

    @property
    def area(self) -> str | None:
        return self._area

    @property
    def zone(self) -> str:
        return self._zone
