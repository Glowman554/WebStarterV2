import { createContext, createSignal, JSX, Show } from 'solid-js';
import LoadingSpinner from './LoadingSpinner';
import ErrorComponent from './ErrorComponent';

export interface LoadingInterface {
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
}

export const LoadingContext = createContext<LoadingInterface>({
    setLoading: (loading: boolean) => console.warn('setLoading', loading),
    setError: (error: string) => console.warn('setError', error),
});

export interface Props {
    children: JSX.Element;
    initial: boolean;
}

export default function (props: Props) {
    const [loading, setLoading] = createSignal(props.initial);
    const [error, setError] = createSignal<string>();

    return (
        <LoadingContext.Provider value={{ setLoading, setError }}>
            <Show
                when={error()}
                fallback={
                    <>
                        <LoadingSpinner visible={loading()} />
                        <div style={{ display: loading() ? 'none' : 'block' }}>{props.children}</div>
                    </>
                }
            >
                <ErrorComponent error={error()!} />
            </Show>
        </LoadingContext.Provider>
    );
}
