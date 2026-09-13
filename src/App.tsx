import Footer from "./Components/Footer";
import Header from "./Components/Header";
import NotificationToast from "./Components/Notifications/NotificationToast";
import CommunitySection from "./Components/Community/CommunitySection";
import OpportunitiesSection from "./Components/Opportunities/OpportunitiesSection";
import { useNotificationQueue } from "./hooks/useNotificationQueue";

export default function App() {
  const { current, notify, dismiss } = useNotificationQueue();

  return (
    <div className="app-root">
      <Header />
      <main className="app-shell">
        <CommunitySection notify={notify} />
        <OpportunitiesSection notify={notify} />
      </main>
      <Footer />
      <NotificationToast notification={current} onDismiss={dismiss} />
    </div>
  );
}
