class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static validationError(msg) {
    return new ApiError(400, msg);
  }

  static authError(msg) {
    return new ApiError(401, msg);
  }

  static forbiddenError(msg) {
    return new ApiError(403, msg);
  }

  static notFoundError(msg) {
    return new ApiError(404, msg);
  }

  static conflictError(msg) {
    return new ApiError(409, msg);
  }
}

module.exports = ApiError;
