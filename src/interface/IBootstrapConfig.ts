export interface ITemplateConfig {
  name: string;
  path: string;
  engine: string;
  input: string;
  contentPath: string;
}

export interface IChannelConfig {
  validatorPath: string;
  templates: ITemplateConfig[];
}
