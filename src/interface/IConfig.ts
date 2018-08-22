
export interface ITemplate {
  name: string;
  path: string;
  engine: string;
  input: string;
  contentPath: string;
}

export interface IConfig {
  validatorPath: string;
  templates: ITemplate[];
}
