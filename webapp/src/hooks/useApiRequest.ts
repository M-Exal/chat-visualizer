import { useCallback } from "react";
import { useNotifications } from "./useNotifications";

export function useApiRequest() {
	const { showError } = useNotifications();

	return useCallback(
		async <T>(
			url: string,
			options?: RequestInit,
			errorMsg?: string,
		): Promise<T | null> => {
			try {
				const res = await fetch(url, options);
				if (!res.ok) throw new Error();
				return await res.json();
			} catch (e) {
				console.error(e);
				if (errorMsg) showError(errorMsg);
				return null;
			}
		},
		[showError],
	);
}
