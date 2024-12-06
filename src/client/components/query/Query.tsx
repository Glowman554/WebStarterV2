import { JSX, Show, untrack } from 'solid-js';
import Loading from '../loading/Loading';
import { createQuery } from '../../lib/helper';

export interface Props<T> {
    f: () => Promise<T>;
    queryKey?: string;
    cacheKey?: string;
    children: (item: T) => JSX.Element;
}

function Wrapped<T>(props: Props<T>) {
    const [data, resolved] = createQuery(
        untrack(() => props.f),
        untrack(() => props.queryKey),
        untrack(() => props.cacheKey)
    );
    return <Show when={resolved()}>{props.children(data()!)}</Show>;
}

export default function <T>(props: Props<T>) {
    return (
        <Loading initial={true}>
            <Wrapped {...props} />
        </Loading>
    );
}
