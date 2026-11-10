import { videoControllerConfig } from '../configs/all-configs';
import { registerBenchConfig } from '../utils/registerBenchConfig';

registerBenchConfig(videoControllerConfig);

export const videoControllerBenchmarkConfig = videoControllerConfig;
