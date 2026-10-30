import { toastConfig } from '../configs/all-configs';
import { registerBenchConfig } from '../utils/registerBenchConfig';

registerBenchConfig(toastConfig);

export const toastBenchmarkConfig = toastConfig;
