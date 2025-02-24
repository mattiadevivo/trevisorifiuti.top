from typing import TypedDict

from attr import dataclass
from scraper.adapters.supabase import Supabase, Config as SupabaseConfig


class Config(TypedDict):
    supabase: SupabaseConfig


@dataclass
class Adapters:
    supabase: Supabase


def create(config: Config) -> Adapters:
    supabase = Supabase(**config["supabase"])
    return Adapters(supabase)
