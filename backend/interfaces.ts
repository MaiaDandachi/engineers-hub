export interface IUser {
  id: string;
  userName: string;
  email: string;
  password: string;
}

export interface IPost {
  id: string;
  postUserInfo: Partial<IUser>;
  title: string;
  content: string;
  likesCount: number;
  commentsCount: number;
}

export interface ILikeObj {
  userId: string;
  postId: string;
}

export interface IComment {
  id: string;
  postId: string;
  text: string;
  createdAt: string;
  userId: string;
}
