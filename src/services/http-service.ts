import apiClient from "./api-client";

// This type is a union of two possible shapes for an entity's identity.
// It helps enforce that an entity must have one of these ID properties.
type EntityWithId = { id: number } | { _id: string };

class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll<T>() {
    const controller = new AbortController();
    const request = apiClient.get<T[]>(this.endpoint, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  delete(id: string | number) {
    return apiClient.delete(this.endpoint + "/" + id);
  }

  create<T>(entity: T) {
    return apiClient.post(this.endpoint, entity);
  }

  update<T extends EntityWithId>(entity: T) {
    // The 'in' operator checks for the property, and TypeScript is smart
    // enough to narrow down the type of 'entity' within each block.
    if ("_id" in entity) {
      return apiClient.patch(this.endpoint + "/" + entity._id, entity);
    }
    return apiClient.patch(this.endpoint + "/" + entity.id, entity);
  }
}

const create = (endpoint: string) => new HttpService(endpoint);

export default create;
