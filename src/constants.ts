export enum ApiTagsEnum {
  Auth = 'Auth',
  Example = 'Example',
}

export const ApiDescriptions: Record<ApiTagsEnum, string> = {
  Example: 'Example generation',
  Auth: 'Authentication',
};
