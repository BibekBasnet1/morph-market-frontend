const SellerRecentActivity = () => {
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>

          {/* <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              Filter
            </button>

            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              See all
            </button>
          </div> */}
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-y border-gray-100 dark:border-gray-800">
              <tr>
                <th className="py-3 text-start text-theme-xs font-medium text-gray-500">
                  Animal / Reptile
                </th>
                <th className="py-3 text-start text-theme-xs font-medium text-gray-500">
                  Species Type
                </th>
                <th className="py-3 text-start text-theme-xs font-medium text-gray-500">
                  Price
                </th>
                <th className="py-3 text-start text-theme-xs font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {/* Row 1 */}
              <tr>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src="/images/animals/ball-python.jpg"
                        alt="Ball Python"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        Ghost Ball Python
                      </p>
                      <span className="text-theme-xs text-gray-500">
                        Captive Bred
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-theme-sm text-gray-500">Reptile</td>
                <td className="py-3 text-theme-sm text-gray-500">$32,000</td>
                <td className="py-3">
                  <span className="inline-flex rounded-full bg-success-50 px-2.5 py-0.5 text-theme-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
                    Delivered
                  </span>
                </td>
              </tr>

              {/* Row 2 */}
              <tr>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src="/images/animals/bearded-dragon.jpg"
                        alt="Bearded Dragon"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        Bearded Dragon
                      </p>
                      <span className="text-theme-xs text-gray-500">
                        Juvenile
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-theme-sm text-gray-500">Reptile</td>
                <td className="py-3 text-theme-sm text-gray-500">$18,500</td>
                <td className="py-3">
                  <span className="inline-flex rounded-full bg-warning-50 px-2.5 py-0.5 text-theme-xs font-medium text-warning-600 dark:bg-warning-500/15 dark:text-orange-400">
                    Pending
                  </span>
                </td>
              </tr>

              {/* Row 3 */}
              <tr>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src="/images/animals/african-grey.jpg"
                        alt="African Grey Parrot"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        African Grey Parrot
                      </p>
                      <span className="text-theme-xs text-gray-500">
                        Hand Tamed
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-theme-sm text-gray-500">Bird</td>
                <td className="py-3 text-theme-sm text-gray-500">$95,000</td>
                <td className="py-3">
                  <span className="inline-flex rounded-full bg-success-50 px-2.5 py-0.5 text-theme-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
                    Delivered
                  </span>
                </td>
              </tr>

              {/* Row 4 */}
              <tr>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src="/images/animals/leopard-gecko.jpg"
                        alt="Leopard Gecko"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        Leopard Gecko
                      </p>
                      <span className="text-theme-xs text-gray-500">
                        Albino Morph
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-theme-sm text-gray-500">Reptile</td>
                <td className="py-3 text-theme-sm text-gray-500">$12,000</td>
                <td className="py-3">
                  <span className="inline-flex rounded-full bg-error-50 px-2.5 py-0.5 text-theme-xs font-medium text-error-600 dark:bg-error-500/15 dark:text-error-500">
                    Canceled
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SellerRecentActivity;
