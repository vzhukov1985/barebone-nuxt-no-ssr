# API
gen-api:
	rm -fr ./common/runtime/api/**/*.ts && rm -fr ./common/runtime/api/*.ts
	cd cli && bun run generateApi.ts
	bunx eslint --fix --cache common/runtime/api
	bunx eslint --fix --cache "./common/devProxy.ts"

reinstall:
	cd common && rm -fr node_modules bun.lockb .nuxt .output dist
	cd cli && rm -fr node_modules bun.lockb .nuxt .output dist && bun install
	rm -fr node_modules bun.lockb .eslintcache
	bun install
# CHECKUPS
check-d:
ifndef d
	$(error you have to set d=dir after target)
endif


# NUXT
build: check-d
	cd $(d) && BASENAME=$(d) bun run build
dev: check-d
	cd $(d) && BASENAME=$(d) bun run dev
generate: check-d
	cd $(d) && BASENAME=$(d) bun run generate
start: check-d
	cd $(d) && bun run preview
preview: generate start
size: check-d
	cd $(d) && BASENAME=$(d) bunx nuxi analyze

# I18N
i18n-a: check-d
	bun run cli/extractI18n.ts $(d)
i18n-r: check-d
	bun run cli/extractI18n.ts $(d) remove

clean:
	rm -rf .output/public