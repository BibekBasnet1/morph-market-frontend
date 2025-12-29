import BuyingsCard from "../../../components/ecommerce/BuyingComponent";
import DemographicCard from "../../../components/ecommerce/DemographicCard";
import PopularProductsCard from "../../../components/ecommerce/PopularComponent";
import SellingsCard from "../../../components/ecommerce/SellingComponent";

const DashboardPage= () => {
  return (
    <>
       <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-4">
        <SellingsCard />
      </div>

      <div className="col-span-12 xl:col-span-4">
        <BuyingsCard />
      </div>

      <div className="col-span-12 xl:col-span-4">
        <PopularProductsCard />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>
    </div>
    </>
  );
};
export default DashboardPage;