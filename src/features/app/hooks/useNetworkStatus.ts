import { useEffect, useState } from 'react';

import {
  getNetworkStatus,
  subscribeNetworkStatus,
  type NetworkStatus,
} from '../services/networkStatusService';

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(getNetworkStatus);

  useEffect(() => subscribeNetworkStatus(setStatus), []);

  return status;
}
