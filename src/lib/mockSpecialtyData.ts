export interface Mockspeciality {
  id: string;
  name: string;
  banner: string;
  image?: string;
  is_active?: boolean;
  topics: Array<{ name: string; topic_img: string }>;
  topic_images?: string[];
}

const topicImageMap: Record<string, string[]> = {
  OMS: [
    '/images/speciality/img02.png',
    '/images/speciality/img01.png',
    '/images/speciality/img03.png',
    '/images/speciality/img04.png',
    '/images/speciality/img05.png',
    '/images/speciality/img06.png',
    '/images/speciality/img07.png',
    '/images/speciality/img08.png',
    '/images/speciality/img09.png',
    '/images/speciality/img10.png',
    '/images/speciality/img11.png',
  ],
  Dentistry: [
    '/images/speciality/img01.png',
    '/images/speciality/img02.png',
    '/images/speciality/img03.png',
    '/images/speciality/img04.png',
    '/images/speciality/img05.png',
  ],
  Medicine: [
    '/images/speciality/img06.png',
    '/images/speciality/img07.png',
    '/images/speciality/img08.png',
    '/images/speciality/img09.png',
    '/images/speciality/img10.png',
    '/images/speciality/img11.png',
  ],
};

export const mockSpecialties: Mockspeciality[] = [
  {
    id: '1',
    name: 'OMS',
    banner: '/images/osm/banner.png',
    image: '/images/osm/osm.png',
    is_active: true,
    topics: [
      { name: 'Anesthesia/Medicine', topic_img: '' },
      { name: 'Cancer', topic_img: '' },
      { name: 'Cleft/Craniofacial', topic_img: '' },
      { name: 'Cosmetics', topic_img: '' },
      { name: 'Dentoalveolar', topic_img: '' },
      { name: 'Implants', topic_img: '' },
      { name: 'Orthognathic', topic_img: '' },
      { name: 'Pathology', topic_img: '' },
      { name: 'Reconstruction', topic_img: '' },
      { name: 'TMJ', topic_img: '' },
      { name: 'Trauma', topic_img: '' },
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
      { name: 'Restorative', topic_img: '' },
      { name: 'Endodontics', topic_img: '' },
      { name: 'Periodontics', topic_img: '' },
      { name: 'Prosthodontics', topic_img: '' },
      { name: 'Pediatric Dentistry', topic_img: '' },
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
      { name: 'Cardiology', topic_img: '' },
      { name: 'Gastroenterology', topic_img: '' },
      { name: 'Neurology', topic_img: '' },
      { name: 'Pulmonology', topic_img: '' },
      { name: 'Rheumatology', topic_img: '' },
      { name: 'Infectious Disease', topic_img: '' },
    ],
    topic_images: topicImageMap.Medicine,
  },
];

let mockStore: Mockspeciality[] = [...mockSpecialties];

function toFrontendspeciality(data: Mockspeciality) {
  const topics = (data.topics || []).map((topic, index) => ({
    name: topic.name,
    topic_img: data.topic_images?.[index] || topic.topic_img || '',
  }));

  return {
    id: data.id,
    _id: undefined,
    name: data.name,
    speciality_banner_img: data.banner,
    brand_img: data.image,
    is_active: data.is_active,
    topics,
    total_topics: data.topics.length,
  };
}

export const mockspecialityService = {
  getAll: () => ({
    data: {
      data: mockStore.map(toFrontendspeciality),
      meta: { total: mockStore.length },
    },
  }),

  getByName: (name: string) => {
    if (!name) return { data: null };
    const normalized = name.toLowerCase().replace(/[\s-]+/g, '');
    const found = mockStore.find(
      s => s.name.toLowerCase().replace(/[\s-]+/g, '') === normalized,
    );
    if (found) {
      return { data: toFrontendspeciality(found) };
    }
    return { data: null };
  },

  getById: (id: string) => {
    const found = mockStore.find(s => s.id === id);
    if (found) {
      return { data: toFrontendspeciality(found) };
    }
    return { data: null };
  },

  create: (data: {
    name: string;
    speciality_banner_img: string;
    brand_img?: string;
    topics: { name: string; topic_img: string }[];
  }) => {
    const topics = (data.topics || []).map(topic => ({
      name: topic.name,
      topic_img: topic.topic_img,
    }));

    const newspeciality: Mockspeciality = {
      id: `mock-${Date.now()}`,
      name: data.name,
      banner: data.speciality_banner_img,
      image: data.brand_img,
      is_active: true,
      topics,
      topic_images: topics.map(t => t.topic_img),
    };
    mockStore = [...mockStore, newspeciality];
    return {
      data: { success: true, message: 'speciality created successfully' },
    };
  },

  update: (
    id: string,
    data: {
      name?: string;
      speciality_banner_img?: string;
      brand_img?: string;
      topics?: { name: string; topic_img: string }[];
    },
  ) => {
    const index = mockStore.findIndex(s => s.id === id);
    if (index >= 0) {
      const existing = mockStore[index];
      const updated: Mockspeciality = {
        ...existing,
        ...(data.name ? { name: data.name } : {}),
        ...(data.speciality_banner_img
          ? { banner: data.speciality_banner_img }
          : {}),
        ...(data.brand_img ? { image: data.brand_img } : {}),
        topics: data.topics
          ? data.topics.map(topic => ({
              name: topic.name,
              topic_img: topic.topic_img,
            }))
          : existing.topics,
        topic_images: data.topics
          ? data.topics.map(topic => topic.topic_img)
          : existing.topic_images,
      };
      mockStore = mockStore.map((s, i) => (i === index ? updated : s));
      return { data: toFrontendspeciality(updated) };
    }
    return { data: null };
  },

  delete: (id: string) => {
    mockStore = mockStore.filter(s => s.id !== id);
    return { data: { message: 'Deleted successfully' } };
  },

  addTopic: (
    specialityId: string,
    data: { name: string; is_active: boolean; topic_image?: string },
  ) => {
    const index = mockStore.findIndex(s => s.id === specialityId);
    if (index >= 0) {
      const speciality = mockStore[index];
      const newTopic = {
        name: data.name,
        topic_img: data.topic_image || '',
      };
      const updatedTopics = [...speciality.topics, newTopic];
      const updatedImages = [
        ...(speciality.topic_images || []),
        data.topic_image || '',
      ];
      mockStore[index] = {
        ...speciality,
        topics: updatedTopics,
        topic_images: updatedImages,
      };
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

  updateTopic: (
    topicId: string,
    data: { name?: string; is_active?: boolean; topic_image?: string },
  ) => {
    for (let i = 0; i < mockStore.length; i++) {
      const speciality = mockStore[i];
      const topicIndex = speciality.topics.findIndex(
        t => t.name === topicId,
      );
      if (topicIndex >= 0) {
        const updatedTopics = [...speciality.topics];
        updatedTopics[topicIndex] = {
          ...updatedTopics[topicIndex],
          ...(data.name ? { name: data.name } : {}),
        };
        const updatedImages = [...(speciality.topic_images || [])];
        if (data.topic_image !== undefined) {
          updatedImages[topicIndex] = data.topic_image;
        }
        mockStore[i] = {
          ...speciality,
          topics: updatedTopics,
          topic_images: updatedImages,
        };
        return {
          data: {
            success: true,
            message: 'Topic updated successfully',
            data: {
              id: topicId,
              name: data.name || updatedTopics[topicIndex].name,
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
      const speciality = mockStore[i];
      const topicIndex = speciality.topics.findIndex(
        t => t.name === topicId,
      );
      if (topicIndex >= 0) {
        const updatedTopics = speciality.topics.filter(
          (_, idx) => idx !== topicIndex,
        );
        const updatedImages =
          speciality.topic_images?.filter((_, idx) => idx !== topicIndex) || [];
        mockStore[i] = {
          ...speciality,
          topics: updatedTopics,
          topic_images: updatedImages,
        };
        return {
          data: { success: true, message: 'Topic deleted successfully' },
        };
      }
    }
    return { data: null };
  },

  reset: () => {
    mockStore = [...mockSpecialties];
  },
};
