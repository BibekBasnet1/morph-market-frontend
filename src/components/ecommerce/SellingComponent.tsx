import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const SellingsCard = () => {
  return (
    <Card className="dark:text-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Sellings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>Total Orders</span>
          <span className="font-semibold">128</span>
        </div>
        <div className="flex justify-between">
          <span>Total Revenue</span>
          <span className="font-semibold">$4,560</span>
        </div>
        <div className="flex justify-between">
          <span>Pending Orders</span>
          <span className="font-semibold text-yellow-600">12</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellingsCard;
