export enum ApiTagsEnum {
  Auth = 'auth',
  Example = 'example',
}

export const ApiDescriptions: Record<ApiTagsEnum, string> = {
  example: 'Example generation',
  auth: 'Authentication',
};
