import { c as createElement, h as AtomicoStoreButton } from './chunk-edfac312.js';
import { a as AtomicoStoreCart } from './chunk-863279da.js';

function cart({ products, remCart }) {
	return (
		createElement('section', null
, products.map(({ title, id, price, count }) => (
				createElement(AtomicoStoreCart, { key: id,}
, createElement('p', null
, createElement('strong', null, title), " - "  , price, " x "  , count
)
, createElement(AtomicoStoreButton, {
						onClick: () => {
							remCart({ title, id, price });
						},}
					, "remove to cart"

)
)
			))
)
	);
}

export default cart;
//# sourceMappingURL=cart-04aba04e.js.map
