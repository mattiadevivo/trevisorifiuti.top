import httpx
from bs4 import BeautifulSoup, Tag
from typing import cast

# Send a GET request to the webpage
url = "https://contarina.it/cittadino/raccolta-differenziata/eco-calendario"


def get_page_content(url) -> bytes:
    response = httpx.get(url)
    if response.status_code != 200:
        raise (Exception)
    return response.content


def scrape(url: str):
    page_content = get_page_content(url)
    # Create a BeautifulSoup object and specify the parser
    soup = BeautifulSoup(page_content, "html.parser")
    # Find all table elements with class that follow the pattern "table comune comune_zona_<number>"
    tables = soup.find_all(
        attrs={"class": lambda x: x and x.startswith("table svuotamenti")}
    )
    for table in tables:
        table = cast(Tag, table)
        print(table)
        print(f"Comune: {table.find('th', string=True).text.strip()}")
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
    else:
        print("Failed to retrieve the webpage")


scrape(url)
