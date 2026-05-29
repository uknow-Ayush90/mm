export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string;
  role: "USER" | "ADMIN";
  totalScore: number;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface MemeTag {
  tag: Tag;
}

export interface Vote {
  id: string;
  type: "UPVOTE" | "DOWNVOTE";
  userId: string;
}

export interface Comment {
  id: string;
  body: string;
  authorId: string;
  memeId: string;
  createdAt: string;
  author: Pick<User, "id" | "username" | "displayName" | "avatarColor">;
}

export interface Meme {
  id: string;
  title: string;
  imageUrl: string;
  publicId: string;
  upvotes: number;
  downvotes: number;
  score: number;
  isRemoved: boolean;
  authorId: string;
  createdAt: string;
  author: Pick<User, "id" | "username" | "displayName" | "avatarColor">;
  tags: MemeTag[];
  votes: Vote[];
  _count?: { comments: number; votes: number };
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string;
  totalScore: number;
  _count: { memes: number };
}

export type SortMode = "hot" | "new" | "top";

export interface LocalUser {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string;
}

// Desk Review types
export interface DeskTag {
  slug: string;
  name: string;
}

export interface DeskReviewTag {
  tag: DeskTag;
}

export interface DeskReviewVote {
  id: string;
  type: "UPVOTE" | "DOWNVOTE";
  userId: string;
}

export interface DeskReviewComment {
  id: string;
  body: string;
  authorId: string;
  deskReviewId: string;
  createdAt: string;
  author: Pick<User, "id" | "username" | "displayName" | "avatarColor">;
}

export interface DeskReview {
  id: string;
  title: string;
  imageUrl: string;
  publicId: string;
  upvotes: number;
  downvotes: number;
  score: number;
  isRemoved: boolean;
  authorId: string;
  createdAt: string;
  author: Pick<User, "id" | "username" | "displayName" | "avatarColor">;
  tags: DeskReviewTag[];
  votes: DeskReviewVote[];
  _count?: { comments: number; votes: number };
}

