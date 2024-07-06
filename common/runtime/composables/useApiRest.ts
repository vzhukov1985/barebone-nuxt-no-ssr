import type { ErrorObject } from "../api/models/ErrorObject";
import type { ObjectStringKeyAnyValue } from "../types";
import { i18n } from "../utils/i18n";

export const useApiRest = <T>(
  url: string,
  options: ObjectStringKeyAnyValue = {},
) => {
  const responseType = options?.params?.responseType || "json";
  const { REST_API_URL } = useRuntimeConfig().public;

  return $fetch<T>(url, {
    baseURL: REST_API_URL as string,
    responseType,
    async onResponseError({ response }) {
      clearError();
      if (response.status === 400) {
        try {
          const d = response._data as ErrorObject;
          response._data = {
            ...d,
            error: d.code ? i18n.global.t(d.code) : d.error,
          };
        } catch (e) {
          /* empty */
        }
      }
    },
    ...options,
  });
};
