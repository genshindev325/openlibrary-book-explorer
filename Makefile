.PHONY: dev stop ps migrate seed test e2e

dev:
	docker-compose up --build

stop:
	docker-compose down

ps:
	docker-compose ps

migrate:
	docker-compose exec -T web npm run prisma:migrate

seed:
	docker-compose exec -T web npm run seed

test:
	npm run test

e2eserver:
	npx playwright install && npm run e2e:with-server
