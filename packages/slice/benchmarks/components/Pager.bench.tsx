import { pagerConfig } from '../configs/all-configs';
import { registerBenchConfig } from '../utils/registerBenchConfig';

registerBenchConfig(pagerConfig);

export const pagerBenchmarkConfig = pagerConfig;
