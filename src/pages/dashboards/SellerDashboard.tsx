import BuyerActivityLogs from "../../components/buyer/ActivityLogs";
import SellerOrdersComponent from "../../components/seller/SellerOrdersComponent";

const SellerDashboard = () => {
  return (
<section className="grid grid-cols-12  gap-4">
      {/* <div className="col-span-12">
        <SellerStatsCards />
        </div> */}
        <div className=" col-span-12 md:col-span-6 h-full">
        <BuyerActivityLogs />
      </div>
          <div className="col-span-12 md:col-span-6 h-full">
        <SellerOrdersComponent />
      </div>
      
</section>
  );
};

export default SellerDashboard;