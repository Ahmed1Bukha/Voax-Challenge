// Simple test script to demonstrate the middleware functionality
const axios = require("axios");

const BASE_URL = "http://localhost:3000/api/v1/blobs";

async function testMiddleware() {
  try {
    console.log("Testing blob middleware...\n");

    // Test GET request (should log activity)
    console.log("1. Testing GET request...");
    try {
      const getResponse = await axios.get(`${BASE_URL}/test-blob-id`);
      console.log("GET Response Status:", getResponse.status);
    } catch (error) {
      console.log("GET Error Status:", error.response?.status || "No response");
    }

    // Test POST request (should log activity)
    console.log("\n2. Testing POST request...");
    try {
      const postResponse = await axios.post(`${BASE_URL}/`, {
        name: "test-blob",
        content: "test content",
      });
      console.log("POST Response Status:", postResponse.status);
    } catch (error) {
      console.log(
        "POST Error Status:",
        error.response?.status || "No response"
      );
    }

    console.log(
      "\n✅ Middleware test completed! Check your database for blob activity records."
    );
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testMiddleware();
}

module.exports = { testMiddleware };

