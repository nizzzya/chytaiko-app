export type NetworkStatus = {
  isOnline: boolean;
};

type NetworkStatusListener = (status: NetworkStatus) => void;

/**
 * Phase 13.4 — Real offline detection
 *
 * @react-native-community/netinfo is not in package.json yet.
 * Do not install from this task. When added, wire NetInfo here and call
 * startNetworkStatusMonitoring() once from App.tsx (e.g. useEffect on mount).
 *
 * Install (manual): npx expo install @react-native-community/netinfo
 *
 * Mapping:
 * - isConnected === false → isOnline false
 * - isInternetReachable === false → isOnline false
 * - otherwise → isOnline true
 */
// import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

let currentStatus: NetworkStatus = { isOnline: true };

const listeners = new Set<NetworkStatusListener>();

let monitoringStarted = false;

// let netInfoUnsubscribe: (() => void) | null = null;

function applyNetworkStatus(isOnline: boolean): void {
  if (currentStatus.isOnline === isOnline) {
    return;
  }

  currentStatus = { isOnline };

  for (const listener of listeners) {
    listener(currentStatus);
  }
}

// function mapNetInfoToOnline(state: NetInfoState): boolean {
//   if (state.isConnected === false) {
//     return false;
//   }
//
//   if (state.isInternetReachable === false) {
//     return false;
//   }
//
//   return true;
// }

/**
 * Starts NetInfo subscription. No-op until dependency is installed and block below is enabled.
 */
export function startNetworkStatusMonitoring(): void {
  if (monitoringStarted) {
    return;
  }

  monitoringStarted = true;

  // TODO(13.4): Enable after @react-native-community/netinfo is installed:
  //
  // void NetInfo.fetch().then((state) => {
  //   applyNetworkStatus(mapNetInfoToOnline(state));
  // });
  //
  // netInfoUnsubscribe = NetInfo.addEventListener((state) => {
  //   applyNetworkStatus(mapNetInfoToOnline(state));
  // });
}

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
