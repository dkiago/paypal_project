import os
import braintree

# Initialize the Braintree gateway
gateway = braintree.BraintreeGateway(
    braintree.Configuration(
        environment=braintree.Environment.parse_environment(os.environ.get("BT_ENVIRONMENT")),  # Use the dynamically determined environment
        merchant_id=os.environ.get("BT_MERCHANT_ID"),  # Retrieve the Merchant ID
        public_key=os.environ.get("BT_PUBLIC_KEY"),    # Retrieve the Public Key
        private_key=os.environ.get("BT_PRIVATE_KEY"),  # Retrieve the Private Key
    )
)

def transact(options): # Processes a payment transaction using the Braintree gateway.
    return gateway.transaction.sale(options)