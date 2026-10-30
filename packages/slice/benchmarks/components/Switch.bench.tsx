import { switchConfig } from '../configs/all-configs';
import { registerBenchConfig } from '../utils/registerBenchConfig';

registerBenchConfig(switchConfig);

export const switchBenchmarkConfig = switchConfig;
