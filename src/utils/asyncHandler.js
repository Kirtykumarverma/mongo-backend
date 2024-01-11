const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

//wrapper for async await using try catch

// const asyncHandler = (fun) = async(req,res,next) => {
//     try {
//         await fun(req,res,next);
//     } catch (error) {
//         res.error(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }
