import { useCallback, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonToolbar,
} from '@ionic/react';
import { list, refresh } from 'ionicons/icons';
import { FEED_ROUTE, MAP_ROUTE } from 'app/routes';
import { useLatestSightings } from 'hooks/useSightings';
import NavBar from 'components/NavBar';
import CatMap from 'components/map/CatMap';
import type { PinDetails } from 'components/map/CatMap';
import FeedList from 'components/FeedList';
import { QuerySightingOrderBy } from '@api/sightings';
import { useLocation, useHistory } from 'react-router';
import * as queryString from 'query-string';

type HomePageProps = {}

const HomeTab: React.FC<HomePageProps> = () => {

  // page setup
  const mapPage = "Map"
  const feedPage = "Feed"
  const [currPage, setCurrPage] = useState<string>(mapPage)

  const mapShown = currPage === mapPage
  const feedShown = currPage === feedPage

  // refresh sightings
  const { mutate, isLoading } = useLatestSightings();
  const [showFeedback, toggleFeedback] = useState(false);

  const refreshSightings = useCallback(() => {
    mutate();
    toggleFeedback(true);
    setTimeout(() => {
      toggleFeedback(false);
    }, 1000);
  }, [mutate, toggleFeedback])

  // change pin location if nagivated to via query string
  const location = useLocation()
  const history = useHistory()
  const [mapPinDetails, setMapPinDetails] = useState<PinDetails | undefined>()

  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.lat && query.lng) {
      setCurrPage(mapPage)
      setMapPinDetails({
        coords: [parseFloat(query.lng as string), parseFloat(query.lat as string)],
        tag: query.tag as string,
      })
    }
  }, [location?.search]);


  return (
    <IonPage>
      <NavBar title={currPage} >
        <IonButtons slot="start">
          <IonButton
            className={"w-12 " + (mapShown ? "opacity-100" : "opacity-0")}
            fill="clear"
            color="secondary"
            slot="start"
            size={'small'}
            onClick={refreshSightings}
            disabled={isLoading || feedShown}
          >
            {showFeedback && !isLoading ? (
              <IonSpinner name="circular" color="secondary" />
            ) : (
              <IonIcon slot="start" icon={refresh} />
            )}
          </IonButton>
        </IonButtons>
        <IonButtons slot="end">
          <IonButton
            fill="clear"
            color="secondary"
            slot="start"
            routerLink={FEED_ROUTE}
            routerDirection="forward"
            size={'small'}
          >
            <IonIcon slot="end" icon={list} />
          </IonButton>
        </IonButtons>

      </NavBar>
      <IonContent scrollY={false} className="relative">
        <IonToolbar color="light" className="absolute">
          <IonSegment
            color="dark"
            value={currPage}
            onIonChange={e => {
              setCurrPage(e.detail.value || mapPage)
              if (e.detail.value === feedPage) {
                history.replace(MAP_ROUTE)
              }
            }}
          >
            <IonSegmentButton value={mapPage}>
              <IonLabel>Map</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={feedPage}>
              <IonLabel>Feed</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        <div className={"absolute w-full top-11 h-map-content transform transition-all duration-200 "
          + (mapShown ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2/3 pointer-events-none")}>
          <CatMap pinDetails={mapPinDetails} />
        </div>
        <div className={"absolute w-full top-11 h-map-content transform transition-all duration-200 "
          + (feedShown ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2/3 pointer-events-none")}>
          <FeedList
            queryParams={{
              includeCatsData: true,
              includeOwnerData: true,
              orderBy: QuerySightingOrderBy.TIME,
            }}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomeTab;
