import { IActiveUserData } from '../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../constants/auth.constants';

declare global {
  namespace Express {
    interface Request {
      // Use the actual constant value or the string it represents
      [REQUEST_USER_KEY]?: IActiveUserData;
    }
  }
}
