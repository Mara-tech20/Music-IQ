import { useAuth } from './context/AuthContext';
import { useGame } from './context/GameContext';
import CanvasBackground from './components/CanvasBackground';
import TopBar from './components/TopBar';
import Modals from './components/Modals';
import HomeView from './components/HomeView';
import GameplayView from './components/GameplayView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import AuthView from './components/AuthView';
import NotificationsView from './components/NotificationsView';
import PostGameView from './components/PostGameView';

function App() {
  const { currentUser } = useAuth();
  const { activeView }  = useGame();

  // Show auth screen if not logged in
  if (!currentUser) {
    return (
      <>
        <CanvasBackground />
        <AuthView />
      </>
    );
  }

  return (
    <>
      <CanvasBackground />
      <TopBar />
      <Modals />

      <main style={{
        position: 'relative',
        zIndex: 10,
        marginTop: 'var(--topbar-h)',
        minHeight: 'calc(100vh - var(--topbar-h))',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '24px',
        paddingBottom: '64px',
      }}>
        {activeView === 'home'     && <HomeView />}
        {activeView === 'gameplay' && <GameplayView />}
        {activeView === 'profile'  && <ProfileView />}
        {activeView === 'settings' && <SettingsView />}
        {activeView === 'notifications' && <NotificationsView />}
        {activeView === 'postgame' && <PostGameView />}
      </main>
    </>
  );
}

export default App;
