import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Article_Key {
  id: UUIDString;
  __typename?: 'Article_Key';
}

export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface GetUserData {
  user?: {
    id: UUIDString;
    username: string;
    email: string;
    bio?: string | null;
    profilePictureUrl?: string | null;
  } & User_Key;
}

export interface ListArticlesData {
  articles: ({
    id: UUIDString;
    title: string;
    content: string;
    publishedAt: TimestampString;
  } & Article_Key)[];
}

export interface SavedArticle_Key {
  userId: UUIDString;
  articleId: UUIDString;
  __typename?: 'SavedArticle_Key';
}

export interface UpdateArticleData {
  article_update?: Article_Key | null;
}

export interface UpdateArticleVariables {
  id: UUIDString;
  content?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface ListArticlesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListArticlesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListArticlesData, undefined>;
  operationName: string;
}
export const listArticlesRef: ListArticlesRef;

export function listArticles(): QueryPromise<ListArticlesData, undefined>;
export function listArticles(dc: DataConnect): QueryPromise<ListArticlesData, undefined>;

interface UpdateArticleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateArticleVariables): MutationRef<UpdateArticleData, UpdateArticleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateArticleVariables): MutationRef<UpdateArticleData, UpdateArticleVariables>;
  operationName: string;
}
export const updateArticleRef: UpdateArticleRef;

export function updateArticle(vars: UpdateArticleVariables): MutationPromise<UpdateArticleData, UpdateArticleVariables>;
export function updateArticle(dc: DataConnect, vars: UpdateArticleVariables): MutationPromise<UpdateArticleData, UpdateArticleVariables>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(): QueryPromise<GetUserData, undefined>;
export function getUser(dc: DataConnect): QueryPromise<GetUserData, undefined>;

