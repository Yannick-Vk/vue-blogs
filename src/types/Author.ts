export interface Author {
    name: string;
    description?: string;
    avatar?: {
        src: string;
    };
    to?: string;
    target?: string;
}