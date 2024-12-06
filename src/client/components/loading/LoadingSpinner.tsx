import Overlay from '../generic/Overlay';

export interface Props {
    visible: boolean;
}

export default function (props: Props) {
    return (
        <Overlay visible={props.visible}>
            <div class="center">
                <img src="/res/loading.svg" class="spinner" style={{ width: '2rem' }} />
            </div>
        </Overlay>
    );
}
