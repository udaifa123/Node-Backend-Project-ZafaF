// PayPal utility functions

// Load PayPal SDK dynamically
export const loadPayPalScript = () => {
  return new Promise((resolve, reject) => {
    // Check if PayPal script is already loaded
    if (window.paypal) {
      resolve(window.paypal);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    script.async = true;
    
    script.onload = () => {
      if (window.paypal) {
        resolve(window.paypal);
      } else {
        reject(new Error('PayPal SDK not available'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load PayPal SDK'));
    };
    
    document.body.appendChild(script);
  });
};

// Convert INR to USD for PayPal
export const formatAmountForPayPal = (amountInINR) => {
  // Approximate conversion rate (update with real rate if needed)
  const exchangeRate = 0.012; // 1 INR = 0.012 USD
  const amountInUSD = (amountInINR * exchangeRate).toFixed(2);
  return parseFloat(amountInUSD);
};

// Create PayPal order
export const createPayPalOrder = async (amount, items, shippingAddress) => {
  try {
    const response = await fetch('http://localhost:5000/api/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: formatAmountForPayPal(amount),
        items,
        shippingAddress
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create PayPal order');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
};

// Capture PayPal payment
export const capturePayPalPayment = async (orderID) => {
  try {
    const response = await fetch('http://localhost:5000/api/paypal/capture-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderID })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Payment capture failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    throw error;
  }
};