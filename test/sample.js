import { h, render } from "@atomico/core";

function createScope() {
	return document.createElement("div");
}

describe("Element Lifecycle", () => {
	it("Example component", () => {
		let scope = createScope();

		function App() {
			return <h1>atomico</h1>;
		}

		render(<App />, scope);

		assert(scope.querySelector("h1").textContent, "atomico");
	});
});
