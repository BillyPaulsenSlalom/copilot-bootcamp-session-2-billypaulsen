const sendError = (res, status, code, message, details = []) => {
  return res.status(status).json({
    error: {
      code,
      message,
      details,
    },
  });
};

const sendSuccess = (res, status, data) => {
  return res.status(status).json({ data });
};

module.exports = {
  sendError,
  sendSuccess,
};
