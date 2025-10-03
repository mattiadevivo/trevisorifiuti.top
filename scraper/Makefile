test:
	uv run pytest -v -vv --cov=. --cov-report term-missing

test-path: # Run specific test file
	uv run pytest $(testpath) -v

lint:
	uv run ruff check --fix

format:
	uv run ruff format

run:
	uv run scrape.py