export interface TagQueryParams {
  skip?: string;
  limit?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface Tag {
  tagId: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description?: string;
  avatarId?: string;
  coverId?: string;
  isFavorited?: boolean;
}
