import { audioLevelConfig } from '../configs/all-configs';
import { registerBenchConfig } from '../utils/registerBenchConfig';

registerBenchConfig(audioLevelConfig);

export const audioLevelBenchmarkConfig = audioLevelConfig;
