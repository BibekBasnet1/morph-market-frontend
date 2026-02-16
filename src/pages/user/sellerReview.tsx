import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SellerView } from "../../lib/api/admin/sellerview";
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
  AlertCircle,
  Store as StoreIcon,
  Clock,
  Globe,
  UserMinus,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "../../components/ui/textArea";
import toast from "react-hot-toast";

const SellerReviewPage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [notes, setNotes] = useState("");

  const { data: sellerDetail, isLoading, isError } = useQuery({
    queryKey: ['seller-detail', sellerId],
    queryFn: async () => {
      const response = await SellerView.getSellerDetail(Number(sellerId));
      return response.data;
    },
    enabled: !!sellerId,
  });

  const revokeSellerMutation = useMutation({
    mutationFn: (data: { sellerId: number; reason: string; notes: string }) =>
      SellerView.revokeSellerRole(data.sellerId, data.reason, data.notes),
    onSuccess: () => {
      toast.success("Seller role revoked successfully!");
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
      navigate('/admin/sellers');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to revoke seller role");
    },
  });

  const updateStoreStatusMutation = useMutation({
    mutationFn: (data: { 
      sellerId: number; 
      storeId: number; 
      status: { is_active?: boolean; is_verified?: boolean; is_draft?: boolean };
      notes?: string;
    }) =>
      SellerView.updateStoreStatus(data.sellerId, data.storeId, data.status, data.notes),
    onSuccess: () => {
      toast.success("Store status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['seller-detail', sellerId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update store status");
    },
  });

  const handleRevokeRole = () => {
    if (!sellerId) return;
    
    const reason = prompt("Please enter the reason for revoking seller role:");
    
    if (!reason || !reason.trim()) {
      toast.error("Reason is required to revoke seller role");
      return;
    }

    if (confirm("Are you sure you want to revoke this seller's role? All stores will be deactivated.")) {
      revokeSellerMutation.mutate({ 
        sellerId: Number(sellerId), 
        reason: reason.trim(), 
        notes 
      });
    }
  };

  const handleUpdateStoreStatus = (storeId: number, status: { is_active?: boolean; is_verified?: boolean; is_draft?: boolean }) => {
    if (!sellerId) return;
    
    const action = status.is_verified ? "verify" : status.is_active ? "activate" : "deactivate";
    
    if (confirm(`Are you sure you want to ${action} this store?`)) {
      updateStoreStatusMutation.mutate({
        sellerId: Number(sellerId),
        storeId,
        status,
        notes
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !sellerDetail) {
    return (
      <div className="flex h-screen dark:text-white items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground dark:text-foreground">Seller Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The seller you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/admin/sellers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sellers
          </Button>
        </div>
      </div>
    );
  }

  const hasStores = sellerDetail.stores && sellerDetail.stores.length > 0;

  return (
    <div className="space-y-6 dark:text-gray-200 max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/sellers')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Seller Review</h1>
            <p className="text-muted-foreground">
              Review seller information and manage stores
            </p>
          </div>
        </div>
      </div>

      {/* User Information Card */}
      <Card className="bg-card dark:text-gray-200 dark:bg-card border-border dark:border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground dark:text-foreground">
            <User className="h-5 w-5" />
            Seller Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-lg font-semibold text-foreground dark:text-foreground">{sellerDetail.name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Username</label>
              <p className="text-lg font-semibold text-foreground dark:text-foreground">@{sellerDetail.username}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <div className="flex items-center gap-2">
                <p className="text-lg text-foreground dark:text-foreground">{sellerDetail.email}</p>
                <Badge variant={sellerDetail.email_verified ? "default" : "secondary"}>
                  {sellerDetail.email_verified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <p className="text-lg text-foreground dark:text-foreground">
                {new Date(sellerDetail.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {sellerDetail.region && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Region
                </label>
                <p className="text-lg text-foreground dark:text-foreground">{sellerDetail.region.name}</p>
              </div>
            )}
            {sellerDetail.currency && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Currency</label>
                <p className="text-lg text-foreground dark:text-foreground">
                  {sellerDetail.currency.symbol} {sellerDetail.currency.name} ({sellerDetail.currency.code})
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stores */}
      {hasStores ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground dark:text-foreground">
            <StoreIcon className="h-6 w-6" />
            Stores ({sellerDetail.stores.length})
          </h2>
          
          {sellerDetail.stores.map((store) => (
            <Card key={store.id} className="overflow-hidden bg-card dark:bg-card border-border dark:border-border">
              <CardHeader className="bg-muted/50 dark:bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-foreground dark:text-foreground">{store.name}</CardTitle>
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
                  <h4 className="font-semibold mb-3 text-foreground dark:text-foreground">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Brand Name
                      </label>
                      <p className="text-base text-foreground dark:text-foreground">{store.brand_name}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Username</label>
                      <p className="text-base text-foreground dark:text-foreground">@{store.username}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Store Email
                      </label>
                      <p className="text-base text-foreground dark:text-foreground">{store.email}</p>
                    </div>
                    {store.phone && (
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </label>
                        <p className="text-base text-foreground dark:text-foreground">{store.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Store Performance */}
                <div className="pt-4 border-t border-border dark:border-border">
                  <h4 className="font-semibold mb-3 text-foreground dark:text-foreground">Performance</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded bg-muted/30 dark:bg-muted/30">
                      <p className="text-2xl font-bold text-foreground dark:text-foreground">{store.rating}</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div className="text-center p-3 rounded bg-muted/30 dark:bg-muted/30">
                      <p className="text-2xl font-bold text-foreground dark:text-foreground">{store.total_sales}</p>
                      <p className="text-xs text-muted-foreground">Total Sales</p>
                    </div>
                    <div className="text-center p-3 rounded bg-muted/30 dark:bg-muted/30">
                      <p className="text-2xl font-bold text-foreground dark:text-foreground">{store.total_reviews}</p>
                      <p className="text-xs text-muted-foreground">Reviews</p>
                    </div>
                    <div className="text-center p-3 rounded bg-muted/30 dark:bg-muted/30">
                      <p className="text-2xl font-bold text-foreground dark:text-foreground">{store.inventories_count || 0}</p>
                      <p className="text-xs text-muted-foreground">Products</p>
                    </div>
                  </div>
                </div>

                {/* Store Actions */}
                <div className="pt-4 border-t border-border dark:border-border">
                  <h4 className="font-semibold mb-3 text-foreground dark:text-foreground">Store Management</h4>
                  <div className="flex gap-2 flex-wrap">
                    {!store.is_verified && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStoreStatus(store.id, { is_verified: true })}
                        disabled={updateStoreStatusMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verify Store
                      </Button>
                    )}
                    {store.is_active ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleUpdateStoreStatus(store.id, { is_active: false })}
                        disabled={updateStoreStatusMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateStoreStatus(store.id, { is_active: true })}
                        disabled={updateStoreStatusMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Activate
                      </Button>
                    )}
                  </div>
                </div>

                {/* Store Address */}
                {store.address && (
                  <div className="pt-4 border-t border-border dark:border-border">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground dark:text-foreground">
                      <MapPin className="h-4 w-4" />
                      Store Address
                    </h4>
                    <div className="space-y-2 text-sm text-foreground dark:text-foreground">
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
                  <div className="pt-4 border-t border-border dark:border-border">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground dark:text-foreground">
                      <Clock className="h-4 w-4" />
                      Store Hours
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {store.hours.map((hour) => (
                        <div key={hour.id} className="flex items-center justify-between p-2 rounded bg-muted/30 dark:bg-muted/30">
                          <span className="font-medium capitalize text-foreground dark:text-foreground">{hour.day}</span>
                          {hour.is_open ? (
                            <span className="text-sm text-foreground dark:text-foreground">
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card dark:bg-card border-border dark:border-border">
          <CardContent className="py-12">
            <div className="text-center">
              <StoreIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-foreground">No Stores</h3>
              <p className="text-muted-foreground">
                This seller doesn't have any stores yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Actions */}
      <Card className="bg-card dark:bg-card border-border dark:border-border">
        <CardHeader>
          <CardTitle className="text-foreground dark:text-foreground">Admin Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-foreground">Admin Notes (Optional)</label>
            <Textarea
              placeholder="Add any notes about this seller..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={handleRevokeRole}
              disabled={revokeSellerMutation.isPending}
            >
              {revokeSellerMutation.isPending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Revoking...
                </>
              ) : (
                <>
                  <UserMinus className="mr-2 h-4 w-4" />
                  Revoke Seller Role
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerReviewPage;