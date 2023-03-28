-- disable paypal payment provider
UPDATE payment_provider
   SET paypal_email_account = NULL,
<<<<<<< HEAD
       paypal_seller_account = NULL,
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
       paypal_pdt_token = NULL;
