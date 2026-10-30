import { dotConfig } from '../configs/all-configs';
import { registerBenchConfig } from '../utils/registerBenchConfig';

registerBenchConfig(dotConfig);

export const dotBenchmarkConfig = dotConfig;
