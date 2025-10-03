from attr import dataclass
from injector import inject

from scraper.adapters.db import Db


@inject
@dataclass
class Adapters:
	"""Convenience class you can fetch with injector.get(Adapters)"""

	db: Db
