import { Card, CardContent } from "../../components/ui/card";

const stats = [
  {
    label: "Total Revenue",
    value: "₹1,24,000",
    note: "+12% this month",
  },
  {
    label: "Active Listings",
    value: "18",
    note: "3 pending approval",
  },
  {
    label: "Orders Completed",
    value: "142",
    note: "Last 30 days",
  },
  {
    label: "Avg. Response Time",
    value: "2h",
    note: "Buyer messages",
  },
];

const SellerStatsCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-semibold mt-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.note}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SellerStatsCards;
