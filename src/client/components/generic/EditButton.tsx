import SvgButton from './SvgButton';

export interface Props {
    callback: () => void;
}

export default function (props: Props) {
    return <SvgButton src="/res/edit.svg" callback={props.callback} />;
}
