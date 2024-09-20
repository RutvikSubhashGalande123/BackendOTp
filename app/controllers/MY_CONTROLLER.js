// MY_CONTROLLER.js

class ResponseBuilder {
  constructor(res) {
    this.res = res;
    this.response = {};
  }

  setStatus(statusCode) {
    this.statusCode = statusCode;
    return this;
  }

  setSuccess(success) {
    this.response.success = success;
    return this;
  }

  setMessage(message) {
    this.response.message = message;
    return this;
  }

  setData(data) {
    if (data !== null) {
      this.response.data = data;
    }
    return this;
  }

  setErrors(errors) {
    if (errors !== null) {
      this.response.errors = errors;
    }
    return this;
  }

  send() {
    return this.res.status(this.statusCode).json(this.response);
  }
}

class MyController {
  static ResponseType = {
    SUCCESS: "success",
    ERROR: "error",
    CREATED: "created",
    NO_CONTENT: "noContent",
    BAD_REQUEST: "badRequest",
    UNAUTHORIZED: "unauthorized",
    FORBIDDEN: "forbidden",
    NOT_FOUND: "notFound",
    CONFLICT: "conflict",
    INTERNAL_ERROR: "internalError",
  };

  static StatusCodes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  };

  static respond(type, res, message, data = null, errors = null) {
    const builder = new ResponseBuilder(res);

    switch (type) {
      case this.ResponseType.SUCCESS:
        return builder
          .setStatus(this.StatusCodes.OK)
          .setSuccess(true)
          .setMessage(message)
          .setData(data)
          .send();
      case this.ResponseType.CREATED:
        return builder
          .setStatus(this.StatusCodes.CREATED)
          .setSuccess(true)
          .setMessage(message)
          .setData(data)
          .send();
      case this.ResponseType.NO_CONTENT:
        return res.status(this.StatusCodes.NO_CONTENT).send();
      case this.ResponseType.BAD_REQUEST:
        return builder
          .setStatus(this.StatusCodes.BAD_REQUEST)
          .setSuccess(false)
          .setMessage(message)
          .setErrors(errors)
          .send();
      case this.ResponseType.UNAUTHORIZED:
        return builder
          .setStatus(this.StatusCodes.UNAUTHORIZED)
          .setSuccess(false)
          .setMessage(message)
          .send();
      case this.ResponseType.FORBIDDEN:
        return builder
          .setStatus(this.StatusCodes.FORBIDDEN)
          .setSuccess(false)
          .setMessage(message)
          .send();
      case this.ResponseType.NOT_FOUND:
        return builder
          .setStatus(this.StatusCodes.NOT_FOUND)
          .setSuccess(false)
          .setMessage(message)
          .send();
      case this.ResponseType.CONFLICT:
        return builder
          .setStatus(this.StatusCodes.CONFLICT)
          .setSuccess(false)
          .setMessage(message)
          .send();
      case this.ResponseType.INTERNAL_ERROR:
        return builder
          .setStatus(this.StatusCodes.INTERNAL_SERVER_ERROR)
          .setSuccess(false)
          .setMessage(message)
          .send();
      default:
        throw new Error("Invalid response type");
    }
  }

  static successResponse(res, message, data = null) {
    console.log("success");

    return this.respond(this.ResponseType.SUCCESS, res, message, data);
  }

  static createdResponse(res, message, data = null) {
    console.log("created");
    return this.respond(this.ResponseType.CREATED, res, message, data);
  }

  static noContentResponse(res) {
    console.log("no content");
    return this.respond(this.ResponseType.NO_CONTENT, res);
  }

  static badRequestResponse(res, message, errors = null) {
    console.log("bad request");
    return this.respond(
      this.ResponseType.BAD_REQUEST,
      res,
      message,
      null,
      errors
    );
  }

  static unauthorizedResponse(res, message) {
    console.log("unauthorized");
    return this.respond(this.ResponseType.UNAUTHORIZED, res, message);
  }

  static forbiddenResponse(res, message) {
    console.log("forbidden");
    return this.respond(this.ResponseType.FORBIDDEN, res, message);
  }

  static notFoundResponse(res, message) {
    console.log("not found");
    return this.respond(this.ResponseType.NOT_FOUND, res, message);
  }

  static conflictResponse(res, message) {
    console.log("conflict");
    return this.respond(this.ResponseType.CONFLICT, res, message);
  }

  static internalErrorResponse(res, message) {
    console.log("internal error");
    return this.respond(this.ResponseType.INTERNAL_ERROR, res, message);
  }

  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch((error) => {
        console.error("Async error:", error);
        this.internalErrorResponse(res, "Internal Server Error");
      });
    };
  }
}

module.exports = MyController;
