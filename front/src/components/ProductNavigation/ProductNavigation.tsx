import './ProductNavigation.scss';

interface ProductNavigationProps {
  prevProduct: () => void;
  nextProduct: () => void;
  currentIndex: number;
  totalProducts: number;
}

const ProductNavigation = ({
  prevProduct,
  nextProduct,
  currentIndex,
  totalProducts,
}: ProductNavigationProps) => (
  <div className="bottom">
    <div className="previous">
      <button onClick={prevProduct} disabled={currentIndex === 0}>
        Précédent
      </button>
    </div>
    <div className="next">
      <button
        onClick={nextProduct}
        disabled={currentIndex === totalProducts - 1}
      >
        Suivant
      </button>
    </div>
  </div>
);

export default ProductNavigation;
