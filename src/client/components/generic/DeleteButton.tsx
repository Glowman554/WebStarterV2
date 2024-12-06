import { createSignal, useContext } from 'solid-js';
import ContinueBox from './ContinueBox';
import SvgButton from './SvgButton';
import { LoadingContext, LoadingInterface } from '../loading/Loading';

export interface Props<T> {
    callback: (id: T, loading: LoadingInterface) => void;
    id: T;
}

export default function <T>(props: Props<T>) {
    const loading = useContext(LoadingContext);
    const [continueVisible, setContinueVisible] = createSignal(false);
    return (
        <>
            <SvgButton src="/res/delete.svg" callback={() => setContinueVisible(true)} />
            <ContinueBox
                visible={continueVisible()}
                resetCallback={() => setContinueVisible(false)}
                cancelCallback={() => {}}
                continueCallback={() => props.callback(props.id, loading)}
            >
                Wollen sie das Element wirklich löschen?
            </ContinueBox>
        </>
    );
}
