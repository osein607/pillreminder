import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // .env에 설정한 URL
  withCredentials: true, // 필요 없으면 false로 해도 ok
});

// 요청/응답 인터셉터 필요한 경우 여기에 추가 가능
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
