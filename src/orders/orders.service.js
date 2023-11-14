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
    const user = req.user;

    const orderDoc = OrderModel({
      content,
      totalPrice,
      address: user.address.address,
      customerId: user._id,
      code: ("000" + Math.floor(Math.random() * 1000)).slice(-4),
    });

    await orderDoc.save();

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json({ success: true });
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

/**
 * PUT - accept order
 * @return { success: boolean }
 */

const updateStatusDelivery = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.orderId);
    const { status, code } = req.body;

    if (status !== "ORDER_PREPARATION" && status !== "DELIVERED")
      return res
        .status(401)
        .json({ error: "Vous n'êtes pas autorisé à effectuer cette action" });

    if (status === "DELIVERED") {
      const orderCode = await OrderModel.findById(req.params.orderId);

      if (orderCode.code !== code)
        return res.status(404).json({ error: "Le code n'est pas bon" });
    }

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
 * PUT - order ready
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
  create,
  updateStatusDelivery,
  updateStatusAdmin,
};

// TEST FUNNEL ORDER - CREATE ORDER
// {
//   "content": [{ "name": "Spaghetti Bolognese", "price": 10.99, "photo": "https://supervalu.ie/thumbnail/800x600/var/files/real-food/recipes/Uploaded-2020/spaghetti-bolognese-recipe.jpg",
//     "quantity": 2 }, { "name": "Spaghetti Pas Bolognese", "price": 7.99, "photo": "https://supervalu.ie/thumbnail/800x600/var/files/real-food/recipes/Uploaded-2020/spaghetti-bolognese-recipe.jpg",
//     "quantity": 1 }
//   ],
//   "totalPrice": 29.97
// }

// TEST FUNNEL ORDER - UPDATE STATUS ORDER (DELIVERY)
