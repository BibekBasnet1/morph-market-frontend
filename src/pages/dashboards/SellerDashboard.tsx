import BuyerActivityLogs from "../../components/buyer/ActivityLogs";
import PopularProductsCard from "../../components/ecommerce/PopularComponent";
import SellerRecentActivity from "../../components/ecommerce/SellerRecentActivityComponent";
import SellerStatsCards from "../../components/ecommerce/SellerStatsComponent";

const SellerDashboard = () => {
  return (
<section className="grid grid-cols-12 gap-4">
      {/* <div className="col-span-12">
        <SellerStatsCards />
        </div> */}
        <div className=" col-span-6 h-full">
        <BuyerActivityLogs />
      </div>
          <div className=" col-span-6 h-full">
        <SellerRecentActivity />
      </div>
      <div className=" col-span-6">
        <PopularProductsCard />
      </div>
      
</section>
  );
};

export default SellerDashboard;