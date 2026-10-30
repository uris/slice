import { overlayConfig } from '../configs/all-configs';
import { registerBenchConfig } from '../utils/registerBenchConfig';

registerBenchConfig(overlayConfig);

export const overlayBenchmarkConfig = overlayConfig;
