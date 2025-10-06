
export interface ResFollowersCount {
    elements: [DataFollowersCount]
}
export interface DataFollowersCount {
    followerCountsByGeoCountry: DataFollowersCountByCountry[]
}
export interface DataFollowersCountByCountry {
    geo: string,
    followerCounts: {
        organicFollowerCount: number,
        paidFollowerCount: number
    }
}

export interface ResDatacountry {
    results: DataCountryId
}

export interface DataCountryId {
    [key: string]: DataCountryValue
}

export interface DataCountryValue {
    defaultLocalizedName: {
        locale: {
            country: string;
            language: string;
        };
        value: string;
    };
    id: number;
}

export interface ResPageStats {
    elements: DataPageStats[]
}

export interface DataPageStats {
    totalPageStatistics: {
        views: {
            allPageViews: {
                pageViews: number,
                uniquePageViews: number
            }
        }
        clicks: {
            mobileCustomButtonClickCounts: [
                {
                    clicks: number
                }
            ],
            desktopCustomButtonClickCounts: [
                {
                    clicks: number
                }
            ]
        }
    }
    timeRange: {
        start: number
    }
}

export interface ResNewFollowers {
    elements: DataNewFollowers[]
}

export interface DataNewFollowers {
    followerGains: {
        organicFollowerGain: number,
        paidFollowerGain: number
    },
    timeRange: {
        start: number
    }
}

export interface ResTotalImpression {
    elements: DataTotalImpression[]
}

export interface DataTotalImpression {
    totalShareStatistics: {
        impressionCount: number
    },
    timeRange: {
        start: number
    }
}

export interface ResPosts {
    elements: DataPosts[]
}

export interface DataPosts {
    id: string,
    commentary: string,
    lifecycleState: string,
    publishedAt: number
}

export interface ResPostsImpression {
    elements: DataPostsImpression[]
}

export interface DataPostsImpression {
    ugcPost?: string,
    share?: string,
    totalShareStatistics?: {
        likeCount: number,
        commentCount: number,
        shareCount: number,
        clickCount: number,
        impressionCount: number
    }
}

