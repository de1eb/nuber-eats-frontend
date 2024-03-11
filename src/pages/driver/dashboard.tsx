import { useMutation, useSubscription } from "@apollo/client";
import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { graphql, useFragment } from "../../gql";
import { CookedOrderSubscription, TakeOrderMutation, TakeOrderMutationVariables } from "../../gql/graphql";

const COOKED_ORDER_SUBSCRIPTION = graphql(`
  subscription cookedOrder {
    cookedOrder {
      ...FullOrderParts
    }
  }
`);

const TAKE_ORDER_MUTATION = graphql(`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`);

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}
const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();

  const onSuccess = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => {
          console.log(status, results);
        }
      );
    }
  }, [driverCoords.lat, driverCoords.lng]);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };
  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#000",
          strokeOpacity: 1,
          strokeWeight: 5,
        },
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
          },
          destination: {
            location: new google.maps.LatLng(driverCoords.lat + 0.05, driverCoords.lat + 0.05),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };
  const defaultProps = {
    center: {
      lat: 36.58,
      lng: 125.95,
    },
    zoom: 16,
  };
  const { data: cookedOrderData } = useSubscription<CookedOrderSubscription>(COOKED_ORDER_SUBSCRIPTION);
  const cookedOrder = useFragment(FULL_ORDER_FRAGMENT, cookedOrderData?.cookedOrder);

  useEffect(() => {
    if (cookedOrder?.id) {
      makeRoute();
    }
  }, [cookedOrderData]);

  const navigate = useNavigate();
  const onCompleted = (data: TakeOrderMutation) => {
    if (data.takeOrder.ok) {
      navigate(`/home/orders/${cookedOrder?.id}`);
    }
  };
  const [takeOrderMutation] = useMutation<TakeOrderMutation, TakeOrderMutationVariables>(TAKE_ORDER_MUTATION, {
    onCompleted,
  });
  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };
  return (
    // Important! Always set the container height explicitly
    <div>
      <div className="overflow-hidden" style={{ height: "50vh", width: window.innerWidth }}>
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          draggable={true}
          bootstrapURLKeys={{ key: "AIzaSyAhhjSSE9axWLxS_auF5td_sM44t-F9u-w" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        ></GoogleMapReact>
      </div>
      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrder?.restaurant ? (
          <>
            <h1 className="text-center text-3xl font-medium">New Coocked Order</h1>
            <h1 className="text-center my8-3 text-2xl font-medium">Pick it up soon @ {cookedOrder.restaurant.name}</h1>
            <button onClick={() => triggerMutation(cookedOrder.id)} className="btn w-full block text-center mt-5">
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center text-3xl">No orders yet..</h1>
        )}
      </div>
    </div>
  );
};
