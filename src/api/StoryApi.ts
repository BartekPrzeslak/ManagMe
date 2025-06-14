import type { Story } from '../models/Story';

export class StoryApi {
    private static STORAGE_KEY = "stories";

    static getAll(): Story[]{
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static saveAll(stories: Story[]) : void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    }

    static add(story: Story): void {
        const stories = this.getAll();
        stories.push(story);
        this.saveAll(stories);
    }

    static update(updated: Story): void {
        const stories = this.getAll().map(s => (s.id === updated.id ? updated : s));
        this.saveAll(stories);
    }

    static remove(id: string): void {
        const stories = this.getAll().filter(s => s.id !== id);
        this.saveAll(stories);
    }
}
