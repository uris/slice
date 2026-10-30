import { promptInputConfig } from '../configs/all-configs';
import { registerBenchConfig } from '../utils/registerBenchConfig';

registerBenchConfig(promptInputConfig);

export const promptInputBenchmarkConfig = promptInputConfig;
