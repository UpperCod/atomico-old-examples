import { c as createElement, h as AtomicoStoreButton } from './chunk-edfac312.js';
import { a as AtomicoStoreCart } from './chunk-863279da.js';

function products({ products, addCart }) {
	return (
		createElement('section', null
, products.map(({ title, id, price }) => (
				createElement(AtomicoStoreCart, { key: id,}
, createElement('p', null
, createElement('strong', null, title), " - "  , price
)
, createElement(AtomicoStoreButton, {
						onClick: () => {
							addCart({ title, id, price });
						},}
					, "add to cart"

)
)
			))
)
	);
}

export default products;
//# sourceMappingURL=products-03654883.js.map
