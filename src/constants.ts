export const CLIENT_PAYMENT_STATUSES_URL = 'https://gist.githubusercontent.com/anhzf/af04c99ac5ffa6c7b34c291a8b8cd662/raw/clients.json';

export const CLIENT_PAYMENT_STATUS_KEY = 'travel-fair';

export const RESOURCE_PREFIX = `guest-book/${import.meta.env.PROD ? 'PROD' : 'DEV'}/` as const;