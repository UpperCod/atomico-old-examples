import { h } from "@atomico/core";

export default function Button({ children, checked, dark, ...props }) {
	return (
		<div {...props} shadowDom>
			<style>
				{`
					:host{
						padding:.5rem 1rem;
						border-radius:5px;
						cursor:pointer;
						display:inline-flex;
						align-items:center;
						${
							dark
								? `background:black;color:white;`
								: checked
								? `background:white`
								: `color:white`
						}
					}
					`}
			</style>
			{children}
		</div>
	);
}
