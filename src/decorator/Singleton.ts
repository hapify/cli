
export function Singleton(target: any) {

  /**
   * Static instance getter method
   * @param args
   * @return {any}
   */
  target.instance = function(...args: any[]) {

    /** @type {any} save a reference to the original constructor */
    const original = target;
    /**
     * A utility function to generate instance of a class
     * @param constructor
     */
    function construct(constructor) {
      const c = function() {
        return constructor.apply(this, args);
      };
      c.prototype = constructor.prototype;
      return new c();
    }
    /**
     * New constructor
     * @return {any}
     */
    const f = function() {
      return construct(original);
    };

    // copy prototype so instanceof operator still works
    if (!original._instance) {
      f.prototype = original.prototype;
      original._instance = new f();
    }

    return original._instance;
  };

}