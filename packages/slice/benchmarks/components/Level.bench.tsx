import { levelConfig } from '../configs/all-configs';
import { registerBenchConfig } from '../utils/registerBenchConfig';

registerBenchConfig(levelConfig);

export const levelBenchmarkConfig = levelConfig;
