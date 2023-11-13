const OrderModel = require("./orders.model");
const { logDisplayer } = require("../utils");

/**
 * GET - Orders list
 * @queryParam {
    customerId?: ObjectId
    deliveryPersonId?: ObjectId
    status?: "FREE" | "ORDER_PREPARATION" | "READY" | "PENDING_DELIVERY" | "DELIVERED"
  }
 *
 * @return Orders[] | []
 */

const get = async (req, res) => {
  try {
    const {
      customerId,
      deliveryPersonId,
      status,
      limit = 10,
      page,
    } = req.query;

    console.log("USER => ", req.user);

    if (req.user.role === "MEMBER") {
      const orders = await OrderModel.find({
        customerId: req.user._id,
        ...(status && { status }),
      });

      logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

      return res.json(orders);
    }

    if (req.user.role === "DELIVERY_PERSON") {
      const orders = await OrderModel.find({
        deliveryPersonId: req.user._id,
        ...(status && { status }),
      });

      logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

      return res.json(orders);
    }

    const orders = await OrderModel.find({
      ...(customerId && { customerId }),
      ...(deliveryPersonId && { deliveryPersonId }),
      ...(status && { status }),
    })
      .limit(limit)
      .skip(limit * page);

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json(orders);
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

/**
 * POST - create a new order
 * @param { content: Meal[], totalPrice: number }
 *
 * @return { success: boolean }
 */

const create = async (req, res) => {
  try {
    const { content, totalPrice } = req.body;

    console.log(content, ` <== content`);

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json({ success: true });
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

module.exports = {
  get,
  create,
};
