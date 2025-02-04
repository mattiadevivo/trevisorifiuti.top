from typing import Literal


Rifiuto = Literal["Vegetale" | "Secco" | "Umido" | "VPL" | "Carta"]


class Svuotamento:
    def __init__(self, data: str, rifiuto: Rifiuto) -> None:
        self._data = data
        self._rifiuto = rifiuto
