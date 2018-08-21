export interface IMaskConfig {
  name: string;
  path: string;
  engine: string;
  input: string;
  contentPath: string;
}

export interface IBootstrapConfig {
  validatorPath: string;
  masks: IMaskConfig[];
}
