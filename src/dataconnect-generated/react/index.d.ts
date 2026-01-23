import { CreateUserData, ListArticlesData, UpdateArticleData, UpdateArticleVariables, GetUserData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useListArticles(options?: useDataConnectQueryOptions<ListArticlesData>): UseDataConnectQueryResult<ListArticlesData, undefined>;
export function useListArticles(dc: DataConnect, options?: useDataConnectQueryOptions<ListArticlesData>): UseDataConnectQueryResult<ListArticlesData, undefined>;

export function useUpdateArticle(options?: useDataConnectMutationOptions<UpdateArticleData, FirebaseError, UpdateArticleVariables>): UseDataConnectMutationResult<UpdateArticleData, UpdateArticleVariables>;
export function useUpdateArticle(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateArticleData, FirebaseError, UpdateArticleVariables>): UseDataConnectMutationResult<UpdateArticleData, UpdateArticleVariables>;

export function useGetUser(options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
export function useGetUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
