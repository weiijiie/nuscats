import {
    IonButton,
    IonButtons,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonListHeader,
    IonRouterLink,
    IonText,
    IonTitle,
    IonToolbar,
    useIonToast,
    useIonViewDidEnter,
    useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave,
} from '@ionic/react';
import {
    LANDING_ROUTE,
    PROFILE_ROUTE,
    SETUP_PROFILE_ROUTE,
    SIGNIN_ROUTE,
    SIGNUP_ROUTE,
} from 'app/routes';
import useAuth from 'hooks/useAuth';
import { useNotification } from 'hooks/useNotification';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { list, notifications, notificationsOff } from 'ionicons/icons';
import { logout } from 'lib/auth';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useHistory } from 'react-router';

type NavBarProps = {
    title: string;
};

const NavBar: React.FC<NavBarProps> = ({ title, children }) => {
    const { isLoggedIn, shouldCreateProfile, setLogout } = useAuth();
    const {
        canSubscribe,
        hasPermission,
        subscribe: subscribeNotification,
        unsubscribe: unsubscribeNotification,
    } = useNotification();
    const [showDropdown, setShowDropDown] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false)
    const dropdownRef = useRef(null);
    const location = useLocation();
    const history = useHistory();
    const [presentFeedback] = useIonToast();

    useEffect(() => {
        setShowDropDown(false)

        return () => setShowDropDown(false)
    }, [location])

    useOnClickOutside(dropdownRef, () => setShowDropDown(false));

    const handleLogout = useCallback(() => {
        return logout().finally(() => {
            setLogout();
            history.push(LANDING_ROUTE);
        });
    }, [setLogout, history]);

    useIonViewWillEnter(() => setIsAnimating(true));

    useIonViewDidEnter(() => setIsAnimating(false));

    useIonViewWillLeave(() => setIsAnimating(true));

    useIonViewDidLeave(() => setIsAnimating(false));

    const notificationMenuItem = useMemo(() => {
        if (!canSubscribe) {
            return null;
        }

        if (hasPermission) {
            return (
                <IonItem
                    lines="full"
                    detail={false}
                    button
                    onClick={() => unsubscribeNotification().then(() => {
                        presentFeedback({
                            message: 'Successfully unsubscribed from cat alerts',
                            duration: 3000,
                            position: 'top',
                        })
                    })}
                    className={'text-sm'}
                >
                    Notifications
                    <IonIcon
                        icon={notifications}
                        size={'small'}
                        slot={'end'}
                        color={'primary'}
                    />
                </IonItem>
            );
        } else {
            return (
                <IonItem
                    lines="full"
                    detail={false}
                    button
                    onClick={(() => subscribeNotification()
                        .then(() => presentFeedback({
                            message: 'Successfully subscribed to cat alerts',
                            duration: 3000,
                            position: 'top',
                          }))
                        .catch(console.log))}
                    className={'text-sm border-0'}
                >
                    Notifications
                    <IonIcon
                        icon={notificationsOff}
                        size={'small'}
                        slot={'end'}
                        color={'gray'}
                    />
                </IonItem>
            );
            }
        }, [canSubscribe, hasPermission]);

    return (
        <IonHeader translucent className="relative z-40">
            <IonToolbar>
                <IonTitle>{title}</IonTitle>
                {children}
                <IonButtons slot="end">
                    <IonButton
                        color="dark"
                        onClick={e => setShowDropDown(true)}
                        disabled={showDropdown}
                    >
                        <IonIcon icon={list} />
                    </IonButton>
                </IonButtons>
            </IonToolbar>
            <div className={"absolute z-50 h-auto top-12 w-44 right-3 transform transition-all "
                + (showDropdown ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-56 pointer-events-none")
                + (isAnimating ? " hidden" : "")
            }
                ref={dropdownRef}
            >
                <div className="absolute h-10 w-11 -top-11 -right-2" />
                <div className="border border-gray-200 shadow-md rounded-xl">
                    <IonList className="w-full h-full rounded-xl" lines="none">
                        <IonListHeader className="-mt-2 text-sm font-semibold text-primary-400">
                            Options
                        </IonListHeader>
                        {!isLoggedIn && (
                            <>
                                {notificationMenuItem}
                                <IonItem className="pointer-events-none" lines="full" detail={false} button>
                                    <IonRouterLink
                                        className="w-full text-sm pointer-events-auto"
                                        color="dark"
                                        routerLink={SIGNUP_ROUTE}
                                    >
                                        Sign Up
                                    </IonRouterLink>
                                </IonItem>
                                <IonItem className="pointer-events-none" lines="full" detail={false} button>
                                    <IonRouterLink
                                        className="w-full text-sm pointer-events-auto"
                                        color="dark"
                                        routerLink={SIGNIN_ROUTE}
                                    >
                                        Log In
                                    </IonRouterLink>
                                </IonItem>
                            </>
                        )}
                        {isLoggedIn && shouldCreateProfile && (
                            <>
                                <IonItem className="pointer-events-none" lines="full" detail={false} button>
                                    <IonRouterLink
                                        className="w-full text-sm pointer-events-auto"
                                        color="dark"
                                        routerLink={SETUP_PROFILE_ROUTE}>
                                        Setup Profile
                                    </IonRouterLink>
                                </IonItem>
                                {notificationMenuItem}
                                <IonItem className="pointer-events-none" lines="full" detail={false} button>
                                    <IonText
                                        className="w-full text-sm pointer-events-auto"
                                        color="dark"
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </IonText>
                                </IonItem>
                            </>
                        )}
                        {isLoggedIn && !shouldCreateProfile && (
                            <>
                                <IonItem className="pointer-events-none" lines="full" detail={false} button>
                                    <IonRouterLink
                                        className="w-full text-sm pointer-events-auto"
                                        color="dark"
                                        routerLink={PROFILE_ROUTE}
                                    >
                                        View Profile
                                    </IonRouterLink>
                                </IonItem>
                                {notificationMenuItem}
                                <IonItem className="pointer-events-none" lines="full" detail={false} button>
                                    <IonText
                                        className="w-full text-sm pointer-events-auto"
                                        color="dark"
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </IonText>
                                </IonItem>
                            </>
                        )}
                        <IonItem
                            lines="none"
                            detail={false}
                            button
                            onClick={() => setShowDropDown(false)}
                        >
                            <IonText className="text-sm">Close</IonText>
                        </IonItem>
                    </IonList>
                </div >
            </div >
        </IonHeader >
    );
};

export default NavBar;
