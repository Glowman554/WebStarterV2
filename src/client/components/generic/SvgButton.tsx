export interface Props {
    callback: () => void;
    src: string;
}

export default function (props: Props) {
    return (
        <span onClick={() => props.callback()}>
            <img src={props.src} style={{ height: '1rem' }} />
        </span>
    );
}
