export interface Category {
    _id: string;
    title: string;
    alias?: string;
    parents?: [string];
    country_whitelist?: [string];
}