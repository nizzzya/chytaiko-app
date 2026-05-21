export type NetworkStatus = {
  isOnline: boolean;
};

type NetworkStatusListener = (status: NetworkStatus) => void;

// TODO: Integrate @react-native-community/netinfo when dependency is added.
// Subscribe to NetInfo.addEventListener and map isConnected / isInternetReachable here.

let currentStatus: NetworkStatus = { isOnline: true };

const listeners = new Set<NetworkStatusListener>();

export function getNetworkStatus(): NetworkStatus {
  return currentStatus;
}

export function subscribeNetworkStatus(
  listener: NetworkStatusListener,
): () => void {
  listeners.add(listener);
  listener(currentStatus);

  return () => {
    listeners.delete(listener);
  };
}
