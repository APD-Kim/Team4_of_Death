class CustomError extends Error {
  constructor(status, message, boolean) {
    super(message);
    this.status = status;
    this.boolean = boolean;
  }
}

export default CustomError;
