import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AppLayout } from '@/components/layout';

import Dashboard from '@/pages/dashboard';
import Clients from '@/pages/clients';
import ClientDetail from '@/pages/client-detail';
import Calendar from '@/pages/calendar';
import Outcomes from '@/pages/outcomes';
import Revenue from '@/pages/revenue';
import Reviews from '@/pages/reviews';
import Blog from '@/pages/blog';
import Profile from '@/pages/profile';
import Settings from '@/pages/settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: false,
    },
  },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/clients" component={Clients} />
        <Route path="/clients/:id" component={ClientDetail} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/outcomes" component={Outcomes} />
        <Route path="/revenue" component={Revenue} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/blog" component={Blog} />
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
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
