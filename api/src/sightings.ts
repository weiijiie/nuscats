import { Point } from "geojson";
import { Cat } from "./cats";

export enum SightingType {
  Emergency = "Emergency",
  CatSighted = "CatSighted",
}

export interface CatSighting {
  id: number;
  image: string; // url to image
  cat_id?: number; // id reference to cat
  cat?: Cat; // when viewing a particular sighting information
  location: Point;
  type: SightingType;
  description: string;
  owner_id?: string;
  created_at: Date;
  updated_at: Date;
}

export function makeSighting({
  id,
  image,
  cat_id = 0,
  cat = undefined,
  location,
  type,
  description = "",
}: {
  id: number;
  image: string;
  cat_id?: number;
  cat?: Cat | undefined;
  location: Point;
  type: SightingType;
  description?: string;
}): CatSighting {
  return {
    id: id,
    image: image,
    cat_id: cat_id,
    cat: cat,
    location: location,
    type: type,
    description: description,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export enum QuerySightingOrderBy {
  TIME = "time",
  LOCATION = "location",
}

export interface CatSightingQuery {
  //================ FILTERS ===================
  catIds?: number[];
  includeUnknownCats?: boolean;
  type?: SightingType;
  ownerIds?: string[];

  //================ ORDERING ===================
  orderBy?: QuerySightingOrderBy;
  location?: string;

  //================ PAGINATION ===================
  limit?: number;
  page?: number;
}

export interface CatSightingsResponse {
  items: CatSighting[];
  meta: PaginationMetadata;
  links: Links;
}

export interface Links {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface PaginationMetadata {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
