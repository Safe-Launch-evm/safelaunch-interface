import { CommentType } from './../../types/index';
import client from '../client';
import { getCookieStorage } from '../cookie-storage';
import { unstable_noStore as noStore } from 'next/cache';

export const addComment = async (tokenId: string, data: object) => {
  noStore();
  try {
    const token = await getCookieStorage('auth_token');
    const comment = await client(`/token/comments/${tokenId}`, {
      token: token,
      formData: data
    });
    // console.log(comment);
    if (comment.code !== 200) {
      return null;
    }
    return comment;
  } catch (error) {
    return null;
  }
};

export type CommentsResponse = {
  error: boolean;
  data: string;
  code: number;
  result: CommentType[];
};

export const fetchTokenComments = async (tokenId: string): Promise<CommentType[]> => {
  noStore();
  try {
    const comments: CommentsResponse = await client(`/token/comments/${tokenId}`, {
      tag: 'comments'
    });

    if (comments.code !== 200) return [];
    return comments.result;
  } catch (error) {
    return [];
  }
};
