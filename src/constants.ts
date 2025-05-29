export enum ApiTagsEnum {
  Auth = 'auth',
  CloudStorage = 'cloud-storage',
  Notification = 'notification',
  Example = 'example',
}

export const ApiDescriptions: Record<ApiTagsEnum, string> = {
  example: 'Example generation',
  auth: 'Authentication',
  'cloud-storage': 'Cloud Storage',
  notification: 'Notification',
};
