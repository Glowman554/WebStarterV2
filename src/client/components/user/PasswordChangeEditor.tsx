import { createEffect, createSignal, Show, useContext } from 'solid-js';
import Loading, { LoadingContext, LoadingInterface } from '../loading/Loading';
import { passwordOk, PasswordResult, validatePassword } from '~/lib/password';

export interface Props {
    submit: (oldPassword: string, newPassword: string, loading: LoadingInterface) => void;
}

function PasswordValidationResult(props: PasswordResult) {
    return (
        <>
            <p>Password muss enthalten:</p>
            <p style={{ color: props.length ? 'green' : 'red' }}>Mindestens 8 Zeichen</p>
            <p style={{ color: props.upperCase ? 'green' : 'red' }}>Mindestens ein Großbuchstabe</p>
            <p style={{ color: props.specialChar ? 'green' : 'red' }}>Mindestens ein Sonderzeichen</p>
        </>
    );
}

function Wrapped(props: Props) {
    const loading = useContext(LoadingContext);

    const [oldPassword, setOldPassword] = createSignal('');
    const [newPassword, setNewPassword] = createSignal('');
    const [newPasswordControl, setNewPasswordControl] = createSignal('');

    const [passwordResult, setPasswordResult] = createSignal<PasswordResult>({
        length: false,
        specialChar: false,
        upperCase: false,
    });
    createEffect(() => {
        setPasswordResult(validatePassword(newPassword()));
    });

    const submit = () => {
        if (newPassword() != newPasswordControl()) {
            return;
        }

        props.submit(oldPassword(), newPassword(), loading);
    };

    return (
        <form
            on:submit={(e) => {
                e.preventDefault();
                submit();
            }}
        >
            <div class="section">
                Altes Passwort
                <input
                    type="password"
                    value={oldPassword()}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                />
            </div>

            <div class="section">
                Neues Passwort
                <input type="password" value={newPassword()} onInput={(e) => setNewPassword(e.target.value)} required />
            </div>

            <div class="section">
                Neues Passwort wiederhole
                <input
                    type="password"
                    value={newPasswordControl()}
                    onInput={(e) => setNewPasswordControl(e.target.value)}
                    required
                />
            </div>

            <Show when={!passwordOk(passwordResult())}>
                <PasswordValidationResult {...passwordResult()} />
            </Show>
            <br />
            <Show when={newPassword() != newPasswordControl()}>
                <p style={{ color: 'red' }}>Passwörter stimmen nicht überein</p>
            </Show>

            <div class="center">
                <button type="submit" disabled={!passwordOk(passwordResult()) || newPassword() != newPasswordControl()}>
                    Aktualisieren
                </button>
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
