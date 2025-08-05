from typing import TypedDict
from sqlmodel import create_engine


class Config(TypedDict):
    connection_string: str


class Db:
    def __init__(self, connection_string: str):
        self.engine = create_engine(connection_string)
