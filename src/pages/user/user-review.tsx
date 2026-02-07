import { useQuery } from "@tanstack/react-query";
import { BuyerView } from "../../../lib/api/buyerview";

const UserReviewPage = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['user-detail', userId],
    queryFn: async () => {
      const response = await BuyerView.getUserDetail(Number(userId));
      return response.data;
    },
    enabled: !!userId,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <div>Error loading user</div>;

  return (
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.email}</p>
      {/* Rest of your UI */}
    </div>
  );
};