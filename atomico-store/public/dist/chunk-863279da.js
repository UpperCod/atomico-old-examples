import { f as customElement, c as createElement } from './chunk-edfac312.js';

var style = ":host{flex:0%;padding:1rem;box-sizing:border-box;margin:1rem;background:#fff;border-radius:5px;box-shadow:0 6px 12px rgba(0,0,0,.05);display:flex;align-items:center;justify-content:space-between;font-size:14px}";

function Card({ labelButton }) {
	return (
		createElement('host', { shadowDom: true,}
, createElement('style', null, style)
, createElement('slot', null )
)
	);
}

Card.observables = {
	labelButton: String
};

var AtomicoStoreCart = customElement("atomico-store-card", Card);

export { AtomicoStoreCart as a };
//# sourceMappingURL=chunk-863279da.js.map
