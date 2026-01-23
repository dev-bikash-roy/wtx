import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

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

/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function createUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;
/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function createUser(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;

/** Generated Node Admin SDK operation action function for the 'ListArticles' Query. Allow users to execute without passing in DataConnect. */
export function listArticles(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListArticlesData>>;
/** Generated Node Admin SDK operation action function for the 'ListArticles' Query. Allow users to pass in custom DataConnect instances. */
export function listArticles(options?: OperationOptions): Promise<ExecuteOperationResponse<ListArticlesData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateArticle' Mutation. Allow users to execute without passing in DataConnect. */
export function updateArticle(dc: DataConnect, vars: UpdateArticleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateArticleData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateArticle' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateArticle(vars: UpdateArticleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateArticleData>>;

/** Generated Node Admin SDK operation action function for the 'GetUser' Query. Allow users to execute without passing in DataConnect. */
export function getUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserData>>;
/** Generated Node Admin SDK operation action function for the 'GetUser' Query. Allow users to pass in custom DataConnect instances. */
export function getUser(options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserData>>;

