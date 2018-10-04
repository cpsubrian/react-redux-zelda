/**
 * Generates simple random strings based on
 * Math.random.
 */
export const idgen = () => {
  return `${Math.random()}`.substr(2);
};
