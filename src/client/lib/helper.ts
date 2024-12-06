import { Accessor, createEffect, createSignal, DEV, useContext } from 'solid-js';
import { LoadingContext, LoadingInterface } from '../components/loading/Loading';
import { createQueryKey } from '../components/query/QueryController';

const cache = new Map<string, unknown>();

export function deleteFromCache(key: string) {
    if (DEV) console.log('Removing ' + key + ' from cache');
    cache.delete(key);
}

export function withQuery<T>(
    f: () => Promise<T>,
    loading: LoadingInterface,
    resetting: boolean,
    c?: (t: T) => void,
    cacheKey?: string
) {
    const reset = () => {
        if (resetting) {
            loading.setLoading(false);
        }
    };

    if (cacheKey && cache.has(cacheKey)) {
        if (DEV) console.log(`[CACHE] ${cacheKey}`);

        if (c) {
            c(cache.get(cacheKey) as T);
        }
        reset();
        return;
    }

    loading.setLoading(true);
    f()
        .then((t) => {
            if (cacheKey) {
                cache.set(cacheKey, t);
            }

            if (c) {
                c(t);
            }
            return t;
        })
        .catch((e) => {
            loading.setError(String(e));
            throw e;
        })
        .finally(reset);
}

export function createQuery<T>(
    f: () => Promise<T>,
    queryKey?: string,
    cacheKey?: string
): [Accessor<T | undefined>, Accessor<boolean>] {
    const loading = useContext(LoadingContext);
    const [resolved, setResolved] = createSignal(false);
    const [result, setResult] = createSignal<T | undefined>(undefined);

    const run = () => {
        withQuery(
            f,
            loading,
            true,
            (t) => {
                setResult(() => t);
                setResolved(true);
            },
            cacheKey
        );
    };

    createEffect(run);
    createQueryKey(queryKey, run);

    return [result, resolved];
}

export function createQueryTransformed<T, U>(
    f: () => Promise<T>,
    transform: (t: T) => U,
    queryKey?: string,
    cacheKey?: string
): [Accessor<U | undefined>, Accessor<boolean>] {
    const loading = useContext(LoadingContext);
    const [resolved, setResolved] = createSignal(false);
    const [result, setResult] = createSignal<U | undefined>(undefined);

    const run = () => {
        withQuery(
            f,
            loading,
            true,
            (t) => {
                setResult(() => transform(t));
                setResolved(true);
            },
            cacheKey
        );
    };

    createEffect(run);
    createQueryKey(queryKey, run);

    return [result, resolved];
}
