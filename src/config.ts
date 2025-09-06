const config = {
  port: process.env.PORT || 3000,
  versions: {
    v1: "v1",
  },
  AWS: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION || "us-east-1",
  },
};

export default config;
