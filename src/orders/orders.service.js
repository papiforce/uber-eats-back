const OrderModel = require("./orders.model");
const { MealModel } = require("../meals");
const { logDisplayer } = require("../utils");

/**
 * GET - Orders list
 * @queryParam {
    customerId?: ObjectId
    deliveryPersonId?: ObjectId
    status?: "FREE" | "ORDER_PREPARATION" | "READY" | "PENDING_DELIVERY" | "DELIVERED"
    limit?: Number
    page?: Number
  }
 *
 * @return Orders[] | []
 */

const getlatest = async (req, res) => {
  try {
    const order = await OrderModel.find({
      customerId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(1);

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json(order[0]);
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

const get = async (req, res) => {
  try {
    const { customerId, deliveryPersonId, status } = req.query;

    if (req.user.role === "MEMBER") {
      const orders = await OrderModel.find({
        customerId: req.user._id,
        ...(status && { status }),
      })
        .populate("customerId")
        .populate("deliveryPersonId");

      return res.json({
        free: orders.filter((item) => item.status === "FREE"),
        pending: orders.filter(
          (item) => item.status !== "FREE" && item.status !== "DELIVERED"
        ),
        finish: orders.filter((item) => item.status === "DELIVERED"),
      });
    }

    if (req.user.role === "DELIVERY_PERSON") {
      const orders = await OrderModel.find({
        status: "FREE",
      });

      const deliveryPersonOrders = await OrderModel.find({
        deliveryPersonId: req.user._id,
      })
        .populate("customerId")
        .populate("deliveryPersonId");

      logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

      return res.json({
        free: orders,
        pending: deliveryPersonOrders.filter(
          (item) => item.status !== "FREE" && item.status !== "DELIVERED"
        ),
        finish: deliveryPersonOrders.filter(
          (item) => item.status === "DELIVERED"
        ),
      });
    }

    const orders = await OrderModel.find({
      ...(customerId && { customerId }),
      ...(deliveryPersonId && { deliveryPersonId }),
      ...(status && { status }),
    })
      .populate("customerId")
      .populate("deliveryPersonId");

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json({
      free: orders.filter((item) => item.status === "FREE"),
      pending: orders.filter(
        (item) => item.status !== "FREE" && item.status !== "DELIVERED"
      ),
      finish: orders.filter((item) => item.status === "DELIVERED"),
    });
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

/**
 * POST - create a new order
 * @param { content: Meal[], totalPrice: number }
 *
 * @return { Meal }
 */

const create = async (req, res) => {
  try {
    const { content, totalPrice } = req.body;
    const user = req.user;

    const meals = await MealModel.find({ _id: content.map((item) => item.id) });

    await Promise.all(content).then((cart) => {
      meals.forEach(async (item) => {
        const itemToUpdate = cart.find((subItem) =>
          item._id.equals(subItem.id)
        );

        Object.assign(item, {
          quantity: (item.quantity -= itemToUpdate.quantity),
        });

        await item.save();
      });
    });

    const orderDoc = OrderModel({
      content,
      totalPrice,
      address: user.address,
      customerId: user._id,
      code: ("000" + Math.floor(Math.random() * 1000)).slice(-4),
    });

    await orderDoc.save();

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json(orderDoc);
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

/**
 * PUT - cancel order
 * @return { success: boolean }
 */

const cancel = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.orderId);

    if (!order.customerId.equals(req.user._id))
      return res
        .status(401)
        .json({ error: "Vous n'êtes pas autorisé à effectuer cette action" });

    const updatedOrder = Object.assign(order, { status: "CANCELED" });

    await updatedOrder.save();

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json({ success: true });
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

/**
 * PUT - update order status (delivery person)
 * @return { success: boolean }
 */

const updateStatusDelivery = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.orderId);
    const { status, code } = req.body;

    if (status !== "ORDER_PREPARATION" && status !== "DELIVERED") {
      console.log("test");
      return res
        .status(401)
        .json({ error: "Vous n'êtes pas autorisé à effectuer cette action" });
    }

    if (status === "DELIVERED" && order.code !== code)
      return res.status(404).json({ error: "Le code n'est pas bon" });

    const updatedOrder = Object.assign(order, {
      deliveryPersonId: req.user._id,
      status,
    });

    await updatedOrder.save();

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json({ success: true });
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

/**
 * PUT - update status (admin)
 * @return { success: boolean }
 */

const updateStatusAdmin = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.orderId);
    const { status } = req.body;

    const updatedOrder = Object.assign(order, {
      status,
    });

    await updatedOrder.save();

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json({ success: true });
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

module.exports = {
  get,
  getlatest,
  create,
  updateStatusDelivery,
  updateStatusAdmin,
  cancel,
};
