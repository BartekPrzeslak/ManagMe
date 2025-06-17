import type { Task } from "../models/Task";

export class TaskApi {
  private static STORAGE_KEY = "tasks";

  static getAll(): Task[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveAll(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  static add(task: Task): void {
    const tasks = this.getAll();
    tasks.push(task);
    this.saveAll(tasks);
  }

  static update(updated: Task): void {
    const tasks = this.getAll().map(t => (t.id === updated.id ? updated : t));
    this.saveAll(tasks);
  }

  static remove(id: string): void {
    const tasks = this.getAll().filter(t => t.id !== id);
    this.saveAll(tasks);
  }
}
