import { createContext, JSX, Show, useContext } from 'solid-js';
import { deleteFromCache, withQuery } from '~/client/lib/helper';
import { api } from '~/client/lib/api';
import LoginEditor from './user/LoginEditor';
import { QueryContext } from './query/QueryController';
import { User } from '~/server/api/routers/authentication';
import Query from './query/Query';

export const SelfContext = createContext<User>();

export interface Props {
    children: JSX.Element;
    check: (u: User) => boolean;
}

export default function (props: Props) {
    const query = useContext(QueryContext)!;

    return (
        <Query f={() => api.authentication.status.query()} cacheKey="internal-status" queryKey="internal-status">
            {(user) => (
                <Show
                    when={user && props.check(user)}
                    fallback={
                        <>
                            <p>Du kannst auf diese Seite nicht zugreifen</p>
                            <Show when={!user}>
                                <LoginEditor
                                    submit={(username, password, loading) =>
                                        withQuery(
                                            () => api.authentication.login.mutate({ username, password }),
                                            loading,
                                            false,
                                            () => {
                                                deleteFromCache('internal-status');
                                                query.refetch('internal-status');
                                            }
                                        )
                                    }
                                />
                            </Show>
                        </>
                    }
                >
                    <SelfContext.Provider value={user}>{props.children}</SelfContext.Provider>
                </Show>
            )}
        </Query>
    );
}
