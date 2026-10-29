module.exports = (req, res) => {
  if (req.method === 'POST') {
    const orderData = req.body;
    console.log("Received new order:", orderData);

    // In a real application, you would save this to a database (e.g., Supabase)

    res.status(200).json({ success: true, message: 'Order received successfully', orderId: orderData.orderId });
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};