import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const SellingsCard = () => {
  return (
    <Card
      className="border border-gray-200 bg-white text-gray-900
                 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Sellings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Total Orders
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            128
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Total Revenue
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            $4,560
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Pending Orders
          </span>
          <span className="font-semibold text-yellow-600 dark:text-yellow-400">
            12
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellingsCard;
