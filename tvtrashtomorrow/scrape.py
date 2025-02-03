import httpx
from bs4 import BeautifulSoup, Tag, ResultSet
from typing import cast
from re import search

from tvtrashtomorrow.entities.comune import Comune

# Send a GET request to the webpage
url = "https://contarina.it/cittadino/raccolta-differenziata/eco-calendario"


def get_page_content(url) -> bytes:
    response = httpx.get(url)
    if response.status_code != 200:
        raise (Exception)
    return response.content


def extract_comune_from_table(table: Tag) -> Comune | None:
    def extract_comune_number_from_class_attrs(attrs: list[str]) -> str | None:
        for attr in attrs:
            match = search(r"comune_zona_(\d+)", attr)
            if match:
                return match.group(1)
        return None

    comune_zone = extract_comune_number_from_class_attrs(
        cast(list[str], table.attrs["class"])
    )
    # extract the comune name
    comune_row = cast(Tag, table.find("tr", attrs={"class": "firstrow"}))
    comune_column = comune_row.find("td")
    if comune_zone is not None and comune_column is not None:
        comune_with_area = comune_column.getText("-", strip=True)
        return Comune(
            comune_with_area.split("-")[0],
            comune_zone,
            comune_with_area.split("-")[1]
            if comune_with_area.find("-") != -1
            else None,
        )
    return None


def extract_comune_data(comune: Comune, data: Tag):
    return None


def scrape(url: str):
    page_content = get_page_content(url)
    # Create a BeautifulSoup object and specify the parser
    soup = BeautifulSoup(page_content, "html.parser")
    # Find all table elements with class that follow the pattern "table comune comune_zona_<number>"
    tables: ResultSet = soup.find_all(
        attrs={"class": lambda x: x and x.startswith("table comune")}
    )
    for table in tables:
        table = cast(Tag, table)
        comune = extract_comune_from_table(table)
        if comune is not None:
            print(f"Comune #{comune.zone}: {comune.name} ({comune.area})")
        continue
        # Find all rows in the table
        rows = table.find_all("tr")
        for row in rows[1:]:
            cols = row.find_all("td")
            if len(cols) > 0:
                comune = cols[0].find("span", string=True).text.strip()
                data = cols[1].find("span", string=True).text.strip()
                svuotamenti = cols[2].find_all("span", string=True)
                # Print each day's waste collection point
                for i, svu in enumerate(svuotamenti):
                    print(f"  {data}:")
                    print(f"    {comune} ({svu.text.strip()})")


scrape(url)
