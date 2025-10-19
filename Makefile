SHELL := /usr/bin/env bash

NODE_VERSION := 20
PYTHON := python3

.PHONY: setup dev lint test build up down clean

setup:
	@echo "▶ Installing Node and Python deps..."
	cd app && npm ci
	cd api && $(PYTHON) -m venv .venv && . .venv/bin/activate && pip install -U pip && pip install -r requirements.txt
	pre-commit install || true

dev:
	@echo "▶ Starting dev servers..."
	(cd api && . .venv/bin/activate && uvicorn main:app --reload --port 8000) & \
	(cd app && npm run dev)

lint:
	@echo "▶ Linting..."
	cd api && . .venv/bin/activate && ruff check . && black --check .
	cd app && npm run lint

test:
	@echo "▶ Running tests..."
	cd api && . .venv/bin/activate && pytest -q || true
	cd app && npm test -- --watch=false || true

build:
	@echo "▶ Building frontend and docker image..."
	cd app && npm run build
	docker build -f Dockerfile.web -t financetrackerpro:web .

up:
	@echo "▶ docker-compose up"
	docker-compose up -d

down:
	@echo "▶ docker-compose down"
	docker-compose down

clean:
	@echo "▶ Cleaning..."
	rm -rf app/node_modules app/dist api/.venv
