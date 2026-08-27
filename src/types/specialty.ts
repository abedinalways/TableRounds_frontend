export interface specialityTopic {
  topic_name: string;
  topic_img: string;
}

export interface speciality {
  id?: string;
  _id?: string;
  speciality_name: string;
  speciality_banner_img: string;
  brand_img?: string;
  topics?: specialityTopic[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface specialityListResponse {
  success: boolean;
  message: string;
  data: speciality[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
    next: string | null;
    previous: string | null;
  };
}

export interface TopicResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    is_active: boolean;
    topic_image: string;
    created_at: string;
    updated_at: string;
  };
}
