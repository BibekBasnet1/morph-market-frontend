
// import SellingsCard from "../../components/ecommerce/SellingComponent";
// import BuyingsCard from "../../components/ecommerce/BuyingComponent";
import BuyerActivityLogs from "../../components/buyer/ActivityLogs";
import PopularProductsCard from "../../components/ecommerce/PopularComponent";

const BuyerDashboard = () => {
 return (
    <>
       <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* <div className="col-span-12 xl:col-span-4">
        <SellingsCard />
      </div>

      <div className="col-span-12 xl:col-span-4">
        <BuyingsCard />
      </div> */}
     <div className="col-span-12 xl:col-span-6">
        <BuyerActivityLogs />
      </div>
      <div className="col-span-12 xl:col-span-4">
        <PopularProductsCard />
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div> */}

 
    </div>
    </>
  );
};

export default BuyerDashboard;