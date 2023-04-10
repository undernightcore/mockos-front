export interface ProjectInterface {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ForkedProjectInterface extends ProjectInterface {
  forkedProject: ProjectInterface | null;
}
