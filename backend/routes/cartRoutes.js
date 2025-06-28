const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/product");
const { protect } = require("../middleware/authMiddleware");  

const router = express.Router();

// Helper function to get cart by userId or guestId
const getCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ user: userId });
  if (guestId) return await Cart.findOne({ guestId });
  return null;
};

// @route   POST /api/cart
// @desc    Add product to cart for a guest or logged-in user
// @access  Public
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId, store } = req.body;

  try {
    // Validate the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure price is a valid number
    const price = Number(product.price);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: "Invalid product price" });
    }

    // Try to find an existing cart
    let cart = await getCart(userId, guestId);

    if (cart) {
      // Check if the product with same options already exists
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        // If product exists, update quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // Add new product to cart
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price,
          size,
          color,
          quantity,
          store,
        });
      }

      // Recalculate totalPrice and force it to be a number
      cart.totalPrice = Number(
        cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
      );

      if (isNaN(cart.totalPrice) || cart.totalPrice <= 0) {
        return res.status(400).json({ message: "Invalid total price" });
      }

      await cart.save();
      return res.status(200).json(cart);
    } else {
      // Create a new cart if it doesn't exist
      const newCart = await Cart.create({
        user: userId || undefined,
        guestId: guestId || "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price,
            size,
            color,
            quantity,
            store,
          },
        ],
        totalPrice: price * quantity,
      });

      await newCart.save();
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error("Add to Cart Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/cart
// @desc    Update product quantity in cart for guest or logged user
// @access  Public
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  // Helper to get the cart
  const getCart = async (userId, guestId) => {
    if (userId) return await Cart.findOne({ user: userId });
    if (guestId) return await Cart.findOne({ guestId });
    return null;
  };

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      const productItem = cart.products[productIndex];

      if (quantity > 0) {
        // Just update the quantity
        productItem.quantity = quantity;
      } else {
        // Remove product from cart
        cart.products.splice(productIndex, 1);
      }

      // Recalculate totalPrice safely
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + Number(item.price) * item.quantity,
        0
      );

      cart.totalPrice = Number(cart.totalPrice);

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

//@route DELETE /api/cart
//@desc remove a product from the cart
//@access public

router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId, store } = req.body;
  try {
    let cart = await getCart(userId, guestId);

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

//@route GET /api/cart
//@desc get logged or guest user cart
//@access public

router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

//@route POST /api/cart/merge
//@desc merge user cart and guest user cart
//@access private

router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  const userId = req.user._id;

  try {
    // Find the guest cart and user cart
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: userId });

    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(400).json({ message: "Guest cart is empty" });
      }

      if (userCart) {
        // Merge carts if user cart exists
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (productIndex > -1) {
            // If the item exists in the cart, update the quantity
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            // If the item doesn't exist in the cart, push it
            userCart.products.push(guestItem);
          }
        });

        // Recalculate totalPrice after merge
        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        await userCart.save();

        // Delete the guest cart after merging
        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.error("Error deleting guest cart:", error);
        }

        return res.status(200).json(userCart);
      } else {
        // If the user has no existing cart, assign the guest cart to the user
        guestCart.user = userId;
        guestCart.guestId = undefined;
        await guestCart.save();

        return res.status(200).json(guestCart);
      }
    } else {
      // If there's no guest cart, return the user's cart if available
      if (userCart) {
        return res.status(200).json(userCart);
      }
      res.status(404).json({ message: "Guest cart not found" });
    }
  } catch (error) {
    console.error("Error merging cart:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
