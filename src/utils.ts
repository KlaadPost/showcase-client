
/**
 * Retrieves the Anti-Forgery Token from the server-side rendered hidden input.
 * An Anti-Forgery Token is a security measure to protect against Cross-Site Request Forgery (CSRF) attacks.
 * It is used to verify that the authenticated user is the one making the request.
 * This function should be used in scenarios where an action requires a valid Anti-Forgery Token.
 *
 * @returns {Promise<string>} A Promise that resolves with the Anti-Forgery Token value.
 * @throws {Error} If the token input element is not found in the DOM.
 */
export const getAntiForgeryToken = async (): Promise<string> => {
    // Try to select the token input element
    const tokenInputElement = document.querySelector('input[name="__RequestVerificationToken"]') as HTMLInputElement;

    // If the element is found, resolve with its value; otherwise, reject
    if (tokenInputElement) {
        return tokenInputElement.value;
    } else {
        throw new Error("Token input element not found");
    }
};


export const getRecaptchaToken = async () => {
    return await grecaptcha.execute("6Lc_9TcpAAAAAIdlMq6r78wsWDrj6cELayKQWvw4", { action: 'submit' });
};

/**
 * Handles an HTTP request.
 *
 * @param {string} url - The URL for the request.
 * @param {string} method - The HTTP method (e.g., "GET", "POST").
 * @param {string} body - The request body.
 * @param {Record<string, string>} headers - The request headers.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response.
 */
export const handleRequest = async (url: string, method: string, body: string, headers: Record<string, string>) => {
    const response = await fetch(url, { method, headers, body });
    if (!response.ok) {
        const errorResponse: { [key: string]: string[] } = await response.json();
        throw new Error(Object.values(errorResponse).flatMap((errors: string[]) => errors).join(', '));
    }
    return response;
};