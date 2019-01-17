class DependencyError extends Error {
  name = 'DependencyError';

  constructor(message) {
    super(message);
  }
}

export default DependencyError;
