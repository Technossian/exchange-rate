import {IRate} from './rates.model';
import {IHistoryLog} from './history.model';

export interface IApiResponse {
  success: boolean;
  count: number;
  rates: IRate[];
  history: IHistoryLog[];
}
