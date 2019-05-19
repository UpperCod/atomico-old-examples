import { Element, h } from "@atomico/element";
import { scope } from "./utils";

class Tag extends Element {
	render() {
		return <host>atomico</host>;
	}
}

customElements.define("custom-element", Tag);

describe("Element Lifecycle", () => {
	it("Example component", async done => {
		let node = scope("<custom-element></custom-element>");

		await node.mounted;

		expect(node.textContent).toBe("atomico");

		done();
	});
});
