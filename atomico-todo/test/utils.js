export function scope(html) {
	let scope = document.createElement("div");

	scope.innerHTML = html;

	document.body.appendChild(scope);

	return scope.querySelector("*");
}
