import fetch, { HeadersInit, Response } from 'node-fetch'; // Import fetch from node-fetch-extend
import { parseStringPromise } from 'xml2js';

interface SoapRequestOptions {
  url: string;
  headers: HeadersInit;
  xmlBody: string;
  timeout?: number;
}

export const soapRequest = async ({
  url,
  headers,
  xmlBody,
  timeout = 5000,
}: SoapRequestOptions): Promise<any> => {
  const requestHeaders: HeadersInit = {
    ...headers,
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  try {
    const response: Response = await fetch(url, {
      method: 'post',
      headers: requestHeaders,
      body: xmlBody,
     // Include the timeout option
    });

    const text: string = await response.text();
    const result: any = await parseStringPromise(text);

    return result;
  } catch (error) {
    // Handle errors, e.g., request timeout or network issues
    throw error;
  }
};