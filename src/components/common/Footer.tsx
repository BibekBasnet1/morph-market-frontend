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
                Huskey Exotics
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
                  Browse Marketplace
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Sign In
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
                <Link
                  to="/seller-agreement"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Seller Agreement
                </Link>
              </li>
              <li>
                <Link
                  to="/animal-liability-waiver"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Liability Waiver
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Terms for Sellers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground dark:text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
              <li>
                <Link
                  to="/terms"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/seller-agreement"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Seller Agreement
                </Link>
              </li>
              <li>
                <Link
                  to="/animal-liability-waiver"
                  className="hover:text-foreground dark:hover:text-white transition-colors"
                >
                  Liability Waiver
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border dark:border-gray-700 mt-8 pt-8 text-center text-sm text-muted-foreground dark:text-gray-400">
          © 2026 Huskey Exotics. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
