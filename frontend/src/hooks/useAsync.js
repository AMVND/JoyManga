import { useCallback, useEffect, useState } from 'react';
import { isCancel } from '../api/mangadex';

/**
 * Chạy fn(signal) mỗi khi deps đổi; tự hủy request cũ (tránh race condition
 * khi bấm chuyển trang/đổi bộ lọc nhanh) và cho phép tải lại.
 */
export default function useAsync(fn, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fn(controller.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (isCancel(error)) return;
        setState({ data: null, loading: false, error });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  return { ...state, reload };
}
