from typing import TypedDict
from supabase import create_client, Client

from scraper.entities.municipality import Municipality


class Config(TypedDict):
    url: str
    key: str


class Supabase:
    def __init__(self, url: str, key: str):
        self.client: Client = create_client(url, key)

    def insert_municipality(self, municipality: Municipality):
        return (
            self.client.schema("tvtrash")
            .table("municipalities")
            .insert(municipality.__dict__)
            .execute()
        )
