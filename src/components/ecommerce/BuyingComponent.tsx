import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const BuyingsCard = () => {
  return (
    <Card className="border border-gray-200 bg-white text-gray-900 
                     dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Buyings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Total Purchases
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            76
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Total Spent
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            $2,180
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Active Orders
          </span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            5
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuyingsCard;
