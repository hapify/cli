import Observable = Rx.Observable;

/**
 * Represent a class that can be sync remotely to the console
 */
export default interface IRemote {

  /**
   * Denotes if the instance can handle the incoming message
   * @return {Promise<boolean>|boolean}
   */
  canHandle(): Promise<boolean>|boolean;

  /**
   * Handle an incoming message
   * @return {Promise<boolean>|boolean}
   */
  handle(): Promise<void>;

  /**
   * Returns an observable to listen to update
   * @return {Rx.Observable<void>}
   */
  observe(): Observable<void>;
}
