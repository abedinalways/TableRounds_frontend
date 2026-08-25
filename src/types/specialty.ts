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
}
