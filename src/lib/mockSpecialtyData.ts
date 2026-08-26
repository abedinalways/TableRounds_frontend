
export interface MockSpecialty {
  id: string;
  name: string;
  banner: string;
  image?: string;
  is_active?: boolean;
  topics: Array<{ topic_name: string; topic_img: string }>;
  topic_images?: string[];
}

const topicImageMap: Record<string, string[]> = {
  OMS: [
    '/images/specialty/img02.png',
    '/images/specialty/img01.png',
    '/images/specialty/img03.png',
    '/images/specialty/img04.png',
    '/images/specialty/img05.png',
    '/images/specialty/img06.png',
    '/images/specialty/img07.png',
    '/images/specialty/img08.png',
    '/images/specialty/img09.png',
    '/images/specialty/img10.png',
    '/images/specialty/img11.png',
  ],
  Dentistry: [
    '/images/specialty/img01.png',
    '/images/specialty/img02.png',
    '/images/specialty/img03.png',
    '/images/specialty/img04.png',
    '/images/specialty/img05.png',
  ],
  Medicine: [
    '/images/specialty/img06.png',
    '/images/specialty/img07.png',
    '/images/specialty/img08.png',
    '/images/specialty/img09.png',
    '/images/specialty/img10.png',
    '/images/specialty/img11.png',
  ],
};

export const mockSpecialties: MockSpecialty[] = [
  {
    id: '1',
    name: 'OMS',
    banner: '/images/osm/banner.png',
    image: '/images/osm/osm.png',
    is_active: true,
    topics: [
      { topic_name: 'Anesthesia/Medicine', topic_img: '' },
      { topic_name: 'Cancer', topic_img: '' },
      { topic_name: 'Cleft/Craniofacial', topic_img: '' },
      { topic_name: 'Cosmetics', topic_img: '' },
      { topic_name: 'Dentoalveolar', topic_img: '' },
      { topic_name: 'Implants', topic_img: '' },
      { topic_name: 'Orthognathic', topic_img: '' },
      { topic_name: 'Pathology', topic_img: '' },
      { topic_name: 'Reconstruction', topic_img: '' },
      { topic_name: 'TMJ', topic_img: '' },
      { topic_name: 'Trauma', topic_img: '' },
    ],
    topic_images: topicImageMap.OMS,
  },
  {
    id: '2',
    name: 'Dentistry',
    banner: '/images/osm/banner.png',
    image: '/images/osm/osm.png',
    is_active: true,
    topics: [
      { topic_name: 'Restorative', topic_img: '' },
      { topic_name: 'Endodontics', topic_img: '' },
      { topic_name: 'Periodontics', topic_img: '' },
      { topic_name: 'Prosthodontics', topic_img: '' },
      { topic_name: 'Pediatric Dentistry', topic_img: '' },
    ],
    topic_images: topicImageMap.Dentistry,
  },
  {
    id: '3',
    name: 'Medicine',
    banner: '/images/osm/banner.png',
    image: '/images/osm/TR Emergency Medicine logo.png',
    is_active: true,
    topics: [
      { topic_name: 'Cardiology', topic_img: '' },
      { topic_name: 'Gastroenterology', topic_img: '' },
      { topic_name: 'Neurology', topic_img: '' },
      { topic_name: 'Pulmonology', topic_img: '' },
      { topic_name: 'Rheumatology', topic_img: '' },
      { topic_name: 'Infectious Disease', topic_img: '' },
    ],
    topic_images: topicImageMap.Medicine,
  },
];

let mockStore: MockSpecialty[] = [...mockSpecialties];

function toFrontendSpecialty(data: MockSpecialty) {
  const topics = (data.topics || []).map((topic, index) => ({
    topic_name: topic.topic_name,
    topic_img: data.topic_images?.[index] || topic.topic_img || '',
  }));

  return {
    id: data.id,
    _id: undefined,
    specialty_name: data.name,
    specialty_banner_img: data.banner,
    brand_img: data.image,
    is_active: data.is_active,
    topics,
  };
}

export const mockSpecialtyService = {
  getAll: () => ({
    data: {
      data: mockStore.map(toFrontendSpecialty),
      meta: { total: mockStore.length },
    },
  }),

  getByName: (name: string) => {
    if (!name) return { data: null };
    const normalized = name.toLowerCase().replace(/[\s-]+/g, '');
    const found = mockStore.find(
      (s) => s.name.toLowerCase().replace(/[\s-]+/g, '') === normalized,
    );
    if (found) {
      return { data: toFrontendSpecialty(found) };
    }
    return { data: null };
  },

  getById: (id: string) => {
    const found = mockStore.find((s) => s.id === id);
    if (found) {
      return { data: toFrontendSpecialty(found) };
    }
    return { data: null };
  },

  create: (data: { specialty_name: string; specialty_banner_img: string; brand_img?: string; topics: { topic_name: string; topic_img: string }[] }) => {
    const topics = (data.topics || []).map((topic) => ({
      topic_name: topic.topic_name,
      topic_img: topic.topic_img,
    }));

    const newSpecialty: MockSpecialty = {
      id: `mock-${Date.now()}`,
      name: data.specialty_name,
      banner: data.specialty_banner_img,
      image: data.brand_img,
      is_active: true,
      topics,
      topic_images: topics.map((t) => t.topic_img),
    };
    mockStore = [...mockStore, newSpecialty];
    return { data: { success: true, message: 'Specialty created successfully' } };
  },

  update: (id: string, data: { specialty_name?: string; specialty_banner_img?: string; brand_img?: string; topics?: { topic_name: string; topic_img: string }[] }) => {
    const index = mockStore.findIndex((s) => s.id === id);
    if (index >= 0) {
      const existing = mockStore[index];
      const updated: MockSpecialty = {
        ...existing,
        ...(data.specialty_name ? { name: data.specialty_name } : {}),
        ...(data.specialty_banner_img ? { banner: data.specialty_banner_img } : {}),
        ...(data.brand_img ? { image: data.brand_img } : {}),
        topics: data.topics
          ? data.topics.map((topic) => ({
              topic_name: topic.topic_name,
              topic_img: topic.topic_img,
            }))
          : existing.topics,
        topic_images: data.topics
          ? data.topics.map((topic) => topic.topic_img)
          : existing.topic_images,
      };
      mockStore = mockStore.map((s, i) => (i === index ? updated : s));
      return { data: toFrontendSpecialty(updated) };
    }
    return { data: null };
  },

  delete: (id: string) => {
    mockStore = mockStore.filter((s) => s.id !== id);
    return { data: { message: 'Deleted successfully' } };
  },

  addTopic: (specialtyId: string, data: { name: string; is_active: boolean; topic_image?: string }) => {
    const index = mockStore.findIndex((s) => s.id === specialtyId);
    if (index >= 0) {
      const specialty = mockStore[index];
      const newTopic = {
        topic_name: data.name,
        topic_img: data.topic_image || '',
      };
      const updatedTopics = [...specialty.topics, newTopic];
      const updatedImages = [...(specialty.topic_images || []), data.topic_image || ''];
      mockStore[index] = { ...specialty, topics: updatedTopics, topic_images: updatedImages };
      return {
        data: {
          success: true,
          message: 'Topic added successfully',
          data: {
            id: `mock-topic-${Date.now()}`,
            name: data.name,
            is_active: data.is_active,
            topic_image: data.topic_image || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
      };
    }
    return { data: null };
  },

  updateTopic: (topicId: string, data: { name?: string; is_active?: boolean; topic_image?: string }) => {
    for (let i = 0; i < mockStore.length; i++) {
      const specialty = mockStore[i];
      const topicIndex = specialty.topics.findIndex((t) => t.topic_name === topicId);
      if (topicIndex >= 0) {
        const updatedTopics = [...specialty.topics];
        updatedTopics[topicIndex] = {
          ...updatedTopics[topicIndex],
          ...(data.name ? { topic_name: data.name } : {}),
        };
        const updatedImages = [...(specialty.topic_images || [])];
        if (data.topic_image !== undefined) {
          updatedImages[topicIndex] = data.topic_image;
        }
        mockStore[i] = { ...specialty, topics: updatedTopics, topic_images: updatedImages };
        return {
          data: {
            success: true,
            message: 'Topic updated successfully',
            data: {
              id: topicId,
              name: data.name || updatedTopics[topicIndex].topic_name,
              is_active: data.is_active ?? true,
              topic_image: data.topic_image || updatedImages[topicIndex] || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
        };
      }
    }
    return { data: null };
  },

  deleteTopic: (topicId: string) => {
    for (let i = 0; i < mockStore.length; i++) {
      const specialty = mockStore[i];
      const topicIndex = specialty.topics.findIndex((t) => t.topic_name === topicId);
      if (topicIndex >= 0) {
        const updatedTopics = specialty.topics.filter((_, idx) => idx !== topicIndex);
        const updatedImages = specialty.topic_images?.filter((_, idx) => idx !== topicIndex) || [];
        mockStore[i] = { ...specialty, topics: updatedTopics, topic_images: updatedImages };
        return { data: { success: true, message: 'Topic deleted successfully' } };
      }
    }
    return { data: null };
  },

  reset: () => {
    mockStore = [...mockSpecialties];
  },
};
