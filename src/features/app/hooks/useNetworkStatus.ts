import { useEffect, useState } from 'react';

import {
  getNetworkStatus,
  startNetworkStatusMonitoring,
  subscribeNetworkStatus,
  type NetworkStatus,
} from '../services/networkStatusService';

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(getNetworkStatus);

  useEffect(() => {
    startNetworkStatusMonitoring();
    return subscribeNetworkStatus(setStatus);
  }, []);

  return status;
}
