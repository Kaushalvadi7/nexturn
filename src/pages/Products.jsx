import ProductHero from "../components/products/ProductHero";
import ProductFeatures from "../components/products/ProductFeatures";
import ProductFilter from "../components/products/ProductFilter";
import ProductGrid from "../components/products/ProductGrid";
import AvailableMaterials from "../components/products/AvailableMaterials";
import ForSeo from "../components/ForSeo";

const Products = () => {

  return (
    <>
      <ForSeo
        title="Our Products | Nexturn Component Craft"
        description="Explore our extensive range of high-quality precision engineering products, including CNC machined parts, custom metal fabrication, and more."
        keywords="precision engineering products, CNC machined parts, custom metal fabrication, sheet metal products, high-quality components, Nexturn products"
        path="/products"
        serviceSchema={{
          serviceName: "Precision Engineering Products",
          serviceDescription: "Explore our extensive range of high-quality precision engineering products, including CNC machined parts and custom metal fabrication.",
        }}
      />
      <div className="bg-[#fafbfc] min-h-screen pt-0 pb-16 font-['Source_Sans_3',sans-serif]">
        <div id="overview" className="scroll-mt-24">
          <ProductHero />
        </div>
        <div id="features" className="scroll-mt-24">
          {/* <ProductFeatures /> */}
        </div>
        {/* <ProductFilter />
      <ProductGrid /> */}
        <div id="materials" className="scroll-mt-24">
          <AvailableMaterials />
        </div>
      </div>
    </>
  );
};

export default Products;
