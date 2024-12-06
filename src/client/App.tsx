import { Suspense } from 'solid-js';
import { Route, Router } from '@solidjs/router';
import { MetaProvider, Title } from '@solidjs/meta';
import Layout from './Layout';
import { Index } from './routes';
import { Hello } from './routes/hello';

export interface Props {
    url?: string;
}

function App(props: Props) {
    return (
        <Router
            url={props.url}
            root={(props) => (
                <MetaProvider>
                    <Title>Test</Title>
                    <Suspense>
                        <Layout>{props.children}</Layout>
                    </Suspense>
                </MetaProvider>
            )}
        >
            <Route path="/" component={Index} />
            <Route path="/hello" component={Hello} />
        </Router>
    );
}

export default App;
