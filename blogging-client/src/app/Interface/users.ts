export interface IUsers {
  _id?: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  friends: IFriends;
}

export interface IFriends {
  friendName: string;
  friendId: string;
}
