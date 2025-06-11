export class CustomError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CustomError";
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}
