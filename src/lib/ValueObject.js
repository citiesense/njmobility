/*@flow*/

export default class ValueObject {
  value: number;
  unit: string;

  constructor(value: number, unit: string) {
    this.value = value;
    this.unit = unit;
  }

  static create = (value: number, unit: string) => new ValueObject(value, unit);

  add = (other: ValueObject) => {
    if (this.unit === other.unit) {
      return new ValueObject(this.value + other.value, this.unit);
    }
    throw new Error('Incompatible units.');
  };

  toString = () => `${this.value}${this.unit}`;
}
