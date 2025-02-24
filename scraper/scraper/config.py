from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # each field of the settings can be overriden by an env var with the same name as the field
    model_config = SettingsConfigDict(case_sensitive=False)
    page_url: str = Field(
        default="https://contarina.it/cittadino/raccolta-differenziata/eco-calendario",
        description="The page where scrape the data from",
    )
    supabase_url: str
    supabase_key: str
