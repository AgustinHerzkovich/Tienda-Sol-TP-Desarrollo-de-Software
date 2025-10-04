export default class Repository {
  constructor(model) {
    this.model = model;
  }

  async create(entity) {
    const entitySaved = new this.model(entity);
    return await entitySaved.save();
  }

  async update(id, entity) {
    return await this.model.findByIdAndUpdate(id, entity, { new: true });
  }

  async findById(id) {
    return await this.model.findById(id);
  }
}
