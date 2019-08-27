export interface IReply {
  commenterId: string;
  commenterName: string;
  content: string;
  commentedAt: Date;
}

export interface IComment {
  content: string;
  commenterId: string;
  commenterName: string;
  commentedAt: Date;
  replies: IReply;
}

export interface IImage {
  filename: string;
}

export interface IBlog {
  userId: string;
    userName: string;
    title: string;
    description: string;
    createdAt: Date;
    imageUrl: IImage;
    comments: IComment;
}
