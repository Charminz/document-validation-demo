import axios from "axios";
import { NotificationManager } from "react-notifications";

type RequestProps = {
	url: string;
	method: string;
	data?: any;
}

const API: string = "http://fe-test.guardtime.com/";
const requestTimeout: number = 10000;

const mapDataToGetQuery = (data: {}): string => {
	return Object.entries(data).reduce(
		(query: string, [key, value]: [string, any], index: number
	): string => {
		if (index > 0) {
			return `${query}&${key}=${value}`;
		}
		return `${query}${key}=${value}`;
	}, "?");
}

const handleError = (error: any): Promise<any> => {
	if (error && error.message) {
		NotificationManager.error(error.message, "", 2000);
	}
	return Promise.reject(error);
}

export const makeRequest = ({ url, method, data }: RequestProps) => {
	const requestMethod : any = method.toUpperCase();

	if (method === 'GET') {
		const params: string = mapDataToGetQuery(data);

		return axios({
			url: API + url + params,
			method: requestMethod,
			timeout: requestTimeout
		}).catch(handleError);
	} else {
		return axios({
			url: API + url,
			method: requestMethod,
			data,
			timeout: requestTimeout
		}).catch(handleError)
	}
}