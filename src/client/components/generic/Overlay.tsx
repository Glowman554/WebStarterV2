import { JSX, Show } from 'solid-js';

export interface Props {
    children: JSX.Element;
    visible: boolean;
}

export default function (props: Props) {
    return (
        <Show when={props.visible}>
            <div class="overlay-background">
                <div class="overlay">{props.children}</div>
            </div>
        </Show>
    );
}
