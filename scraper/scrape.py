from datetime import datetime
import httpx
from bs4 import BeautifulSoup, Tag, ResultSet
from typing import List, cast
from re import search

from scraper.config import Settings
from scraper.domains.waste.municipality import Municipality
from scraper.domains.waste.collection_schedule import CollectionSchedule, Waste

from scraper.adapters import create as create_adapters
from scraper.services import Services, create as create_services


def get_page_content(url) -> bytes:
    response = httpx.get(url)
    if response.status_code != 200:
        raise (Exception)
    return response.content


def extract_municipality_from_table(table: Tag) -> Municipality | None:
    def extract_municipality_zone_from_class_attrs(attrs: list[str]) -> str | None:
        """Some municipalities have more than one zone, if present extract it"""
        for attr in attrs:
            match = search(r"comune_zona_(\d+)", attr)
            if match:
                return match.group(1)
        return None

    municipality_zone = extract_municipality_zone_from_class_attrs(
        cast(list[str], table.attrs["class"])
    )
    # extract the comune name
    municipality_row = table.find("tr", attrs={"class": "firstrow"})
    assert isinstance(municipality_row, Tag)
    municipality_column = municipality_row.find("td")
    if municipality_zone is not None and municipality_column is not None:
        municipality_with_area = municipality_column.getText("-", strip=True)
        return Municipality(
            name=municipality_with_area.split("-")[0],
            zone=municipality_zone,
            area=municipality_with_area.split("-")[1]
            if municipality_with_area.find("-") != -1
            else None,
        )
    return None


def extract_collection_schedules(
    table: Tag, municipality: Municipality
) -> List[CollectionSchedule]:
    collection_schedules_table = table.find(
        "table", id=f"svuotamenti_{municipality.zone}"
    )
    assert isinstance(collection_schedules_table, Tag)
    collection_schedules_rows = collection_schedules_table.find_all(
        "tr", recursive=False
    )
    collection_schedules: List[CollectionSchedule] = []
    for row in collection_schedules_rows:
        assert isinstance(row, Tag)
        collection_schedules_cells = row.find_all("td", recursive=False)
        if collection_schedules_cells:
            text = " ".join(
                [s.getText("&", strip=True) for s in collection_schedules_cells]
            )
            (date, s) = text.split(" ", 1)
            collection_schedules.append(
                CollectionSchedule(
                    date=datetime.strptime(date, "%d-%m-%Y").date(),
                    waste=cast(
                        List[Waste],
                        s.split("&"),
                    ),
                    municipality_id=municipality.id,
                )
            )
    return collection_schedules


def scrape(services: Services, url: str):
    page_content = get_page_content(url)
    # Create a BeautifulSoup object and specify the parser
    soup = BeautifulSoup(page_content, "html.parser")
    # Find all table elements with class that follow the pattern "table comune"
    tables: ResultSet = soup.find_all(
        attrs={"class": lambda x: x and x.startswith("table comune")}
    )
    for table in tables:
        assert isinstance(table, Tag)
        municipality = extract_municipality_from_table(table)
        if municipality is None:
            continue
        municipality = services.municipality.create(
            municipality.name, municipality.zone, municipality.area
        )
        collection_schedules = extract_collection_schedules(table, municipality)
        services.collection_schedule.create_many(collection_schedules)


if __name__ == "__main__":
    settings = Settings()
    adapters = create_adapters(
        {
            "db": {
                "connection_string": settings.db_connection_string,
            }
        }
    )
    services = create_services(config={}, adapters=adapters)
    scrape(services, settings.page_url)
