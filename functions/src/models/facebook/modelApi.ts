export interface Pages {
    name: string;
    access_token: string;
    id: string;
}

export interface DataPages {
    data: Pages[];
}

export interface GenderAgeByPage {
    page_id: string,
    page_name: string,
    gender_age: GenderAge;
}

export interface GenderAge {
    [key: string]: number;
}

export interface DataGenderAge {
    data: GenderAgeValueArray[]
}

export interface GenderAgeValueArray {
    values: GenderAgeValue[]
}

export interface GenderAgeValue {
    value: GenderAge
}

export interface ResPageOverview {
    data: DataPageOverview[]
}

export interface DataPageOverview {
    name: string,
    values: [
        {
            value: number,
            end_time: string
        }
    ]
}

export interface ResPosts {
    data: DataPosts[]
}

export interface DataPosts {
    created_time: string,
    message: string,
    id: string,
    story: string
}

export interface PostReactions {
    reactions: {
        summary: {
            total_count: number;
        }
    }
}

export interface ResPostInsights {
    data: DataPostInsights[]
}

export interface DataPostInsights {
    name: string,
    values: [
        {
            value: number,
        }
    ]
}

export interface PostShares {
    share: {
        count: number
    }
}

