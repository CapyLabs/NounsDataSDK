
export interface DataAPI {
    get(path: string): Promise<any>;
    post(path: string, body: any): Promise<void>;
}

export class DataAPIImplementation implements DataAPI {
    async get(path: string): Promise<any> {
        // implementation here
    }

    async post(path: string, body: any): Promise<void> {
        // implementation here
    }

    constructor() {

    }
}