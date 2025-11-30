/**
 * @param {string} name
 * @returns {string}
 */
export const env = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`"${name}" environment variable is not defined`);
  }

  return value;
};

/**
 * @param {number} delay
 * @returns {Promise<void>}
 */
export const wait = (delay) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, delay);
  });
};

export class HttpClient {
  /**
   * @type {number}
   */
  #retries;

  /**
   * @type {number}
   */
  #timeout;

  /**
   * @type {number}
   */
  #backoff;

  /**
   * @param {object} options
   * @param {number=} options.retries
   * @param {number=} options.timeout
   * @param {number=} options.backoff
   */
  constructor(options = {}) {
    this.#retries = options.retries || 0;
    this.#timeout = options.timeout || 10_000;
    this.#backoff = options.backoff || 3_000;
  }

  /**
   * @template T
   *
   * @param {string} url
   * @returns {Promise<T>}
   */
  async get(url) {
    const retries = this.#retries;
    const timeout = this.#timeout;

    for (let i = 0; i < retries + 1; i++) {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(timeout),
        });

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: "${response.statusText}" on "${url}"`
          );
        }

        const data = await response.json();

        return data;
      } catch (error) {
        if (i < retries) {
          const attempt = i + 1;

          console.warn(
            `Attempt ${attempt}/${retries} failed for "${url}", retrying...`
          );

          await wait(this.#backoff);
        } else {
          throw error;
        }
      }
    }
  }
}
