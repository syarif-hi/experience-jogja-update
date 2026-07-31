import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from '@/lib/ThemeContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import { CurrencyProvider } from '@/lib/CurrencyContext';
import Home from '@/pages/Home';
import Explore from '@/pages/Explore';
import Destinations from '@/pages/Destinations';
import EventsPage from '@/pages/EventsPage';
import TripPlanner from '@/pages/TripPlanner';
import EventDetail from '@/pages/EventDetail';
import DestinationDetail from '@/pages/DestinationDetail';
import News from '@/pages/News';
import ArticleDetail from '@/pages/ArticleDetail';
import Stays from '@/pages/Stays';
import StayDetail from '@/pages/StayDetail';
import VisitorInformation from '@/pages/VisitorInformation';
import DiscoverPageTemplate from '@/pages/DiscoverPageTemplate';
import Itineraries from '@/pages/Itineraries';
import ItineraryDetail from '@/pages/ItineraryDetail';
import ComingSoon from '@/pages/ComingSoon';
import PlanYourTripLanding from '@/pages/PlanYourTripLanding';
import BookExperienceLanding from '@/pages/BookExperienceLanding';
import DiscoverLanding from '@/pages/DiscoverLanding';
import ThingsToDoLanding from '@/pages/ThingsToDoLanding';
import DestinationsLanding from '@/pages/DestinationsLanding';
import AccountLayout from '@/pages/account/AccountLayout';
import AccountOverview from '@/pages/account/AccountOverview';
import NotificationPreferences from '@/pages/account/NotificationPreferences';
import ProfileSettings from '@/pages/account/ProfileSettings';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/destinations/:slug" element={<DestinationDetail />} />
      <Route path="/destinations/*" element={<DestinationsLanding />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:slug" element={<EventDetail />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:slug" element={<ArticleDetail />} />
      <Route path="/calendar" element={<Navigate to="/events" replace />} />
      <Route path="/plan-your-trip/*" element={<PlanYourTripLanding />} />
      <Route path="/book-experience/*" element={<BookExperienceLanding />} />
      <Route path="/things-to-do/*" element={<ThingsToDoLanding />} />
      <Route path="/discover/*" element={<DiscoverLanding />} />
      <Route path="/stays" element={<Stays />} />
      <Route path="/stays/:slug" element={<StayDetail />} />
      <Route path="/visitor-information/*" element={<VisitorInformation />} />
      <Route path="/itineraries" element={<Itineraries />} />
      <Route path="/itineraries/:slug" element={<ItineraryDetail />} />
      <Route path="/trip-planner" element={<TripPlanner />} />
      <Route path="/coming-soon" element={<ComingSoon />} />
      {/* Account panel (protected) */}
      <Route path="/account" element={<AccountLayout />}>
        <Route index element={<AccountOverview />} />
        <Route path="notifications" element={<NotificationPreferences />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>
      {/* Add your page Route elements here */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <Router>
                <ScrollToTop />
                <AuthenticatedApp />
              </Router>
              <Toaster />
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App