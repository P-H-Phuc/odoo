-- disable asiapay payment provider
UPDATE payment_provider
   SET asiapay_merchant_id = NULL,
<<<<<<< HEAD
       asiapay_currency_id = NULL,
=======
>>>>>>> 94d7b2a773f2c4666c263d1d26cdbe278887f8f6
       asiapay_secure_hash_secret = NULL,
       asiapay_secure_hash_function = NULL;
