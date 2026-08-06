export abstract class BaseError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = new.target.name; // `this.name = this.constructor.name`の補完が効かないため、基底クラスで定義
  }
}
