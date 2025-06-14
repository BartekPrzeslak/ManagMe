export class ActiveProjectApi {
    private static KEY = "activeProjectId";

    static set(id: string){
        localStorage.setItem(this.KEY, id);

    }

    static get(): string | null {
        return localStorage.getItem(this.KEY);
    }
    
}