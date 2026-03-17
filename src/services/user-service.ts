import create from "./http-service";
import { Organization } from "./organization-service";

export interface User {
  _id: string;
  name: string;
  email: string;
  organizacion: Organization | string; // Can be a full object or just an ID string
  password?: string;
}

export default create('/usuarios');
