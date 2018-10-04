declare module "raf-throttle" {
  function rafThrottle<F>(wrapped: F): F;
  export default rafThrottle;
}
