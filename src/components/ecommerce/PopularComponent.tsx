import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const products = [
  { species: "Ball Python", count: 18 },
  { species: "Corn Snake", count: 12 },
  { species: "Boa Constrictor", count: 7 },
  { species: "King Snake", count: 5 },

];

const PopularProductsCard = () => {
  return (
        <Card className="dark:text-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Popular Snake Species</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {products.map((snake) => (
          <div key={snake.species} className="flex justify-between">
            <span>{snake.species}</span>
            <span className="font-semibold">
              {snake.count} sold
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PopularProductsCard;
