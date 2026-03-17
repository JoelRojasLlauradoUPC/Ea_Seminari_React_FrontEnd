import create from "./http-service";

export interface Organization {
  _id: string;
  name: string;
}

export default create('/organizaciones');
