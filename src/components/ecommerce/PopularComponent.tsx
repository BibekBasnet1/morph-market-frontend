import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const products = [
  { species: "Ball Python", count: 18 },
  { species: "Corn Snake", count: 12 },
  { species: "Boa Constrictor", count: 7 },
  { species: "King Snake", count: 5 },
];

const PopularProductsCard = () => {
  return (
    <Card
      className="border border-gray-200 h-full bg-white text-gray-900
                 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Popular Snake Species
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        {products.map((snake) => (
          <div
            key={snake.species}
            className="flex justify-between items-center"
          >
            <span className="text-gray-600 dark:text-gray-400">
              {snake.species}
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {snake.count} sold
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PopularProductsCard;
