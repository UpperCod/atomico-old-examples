import { h } from "@atomico/core";

export default function Box(props) {
	return (
		<article shadowDom>
			<style>{`
			:host{
				flex:0%;
				padding:1rem;
				box-sizing:border-box;
				margin : 1rem;
				background:white;
				border-radius:5px;
				box-shadow:0px 6px 12px rgba(0,0,0,.05);
				display:flex;
				align-items:center;
				justify-content:space-between;
			}
			`}</style>
			{props.children}
		</article>
	);
}
