import {
  matchPath,
  Redirect,
  Route,
  useLocation,
  RouteComponentProps,
} from 'react-router-dom';
import {
  IonIcon,
  IonLabel,
  IonLoading,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { construct, logoOctocat, map } from 'ionicons/icons';
import {
  CAT_ROUTE,
  MAP_ROUTE,
  ADMIN_ROUTE,
  BROADCAST_ANNOUNCEMENT_ROUTE,
  REQUEST_LOCATION_ROUTE,
  EDIT_CATS_ROUTE,
  CHANGE_PASSWORD_ROUTE,
  CHANGE_USERNAME_ROUTE,
  PROFILE_ROUTE,
  PROFILE_SETTINGS_ROUTE,
  CHANGE_NAME_DP_ROUTE,
  ROOT_ROUTE,
  ALERT_CATS_ROUTE,
  SETUP_PROFILE_ROUTE,
  SIGNIN_ROUTE,
  SIGNUP_ROUTE,
  EMAIL_CONFIRM_ROUTE,
  FORGET_PASSWORD_ROUTE,
  PASSWORD_RESET_ROUTE,
  RESEND_EMAIL_ROUTE,
  SIGHTING_ROUTE,
} from 'app/routes';
import useAuth from 'hooks/useAuth';
import { RoleType } from '@api/users';
import PrivateRoute from 'components/PrivateRoute';
import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';

import CatDetailPage from './CatDetailPage';
// import HomeTab from './HomeTab';
import CatsTab from './CatsTab';
import Admin from './Admin';
import Signup from './Signup';
import Signin from './Signin';
import EditCatsList from './EditCatsList';
import RequestLocation from './RequestLocation';
import BroadcastAnnouncement from './BroadcastAnnouncement';
import ChangePassword from './ChangePassword';
import ChangeUsername from './ChangeUsername';
import SetupProfile from './SetupProfile';
import Profile from './Profile';
import Settings from './Settings';
import ChangeNameAndDp from './ChangeNameAndDp';
import AdminCatAlert from './AdminCatAlert';
import EmailConfirmationPage from './EmailConfirmation';
import ForgetPasswordPage from './ForgetPassword';
import ResendConfirmationPage from './ResendConfirmation';
import ResetPasswordPage from './ResetPassword';
import SightingPage from './SightingPage';

const HomeTab = lazy(() => import('./HomeTab'));
interface TabInfo {
  href: string;
  label: string;
  icon: string;
}

/**
 * List of routes that should have tabs hidden
 *
 * Rationale: Navigating to outer navigator is laggy
 */
const SHOULD_HIDE_TABS = [
  { path: `${CAT_ROUTE}/:id`, exact: true, strict: false },
  { path: SIGNUP_ROUTE, exact: true, strict: false },
  { path: SIGNIN_ROUTE, exact: true, strict: false },
  { path: SETUP_PROFILE_ROUTE, exact: true, strict: false },
  { path: RESEND_EMAIL_ROUTE, exact: true, strict: false },
  { path: EMAIL_CONFIRM_ROUTE, exact: true, strict: false },
  { path: PASSWORD_RESET_ROUTE, exact: true, strict: false },
  { path: FORGET_PASSWORD_ROUTE, exact: true, strict: false },
];

const Tabs: React.FC = () => {
  const [showTabs, setShowTabs] = useState(true);
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const shouldHide = SHOULD_HIDE_TABS.reduce(
      (accum, route) => accum || matchPath(location.pathname, route) !== null,
      false,
    );

    if (shouldHide) {
      setShowTabs(false);
      return () => setShowTabs(true);
    }
  }, [location]);

  const isAdmin: boolean = useMemo(
    () => user?.roles?.includes(RoleType.Admin) || false,
    [user?.roles],
  );

  const tabs: TabInfo[] = useMemo(() => {
    const adminTab = {
      href: ADMIN_ROUTE,
      label: 'Admin',
      icon: construct,
    };
    const mapTab = {
      href: MAP_ROUTE,
      label: 'Home',
      icon: map,
    };
    const catsTab = {
      href: CAT_ROUTE,
      label: 'Cats',
      icon: logoOctocat,
    };

    if (isAdmin) {
      return [mapTab, catsTab, adminTab];
    } else {
      return [mapTab, catsTab];
    }
  }, [isAdmin]);

  let tabStyle = showTabs ? undefined : { display: 'none' };

  return (
    <IonPage>
      <Suspense
        fallback={
          <IonLoading
            isOpen={true}
            message={'Loading...'}
            showBackdrop={true}
          />
        }
      >
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path={MAP_ROUTE}>
              <HomeTab />
            </Route>
            <Route exact path={CAT_ROUTE}>
              <CatsTab />
            </Route>
            <Route path={`${CAT_ROUTE}/:id(\\d+)`} component={CatDetailPage} />
            <Route path={`${SIGHTING_ROUTE}/:id`} component={SightingPage} />
            <Route exact path={SIGNUP_ROUTE} component={Signup} />
            <Route exact path={SIGNIN_ROUTE} component={Signin} />
            <Route exact path={SETUP_PROFILE_ROUTE} component={SetupProfile} />
            <Route
              exact
              path={RESEND_EMAIL_ROUTE}
              component={ResendConfirmationPage}
            />
            <Route
              exact
              path={EMAIL_CONFIRM_ROUTE}
              component={EmailConfirmationPage}
            />
            <Route
              exact
              path={PASSWORD_RESET_ROUTE}
              component={ResetPasswordPage}
            />
            <Route
              exact
              path={FORGET_PASSWORD_ROUTE}
              component={ForgetPasswordPage}
            />
            <Route exact path={PROFILE_ROUTE} component={Profile} />
            <Route exact path={PROFILE_SETTINGS_ROUTE} component={Settings} />
            <PrivateRoute
              exact
              path={ADMIN_ROUTE}
              component={Admin}
              canRoute={isAdmin}
              elseRedirectTo={MAP_ROUTE}
            />
            <PrivateRoute
              exact
              path={BROADCAST_ANNOUNCEMENT_ROUTE}
              component={BroadcastAnnouncement}
              canRoute={isAdmin}
              elseRedirectTo={MAP_ROUTE}
            />
            <PrivateRoute
              exact
              path={REQUEST_LOCATION_ROUTE}
              component={RequestLocation}
              canRoute={isAdmin}
              elseRedirectTo={MAP_ROUTE}
            />
            <PrivateRoute
              exact
              path={EDIT_CATS_ROUTE}
              component={EditCatsList}
              canRoute={isAdmin}
              elseRedirectTo={MAP_ROUTE}
            />
            <PrivateRoute
              exact
              path={ALERT_CATS_ROUTE}
              component={AdminCatAlert}
              canRoute={isAdmin}
              elseRedirectTo={MAP_ROUTE}
            />
            <PrivateRoute
              exact
              path={PROFILE_SETTINGS_ROUTE}
              component={Settings}
              canRoute={isLoggedIn}
              elseRedirectTo={MAP_ROUTE}
            />
            <PrivateRoute
              exact
              path={CHANGE_USERNAME_ROUTE}
              component={ChangeUsername}
              canRoute={isLoggedIn}
              elseRedirectTo={MAP_ROUTE}
            />
            <PrivateRoute
              exact
              path={CHANGE_PASSWORD_ROUTE}
              component={ChangePassword}
              canRoute={isLoggedIn}
              elseRedirectTo={MAP_ROUTE}
            />
            <PrivateRoute
              exact
              path={CHANGE_NAME_DP_ROUTE}
              component={ChangeNameAndDp}
              canRoute={isLoggedIn}
              elseRedirectTo={MAP_ROUTE}
            />
            <Route exact path={ROOT_ROUTE}>
              <Redirect to={MAP_ROUTE} />
            </Route>
            <Route component={React.memo(RedirectHelper)} />
          </IonRouterOutlet>

          <IonTabBar slot="bottom" className="py-2" style={tabStyle}>
            {tabs.map((tab, idx) => (
              <IonTabButton key={idx} tab={`tab-${idx}`} href={tab.href}>
                <IonIcon icon={tab.icon} />
                <IonLabel className="font-semibold tracking-wide">
                  {tab.label}
                </IonLabel>
              </IonTabButton>
            ))}
          </IonTabBar>
        </IonTabs>
      </Suspense>
    </IonPage>
  );
};

const isOuterRoute = (path: string) =>
  !matchPath(path, {
    path: ROOT_ROUTE,
    exact: false,
  });

const RedirectHelper: React.FC<RouteComponentProps> = ({ location }) => {
  if (isOuterRoute(location.pathname)) {
    return <Redirect to={location.pathname} />;
  }
  return <Redirect to={MAP_ROUTE} />;
};

export default Tabs;
