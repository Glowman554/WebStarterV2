import { createContext, JSX, useContext } from 'solid-js';

const NavigationContext = createContext({ reset: () => {} });

export function Entry(props: { children: JSX.Element; href: string }) {
    const navigation = useContext(NavigationContext);

    return (
        <a onClick={navigation.reset} href={props.href}>
            {props.children}
        </a>
    );
}

export default function (props: { children: JSX.Element }) {
    let navigation: HTMLDivElement | undefined;

    const reset = () => {
        navigation?.classList.remove('responsive');
    };

    return (
        <div ref={navigation} class="navigation-bar">
            <NavigationContext.Provider value={{ reset }}>{props.children}</NavigationContext.Provider>
            <a
                onClick={(e) => {
                    e.preventDefault();
                    if (navigation?.classList.contains('responsive')) {
                        reset();
                    } else {
                        navigation?.classList.add('responsive');
                    }
                }}
                class="icon"
            >
                <img src="/res/menu.svg" alt="Menu" style={{ width: '2rem' }} />
            </a>
        </div>
    );
}
