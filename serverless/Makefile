function=getProducts

.PHONY: deploy
deploy:
	serverless deploy -v

.PHONY: redeploy
redeploy:
	serverless deploy function -f $(function)

.PHONY: local
local:
	serverless invoke local --function $(function) -l

.PHONY: invoke
invoke:
	serverless invoke --function $(function) -l

.PHONY: clean
clean:
	serverless remove

.PHONY: logs
logs:
	serverless logs --function $(function) --tail

.PHONY: offline
offline:
	serverless offline start