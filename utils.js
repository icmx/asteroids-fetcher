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
