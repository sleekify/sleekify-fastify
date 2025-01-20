import { BadRequestError, NotFoundError } from '@sleekify/sleekify';

type DataType = {
  id: number
} & Record<string, any>;

export class Repository {
  private readonly dataArray: DataType[];

  constructor (dataArray: DataType[]) {
    this.dataArray = dataArray;
  }

  async createOne (data: any) {
    const existingData = this.dataArray.find(d => d.id === data.id);

    if (existingData !== undefined) {
      throw new BadRequestError();
    }

    this.dataArray.push(data);
    this.dataArray.sort((left: DataType, right: DataType) => {
      return left.id - right.id;
    });

    return data;
  }

  async readOne (id: number) {
    const existingData = this.dataArray.find(d => d.id === id);

    if (existingData === undefined) {
      throw new NotFoundError();
    }

    return existingData;
  }

  async readAll () {
    return this.dataArray;
  }

  async updateOne (data: DataType) {
    const existingData = await this.readOne(data.id);

    Object.assign(existingData, data);

    return data;
  }

  async deleteOne (id: number) {
    const existingIndex = this.dataArray.findIndex(d => d.id === id);

    if (existingIndex < 0) {
      throw new NotFoundError();
    }

    this.dataArray.splice(existingIndex, 1);
  }
}
