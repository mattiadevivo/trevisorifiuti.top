from injector import Injector
from scraper.adapters import Adapters
from scraper.config import Settings
from scraper.adapters.db import Config as DbConfig
from scraper.services import Services
from scraper.main import get_page_content, scrape


if __name__ == '__main__':
	settings = Settings()
	# create DI injector
	injector = Injector([])
	# tell the injector how to construct DBConfig
	# since it will be used to create other Injectable containers
	injector.binder.bind(DbConfig, DbConfig(settings.db_connection_string))
	adapters = injector.get(Adapters)
	services = injector.get(Services)
	result = get_page_content(adapters.http_client, settings.page_url)
	scrape(settings, adapters, services)
