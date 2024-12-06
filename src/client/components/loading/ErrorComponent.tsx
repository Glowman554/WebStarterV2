import Overlay from '../generic/Overlay';

export interface Props {
    error: string;
}

export default function (props: Props) {
    return (
        <Overlay visible>
            <div class="field">
                <p>{props.error}</p>
                <button onClick={() => location.reload()}>Neuladen</button>
            </div>
        </Overlay>
    );
}
