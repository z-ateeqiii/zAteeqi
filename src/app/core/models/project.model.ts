export type ProjectStatus = 'live' | 'draft';

export interface Project {
  title: string;
  route: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  status: ProjectStatus;
  order: number;
}

export interface ProjectWithId extends Project {
  id: string;
}
