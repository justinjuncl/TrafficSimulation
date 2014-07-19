compiled=TrafficSimulation.js

compile:
	@find ./js -type f -name "*.js" | xargs cat > $(compiled)