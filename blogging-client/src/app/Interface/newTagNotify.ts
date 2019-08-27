export interface ITagNotification {
  postId: string;
  taggedBy: string;
  taggedUsers: ITaggedUsers;
  userId: string;
  userName: string;
  friendId: string;
  friendName: string;
  time: Date;
}

export interface ITaggedUsers {
  userName: string;
  read: boolean;
}
