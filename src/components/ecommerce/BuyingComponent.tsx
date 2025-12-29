import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const BuyingsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buyings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>Total Purchases</span>
          <span className="font-semibold">76</span>
        </div>
        <div className="flex justify-between">
          <span>Total Spent</span>
          <span className="font-semibold">$2,180</span>
        </div>
        <div className="flex justify-between">
          <span>Active Orders</span>
          <span className="font-semibold text-blue-600">5</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuyingsCard;
