import { createSignal, useContext } from 'solid-js';
import Loading, { LoadingContext, LoadingInterface } from '../loading/Loading';

export interface Props {
    submit: (username: string, password: string, loading: LoadingInterface) => void;
}

function Wrapped(props: Props) {
    const loading = useContext(LoadingContext);
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');

    const submit = () => {
        props.submit(email(), password(), loading);
    };

    return (
        <form
            on:submit={(e) => {
                e.preventDefault();
                submit();
            }}
        >
            <div class="section">
                Benutzername
                <input type="text" onChange={(e) => setEmail(e.target.value)} value={email()} required />
            </div>
            <div class="section">
                Passwort
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password()} required />
            </div>
            <div class="center">
                <button type="submit">Anmelden</button>
            </div>
        </form>
    );
}

export default function (props: Props) {
    return (
        <Loading initial={false}>
            <div class="field">
                <Wrapped {...props} />
            </div>
        </Loading>
    );
}
