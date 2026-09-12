import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
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
import Assessments from '@/pages/assessments';
import Activities from '@/pages/activities';
import Messages from '@/pages/messages';

import Blog from '@/pages/blog';
import HtmlChunkPages from '@/pages/html-chunk-pages';
import HtmlChunkEditor from '@/pages/html-chunk-editor';
import PublicHtmlChunkPage from '@/pages/public-html-chunk-page';
import Profile from '@/pages/profile';
import { isAuthenticated } from '@/lib/auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: false,
    },
  },
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      if (!isAuth) {
        window.location.href = '/login?role=therapist';
      }
    };

    checkAuth();
    window.addEventListener('auth_state_change', checkAuth);
    return () => window.removeEventListener('auth_state_change', checkAuth);
  }, [setLocation]);

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}

function Router() {
  const [location] = useLocation();
  if (location === '/login') {
    window.location.href = '/login?role=therapist';
    return null;
  }

  return (
    <Switch>
      <Route path="/p/:slug" component={PublicHtmlChunkPage} />
      <Route>
        {() => (
          <AuthGuard>
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
                <Route path="/assessments" component={Assessments} />
                <Route path="/activities" component={Activities} />
                <Route path="/blog" component={Blog} />

                <Route path="/html-chunk-pages" component={HtmlChunkPages} />
                <Route path="/html-chunk-pages/new" component={HtmlChunkEditor} />
                <Route path="/html-chunk-pages/:id/edit" component={HtmlChunkEditor} />
                <Route path="/profile" component={Profile} />
                <Route component={NotFound} />
              </Switch>
            </AppLayout>
          </AuthGuard>
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
