import { JSX } from 'solid-js';
import Navigation, { Entry } from './components/generic/Navigation';
import QueryController from './components/query/QueryController';

export interface Props {
    children: JSX.Element;
}

export default function (props: Props) {
    return (
        <>
            <Navigation>
                <Entry href="/">Home</Entry>
                <Entry href="/hello">Hello</Entry>
            </Navigation>
            <div style={{ 'padding-top': '4rem' }} />
            <main>
                <QueryController>{props.children}</QueryController>
            </main>
        </>
    );
}
