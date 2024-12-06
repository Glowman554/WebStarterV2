import { JSX, Show, untrack } from 'solid-js';
import Loading from '../loading/Loading';
import { createQueryTransformed } from '../../lib/helper';

export interface Props<T, U> {
    f: () => Promise<T>;
    transform: (t: T) => U;

    queryKey?: string;
    cacheKey?: string;
    children: (item: U) => JSX.Element;
}

function Wrapped<T, U>(props: Props<T, U>) {
    const [data, resolved] = createQueryTransformed(
        untrack(() => props.f),
        untrack(() => props.transform),
        untrack(() => props.queryKey),
        untrack(() => props.cacheKey)
    );
    return <Show when={resolved()}>{props.children(data()!)}</Show>;
}

export default function <T, U>(props: Props<T, U>) {
    return (
        <Loading initial={true}>
            <Wrapped {...props} />
        </Loading>
    );
}
