import create from "./http-service";

export interface User {
  _id: string;
  name: string;
  email: string;
  organizacion: string;
}

export default create('/usuarios');
