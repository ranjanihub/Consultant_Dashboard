import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AppLayout } from '@/components/layout';

import Login from '@/pages/login';

import Dashboard from '@/pages/dashboard';
import Clients from '@/pages/clients';
import ClientDetail from '@/pages/client-detail';
import Calendar from '@/pages/calendar';
import Outcomes from '@/pages/outcomes';
import Revenue from '@/pages/revenue';
import Reviews from '@/pages/reviews';
import Resources from '@/pages/resources';
import Messages from '@/pages/messages';
import Blog from '@/pages/blog';
import HtmlChunkPages from '@/pages/html-chunk-pages';
import HtmlChunkEditor from '@/pages/html-chunk-editor';
import PublicHtmlChunkPage from '@/pages/public-html-chunk-page';
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
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/p/:slug" component={PublicHtmlChunkPage} />
      <Route>
        {() => (
          <AppLayout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/clients" component={Clients} />
              <Route path="/clients/:id" component={ClientDetail} />
              <Route path="/calendar" component={Calendar} />
              <Route path="/messages" component={Messages} />
              <Route path="/outcomes" component={Outcomes} />
              <Route path="/revenue" component={Revenue} />
              <Route path="/reviews" component={Reviews} />
              <Route path="/resources" component={Resources} />
              <Route path="/blog" component={Blog} />
              <Route path="/html-chunk-pages" component={HtmlChunkPages} />
              <Route path="/html-chunk-pages/new" component={HtmlChunkEditor} />
              <Route path="/html-chunk-pages/:id/edit" component={HtmlChunkEditor} />
              <Route path="/profile" component={Profile} />
              <Route path="/settings" component={Settings} />
              <Route component={NotFound} />
            </Switch>
          </AppLayout>
        )}
      </Route>
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
