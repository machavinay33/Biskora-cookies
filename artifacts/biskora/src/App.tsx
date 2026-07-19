import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import Home from '@/pages/home';
import ProductsPage from '@/pages/products';
import AboutPage from '@/pages/about';
import ServicesPage from '@/pages/services';
import ContactPage from '@/pages/contact';
import AdminLogin from '@/pages/admin/login';
import AdminDashboard from '@/pages/admin/dashboard';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
