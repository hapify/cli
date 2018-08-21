export interface IMask {
  name: string;
  path: string;
  engine: string;
  input: string;
  contentPath: string;
  content?: string;
}

export interface IBootstrap {
  validatorPath: string;
  validator?: string;
  masks: IMask[];
}
