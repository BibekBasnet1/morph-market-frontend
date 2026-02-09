import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BuyerView } from "../../lib/api/admin/buyer-view";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Spinner from "../../components/ui/spinner";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
  Store as StoreIcon,
  Clock,
  Globe
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "../../components/ui/textArea";
import toast from "react-hot-toast";

const BuyerReviewPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showConvertAction = searchParams.get('action') === 'convert';

  const [notes, setNotes] = useState("");

  const { data: userDetail, isLoading, isError } = useQuery({
    queryKey: ['user-detail', userId],
    queryFn: async () => {
      const response = await BuyerView.getUserDetail(Number(userId));
      return response.data;
    },
    enabled: !!userId,
  });

  const convertMutation = useMutation({
    mutationFn: (data: { userId: number; notes: string }) =>
      BuyerView.convertToSeller(data.userId, data.notes),
    onSuccess: () => {
      toast.success("User converted to seller successfully!");
      queryClient.invalidateQueries({ queryKey: ['buyers'] });
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
      navigate('/admin/buyers');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to convert user");
    },
  });

  const handleConvert = () => {
    if (!userId) return;
    convertMutation.mutate({ userId: Number(userId), notes });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !userDetail) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/admin/buyers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Buyers
          </Button>
        </div>
      </div>
    );
  }

  const hasStores = userDetail.stores && userDetail.stores.length > 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/buyers')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">User Review</h1>
            <p className="text-muted-foreground">
              Review user information and store applications
            </p>
          </div>
        </div>
      </div>

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-lg font-semibold">{userDetail.name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Username</label>
              <p className="text-lg font-semibold">@{userDetail.username}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <div className="flex items-center gap-2">
                <p className="text-lg">{userDetail.email}</p>
                <Badge variant={userDetail.email_verified ? "default" : "secondary"}>
                  {userDetail.email_verified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <p className="text-lg">{new Date(userDetail.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            {userDetail.region && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Region
                </label>
                <p className="text-lg">{userDetail.region.name}</p>
              </div>
            )}
            {userDetail.currency && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Currency</label>
                <p className="text-lg">{userDetail.currency.symbol} {userDetail.currency.name} ({userDetail.currency.code})</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Store Applications */}
      {hasStores ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <StoreIcon className="h-6 w-6" />
            Store Applications ({userDetail.stores.length})
          </h2>

          {userDetail.stores.map((store) => (
            <Card key={store.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{store.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={store.is_verified ? "default" : "secondary"}>
                      {store.is_verified ? "Verified" : "Pending"}
                    </Badge>
                    <Badge variant={store.is_active ? "default" : "destructive"}>
                      {store.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {store.is_draft && (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Basic Store Info */}
                <div>
                  <h4 className="font-semibold mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Brand Name
                      </label>
                      <p className="text-base">{store.brand_name}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Username</label>
                      <p className="text-base">@{store.username}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Store Email
                      </label>
                      <p className="text-base">{store.email}</p>
                    </div>
                    {store.phone && (
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </label>
                        <p className="text-base">{store.phone}</p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Shipping Type</label>
                      <Badge variant="outline" className="capitalize">{store.shipping_type.replace('_', ' ')}</Badge>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Contact Visibility</label>
                      <p className="text-base">{store.contact_visible ? "Public" : "Private"}</p>
                    </div>
                  </div>
                </div>

                {/* Store Description */}
                {store.about && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">About Store</h4>
                    <p className="text-sm text-muted-foreground">{store.about}</p>
                  </div>
                )}

                {/* Store Policy */}
                {store.policy && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Store Policy</h4>
                    <p className="text-sm text-muted-foreground">{store.policy}</p>
                  </div>
                )}

                {/* Store Address */}
                {store.address && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Store Address
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>{store.address.address_line_1}</p>
                      {store.address.address_line_2 && <p>{store.address.address_line_2}</p>}
                      <p>
                        {store.address.city}, {store.address.state?.name} {store.address.zip_code}
                      </p>
                      {store.address.country && <p>{store.address.country.name}</p>}
                    </div>
                  </div>
                )}

                {/* Store Hours */}
                {store.hours && store.hours.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Store Hours
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {store.hours.map((hour) => (
                        <div key={hour.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                          <span className="font-medium capitalize">{hour.day}</span>
                          {hour.is_open ? (
                            <span className="text-sm">
                              {hour.open_time} - {hour.close_time}
                            </span>
                          ) : (
                            <Badge variant="secondary">Closed</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Store Stats */}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Performance</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded bg-muted/30">
                      <p className="text-2xl font-bold">{store.rating}</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div className="text-center p-3 rounded bg-muted/30">
                      <p className="text-2xl font-bold">{store.total_sales}</p>
                      <p className="text-xs text-muted-foreground">Total Sales</p>
                    </div>
                    <div className="text-center p-3 rounded bg-muted/30">
                      <p className="text-2xl font-bold">{store.total_reviews}</p>
                      <p className="text-xs text-muted-foreground">Reviews</p>
                    </div>
                    <div className="text-center p-3 rounded bg-muted/30">
                      <p className="text-2xl font-bold">{store.products_count}</p>
                      <p className="text-xs text-muted-foreground">Products</p>
                    </div>
                  </div>
                </div>

                {/* Store Images */}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Store Media</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {store.logo && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Logo</label>
                        <img src={store.logo} alt="Store Logo" className="w-32 h-32 object-cover rounded border" />
                      </div>
                    )}
                    {store.cover_photo && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Cover Photo</label>
                        <img src={store.cover_photo} alt="Store Cover" className="w-full h-32 object-cover rounded border" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <StoreIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Store Applications</h3>
              <p className="text-muted-foreground">
                This user hasn't applied to become a seller yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Section */}
      {hasStores && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Notes (Optional)</label>
              <Textarea
                placeholder="Add any notes about this review..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleConvert}
                disabled={convertMutation.isPending}
                className="flex-1"
              >
                {convertMutation.isPending ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Converting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve & Convert to Seller
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm('Are you sure you want to reject this application?')) {
                    toast.error("Application rejected");
                  }
                }}
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Application
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuyerReviewPage;