import { ResourceRepoUrl } from "@/const";

export default class ResourceService {
  async fetchCategories(): Promise<ResourceCategory[]> {
    let res = await fetch(`${ResourceRepoUrl}/categories.json`);
    let categories: ResourceCategory[] = await res.json();

    categories.forEach((c, i) => {
      c.index = i;
    });

    return categories;
  }

  async fetchResources(path: string): Promise<Resource[]> {
    let res = await fetch(`${ResourceRepoUrl}/${path}/resources.json`);
    let resources: Resource[] = await res.json();

    resources.forEach((r, i) => {
      r.index = i;
      if (r.subtitlePath) {
        r.subtitlePath = path + r.subtitlePath;
      }
    });

    return resources;
  }
}
