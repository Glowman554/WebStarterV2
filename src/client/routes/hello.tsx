import Query from '../components/query/Query';
import { api } from '../lib/api';

export function Hello() {
    return (
        <>
            Hello
            <Query f={() => api.hello.query('world')} cacheKey="HELLO">
                {(text) => <>{text}</>}
            </Query>
        </>
    );
}
