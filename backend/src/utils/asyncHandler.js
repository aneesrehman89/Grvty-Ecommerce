const asyncHandler = (fn) => (req, res, next) => {   // safety net wrapped around your controller
  Promise.resolve(fn(req, res, next)).catch(next);
};
 
export default asyncHandler;