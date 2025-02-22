import { useState } from "react";

export function useLoadingHandler<T>(handler: (props: T) => Promise<void>): {
    loading: boolean, 
    wrappedHandler: (props: T) => Promise<void>,
} {
  const [ loading, setLoading ] = useState<boolean>(false);

  async function wrappedHandler(props: T): Promise<void> {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await handler(props);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }
  
  return { loading, wrappedHandler };
}