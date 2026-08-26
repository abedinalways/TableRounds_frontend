export interface SpecialtyTopic {
  topic_name: string;
  topic_img: string;
}

export interface Specialty {
  id?: string;
  _id?: string;
  specialty_name: string;
  specialty_banner_img: string;
  brand_img?: string;
  topics?: SpecialtyTopic[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SpecialtyListResponse {
  success: boolean;
  message: string;
  data: Specialty[];
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
