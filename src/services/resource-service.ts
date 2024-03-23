import { ResourceRepoUrl } from "@/const";
import urlJoin from "url-join";

export default class ResourceService {
  async fetchCategories(): Promise<ResourceCategory[]> {
    let url = urlJoin(ResourceRepoUrl, "categories.json");
    let res = await fetch(url);
    let categories: ResourceCategory[] = await res.json();

    categories.forEach((c, i) => {
      c.index = i;
    });

    return categories;
  }

  async fetchResources(path: string): Promise<Resource[]> {
    let url = urlJoin(ResourceRepoUrl, path, "resources.json");
    let res = await fetch(url);
    let resources: Resource[] = await res.json();

    resources.forEach((r, i) => {
      r.index = i;
      if (r.subtitlePath) {
        r.subtitlePath = urlJoin(ResourceRepoUrl, path, r.subtitlePath);
      }
    });

    return resources;
  }
}
