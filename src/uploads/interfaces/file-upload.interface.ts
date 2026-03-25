import { FileTypes } from '../enums/file-types.enum';

export interface FileUpload {
  name: string;
  path: string;
  type: FileTypes;
  size: number;
  mime: string;
}
