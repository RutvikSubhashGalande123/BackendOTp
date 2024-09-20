const { Op, ValidationError } = require("sequelize");
const { performance } = require("perf_hooks");

// Custom error class for service-related errors
class ServiceError extends Error {
  constructor(message, type, originalError) {
    super(message);
    this.name = "ServiceError";
    this.type = type;
    this.originalError = originalError;
  }
}

// Enhanced error handling function
const handleServiceError = (model, operation, error) => {
  const errorMessage = `[Service] Error while ${operation} ${model.name}: ${error.message}`;
  console.error(errorMessage, error);

  if (error instanceof ValidationError) {
    throw new ServiceError(errorMessage, "VALIDATION_ERROR", error);
  } else if (error.name === "SequelizeUniqueConstraintError") {
    throw new ServiceError(errorMessage, "DUPLICATE_ENTRY", error);
  } else {
    throw new ServiceError(errorMessage, "GENERAL_ERROR", error);
  }
};

// Utility function to handle pagination
const getPaginationOptions = (page, pageSize) => {
  const limit = pageSize
    ? Math.max(1, Math.min(parseInt(pageSize, 10), 100))
    : 10;
  const offset = page ? Math.max(0, parseInt(page, 10) - 1) * limit : 0;
  return { limit, offset };
};

// Utility function to handle sorting
const getSortingOptions = (sortBy, sortOrder) => {
  const validSortOrders = ["ASC", "DESC"];
  return sortBy
    ? [[sortBy, validSortOrders.includes(sortOrder) ? sortOrder : "ASC"]]
    : undefined;
};

// Utility function to measure and log execution time
const measureExecutionTime = async (operation, func) => {
  const start = performance.now();
  const result = await func();
  const end = performance.now();
  console.log(`[Performance] ${operation} took ${(end - start).toFixed(2)}ms`);
  return result;
};

// Utility function to sanitize and validate filters
const sanitizeFilters = (filters) => {
  // Implement your sanitization logic here
  return filters;
};

exports.getList = async (model, options = {}) => {
  return measureExecutionTime("getList", async () => {
    try {
      const { page, pageSize, sortBy, sortOrder, filters } = options;
      const paginationOptions = getPaginationOptions(page, pageSize);
      const sortingOptions = getSortingOptions(sortBy, sortOrder);
      const sanitizedFilters = sanitizeFilters(filters);

      const queryOptions = {
        ...paginationOptions,
        order: sortingOptions,
        where: sanitizedFilters,
      };

      const { count, rows } = await model.findAndCountAll(queryOptions);
      return {
        total: count,
        items: rows,
        currentPage: page ? parseInt(page, 10) : 1,
        totalPages: Math.ceil(count / paginationOptions.limit),
      };
    } catch (error) {
      handleServiceError(model, "fetching list", error);
    }
  });
};

exports.getDetails = async (model, id) => {
  return measureExecutionTime("getDetails", async () => {
    try {
      const result = await model.findByPk(id);
      if (!result) {
        throw new Error(`${model.name} with id ${id} not found`);
      }
      return result;
    } catch (error) {
      handleServiceError(model, `fetching by ID ${id}`, error);
    }
  });
};

exports.addDetails = async (model, data) => {
  return measureExecutionTime("addDetails", async () => {
    try {
      const result = await model.create(data);
      console.log(`[Service] Successfully added new ${model.name}`);
      return result;
    } catch (error) {
      handleServiceError(model, "adding", error);
    }
  });
};

exports.updateDetails = async (model, whereClause, data) => {
  return measureExecutionTime("updateDetails", async () => {
    try {
      const [updatedCount, updatedRecords] = await model.update(data, {
        where: whereClause,
        returning: true,
      });
      if (updatedCount === 0) {
        throw new Error(`No ${model.name} found matching the criteria`);
      }
      console.log(
        `[Service] Successfully updated ${updatedCount} ${model.name}(s)`
      );
      return updatedRecords;
    } catch (error) {
      handleServiceError(
        model,
        `updating by filter ${JSON.stringify(whereClause)}`,
        error
      );
    }
  });
};

exports.deleteDetails = async (model, whereClause) => {
  return measureExecutionTime("deleteDetails", async () => {
    try {
      const deletedCount = await model.destroy({ where: whereClause });
      if (deletedCount === 0) {
        throw new Error(`No ${model.name} found matching the criteria`);
      }
      console.log(
        `[Service] Successfully deleted ${deletedCount} ${model.name}(s)`
      );
      return deletedCount;
    } catch (error) {
      handleServiceError(
        model,
        `deleting by filter ${JSON.stringify(whereClause)}`,
        error
      );
    }
  });
};

exports.getListWithAssociation = async (
  model,
  associationModel,
  options = {}
) => {
  return measureExecutionTime("getListWithAssociation", async () => {
    try {
      const { page, pageSize, sortBy, sortOrder, filters } = options;
      const paginationOptions = getPaginationOptions(page, pageSize);
      const sortingOptions = getSortingOptions(sortBy, sortOrder);
      const sanitizedFilters = sanitizeFilters(filters);

      const queryOptions = {
        ...paginationOptions,
        order: sortingOptions,
        where: sanitizedFilters,
        include: associationModel,
      };

      const { count, rows } = await model.findAndCountAll(queryOptions);
      return {
        total: count,
        items: rows,
        currentPage: page ? parseInt(page, 10) : 1,
        totalPages: Math.ceil(count / paginationOptions.limit),
      };
    } catch (error) {
      handleServiceError(model, "fetching with association", error);
    }
  });
};

exports.getDetailsWithAssociation = async (model, associationModel, id) => {
  return measureExecutionTime("getDetailsWithAssociation", async () => {
    try {
      const result = await model.findByPk(id, { include: associationModel });
      if (!result) {
        throw new Error(`${model.name} with id ${id} not found`);
      }
      return result;
    } catch (error) {
      handleServiceError(model, "fetching details with association", error);
    }
  });
};

exports.getDetailsByKey = async (model, whereClause) => {
  return measureExecutionTime("getDetailsByKey", async () => {
    try {
      const result = await model.findOne({ where: whereClause });
      if (!result) {
        throw new Error(`No ${model.name} found matching the criteria`);
      }
      return result;
    } catch (error) {
      handleServiceError(
        model,
        `fetching details where ${JSON.stringify(whereClause)}`,
        error
      );
    }
  });
};

exports.getRecordsCount = async (model, whereClause = {}) => {
  return measureExecutionTime("getRecordsCount", async () => {
    try {
      const count = await model.count({ where: whereClause });
      return count;
    } catch (error) {
      handleServiceError(model, "fetching table length", error);
    }
  });
};

exports.bulkCreate = async (model, dataArray) => {
  return measureExecutionTime("bulkCreate", async () => {
    try {
      const result = await model.bulkCreate(dataArray);
      console.log(
        `[Service] Successfully bulk created ${result.length} ${model.name}(s)`
      );
      return result;
    } catch (error) {
      handleServiceError(model, "bulk creating", error);
    }
  });
};

exports.upsert = async (model, data, uniqueFields) => {
  return measureExecutionTime("upsert", async () => {
    try {
      const [result, created] = await model.upsert(data, {
        returning: true,
        fields: uniqueFields,
      });
      console.log(
        `[Service] Successfully ${created ? "created" : "updated"} ${
          model.name
        }`
      );
      return result;
    } catch (error) {
      handleServiceError(model, "upserting", error);
    }
  });
};

exports.search = async (model, searchTerm, searchFields, options = {}) => {
  return measureExecutionTime("search", async () => {
    try {
      const { page, pageSize, sortBy, sortOrder } = options;
      const paginationOptions = getPaginationOptions(page, pageSize);
      const sortingOptions = getSortingOptions(sortBy, sortOrder);

      const searchConditions = searchFields.map((field) => ({
        [field]: { [Op.iLike]: `%${searchTerm}%` },
      }));

      const queryOptions = {
        ...paginationOptions,
        order: sortingOptions,
        where: { [Op.or]: searchConditions },
      };

      const { count, rows } = await model.findAndCountAll(queryOptions);
      return {
        total: count,
        items: rows,
        currentPage: page ? parseInt(page, 10) : 1,
        totalPages: Math.ceil(count / paginationOptions.limit),
      };
    } catch (error) {
      handleServiceError(model, `searching for "${searchTerm}"`, error);
    }
  });
};

exports.batchOperation = async (model, operations) => {
  return measureExecutionTime("batchOperation", async () => {
    const transaction = await model.sequelize.transaction();
    try {
      const results = [];
      for (const op of operations) {
        switch (op.type) {
          case "create":
            results.push(await model.create(op.data, { transaction }));
            break;
          case "update":
            results.push(
              await model.update(op.data, { where: op.where, transaction })
            );
            break;
          case "delete":
            results.push(await model.destroy({ where: op.where, transaction }));
            break;
          default:
            throw new Error(`Unknown operation type: ${op.type}`);
        }
      }
      await transaction.commit();
      return results;
    } catch (error) {
      await transaction.rollback();
      handleServiceError(model, "batch operation", error);
    }
  });
};

exports.softDelete = async (model, whereClause) => {
  return measureExecutionTime("softDelete", async () => {
    try {
      const result = await model.update(
        { deletedAt: new Date() },
        { where: whereClause }
      );
      if (result[0] === 0) {
        throw new Error(`No ${model.name} found matching the criteria`);
      }
      console.log(
        `[Service] Successfully soft deleted ${result[0]} ${model.name}(s)`
      );
      return result[0];
    } catch (error) {
      handleServiceError(
        model,
        `soft deleting by filter ${JSON.stringify(whereClause)}`,
        error
      );
    }
  });
};

exports.restoreSoftDeleted = async (model, whereClause) => {
  return measureExecutionTime("restoreSoftDeleted", async () => {
    try {
      const result = await model.update(
        { deletedAt: null },
        { where: { ...whereClause, deletedAt: { [Op.ne]: null } } }
      );
      if (result[0] === 0) {
        throw new Error(
          `No soft-deleted ${model.name} found matching the criteria`
        );
      }
      console.log(
        `[Service] Successfully restored ${result[0]} ${model.name}(s)`
      );
      return result[0];
    } catch (error) {
      handleServiceError(
        model,
        `restoring soft-deleted records by filter ${JSON.stringify(
          whereClause
        )}`,
        error
      );
    }
  });
};

exports.advancedSearch = async (model, searchParams, options = {}) => {
  return measureExecutionTime("advancedSearch", async () => {
    try {
      const { page, pageSize, sortBy, sortOrder } = options;
      const paginationOptions = getPaginationOptions(page, pageSize);
      const sortingOptions = getSortingOptions(sortBy, sortOrder);

      const whereConditions = Object.entries(searchParams).reduce(
        (acc, [key, value]) => {
          if (typeof value === "string") {
            acc[key] = { [Op.iLike]: `%${value}%` };
          } else if (Array.isArray(value)) {
            acc[key] = { [Op.in]: value };
          } else if (typeof value === "object") {
            acc[key] = value; // Assume it's already a valid Sequelize operator
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      const queryOptions = {
        ...paginationOptions,
        order: sortingOptions,
        where: whereConditions,
      };

      const { count, rows } = await model.findAndCountAll(queryOptions);
      return {
        total: count,
        items: rows,
        currentPage: page ? parseInt(page, 10) : 1,
        totalPages: Math.ceil(count / paginationOptions.limit),
      };
    } catch (error) {
      handleServiceError(model, `performing advanced search`, error);
    }
  });
};
