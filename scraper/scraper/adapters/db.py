from attr import dataclass
from injector import Module, inject, provider, singleton
from sqlmodel import Session, create_engine


@dataclass
class Config:
	connection_string: str


class Db:
	@inject
	def __init__(self, config: Config):
		self.config = config
		self.engine = create_engine(self.config.connection_string)

	def session(self) -> Session:
		return Session(self.engine)


class DbModule(Module):
	@provider
	@singleton
	def provide_db(self, config: Config) -> Db:
		connection = Db(config)
		return connection
