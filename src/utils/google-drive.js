import axios from 'axios';

import { BACKEND_URL } from '../config';

export const getGoogleAuthenticateUrl = async () => {
  const { data } = await axios.get(`${BACKEND_URL}/get-gdrive-auth-url`);
  return data.url;
}

export const sendGoogleAuthCodeToServer = async (code) => {
  console.log('code: ', code);
  const { data } = await axios.post(`${BACKEND_URL}/authorize`, {
    code
  });
  console.log('data: ', data);
}

export const saveFileToGoogleDrive = async (file) => {
  console.log('file: ', file);
  const { data } = await axios.post(`${BACKEND_URL}/files`, {
    file: file
  });

  console.log('data: ', data);
}

export const getConfigFileFromGoogleDrive = async () => {
  const { data } = await axios.get(`${BACKEND_URL}/files`);
  console.log('getConfigFileFromGoogleDrive data: ', data);
  if (data) {
    return data;
  }
  return null;
}