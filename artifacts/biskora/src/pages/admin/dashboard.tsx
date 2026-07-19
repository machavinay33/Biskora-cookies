import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { 
  useGetAdminMe, 
  useGetAdminStats, 
  useAdminGetOrders, 
  useAdminUpdateOrder,
  useAdminGetProducts,
  useAdminUpdateProduct,
  useAdminGetIngredients,
  useAdminUpdateIngredient,
  useAdminLogout,
  getAdminGetOrdersQueryKey,
  getAdminGetProductsQueryKey,
  getAdminGetIngredientsQueryKey
} from '@workspace/api-client-react';
import { getAdminHeaders, clearAdminToken, formatPrice } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BiskoraLogo } from '@/components/ui/logo';
import { LogOut, Package, ShoppingBag, Leaf, LayoutDashboard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  const headers = getAdminHeaders() as any;

  // Auth Check
  const { data: me, isLoading: meLoading, isError: meError } = useGetAdminMe({ 
    query: { retry: false },
    request: { headers } 
  });

  useEffect(() => {
    if (meError || (!meLoading && !me)) {
      setLocation('/admin/login');
    }
  }, [me, meError, meLoading, setLocation]);

  const logoutMutation = useAdminLogout();
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        clearAdminToken();
        setLocation('/admin/login');
      }
    });
  };

  if (meLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!me) return null;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <BiskoraLogo className="h-10 w-32" showTagline={false} />
          <span className="text-muted-foreground font-sans text-sm tracking-widest uppercase border-l border-border pl-4">Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-sans text-sm text-primary">{me.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-card border border-border rounded-none p-1 w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="rounded-none font-sans uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><LayoutDashboard className="w-4 h-4 mr-2" /> Overview</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-none font-sans uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><ShoppingBag className="w-4 h-4 mr-2" /> Orders & Inquiries</TabsTrigger>
            <TabsTrigger value="products" className="rounded-none font-sans uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Package className="w-4 h-4 mr-2" /> Products</TabsTrigger>
            <TabsTrigger value="ingredients" className="rounded-none font-sans uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Leaf className="w-4 h-4 mr-2" /> Ingredients</TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="overview">
              <OverviewTab headers={headers} />
            </TabsContent>
            <TabsContent value="orders">
              <OrdersTab headers={headers} />
            </TabsContent>
            <TabsContent value="products">
              <ProductsTab headers={headers} />
            </TabsContent>
            <TabsContent value="ingredients">
              <IngredientsTab headers={headers} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

// Sub-components for tabs
function OverviewTab({ headers }: { headers: any }) {
  const { data: stats, isLoading } = useGetAdminStats({ request: { headers } });

  if (isLoading) return <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={<ShoppingBag />} />
      <StatCard title="New Orders" value={stats?.newOrders || 0} icon={<ShoppingBag className="text-secondary" />} highlight />
      <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={<Package />} />
      <StatCard title="Out of Stock Ingredients" value={stats?.outOfStockIngredients || 0} icon={<Leaf />} alert={stats?.outOfStockIngredients ? stats.outOfStockIngredients > 0 : false} />
    </div>
  );
}

function StatCard({ title, value, icon, highlight, alert }: any) {
  return (
    <div className={`p-6 border rounded-sm flex flex-col gap-4 ${alert ? 'bg-destructive/10 border-destructive' : highlight ? 'bg-secondary/10 border-secondary' : 'bg-card border-border'}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-sm uppercase tracking-widest text-muted-foreground">{title}</h3>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className={`font-serif text-5xl ${alert ? 'text-destructive' : highlight ? 'text-secondary' : 'text-primary'}`}>{value}</div>
    </div>
  );
}

function OrdersTab({ headers }: { headers: any }) {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useAdminGetOrders({ request: { headers }, query: { queryKey: getAdminGetOrdersQueryKey() } });
  const updateOrder = useAdminUpdateOrder({ request: { headers } });
  const { toast } = useToast();

  const handleStatusChange = (id: number, status: 'new' | 'read' | 'responded' | 'completed') => {
    updateOrder.mutate(
      { id, data: { status } },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(getAdminGetOrdersQueryKey(), (old: any) => 
            old?.map((o: any) => o.id === id ? { ...o, status: data.status } : o)
          );
          toast({ title: "Status updated" });
        }
      }
    );
  };

  if (isLoading) return <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />;

  return (
    <div className="bg-card border border-border overflow-hidden rounded-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-sans">
          <thead className="bg-muted text-muted-foreground uppercase tracking-wider text-xs border-b border-border">
            <tr>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Message</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders?.map(order => (
              <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                <td className="p-4 whitespace-nowrap text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="font-medium text-primary">{order.name}</div>
                  <div className="text-xs text-muted-foreground">{order.email}</div>
                  <div className="text-xs text-muted-foreground">{order.phone}</div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <Badge variant="outline" className="rounded-sm font-normal">{order.orderType}</Badge>
                </td>
                <td className="p-4 max-w-xs truncate text-muted-foreground" title={order.message}>
                  {order.message}
                </td>
                <td className="p-4 whitespace-nowrap">
                  <Badge 
                    className={`rounded-sm font-normal ${
                      order.status === 'new' ? 'bg-destructive text-white' : 
                      order.status === 'completed' ? 'bg-green-600 text-white' : 
                      'bg-secondary text-white'
                    }`}
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Select value={order.status} onValueChange={(v: any) => handleStatusChange(order.id, v)}>
                    <SelectTrigger className="w-[130px] ml-auto h-8 text-xs rounded-none border-border bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-border">
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="responded">Responded</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
            {orders?.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductsTab({ headers }: { headers: any }) {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useAdminGetProducts({ request: { headers }, query: { queryKey: getAdminGetProductsQueryKey() } });
  const updateProduct = useAdminUpdateProduct({ request: { headers } });
  const { toast } = useToast();

  const toggleAvailability = (id: number, current: boolean) => {
    updateProduct.mutate(
      { id, data: { isAvailable: !current } },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(getAdminGetProductsQueryKey(), (old: any) => 
            old?.map((p: any) => p.id === id ? { ...p, isAvailable: data.isAvailable } : p)
          );
          toast({ title: `Product marked as ${data.isAvailable ? 'Available' : 'Out of Stock'}` });
        }
      }
    );
  };

  if (isLoading) return <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products?.map(product => (
        <div key={product.id} className="bg-card border border-border p-4 flex flex-col gap-4">
          <div className="aspect-video bg-muted relative">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover opacity-80" />
            <Badge className="absolute top-2 right-2 rounded-sm bg-background text-primary border border-border">{product.category}</Badge>
          </div>
          <div>
            <h4 className="font-serif text-lg text-primary line-clamp-1">{product.name}</h4>
            <p className="font-sans text-sm text-muted-foreground">{formatPrice(product.price)}</p>
          </div>
          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <span className="font-sans text-sm text-muted-foreground">Available Online</span>
            <Switch 
              checked={product.isAvailable} 
              onCheckedChange={() => toggleAvailability(product.id, product.isAvailable)} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function IngredientsTab({ headers }: { headers: any }) {
  const queryClient = useQueryClient();
  const { data: ingredients, isLoading } = useAdminGetIngredients({ request: { headers }, query: { queryKey: getAdminGetIngredientsQueryKey() } });
  const updateIngredient = useAdminUpdateIngredient({ request: { headers } });
  const { toast } = useToast();

  const toggleStock = (id: number, current: boolean) => {
    updateIngredient.mutate(
      { id, data: { isInStock: !current } },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(getAdminGetIngredientsQueryKey(), (old: any) => 
            old?.map((i: any) => i.id === id ? { ...i, isInStock: data.isInStock } : i)
          );
          toast({ title: `Ingredient stock updated` });
        }
      }
    );
  };

  if (isLoading) return <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />;

  // Group ingredients by product ID for better display
  const grouped = ingredients?.reduce((acc: any, ing) => {
    if (!acc[ing.productId]) acc[ing.productId] = [];
    acc[ing.productId].push(ing);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped || {}).map(([productId, ings]: [string, any]) => (
        <div key={productId} className="bg-card border border-border p-6 rounded-sm">
          <h3 className="font-serif text-xl text-primary mb-4 pb-2 border-b border-border">Product ID: {productId} Ingredients</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ings.map((ing: any) => (
              <div key={ing.id} className="flex items-center justify-between p-3 bg-background border border-border">
                <span className="font-sans text-sm text-primary">{ing.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase tracking-wider font-bold ${ing.isInStock ? 'text-green-600' : 'text-destructive'}`}>
                    {ing.isInStock ? 'In Stock' : 'Out'}
                  </span>
                  <Switch 
                    checked={ing.isInStock} 
                    onCheckedChange={() => toggleStock(ing.id, ing.isInStock)} 
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
