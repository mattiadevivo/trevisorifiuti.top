from typing import TypedDict

from attr import dataclass
from scraper.adapters.db import Config as DbConfig, Db


class Config(TypedDict):
    db: DbConfig


@dataclass
class Adapters:
    db: Db


def create(config: Config) -> Adapters:
    db = Db(**config["db"])
    return Adapters(db)
