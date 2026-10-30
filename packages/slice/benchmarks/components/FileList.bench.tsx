import { fileListConfig } from '../configs/all-configs';
import { registerBenchConfig } from '../utils/registerBenchConfig';

registerBenchConfig(fileListConfig);

export const fileListBenchmarkConfig = fileListConfig;
