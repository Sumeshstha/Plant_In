export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  description: string;
  vitality: number;
  healthStatus: 'Healthy' | 'Needs Attention' | 'Excellent';
  light: string;
  watering: string;
  temp: string;
  habitat: 'Indoor' | 'Outdoor';
  tags?: string[];
  spaceId?: string;
}

export interface Task {
  id: string;
  type: 'water' | 'mist' | 'feed';
  title: string;
  subtitle: string;
  completed: boolean;
}

export interface Space {
  id: string;
  name: string;
  plantCount: number;
  status: 'Lush' | 'Stable' | 'Dry Soil';
  image: string;
  alert?: string;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  icon: string;
  color: string;
}
