export interface IFriendRequest {
  user: string;
  requestTo: string;
  status: boolean;
  read: boolean;
  time: Date;
}
