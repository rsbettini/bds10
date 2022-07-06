import jwtDecode from 'jwt-decode';
import { getAuthData, removeAuthData } from './storage';
import { requestBackend } from './request';
import { AxiosRequestConfig } from 'axios';

export type Role = 'ROLE_VISITOR' | 'ROLE_MEMBER';

export type TokenData = {
  exp: number;
  user_name: string;
  authorities: Role[];
};

export const getTokenData = (): TokenData | undefined => {
  try {
    return jwtDecode(getAuthData().access_token) as TokenData;
  } catch (error) {
    return undefined;
  }
};

export const isAuthenticated = (): boolean => {
  const tokenData = getTokenData();

  if (tokenData) {
    const params: AxiosRequestConfig = {
      method: 'GET',
      url: `/users/${tokenData.user_name}`,
      withCredentials: true,
    };

    requestBackend(params).then((response) => {
      if (response.data === false) {
        removeAuthData();
        return false;
      }
    });

    return tokenData.exp * 1000 > Date.now() ? true : false;
  }
  return false;
};

export const hasAnyRoles = (roles: Role[]): boolean => {
  if (roles.length === 0) {
    return true;
  }
  const tokenData = getTokenData();

  if (tokenData !== undefined) {
    return roles.some((role) => tokenData.authorities.includes(role));
  }

  return false;
};
