export const handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, message: "Functions are disabled in production; this is a placeholder." }),
  };
};
