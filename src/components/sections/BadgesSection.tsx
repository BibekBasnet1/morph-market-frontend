import {
  ShieldCheck,
  Truck,
  Headset,
  Star,
} from "lucide-react";

const BadgesSection = () => {
  const items = [
    {
      title: "Verified Sellers",
      subtitle: "100% Trusted",
      icon: ShieldCheck,
    },
    {
      title: "Safe Shipping",
      subtitle: "Live Arrival Guarantee",
      icon: Truck,
    },
    {
      title: "Expert Support",
      subtitle: "24/7 Help",
      icon: Headset,
    },
    {
      title: "Top Rated",
      subtitle: "4.9 Average",
      icon: Star,
    },
  ];

  return (
    <section className="border-y border-border dark:border-gray-600 bg-card dark:bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center justify-center text-center gap-3 dark:text-white"
              >
                <div className="bg-green-600 rounded-full p-2">
                <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BadgesSection;
