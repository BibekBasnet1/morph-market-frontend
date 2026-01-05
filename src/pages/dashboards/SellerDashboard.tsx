import PopularProductsCard from "../../components/ecommerce/PopularComponent";
import DemographicCard from "../../components/ecommerce/DemographicCard";

const SellerDashboard = () => {
  return (
<>
      <div className="col-span-12 xl:col-span-4">
        <PopularProductsCard />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>
</>
  );
};

export default SellerDashboard;