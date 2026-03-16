import { useCallback, useState } from "react";

export function useModal(initialValue = null) {
  const [payload, setPayload] = useState(initialValue);

  const open = useCallback((value = true) => setPayload(value), []);
  const close = useCallback(() => setPayload(null), []);

  return {
    isOpen: payload !== null,
    payload,
    open,
    close,
    setPayload
  };
}
