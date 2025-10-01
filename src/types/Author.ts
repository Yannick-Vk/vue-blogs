export interface Author {
    id: string;
    name: string;
    description?: string;
    avatar?: {
        src: string;
    };
    to?: string;
    target?: string;
}