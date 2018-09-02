IMAGE=sh-api

.PHONY: build
build:
	@docker build -t $(IMAGE) .

.PHONY: run
run:
	@docker run -p 3000:3000 $(IMAGE)
