import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card dark:bg-gray-900 border-t border-border dark:border-gray-700">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐍</span>
              <span className="font-serif text-lg font-bold text-foreground dark:text-white">
                SerpentMarket
              </span>
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              The trusted marketplace for exotic reptiles and snakes.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground dark:text-white mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
              <li>
                <Link
                  to="/marketplace"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Browse All
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=ball-python"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Ball Pythons
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=corn-snake"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Corn Snakes
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=boa"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Boas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground dark:text-white mb-4">
              For Sellers
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Start Selling
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Seller Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground dark:text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border dark:border-gray-700 mt-8 pt-8 text-center text-sm text-muted-foreground dark:text-gray-400">
          © 2024 SerpentMarket. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
