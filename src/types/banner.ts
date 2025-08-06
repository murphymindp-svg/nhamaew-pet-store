import { ApiResponse } from "./api";

export interface Banner {
    name: string;
    imageUrl: string;
}

export interface BannerData {
    name: string;
    imageUrl: string;
}

export interface BannerCategoryData {
    name: string;
    imageUrl: string;
    animalType: string;
}

export interface BannerAndCategoryData {
    bannerList: Banner[] | [];
    animalCategoryList: BannerCategoryData[];
}

export interface BannersAndCategoryResponse extends ApiResponse<Banner[]> { }
