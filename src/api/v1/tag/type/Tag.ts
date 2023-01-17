export interface Tag {
  title: string;
  tagPhoto?: string;
  tagCoverPhoto?: string;
}

export interface TagQueryParams {
  skip?: string;
  limit?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface TagResponse {
  tagId: string;
  createdAt: object;
  updatedAt: object;
  title: string;
  tagPhoto?: string;
  tagCoverPhoto?: string;
  albums?: [];
  // add artist
}
