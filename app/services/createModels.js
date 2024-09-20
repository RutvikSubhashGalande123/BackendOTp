const models = require("../models/models");
(async () => {
  const syncPromises = Object.entries(models).map(
    async ([modelName, model]) => {
      if (model && model.sync && model.name) {
        console.log(model.name);

        await model.sync({ force: false });
        console.log(`${modelName} model synchronized with the database!`);
      } else {
        console.error(`Error synchronizing model: ${modelName}`);
      }
    }
  );

  await Promise.all(syncPromises);
})();
