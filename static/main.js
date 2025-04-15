// Select the payment form using its ID
var form = document.querySelector("#paymentForm");
// Variable to hold the authorization key, fetched dynamically from the server.
var authorization;

// Mapping internal Braintree field keys to user-friendly names for error messages
const fieldKeyMap = {
  "cvv": "CVV",
  "number": "Credit Card Number",
  "expirationDate": "Expiration Date",
};

// Function to fetch the authorization key from the Flask backend
fetch("/get-authorization")
  .then((response) => response.json())
  .then((data) => {
    authorization = data.authorization;

    // Initialize the Braintree client using the fetched authorization key
    braintree.client.create(
      {
        authorization: authorization,
      },
      function (err, clientInstance) {
        // Handle errors during client initialization
        if (err) {
          console.error(err); // Log the error
          return; // Stop further execution if client creation fails
        }

        // Call the function to create hosted fields for secure input
        createHostedFields(clientInstance);
      }
    );
  })
  .catch((error) => {
    // Handle errors during the fetch request
    console.error(error); // Log the error
  });

// Function to set up secure hosted fields for sensitive card details
function createHostedFields(clientInstance) {
  braintree.hostedFields.create(
    {
      client: clientInstance,
      fields: {
        number: {
          selector: "#cardNumber",
          placeholder: "4111 1111 1111 1111",
        },
        cvv: {
          selector: "#cvv",
          placeholder: "123",
        },
        expirationDate: {
          selector: "#expirationDate",
          placeholder: "MM/YYYY",
        },
      },
    },
    function (err, hostedFieldsInstance) {
      // Handle errors during hosted fields creation
      if (err) {
        console.error(err); // Log the error
        return; // Stop further execution if hosted fields creation fails
      }

      // Define the form submission event callback
      var submit = function (event) {
        event.preventDefault();

        // Tokenize the card details to generate a secure nonce
        hostedFieldsInstance.tokenize(function (err, payload) {
          if (err) {
            console.log({err}); // Log the error
            const errors = err.details.invalidFieldKeys.map((k) => fieldKeyMap[k]); // Map invalid fields to user-friendly names
            alert(
              `The following fields are invalid:\n\n${errors.join("\n")}\n\nPlease fix them and try again.`
            );
            return; // Stop further execution if tokenization fails
          }

          // Create a FormData object to send the nonce to the server
          const formData = new FormData();
          formData.append("nonce", payload.nonce); // Add the secure nonce to the form data

          // Send the nonce to the server using Fetch
          return fetch("/handleSubmit", {
            method: "POST",
            body: formData,
          })
            // .then((response) => response.json())
            // .then(() => {
              // alert("Purchase successfully completed!"); // Notify the user of success
              .then((response) => {
                if(response.ok) {
                  return response.json().then((data) => {
                    // alert("Purchase successfully completed!");
                    alert(data.message)
                  });
                } else {
                  return response.json().then((data) => {
                    // alert("Purchase failed!");
                    alert(data.message);
                  });
                }
              })
            // })
            .catch((error) => {
              // Handle network or server-side errors
              console.error(error); // Log the error
            });
        });
      };

      // Attach the submit event to the form
      form.addEventListener("submit", submit, false);
    }
  );
}