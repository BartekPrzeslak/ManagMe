import type { Project } from "@/models/Project";

export class ProjectApi {
  private static STORAGE_KEY = "projects";

  static getAll(): Project[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveAll(projects: Project[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }
 //crud
  static add(project: Project): void {
    const projects = this.getAll();
    projects.push(project);
    this.saveAll(projects);
  }

  static update(updated: Project): void {
    const projects = this.getAll().map(p => (p.id === updated.id ? updated : p));
    this.saveAll(projects);
  }

  static remove(id: string): void {
    const projects = this.getAll().filter(p => p.id !== id);
    this.saveAll(projects);
  }
}
